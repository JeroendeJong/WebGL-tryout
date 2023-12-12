export function xy(x: number, y: number): vector2 {
  return [x, y];
}

export function rgb(r: number, g: number, b: number): vector3 {
  return xyz(r,g,b)
}

export function xyz(x: any, y: any, z: any): vector3 {
  return [x, y, z];
}

export function radian(degree: number): number {
  return degree * (Math.PI / 180);
}


/**
 * 
 * @param from 
 * @param to 
 * @param t number ranging from 0 to 1 where 0 === from, and 1 === to
 */
export function* makeLerp(between: [number, number], range: [number, number]): Generator<number, any, number> {
  while (true) {
    let t: number = yield;

    if (t < range[0] || t > range[1]) {
      // value out of bounds of range. 
      break;
    }

    yield (t - range[0]) * (between[1] - between[0]) / (range[1] - range[0]) + between[0];
  }
}

// how to use, see below!

// const l = makeLerp([0, 90], [0, 10])
// let T = 0

// const a = l.next();
// const b = l.next(T)
// A === unkonwn, B ==== 0

// const c = l.next();
// const d = l.next(T + 1)
// A === unkonwn, B ==== 9
