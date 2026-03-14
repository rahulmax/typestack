'use client'

const GRIP_COUNT = 48
const STEP = 360 / GRIP_COUNT // 7.5 degrees

function buildGripGradient(isDark: boolean) {
  const a = isDark ? 'oklch(0.25 0.005 60)' : 'oklch(0.70 0.003 80)'
  const b = isDark ? 'oklch(0.35 0.005 60)' : 'oklch(0.82 0.003 80)'
  const stops: string[] = []
  for (let i = 0; i < GRIP_COUNT; i++) {
    const color = i % 2 === 0 ? a : b
    const start = i * STEP
    const end = (i + 1) * STEP
    stops.push(`${color} ${start}deg ${end}deg`)
  }
  return `conic-gradient(from 0deg, ${stops.join(', ')})`
}

const BRUSHED_METAL = `
  radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.12), transparent 60%),
  conic-gradient(from 0deg,
    hsl(30 2% 38%), hsl(30 2% 48%), hsl(30 2% 36%),
    hsl(30 2% 50%), hsl(30 2% 38%), hsl(30 2% 46%),
    hsl(30 2% 36%), hsl(30 2% 48%), hsl(30 2% 38%)
  )
`

// Golden ratio position on arc 210-340 => 210 + (340-210) * 0.618 ≈ 290.3
// Rotate from top: indicator at ~290 degrees
const INDICATOR_ANGLE = 210 + (340 - 210) * 0.618 // ~290.3 degrees

export function RejectedKnob() {
  return (
    <div style={{ position: 'relative', width: 120, height: 120 }}>
      {/* Outer grip ring — light mode */}
      <div
        className="block dark:hidden"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: buildGripGradient(false),
          boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)',
        }}
      />
      {/* Outer grip ring — dark mode */}
      <div
        className="hidden dark:block"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: buildGripGradient(true),
          boxShadow: '0 2px 8px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.05)',
        }}
      />

      {/* Inner brushed-metal face */}
      <div
        style={{
          position: 'absolute',
          inset: 3,
          borderRadius: '50%',
          background: BRUSHED_METAL,
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.25), 0 1px 1px rgba(255,255,255,0.08)',
        }}
      />

      {/* Indicator line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 2,
          height: 54,
          marginLeft: -1,
          transformOrigin: '50% 0%',
          transform: `rotate(${INDICATOR_ANGLE}deg)`,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: 14,
            borderRadius: 1,
            background: 'hsl(0 0% 95%)',
            boxShadow: '0 0 3px rgba(255,255,255,0.4)',
          }}
        />
      </div>

      {/* Mechanical counter */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -20%)',
          background: 'hsl(30 2% 18%)',
          borderRadius: 3,
          padding: '2px 6px',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6), inset 0 -1px 1px rgba(255,255,255,0.05)',
          fontFamily: '"SF Mono", "Cascadia Code", "Fira Code", monospace',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.5px',
          color: 'hsl(30 5% 80%)',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        1.618
      </div>
    </div>
  )
}
