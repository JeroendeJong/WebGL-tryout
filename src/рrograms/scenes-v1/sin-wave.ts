import { make2DSquareBuffer } from "../../shapes/buffer-shapes";
import { createStaticVertexBuffer, createVAOForBufferWithLength, glsl } from "../../general/core-utils";


const VERTEX_SHADER_SOURCE_CODE = glsl`#version 300 es
  precision mediump float;

  in vec2 vertexPosition;

  void main() {
    gl_Position = vec4(vertexPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE_CODE = glsl`#version 300 es
  precision mediump float;

  uniform float time;
  uniform vec2 resolution;

  out vec4 outputColor;

  float createWave(float x, float intensity, float time) {
    float wave = round( sin(intensity * x) * 1000.0 ) / 1000.0;
    float normalizedWave = (wave + 2.0) / (10.0 + time);
    return normalizedWave;
  }

  void main() {
    float x = gl_FragCoord.x / resolution.x;
    float y = gl_FragCoord.y / resolution.y;

    float XXLWave = createWave(x, 7.0, time) + 0.3;
    float XLWave = createWave(x, 5.0, time) + 0.1;
    float LWave = createWave(x, 2.0, time) + 0.01;

    if (y < LWave) {
      outputColor = vec4(0.1882, 0.6941, 0.8078, 1.0);
    } else if (y < XLWave) {
      outputColor = vec4(0.1607, 0.6431, 0.7647, 1.0);
    } else if (y < XXLWave) {
      outputColor = vec4(0.01568, 0.4117, 0.5921, 1.0);
    } else {
      outputColor = vec4(0.1, 0.1, 0.1, 1.0);
    }
  }
`;

function makeLoop({gl, program}: WebGLInit): WebGLLoopFunction {
  const canvas = gl.canvas as HTMLCanvasElement

  const GL_vertexPosition = gl.getAttribLocation(program, 'vertexPosition');
  const GL_Time = gl.getUniformLocation(program, 'time');
  const GL_resolutionUniform = gl.getUniformLocation(program, 'resolution');

  const square = make2DSquareBuffer()
  const vertexBuffer = createStaticVertexBuffer(gl, square.shape);
  const vertexArray = createVAOForBufferWithLength(gl, vertexBuffer, 2, GL_vertexPosition);

  let time = 0.0

  return function loop() {
    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    gl.uniform1f(GL_Time, Math.sin(time) * 4.0 + 1.0);
    gl.uniform2f(GL_resolutionUniform, canvas.width, canvas.height);

    gl.bindVertexArray(vertexArray);
    gl.drawArrays(gl.TRIANGLES, 0, square.numberOfcomponents);

    time += 0.005;
  }
}

export default {
  VERTEX_SHADER_SOURCE_CODE,
  FRAGMENT_SHADER_SOURCE_CODE,
  makeLoop
}