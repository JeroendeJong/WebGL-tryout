
export default `
  // doesn't necesarily do much, but it gives the compiler an idea as to the precision we are aiming for.
  // omiting this is not a great idea, however it will still work as expected.
  precision mediump float;
  
  uniform vec4 u_color;
 
  void main() {
    gl_FragColor = u_color;
  }
`;
