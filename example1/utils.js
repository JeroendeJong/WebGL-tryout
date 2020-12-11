export function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  // only log & cleanup if shader has failed somehow
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

export function createProgram(gl, vertexShaderInstance, fragmentShaderInstance) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShaderInstance);
  gl.attachShader(program, fragmentShaderInstance);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  // only log & cleanup if program creation has failed somehow
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}