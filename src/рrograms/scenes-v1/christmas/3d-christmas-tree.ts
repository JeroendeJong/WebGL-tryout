import { createStaticVertexBuffer, createVAOForXYZ_RGBBuffer, drawVAO, glsl } from "../../../general/core-utils";
import { makeAxesLineVertexShape } from "../../../general/axes-shape";
import { make3dChristmasTreeVertexShape } from "./shapes";
import { ProjectionMatrix } from "../../../view/projection";
import { ViewMatrix } from "../../../view/view";
import { WorldMatrix } from "../../../view/world";

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

export function makeLoop({gl, program}: WebGLInit): WebGLLoopFunction {
  const canvas = gl.canvas as HTMLCanvasElement

  const GL_vertexPosition = gl.getAttribLocation(program, 'vertexPosition');
  const GL_vertexColor = gl.getAttribLocation(program, 'vertexColor');

  const GL_worldMatrix = gl.getUniformLocation(program, 'mWorld');
  const GL_viewMatrix = gl.getUniformLocation(program, 'mView');
  const GL_projectionMatrix = gl.getUniformLocation(program, 'mProjection');
  
  const shape = [
    makeAxesLineVertexShape(),
    ...make3dChristmasTreeVertexShape(),
  ]
  const VAOs = shape.map(s => {
    const vertexBuffer = createStaticVertexBuffer(gl, s.buffer);
    return createVAOForXYZ_RGBBuffer(gl, vertexBuffer, GL_vertexPosition, GL_vertexColor);
  })

  canvas.width = 800;
  canvas.height = 600;

  const proj = new ProjectionMatrix(canvas.width / canvas.height)
  const view = new ViewMatrix([0, 0, 3], [0, 0, 0])
  const world = new WorldMatrix(WorldMatrix.IDENTITY)

	let angle = 0;

  return function loop() {
    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    gl.enable(gl.DEPTH_TEST)

    // angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    // world.rotateY(angle)

    gl.uniformMatrix4fv(GL_worldMatrix, false, world.matrix)
    gl.uniformMatrix4fv(GL_viewMatrix, false, view.matrix)
    gl.uniformMatrix4fv(GL_projectionMatrix, false, proj.matrix)

    VAOs.forEach((v, i) => {
      const info = shape[i].info
      drawVAO(gl, v, info)
    })
  }
  // return {
  //   loop: Function,
  //   drag: Function,
  //   click: Function
  // }
}

export default {
  VERTEX_SHADER_SOURCE_CODE,
  FRAGMENT_SHADER_SOURCE_CODE,
  makeLoop
}