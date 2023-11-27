import { mat4 } from "gl-matrix";
import { makeChristmasTreeShapeBuffer } from "../shapes";
import { createStaticVertexBuffer, createVAOForXYZ_RGBBuffer, glsl, withArray } from "../utils";
import { xyz } from "../math-utils";

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
  { translate: xyz(0, 0, 0), scale: xyz(0.6, 0.6, 0)  },
]

export function makeLoop({gl, program}: WebGLInit): WebGLLoopFunction {
  const canvas = gl.canvas as HTMLCanvasElement

  const GL_vertexPosition = gl.getAttribLocation(program, 'vertexPosition');
  const GL_vertexColor = gl.getAttribLocation(program, 'vertexColor');

  // how the model is transform from model into world space
  const GL_worldMatrix = gl.getUniformLocation(program, 'mWorld');

  // how the world is positioned in relation to the camera?
  const GL_viewMatrix = gl.getUniformLocation(program, 'mView');

  // how the camera view is transformed from 3d into 2d.
  const GL_projectionMatrix = gl.getUniformLocation(program, 'mProjection');
  
  const tree = makeChristmasTreeShapeBuffer()
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
      const world = withArray(mat4.identity)
      mat4.translate(world, world, t.translate)
      mat4.scale(world, world, t.scale)

      gl.uniformMatrix4fv(GL_worldMatrix, false, world)
      gl.uniformMatrix4fv(GL_viewMatrix, false, view)
      gl.uniformMatrix4fv(GL_projectionMatrix, false, proj)
      gl.bindVertexArray(vertexArray);
      gl.drawArrays(gl.TRIANGLES, 0, tree.numberOfcomponents);
    })

    requestAnimationFrame(loop)
  }
}

export default {
  VERTEX_SHADER_SOURCE_CODE,
  FRAGMENT_SHADER_SOURCE_CODE,
  makeLoop
}