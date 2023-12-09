import { vec3 } from "gl-matrix";
import { PrimativeShape } from ".";
import { xyz } from "../math-utils";
import { makeCircle, circleGenerator } from "./circle-generator";
import { makeDefaultCircleOptions } from "./shape-defaults";
import { BasicShapeOptions, CircleShapeOptions, ConeShapeOptions, CylinderShapeOptions, BoxShapeOptions } from "./types";
import { makePrimativeShape } from "./shape-creation";

export function makePrimativeTriangle(options: BasicShapeOptions): PrimativeShape {
  const triangle = [
    xyz(0 ,  1, 0),
    xyz(-1, -1, 0),
    xyz(1 , -1, 0)
  ]

  return makePrimativeShape(triangle, options);
}

export function makePrimativeRectangle(options: BasicShapeOptions): PrimativeShape {
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

export function makePrimativeLine(options: BasicShapeOptions): PrimativeShape {
  const line = [
    xyz(0, 0, 0),
    xyz(0, 1, 0)
  ]

  return makePrimativeShape(line, options);
}

export function makePrimativeCircle(options: CircleShapeOptions): PrimativeShape {
  const circle = makeCircle(options.circle)
  return makePrimativeShape(circle, options);
}

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

export function makePrimativeCylinder(options: CylinderShapeOptions): PrimativeShape {
  const {center, segments, radius} = makeDefaultCircleOptions(options.cylinder)
  const length = options.cylinder?.length || 1

  const points: vector3[] = []
  for (const point of circleGenerator(radius, segments)) {
    point[0] = point[0] + center[0]
    point[1] = point[1] + center[1]
    point[2] = point[2] + center[2]
    points.push(point as vector3)
  }

  const cylinder: vector3[] = []
  points.forEach((v, i) => {
    const curr = v
    const next = i === points.length -1 ? points[0] : points[i + 1]

    const bottom = [[...curr], toTopPoint(next), [...next]] as vector3[]
    const top = [toTopPoint(curr), [...curr], toTopPoint(next)] as vector3[]
    cylinder.push(...bottom, ...top)
  })

  console.log(cylinder)
  return makePrimativeShape(cylinder, options);

  function toTopPoint(p: vector3): vector3 {
    const copy = [...p] as vector3
    copy[2] = copy[2] + length
    return copy
  }
}

export function makePrimativeBox(options: BoxShapeOptions): PrimativeShape {
  return makePrimativeShape([
    ...makeSideFrontBack(0.5),
    ...makeSideFrontBack(-0.5),
    ...makeSideTopBottom(0.5),
    ...makeSideTopBottom(-0.5),
    ...makeSideLeftRight(0.5),
    ...makeSideLeftRight(-0.5),
  ], options)


  function makeSideTopBottom(y: number) {
    return [
      xyz(0.5, y, 0.5), xyz(-0.5, y, 0.5), xyz(-0.5, y, -0.5), 
      xyz(-0.5, y, -0.5), xyz(0.5, y, -0.5), xyz(0.5, y, 0.5),
    ]
  }

  function makeSideLeftRight(x: number) {
    return [
      xyz(x, 0.5, 0.5), xyz(x, -0.5, 0.5), xyz(x, -0.5, -0.5), 
      xyz(x, -0.5, -0.5), xyz(x, 0.5, -0.5), xyz(x, 0.5, 0.5),
    ]
  }

  function makeSideFrontBack(z: number) {
    return [
      xyz(-0.5 ,  0.5, z), xyz(-0.5, -0.5, z), xyz(0.5 , -0.5, z), 
      xyz(0.5 ,  0.5, z),  xyz(-0.5, 0.5, z),  xyz(0.5 , -0.5, z),
    ]
  }
}
