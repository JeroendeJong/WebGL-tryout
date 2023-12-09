/**
 * returns the hape with a range -1 to 1
 * @deprecated
 */
export function make2DSquareBuffer(): any {
  return {
    numberOfcomponents: 6,
    shape: new Float32Array([ 
      // Bottom left triangle
      -1, 1,
      -1, -1, 
      1, -1,
      
      // Top right triangle
      1, -1,
      1, 1,
      -1, 1
    ])
  }
}