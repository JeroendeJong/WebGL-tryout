import { mat4 } from "gl-matrix";
import { createStaticVertexBuffer, createVAOForXYZ_RGBBuffer, glsl } from "../../general/core-utils";
import { radian, rgb, xyz } from "../../math-utils";
import { make3dChristmasTreeShapeBuffer } from "./shapes";
import { DrawType, FaceCull } from "../../shapes";
import { makeAxesLinesBuffer } from "../../general/axes-shape";
import { makeBoxBuffer } from "../../shapes/buffer-shapes";

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

export function makeLoop({gl, program}: WebGLInit): WebGLLoopFunction {
  const canvas = gl.canvas as HTMLCanvasElement

  const GL_vertexPosition = gl.getAttribLocation(program, 'vertexPosition');
  const GL_vertexColor = gl.getAttribLocation(program, 'vertexColor');

  const GL_worldMatrix = gl.getUniformLocation(program, 'mWorld');
  const GL_viewMatrix = gl.getUniformLocation(program, 'mView');
  const GL_projectionMatrix = gl.getUniformLocation(program, 'mProjection');
  
  const shape = [
    ...make3dChristmasTreeShapeBuffer(),
    makeAxesLinesBuffer()
  ]
  const VAOs = shape.map(s => {
    const vertexBuffer = createStaticVertexBuffer(gl, s.buffer);
    return createVAOForXYZ_RGBBuffer(gl, vertexBuffer, GL_vertexPosition, GL_vertexColor);
  })

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

    gl.enable(gl.DEPTH_TEST)

    angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    const rotationgWorld = makeRotationgWorld(angle)

    gl.uniformMatrix4fv(GL_worldMatrix, false, world)
    gl.uniformMatrix4fv(GL_viewMatrix, false, view)
    gl.uniformMatrix4fv(GL_projectionMatrix, false, proj)

    VAOs.forEach((v, i) => {
      const info = shape[i]

      if (info.cull) {
        gl.enable(gl.CULL_FACE)
        if (info.cull === FaceCull.FRONT) gl.cullFace(gl.FRONT)
        if (info.cull === FaceCull.BACK) gl.cullFace(gl.BACK)
        if (info.cull === FaceCull.FRONT_AND_BACK) gl.cullFace(gl.FRONT_AND_BACK)
      } else gl.disable(gl.CULL_FACE)

      gl.bindVertexArray(v);

      if (info.type === DrawType.LINES) gl.drawArrays(gl.LINES, 0, info.numberOfcomponents);
      else if (info.type === DrawType.TRIANGLE) gl.drawArrays(gl.TRIANGLES, 0, info.numberOfcomponents);
      else if (info.type === DrawType.POINTS) gl.drawArrays(gl.POINTS, 0, info.numberOfcomponents);
      else {
        throw new Error(`unknown drawtype!: ${info.type}`, )
      }
    })
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