import { mat3 } from "gl-matrix";
import { createStaticVertexBuffer, createVAOForBufferWithLength, glsl, withArray } from "../../../general/core-utils";
import { prepareSnow, snowFlakeToBufferData, updateSnow } from "./snow-utils";

export const VERTEX_SHADER_SOURCE_CODE = glsl`#version 300 es
  precision mediump float;

  in vec4 snowFlake;

  uniform mat3 mWorld;
  uniform mat3 mView;
  uniform mat3 mProjection;

  out vec4 fragmentColor;

  void main() {
    fragmentColor = vec4(1.0, 1.0, 1.0, snowFlake.w);

    vec3 transformedPosition = mProjection * mView * mWorld * vec3(snowFlake.xy, 1.0);
    gl_Position = vec4(transformedPosition, 1.0);
    gl_PointSize = snowFlake.z;
  }
`;

export const FRAGMENT_SHADER_SOURCE_CODE = glsl`#version 300 es
  precision mediump float;

  in vec4 fragmentColor;
  out vec4 outputColor;

  void main() {
    outputColor = fragmentColor;
  }
`;

export function makeLoop({gl, program}: WebGLInit): WebGLLoopFunction {
  const canvas = gl.canvas as HTMLCanvasElement

  const GL_snowFlake = gl.getAttribLocation(program, 'snowFlake');

  const GL_worldMatrix = gl.getUniformLocation(program, 'mWorld');
  const GL_viewMatrix = gl.getUniformLocation(program, 'mView');
  const GL_projectionMatrix = gl.getUniformLocation(program, 'mProjection');
  
  let snow = prepareSnow()

  const world = withArray(mat3.identity)
  const view = withArray(mat3.identity)

  return function loop() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    // ensure that the alpha of the snow auto blends with the backdrop
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    snow = updateSnow(snow)
    const data = snow
      .map(s => snowFlakeToBufferData(s))
      .map(a => [...a]).flat()

    const vertexBuffer = createStaticVertexBuffer(gl, new Float32Array(data));
    const vertexArray = createVAOForBufferWithLength(gl, vertexBuffer, 4, GL_snowFlake);

    gl.uniformMatrix3fv(GL_worldMatrix, false, world)
    gl.uniformMatrix3fv(GL_viewMatrix, false, view)
    gl.uniformMatrix3fv(GL_projectionMatrix, false, makeProjectMatrix())
    gl.bindVertexArray(vertexArray);
    gl.drawArrays(gl.POINTS, 0, snow.length);

    function makeProjectMatrix() {
      const proj = withArray(mat3.identity) 
      mat3.projection(proj, canvas.width, canvas.height);
      return proj
    }
  }
}

export default {
  VERTEX_SHADER_SOURCE_CODE,
  FRAGMENT_SHADER_SOURCE_CODE,
  makeLoop
}