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

