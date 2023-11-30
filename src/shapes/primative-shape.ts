import { vec3 } from "gl-matrix";
import { xyz } from "../math-utils";
import { makeDefaultCircleOptions } from "./shape-defaults";

const TWO_PI = 2 * Math.PI

//
// Primative shapes ALWAYS have a clip space from -1 to 1
//

export function makePrimativeCone(options: ConeShapeOptions): PrimativeShape {
  const circle = makeCircle(options.cone)
  const length = options.cone?.length || 1

  // slightly fiddely, but with a cone, the centre is not at the center every first point (of 3).
  const cone: vec3[] = circle.map((v, i) => {
    const isCentrePoint = (i % 3 === 0)
    if (isCentrePoint) {
      const copy = [...v] as vec3
      copy[2] = copy[2] + length
      return copy
    }
    return v
  })

  return makePrimativeShape(cone, options);
}

function makeCircle(options?: CircleOptions): vector3[] {
  const {center, segments, radius} = makeDefaultCircleOptions(options)
  const points: vector3[] = []

  for (let i = 0; i <= segments; i ++ ){
    const curr = i * (TWO_PI / segments)
    const currPoint: vector3 = [
      radius * Math.cos(curr),
      radius * Math.sin(curr),
      center[2],
    ]

    const next = (i + 1) * (TWO_PI / segments)
    const nextPoint: vector3 = [
      radius * Math.cos(next),
      radius * Math.sin(next),
      center[2],
    ] 

    points.push(
      vec3.normalize(center, center), 
      vec3.normalize(currPoint, currPoint), 
      vec3.normalize(nextPoint, nextPoint), 
    )

    console.log(points[points.length - 1])
  }
  return points
}

export function makePrimativeCircle(options: CircleShapeOptions): PrimativeShape {
  const circle = makeCircle(options.circle)
  return makePrimativeShape(circle, options);
}

export function makePrimativeRectangle(options: ShapeOptions): PrimativeShape {
  const rectangle = [
    xyz(-0.5 ,  1, 0),
    xyz(-0.5, -1, 0),
    xyz(0.5 , -1, 0), 
  
    xyz(0.5 ,  1, 0),
    xyz(-0.5, 1, 0),
    xyz(0.5 , -1, 0),
  ]

  return makePrimativeShape(rectangle, options);
}

/**
 * returns the hape with a range -1 to 1
 */
export function makePrimativeTriangle(options: ShapeOptions): PrimativeShape {
  const triangle = [
    xyz(0 ,  1, 0),
    xyz(-1, -1, 0),
    xyz(1 , -1, 0)
  ]

  return makePrimativeShape(triangle, options);
}

/**
 * Interals!
 */
function makePrimativeShape(shape: vector3[], options: ShapeOptions): PrimativeShape {
  const basicShapes = shape.map(p => {
    const {transform, color} = options
    if (transform) {
      if (transform?.move !== undefined) vec3.add(p, p, transform?.move);
      if (transform?.scale !== undefined) vec3.scale(p, p, transform?.scale);
      if (transform.rotate) {
        const { rotation, origin } = transform.rotate
        vec3.rotateX(p, p, origin, rotation[0]);
        vec3.rotateY(p, p, origin, rotation[1]);
        vec3.rotateZ(p, p, origin, rotation[2]);
      }
    }

    const value = Array.from(p)
    if (color) value.push(...color);

    return value
  })

  return {
    numberOfcomponents: shape.length,
    shape: basicShapes
  }
}