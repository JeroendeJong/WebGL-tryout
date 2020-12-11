import vertexShaderText from './shaders/shader.vert.js';
import fragmentShaderText from './shaders/shader.frag.js';
import {createShader, createProgram, createLetterHdataset, m3} from './utils.js';

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
const gl_uniform_matrix = gl.getUniformLocation(program, "u_matrix");
const gl_uniform_color = gl.getUniformLocation(program, "u_color");

// buffer allocation and usage.
const gl_buffer_position = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, gl_buffer_position);

// as far as I understand it, the `bufferData` call will fill whatever buffer was last "bound."
// which, in this case will be the `gl_buffer_position`. So usage of this has to be carefully considered
// since the order of calling matters a lot.
gl.bufferData(gl.ARRAY_BUFFER,  createLetterHdataset(-1, -1), gl.STATIC_DRAW);


//
// START up + rendering 
//

gl.useProgram(program);

// gl.bindBuffer(gl.ARRAY_BUFFER, gl_buffer_position);


/**
 * set vertex position coordinates
 */ 

gl.enableVertexAttribArray(gl_attribute_position);

var size = 2;          // 2 components per iteration (because the shader only uses XY remember!)
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(gl_attribute_position, size, gl.FLOAT, normalize, stride, offset);


/**
 * Set camera position coordinates
 * NOTE: It seems in general rather than mutating the location of the data, we'd rather mutate the camera 
 * (often refered to as `u_matrix`)
 */ 

const translationMatrix = m3.translation(0.2, 0.1);
const rotationMatrix = m3.rotation(0);
const scaleMatrix = m3.scaling(1, 1);

var matrix = m3.identity();

// we do a few "render iterations".
// every iteratoin will produce a renderd "H" letter with its own color.
for (var i = 0; i < 5; ++i) {
  
  matrix = m3.multiply(matrix, translationMatrix);
  matrix = m3.multiply(matrix, rotationMatrix);
  matrix = m3.multiply(matrix, scaleMatrix);

  gl.uniform4f(gl_uniform_color, Math.random(), Math.random(), Math.random(), 1);

  gl.uniformMatrix3fv(gl_uniform_matrix, false, matrix);

  /**
   * generally, the `drawArrays` function seems to be the end of the cycle.
   * all buffers have been bound and filled with data, the drawarrays then passes this off to the shaders
   * to position the elements + 
   */


  const count = 6 * 3; // how many "coordinates" do we wanna draw? For this simple example this will equal the length of the Float32Array.
  gl.drawArrays(gl.TRIANGLES, 0, count);
}
