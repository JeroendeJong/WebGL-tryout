import { mat4 } from "gl-matrix";
import { createStaticVertexBuffer, createVAOForXYZ_RGBBuffer, glsl, withArray } from "../../general/core-utils";
import { xyz } from "../../math-utils";
import { make2dChristmasTreeShapeBuffer } from "./shapes";

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

const trees = [
  { world: getWorldMatrix(xyz(0, 0, 0), xyz(0.6, 0.6, 0))  },
]

export function makeLoop({gl, program}: WebGLInit): WebGLLoopFunction {
  const canvas = gl.canvas as HTMLCanvasElement

  const GL_vertexPosition = gl.getAttribLocation(program, 'vertexPosition');
  const GL_vertexColor = gl.getAttribLocation(program, 'vertexColor');

  const GL_worldMatrix = gl.getUniformLocation(program, 'mWorld');
  const GL_viewMatrix = gl.getUniformLocation(program, 'mView');
  const GL_projectionMatrix = gl.getUniformLocation(program, 'mProjection');
  
  const tree = make2dChristmasTreeShapeBuffer()
  const vertexBuffer = createStaticVertexBuffer(gl, tree.buffer);
  const vertexArray = createVAOForXYZ_RGBBuffer(gl, vertexBuffer, GL_vertexPosition, GL_vertexColor);

  const proj = withArray(mat4.identity) 
  const view = withArray(mat4.identity)

  return function loop() {
    canvas.width = 800;
    canvas.height = 600;
    
    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    trees.forEach(t => {
      gl.uniformMatrix4fv(GL_worldMatrix, false, t.world)
      gl.uniformMatrix4fv(GL_viewMatrix, false, view)
      gl.uniformMatrix4fv(GL_projectionMatrix, false, proj)
      gl.bindVertexArray(vertexArray);
      gl.drawArrays(gl.TRIANGLES, 0, tree.numberOfcomponents);
    })
  }
}

function getWorldMatrix(translate: vector3, scale: vector3) {
  const world = withArray(mat4.identity)
  mat4.translate(world, world, translate)
  mat4.scale(world, world, scale)
  return world
}


export default {
  VERTEX_SHADER_SOURCE_CODE,
  FRAGMENT_SHADER_SOURCE_CODE,
  makeLoop
}