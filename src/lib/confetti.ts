import confetti from 'canvas-confetti'

const DEFAULTS = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * Runs the "success" confetti animation (two sides, duration in ms).
 * Based on confetti-succesfull-screen-tailwind pattern.
 */
export function runSuccessConfetti(durationMs: number = 5000): () => void {
  const start = Date.now()
  const interval = setInterval(() => {
    const timeLeft = durationMs - (Date.now() - start)
    if (timeLeft <= 0) {
      clearInterval(interval)
      return
    }
    const particleCount = 50 * (timeLeft / durationMs)
    confetti({
      ...DEFAULTS,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    })
    confetti({
      ...DEFAULTS,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    })
  }, 250)
  return () => clearInterval(interval)
}
