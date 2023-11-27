import { vec2, vec3 } from "gl-matrix";
import { rgb, xyz } from "./math-utils";


export function makePrimativeRectangle(options: ShapeOptions<Vector3>): PrimativeShape {
  const rectangle = [
    xyz(-0.5 ,  1, 0),
    xyz(-0.5, -1, 0),
    xyz(0.5 , -1, 0), 
  
    xyz(0.5 ,  1, 0),
    xyz(-0.5, 1, 0),
    xyz(0.5 , -1, 0),
  ]

  return makePrimative2DShape(rectangle, options);
}

/**
 * returns the hape with a range -1 to 1
 */
export function makePrimativeTriangle(options: ShapeOptions<Vector3>): PrimativeShape {
  const triangle = [
    xyz(0 ,  1, 0),
    xyz(-1, -1, 0),
    xyz(1 , -1, 0)
  ]

  return makePrimative2DShape(triangle, options);
}

/**
 * Interals!
 */
function makePrimative2DShape(shape: Vector3[], options: ShapeOptions<Vector3>): PrimativeShape {
  shape.forEach(p => {
    if (options.move !== undefined) vec3.add(p, p, options.move);
    if (options.scale !== undefined) vec3.scale(p, p, options.scale);
    // if (options.rotate) {
    //   const { origin, rad } = options.rotate
    //   vec2.rotate(p, p, origin, rad);
    // }

    if (options.withColor) p.push(...options.withColor);
  })
  return makePrimativeShapeModel(shape, shape.length)
}

function makePrimativeShapeModel(shape: (Vector2 | Vector3)[], count: number): PrimativeShape {
  return {
    numberOfcomponents: count,
    shape
  }
}