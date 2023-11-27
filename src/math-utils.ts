
export function xy(x: number, y: number): Vector2 {
  return [x, y];
}

export function rgb(r: number, g: number, b: number): Vector3 {
  return xyz(r,g,b)
}

export function xyz(x: any, y: any, z: any): Vector3 {
  return [x, y, z];
}

export function degrees(degree: number): number {
  return degree * (Math.PI / 180);
}