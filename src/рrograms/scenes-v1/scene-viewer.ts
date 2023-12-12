import { glsl, createStaticVertexBuffer, createVAOForXYZ_RGBBuffer, drawVAO } from "../../general/core-utils";
import { makeLerp, radian, rgb, xyz } from "../../math-utils";
import { makeBoxBuffer } from "../../shapes/buffer-shapes";
import { WorldMatrix } from "../../view/world";
import { ProjectionMatrix } from "../../view/projection";
import { ViewMatrix } from "../../view/view";
import { makeAxesLineVertexShape } from "../../general/axes-shape";
import { make2dChristmasTreeVertexShape, make3dChristmasTreeVertexShape } from "./christmas/shapes";

const VERTEX_SHADER_SOURCE_CODE = glsl`#version 300 es
  precision mediump float;

  in vec3 vertexPosition;
  in vec3 vertexColor;

  uniform mat4 mWorld;
  uniform mat4 mView;
  uniform mat4 mProjection;

  out vec3 fragmentColor;

  void main() {
    fragmentColor = vertexColor;

    gl_Position = mProjection * mView * mWorld * vec4(vertexPosition, 1.0);
    gl_PointSize = 15.0;
  }
`;

export const FRAGMENT_SHADER_SOURCE_CODE = glsl`#version 300 es
  precision mediump float;

  in vec3 fragmentColor;

  out vec4 outputColor;

  void main() {
    outputColor = vec4(fragmentColor, 1.0);
  }
`;

const SCENE_POSITION_RADIUS = 10

// add all the improved versions of the xmas tree
// v1: 2d
// v2: 3d
// v3: 3d with lights
// v4: with presents underneath it
// v5: with a star on the top
// v6: with a glow??

export function makeLoop({gl, program}: WebGLInit): WebGLLoopFunction {
  const button = makeButton()
  const canvas = gl.canvas as HTMLCanvasElement

  const GL_vertexPosition = gl.getAttribLocation(program, 'vertexPosition');
  const GL_vertexColor = gl.getAttribLocation(program, 'vertexColor');

  const GL_worldMatrix = gl.getUniformLocation(program, 'mWorld');
  const GL_viewMatrix = gl.getUniformLocation(program, 'mView');
  const GL_projectionMatrix = gl.getUniformLocation(program, 'mProjection');
  


  const shape = [
    makeAxesLineVertexShape(),
    ...make3dChristmasTreeVertexShape({
      transform: { 
        move: xyz(0, 0, -SCENE_POSITION_RADIUS),
      }
    }),
    make2dChristmasTreeVertexShape({
      transform: { 
        move: xyz(0, 0, SCENE_POSITION_RADIUS),
      }
    }),
    ...make3dChristmasTreeVertexShape({
      transform: { 
        move: xyz(-SCENE_POSITION_RADIUS, 0, 0),
      }
    }),
    make2dChristmasTreeVertexShape({
      transform: { 
        move: xyz(SCENE_POSITION_RADIUS, 0, 0),
        rotate: {
          origin: xyz(0, 0, 0),
          rotation: xyz(0, radian(90) ,0)
        }
      }
    }),
  ]
  const VAOs = shape.map(s => {
    const vertexBuffer = createStaticVertexBuffer(gl, s.buffer);
    return createVAOForXYZ_RGBBuffer(gl, vertexBuffer, GL_vertexPosition, GL_vertexColor);
  })

  const view = new ViewMatrix(
    [SCENE_POSITION_RADIUS + 2, 0.1, 0], 
    [SCENE_POSITION_RADIUS, 0, 0]
  )
  const world = new WorldMatrix(WorldMatrix.IDENTITY)

	let T = 0;
  let lerp: Generator<number, void, number> | undefined;

  button.onclick = () => {
    const s = world.rotation[1]
    const e = world.rotation[1] - radian(90)
    lerp = makeLerp([s, e], [T, T + 1000])
  }

  return function loop(time: number) {
    const proj = new ProjectionMatrix(canvas.width / canvas.height)

    T = time

    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    // gl.enable(gl.DEPTH_TEST)

    if (lerp) {
      lerp.next()
      const r = lerp.next(T)
      if (!r.done) {
        world.rotateY(r.value)
        console.log(r, lerp)
      }
    }

    gl.uniformMatrix4fv(GL_worldMatrix, false, world.matrix)
    gl.uniformMatrix4fv(GL_viewMatrix, false, view.matrix)
    gl.uniformMatrix4fv(GL_projectionMatrix, false, proj.matrix)

    VAOs.forEach((v, i) => {
      const info = shape[i].info
      drawVAO(gl, v, info)
    })
  }
}

function makeButton(): HTMLButtonElement {
  const button = document.createElement('button')
  button.innerText = 'Rotate'
  button.style.position = 'absolute';
  button.style.top = '0px'
  button.style.left = '0px'
  button.style.width = '80px'
  button.style.height = '60px'

  document.getElementById('root')!.appendChild(button)

  return button
}

export default { 
  VERTEX_SHADER_SOURCE_CODE, 
  FRAGMENT_SHADER_SOURCE_CODE, 
  makeLoop 
}
