import { DrawType, FaceCull } from "../shapes";

// STUB for syntax highlight
export const glsl = (x: any) => x;

/**
 * Assumes canvas HTML element has ID canvas.
 * @param vCode vertex source code
 * @param fCode fragment source code
 * @returns gl and WebGLProgram Instance
 */
export function initGL(vCode: string, fCode: string): WebGLInit {
  const canvas = document.getElementById('canvas')
  if (!canvas) throw new Error('no Canvas Element found')
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error('no Canvas Element found')

  const gl = getContext(canvas);
  const program = createProgram(gl, 
    createShader(gl, gl.VERTEX_SHADER, vCode), 
    createShader(gl, gl.FRAGMENT_SHADER, fCode)
  );

  if (!program) throw new Error('Failed to create WebGL program');

  return {
    gl, 
    program
  }
}


export function getContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = canvas.getContext('webgl2');
  if (gl) return gl
  
  const isWebGl1Supported = !!(document.createElement('canvas')).getContext('webgl');
  if (isWebGl1Supported) {
    throw new Error('WebGL 1 is supported, but not v2 - try using a different device or browser');
  } else {
    throw new Error('WebGL is not supported on this device - try using a different device or browser');
  }
}

export function createShader(gl: WebGL2RenderingContext, type: number, sourceCode: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error('Failed to create Shader Object');
  }

  gl.shaderSource(shader, sourceCode);
  gl.compileShader(shader);
  const isSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (isSuccess) return shader;

  const error = gl.getShaderInfoLog(shader)
  gl.deleteShader(shader);
  throw new Error(error || 'Unknown error compiling shader');
}

export function createProgram(
  gl: WebGL2RenderingContext, 
  vertexShader: WebGLShader, 
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) {
    throw new Error('Failed to create WebGL Program');
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const isSuccess = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (isSuccess) return program;
 
  const error = gl.getProgramInfoLog(program)
  gl.deleteProgram(program);

  throw new Error(error || 'Unknown error creating program');
}

/**
 * Given any data array, creates a buffer reference in WebGL land
 */
export function createStaticVertexBuffer(gl: WebGL2RenderingContext, data: ArrayBuffer): WebGLBuffer {
  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error('Failed to allocate Static Vertex Buffer');
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return buffer;
}

/**
 * makes an assumption that every item the current data in the buffer consists of XYZRGB values. 
 * So per entity it expects 6 items. Use this function if your colour values are embedded inside the data buffer.
 * @param gl 
 * @param buffer 
 * @param positionAttribute 
 * @param colorAttribute 
 * @returns a vertex array instance (VAO) in WebGL land
 */
export function createVAOForXYZ_RGBBuffer(
  gl: WebGL2RenderingContext, 
  buffer: WebGLBuffer,
  positionAttribute: number, 
  colorAttribute: number
): WebGLVertexArrayObject {
  const vao = gl.createVertexArray();
  if (!vao) throw new Error('Failed to allocate VAO for XY RGB buffers');

  gl.bindVertexArray(vao);

  gl.enableVertexAttribArray(positionAttribute);
  gl.enableVertexAttribArray(colorAttribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, size(6), size(0));
  gl.vertexAttribPointer(colorAttribute, 3, gl.FLOAT, false, size(6), size(3));
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.bindVertexArray(null);

  return vao;

  function size(s: number) {
    return s * Float32Array.BYTES_PER_ELEMENT
  }
}

/**
 * makes an assumption that every item the current data in the buffer consists of {length} length. 
 * Does not make any assumption about colour being present.
 * @param gl 
 * @param buffer 
 * @param length 
 * @param positionAttribute 
 * @returns a vertex array instance (VAO) in WebGL land
 */
export function createVAOForBufferWithLength(
  gl: WebGL2RenderingContext, 
  buffer: WebGLBuffer,
  length: number,
  positionAttribute: number
): WebGLVertexArrayObject {
  const vao = gl.createVertexArray();
  if (!vao) throw new Error('Failed to allocate VAO for XY RGB buffers');

  gl.bindVertexArray(vao);

  gl.enableVertexAttribArray(positionAttribute);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(positionAttribute, length, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.bindVertexArray(null);

  return vao;
}


/**
 * @deprecated
 */
export function withArray(func: any, args: any = []) {
  const array: any[] = []
  return func(array, ...args)
}

export function drawVAO(gl: WebGL2RenderingContext, vao: WebGLVertexArrayObject, info: BufferDrawInformation) {
  if (info.cull) {
    gl.enable(gl.CULL_FACE)
    if (info.cull === FaceCull.FRONT) gl.cullFace(gl.FRONT)
    if (info.cull === FaceCull.BACK) gl.cullFace(gl.BACK)
    if (info.cull === FaceCull.FRONT_AND_BACK) gl.cullFace(gl.FRONT_AND_BACK)
  } else gl.disable(gl.CULL_FACE)

  gl.bindVertexArray(vao);

  if (info.type === DrawType.LINES) gl.drawArrays(gl.LINES, 0, info.numberOfcomponents);
  else if (info.type === DrawType.TRIANGLE) gl.drawArrays(gl.TRIANGLES, 0, info.numberOfcomponents);
  else if (info.type === DrawType.POINTS) gl.drawArrays(gl.POINTS, 0, info.numberOfcomponents);
  else {
    throw new Error(`unknown drawtype!: ${info.type}`, )
  }

  gl.disable(gl.CULL_FACE);
  gl.bindVertexArray(null);
}