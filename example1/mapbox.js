import vertexShaderText from './shaders/shader.vert.js';
import fragmentShaderText from './shaders/shader.frag.js';
import {createShader, createProgram} from './utils.js';

const canvas = document.getElementById('canvas');
const gl = canvas.getContext("webgl");
if (!gl) throw new Error('WebGl not found mate!');


const program = createProgram(gl, 
  createShader(gl, gl.VERTEX_SHADER, vertexShaderText), 
  createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText)
);


gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

// Clear the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT)


// variables

const gl_attribute_position = gl.getAttribLocation(program, "a_pos");

// buffer allocation and usage.
const gl_buffer_position = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, gl_buffer_position);


// bind data to the previously bound buffer.
// which, in this case is the `gl_buffer_position`
gl.bufferData(
  gl.ARRAY_BUFFER, 
  new Float32Array([
    0, 0,
    0, 0.5,
    0.7, 0,

    0, 0.5,
    0.7, 0.5,
    0.7, 0
  ]), 
  gl.STATIC_DRAW
);


//
// START up + rendering 
//

gl.useProgram(program);

// gl.bindBuffer(gl.ARRAY_BUFFER, gl_buffer_position);


gl.enableVertexAttribArray(gl_attribute_position);

var size = 2;          // 2 components per iteration (because the shader only uses XY remember!)
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(gl_attribute_position, size, gl.FLOAT, normalize, stride, offset);


var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 6; // how many "coordinates" do we wanna draw? For this simple example this will equal the length of the Float32Array.
gl.drawArrays(primitiveType, offset, count);
