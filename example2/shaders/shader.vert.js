
export default `
  // on a 3d environment (which mapbox is, the positioning vector has 4 values; x,y,z and w)
  // however, for this example we will only use a 2d space, so in the main the other two values get their default
  // values attributed. 
  attribute vec2 a_pos;

  uniform mat3 u_matrix;

  void main() {
    gl_Position = vec4((u_matrix * vec3(a_pos, 1)).xy, 0, 1);
  }
`;