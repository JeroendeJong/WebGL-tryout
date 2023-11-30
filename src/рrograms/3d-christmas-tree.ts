import { mat4 } from "gl-matrix";
import { make3dChristmasTreeShapeBuffer, makeConeBuffer } from "../shapes/buffer-shapes";
import { createStaticVertexBuffer, createVAOForXYZ_RGBBuffer, glsl } from "../webgl/utils";
import { radian, rgb, xyz } from "../math-utils";

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
  
  const circle = make3dChristmasTreeShapeBuffer()

  // const circle = makeTriangleBuffer({
  //   color: rgb(0.3607, 0.1686, 0.1686),
  // })

  const vertexBuffer = createStaticVertexBuffer(gl, circle.buffer);
  const vertexArray = createVAOForXYZ_RGBBuffer(gl, vertexBuffer, GL_vertexPosition, GL_vertexColor);

  canvas.width = 800;
  canvas.height = 600;

  const proj = makeProjection(canvas)
  const view = makeView()
  const world = makeWord()

	let angle = 0;

  return function loop() {
    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);


    angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    const rotationgWorld = makeRotationgWorld(angle)

    gl.uniformMatrix4fv(GL_worldMatrix, false, rotationgWorld)
    gl.uniformMatrix4fv(GL_viewMatrix, false, view)
    gl.uniformMatrix4fv(GL_projectionMatrix, false, proj)
    gl.bindVertexArray(vertexArray);
    gl.drawArrays(gl.TRIANGLES, 0, circle.numberOfcomponents);
  }
}

function makeProjection(canvas: HTMLCanvasElement) {
  const proj = new Float32Array(16)
  const ratio = canvas.width / canvas.height
  mat4.perspective(proj, radian(90), ratio, 0.1, 1000.0);

  return proj
}

function makeView() {
  const view = new Float32Array(16)
  mat4.lookAt(view, [0, 0, 3], [0, 0, 0], [0, 1, 0]);
  return view
}

function makeWord() {
  const world = new Float32Array(16)
  mat4.identity(world);
  return world
}

function makeRotationgWorld(angle: number) {
  const world = new Float32Array(16)
  mat4.identity(world);

  const xRotationMatrix = new Float32Array(16);
  const yRotationMatrix = new Float32Array(16);
  const identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);

  mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
  mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
  mat4.mul(world, yRotationMatrix, xRotationMatrix);

  return world
}


export default {
  VERTEX_SHADER_SOURCE_CODE,
  FRAGMENT_SHADER_SOURCE_CODE,
  makeLoop
}