

export function shapeToBuffer(...args: PrimativeShape[]): BufferInformation {
  const numberOfcomponents = args.reduce((v, curr) => curr.numberOfcomponents + v, 0)
  const shapes = args.map(s => s.shape).flat(2)

  return {
    numberOfcomponents,
    buffer: Float32Array.from(shapes)
  }
}
