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


const thickness = 0.1;
const width = 0.5;
const height = 1;
// const 
export function createLetterHdataset(x = 0, y = 0) {

  return new Float32Array([
    // left rectange 1
    x, y,
    x, y + height,
    x + thickness, y + height,

    // left rectange 2
    x, y,
    x + thickness, y,
    x + thickness, y + height,

    // middle rectange 1
    x + thickness, y + (height / 2 - thickness),
    x + thickness, y + (height / 2 + thickness),
    x + (width - thickness), y + (height / 2 + thickness),
    
    // middle rectange 2
    x + width - thickness, y + (height / 2) - thickness,
    x + width - thickness, y + (height / 2) + thickness,
    x + thickness, y + (height / 2) - thickness,

    // right rectange 1
    x + width, y,
    x + width, y + height,
    x + width - thickness, y,

    // right rectange 2
    x + width - thickness, y,
    x + width - thickness, y + height,
    x + width, y + height,
  ]) 
}


export const m3 = {
  identity: function() {
    return [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ];
  },
  translation: function(tx, ty) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1,
    ];
  },
 
  rotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      c,-s, 0,
      s, c, 0,
      0, 0, 1,
    ];
  },
 
  scaling: function(sx, sy) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ];
  },
  multiply: function(a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];
 
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  }
};