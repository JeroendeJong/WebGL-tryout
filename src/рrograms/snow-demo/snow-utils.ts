
export type SnowFlake = {
  x: number,
  y: number,
  velocity: {
    x: number,
    y: number
  },
  size: number,
  alpha: number
}

export function prepareSnow(): SnowFlake[] {
  const snowFlakes = []

  for (let i = 0; i < Math.floor(random(200, 300)); i++) {
    const flake = makeRandomSnowFlake()
    snowFlakes.push(flake)
  }

  return snowFlakes
}


export function makeRandomSnowFlake(): SnowFlake {
  return {
    x: random(0, window.innerWidth),
    y: random(-500, 0), // start an arbitrary amount above the window
    velocity: {
      x: random(-0.5, 0.5), 
      y: random(0.5, 1.0)
    },
    size: random(1, 10), 
    alpha: random(0.1, 0.5)
  }
}

export function updateSnow(flakes: SnowFlake[]) {
  return flakes.map(f => {
    if (f.x > window.innerWidth) return makeRandomSnowFlake()
    if (f.y > window.innerHeight) return makeRandomSnowFlake()

    f.x += f.velocity.x
    f.y += f.velocity.y

    return f
  })
}

export function snowFlakeToBufferData(flake: SnowFlake): Float32Array {
  return new Float32Array([flake.x, flake.y, flake.size, flake.alpha])
}


function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
