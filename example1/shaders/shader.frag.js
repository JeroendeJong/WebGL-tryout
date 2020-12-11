
export default `
  // doesn't necesarily do much, but it gives the compiler an idea as to the precision we are aiming for.
  // omiting this is not a great idea, however it will still work as expected.
  precision mediump float;

  void main() {

    // what colour should the rendered vertex get 
    // since no data is passed through in anyway ATM, the colour of every pixel in every triangle 
    // will be the same.
    gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);
  }
`;
