import type {ShapeInformation} from './index'
import { makeDefaultCircleOptions } from './shape-defaults'

export function shapeToBuffer(information: ShapeInformation): BufferedShape {
  const {shapes, cull, type} = information
  const input = Array.isArray(shapes) ? shapes : [shapes]
 
  const numberOfcomponents = input.reduce((v, curr) => curr.numberOfcomponents + v, 0)
  const flattendData = input.map(s => s.shape).flat(2)
  return {
    buffer: Float32Array.from(flattendData),
    information: {
      numberOfcomponents,
      cull,
      type
    }
  }
}

const TWO_PI = 2 * Math.PI

export function* circleGenerator(radius: number, segments: number, ) {
  for (let i = 0; i <= segments; i ++ ){

    const angle = i * (TWO_PI / segments)
    const location = [
      radius * Math.cos(angle),
      radius * Math.sin(angle),
      0
    ]

    yield location
  }
}

export function makeCircle(options?: CircleOptions): vector3[] {
  const {center, segments, radius} = makeDefaultCircleOptions(options)
  const points: vector3[] = []

  for (let i = 0; i <= segments; i ++ ){
    const c = [...center]

    const angle1 = i * (TWO_PI / segments)
    const currPoint = [
      radius * Math.cos(angle1),
      radius * Math.sin(angle1),
      c[2],
    ].map((v, i) => v + c[i])

    const angle2 = (i + 1) * (TWO_PI / segments)
    const nextPoint = [
      radius * Math.cos(angle2),
      radius * Math.sin(angle2),
      c[2],
    ].map((v, i) => v + c[i])

    points.push(c, currPoint, nextPoint)
  }
  return points
}