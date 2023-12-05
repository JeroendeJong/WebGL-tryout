import { mat4 } from "gl-matrix";
import { makeTriangleBuffer } from "../../shapes/buffer-shapes";
import { createStaticVertexBuffer, createVAOForXYZ_RGBBuffer, glsl, withArray } from "../../general/core-utils";

export const VERTEX_SHADER_SOURCE_CODE = glsl`#version 300 es
  precision mediump float;

  in vec2 vertexPosition;
  in vec3 vertexColor;

  uniform mat4 mWorld;
  uniform mat4 mView;
  uniform mat4 mProjection;

  out vec3 fragmentColor;

  void main() {
    fragmentColor = vertexColor;

    gl_Position = mProjection * mView * mWorld * vec4(vertexPosition, 0.0, 1.0);
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
  
  const triangle = makeTriangleBuffer({ color: [0.0274, 0.3372, 0.1] })
  const vertexBuffer = createStaticVertexBuffer(gl, triangle.buffer);
  const vertexArray = createVAOForXYZ_RGBBuffer(gl, vertexBuffer, GL_vertexPosition, GL_vertexColor);

  const triangles = [
    { rotateZ: 180, position: [0, -0.5, 0], current: 0},
    { rotateZ: 0, position: [0, 0.5, 0], current: 0},
    { rotateZ: 90, position: [-0.5, 0, 0], current: 0},
    { rotateZ: 270, position: [0.5, 0, 0], current: 0},
  ]

  return function loop() {
    canvas.width = 800;
    canvas.height = 600;

    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    triangles.forEach(t => {
      const world = withArray(mat4.identity)
      const view = withArray(mat4.identity)
      mat4.translate(view, view, t.position as any)
      mat4.rotateZ(view, view, t.rotateZ * (Math.PI / 180))
      mat4.rotateX(view, view, t.current * ((Math.PI / 180)))
      const proj = withArray(mat4.identity) 

      gl.uniformMatrix4fv(GL_worldMatrix, false, world)
      gl.uniformMatrix4fv(GL_viewMatrix, false, view)
      gl.uniformMatrix4fv(GL_projectionMatrix, false, proj)
      gl.bindVertexArray(vertexArray);
      gl.drawArrays(gl.TRIANGLES, 0, triangle.numberOfcomponents);

      t.current = (t.current + 1) % 360;
    })
  }
}

export default {
  VERTEX_SHADER_SOURCE_CODE,
  FRAGMENT_SHADER_SOURCE_CODE,
  makeLoop
}