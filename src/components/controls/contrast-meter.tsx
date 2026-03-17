"use client"

import { useRef, useEffect } from "react"
import { useTypographyStore } from "@/store/typography-store"
import { hexToRgb, contrastRatio } from "@/lib/color-utils"

const SCALE_MARKS = [
  { ratio: 0, angle: -55 },
  { ratio: 2, angle: -30 },
  { ratio: 4, angle: -5 },
  { ratio: 6, angle: 20 },
  { ratio: 8, angle: 45 },
] as const

function ratioToAngle(ratio: number): number {
  if (ratio > 8) {
    const extra = Math.min((ratio - 8) * 0.8, 8)
    return 45 + extra
  }
  const clamped = Math.max(0, Math.min(8, ratio))
  for (let i = 0; i < SCALE_MARKS.length - 1; i++) {
    const a = SCALE_MARKS[i]
    const b = SCALE_MARKS[i + 1]
    if (clamped >= a.ratio && clamped <= b.ratio) {
      const t = (clamped - a.ratio) / (b.ratio - a.ratio)
      return a.angle + t * (b.angle - a.angle)
    }
  }
  return SCALE_MARKS[SCALE_MARKS.length - 1].angle
}

function polar(angleDeg: number, radius: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: Math.round(Math.cos(rad) * radius * 100) / 100,
    y: Math.round(Math.sin(rad) * radius * 100) / 100,
  }
}

// Ticks at 0, 2, 4, 6, 8
const TICKS = [
  { ratio: 0, weight: 0.8, fontSize: 9 },
  { ratio: 2, weight: 0.8, fontSize: 9 },
  { ratio: 4, weight: 0.8, fontSize: 9 },
  { ratio: 6, weight: 0.8, fontSize: 9 },
  { ratio: 8, weight: 0.8, fontSize: 9 },
] as const

// Minor ticks between major marks
const MINOR_TICKS = [-43, -18, 7, 32]

// Gauge geometry
const PX = 80
const PY = 101
const INNER = 63
const OUTER = 74
const LABEL_R = 82
const NEEDLE_LEN = 76
const SURFACE_Y = 84 // where the covering surface starts

function VUGauge({
  fgColor,
  bgColor,
  label,
  idPrefix,
  redUpTo = 3,
  kick = 0,
}: {
  fgColor: string
  bgColor: string
  label: string
  idPrefix: string
  redUpTo?: number
  kick?: number
}) {
  const wcagRatio = contrastRatio(hexToRgb(fgColor), hexToRgb(bgColor))
  const ratio = wcagRatio - 1 // 1:1 (identical) → 0, 21:1 → 20
  const targetAngle = ratioToAngle(ratio)
  const warnThreshold = redUpTo === 4 ? 4.5 : 3
  const isWarn = wcagRatio < warnThreshold
  const isCritical = wcagRatio < 3
  const isGood = wcagRatio >= 6
  const ledColor = isCritical ? "#dd2222" : isWarn ? "#dd8822" : "#332a1a"

  const needleRef = useRef<SVGLineElement>(null)
  const glowRef = useRef<SVGLineElement>(null)
  const animRef = useRef<number>(0)
  const springState = useRef({ angle: targetAngle, velocity: 0 })
  const targetRef = useRef(targetAngle)

  useEffect(() => {
    targetRef.current = targetAngle
  }, [targetAngle])

  const kickRef = useRef(kick)
  useEffect(() => {
    if (kick > 0 && kick !== kickRef.current) {
      kickRef.current = kick
      springState.current.velocity = -600
      animRef.current = requestAnimationFrame(function run() {
        const state = springState.current
        const needle = needleRef.current
        const glow = glowRef.current
        if (!needle || !glow) return
        const target = targetRef.current
        const force = 180 * (target - state.angle)
        const dampForce = -18 * state.velocity
        state.velocity += ((force + dampForce) / 1.2) * (1 / 60)
        state.angle += state.velocity * (1 / 60)
        const tip = polar(state.angle, NEEDLE_LEN)
        const x2 = String(PX + tip.x)
        const y2 = String(PY + tip.y)
        needle.setAttribute("x2", x2)
        needle.setAttribute("y2", y2)
        glow.setAttribute("x2", x2)
        glow.setAttribute("y2", y2)
        if (Math.abs(target - state.angle) > 0.01 || Math.abs(state.velocity) > 0.01) {
          animRef.current = requestAnimationFrame(run)
        }
      })
    }
  }, [kick])

  useEffect(() => {
    const tick = () => {
      const state = springState.current
      const needle = needleRef.current
      const glow = glowRef.current
      if (!needle || !glow) return

      const target = targetRef.current
      const stiffness = 180
      const damping = 18
      const mass = 1.2
      const dt = 1 / 60

      const force = stiffness * (target - state.angle)
      const dampForce = -damping * state.velocity
      const acceleration = (force + dampForce) / mass

      state.velocity += acceleration * dt
      state.angle += state.velocity * dt

      const tip = polar(state.angle, NEEDLE_LEN)
      const x2 = String(PX + tip.x)
      const y2 = String(PY + tip.y)
      needle.setAttribute("x2", x2)
      needle.setAttribute("y2", y2)
      glow.setAttribute("x2", x2)
      glow.setAttribute("y2", y2)

      if (Math.abs(target - state.angle) > 0.01 || Math.abs(state.velocity) > 0.01) {
        animRef.current = requestAnimationFrame(tick)
      }
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [targetAngle])

  const needleTip = polar(targetAngle, NEEDLE_LEN)

  // Red zone arc — center of ticks
  const midR = (INNER + OUTER) / 2
  const arcS = polar(ratioToAngle(0), midR)
  const arcE = polar(ratioToAngle(redUpTo), midR)

  return (
    <svg viewBox="0 0 160 116" className="block w-full">
      <defs>
        {/* Amber ambient glow from center */}
        <radialGradient id={`${idPrefix}-ambient`} cx="50%" cy="70%" r="55%">
          <stop offset="0%" stopColor="#ffaa55" stopOpacity="0.06" />
          <stop offset="50%" stopColor="#ff9933" stopOpacity="0.025" />
          <stop offset="100%" stopColor="#ff8822" stopOpacity="0" />
        </radialGradient>
        <filter id={`${idPrefix}-glow`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* LED halo — amber */}
        <radialGradient id={`${idPrefix}-led-halo-amber`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#dd8822" stopOpacity="0.25" />
          <stop offset="30%" stopColor="#dd8822" stopOpacity="0.1" />
          <stop offset="70%" stopColor="#dd8822" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#dd8822" stopOpacity="0" />
        </radialGradient>
        {/* LED halo — red */}
        <radialGradient id={`${idPrefix}-led-halo-red`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#dd2222" stopOpacity="0.3" />
          <stop offset="30%" stopColor="#dd2222" stopOpacity="0.12" />
          <stop offset="70%" stopColor="#dd2222" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#dd2222" stopOpacity="0" />
        </radialGradient>
        {/* LED halo — green */}
        <radialGradient id={`${idPrefix}-led-halo-green`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22cc44" stopOpacity="0.25" />
          <stop offset="30%" stopColor="#22cc44" stopOpacity="0.1" />
          <stop offset="70%" stopColor="#22cc44" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#22cc44" stopOpacity="0" />
        </radialGradient>
        {/* Glass overlay */}
        <linearGradient id={`${idPrefix}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.07" />
          <stop offset="12%" stopColor="white" stopOpacity="0.02" />
          <stop offset="50%" stopColor="white" stopOpacity="0" />
          <stop offset="88%" stopColor="white" stopOpacity="0.01" />
          <stop offset="100%" stopColor="white" stopOpacity="0.03" />
        </linearGradient>
        {/* Diagonal glare */}
        <linearGradient id={`${idPrefix}-glare`} x1="0" y1="0" x2="0.8" y2="0.5">
          <stop offset="0%" stopColor="white" stopOpacity="0.05" />
          <stop offset="30%" stopColor="white" stopOpacity="0.015" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        {/* Surface gradient for covering panel */}
        <linearGradient id={`${idPrefix}-surface`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--cm-surface-top)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--cm-surface-bot)" stopOpacity="1" />
        </linearGradient>
        {/* Clip for meter well */}
        <clipPath id={`${idPrefix}-meter-clip`}>
          <rect x="6" y="6" width="148" height={SURFACE_Y - 6} rx="3" />
        </clipPath>
      </defs>

      {/* Outer surface — the panel body */}
      <rect x="0" y="0" width="160" height="116" rx="4" className="contrast-meter-surface" />

      {/* Recessed meter well */}
      <rect x="6" y="6" width="148" height={SURFACE_Y - 6} rx="3" className="contrast-meter-face" />
      {/* Inset bezel shadow */}
      <rect
        x="6" y="6" width="148" height={SURFACE_Y - 6} rx="3"
        fill="none" stroke="black" strokeWidth="0.5" opacity="0.2"
      />
      <rect
        x="6" y="6" width="148" height="2" rx="1"
        fill="rgba(0,0,0,0.3)"
      />

      {/* Amber ambient glow inside well */}
      <rect x="6" y="6" width="148" height={SURFACE_Y - 6} rx="3" fill={`url(#${idPrefix}-ambient)`} />

      {/* Clipped meter area */}
      <g clipPath={`url(#${idPrefix}-meter-clip)`}>
        {/* CONTRAST label — center of meter */}
        <text
          x={PX}
          y={SURFACE_Y - 20}
          className="contrast-meter-inner-text"
          fontSize="7"
          textAnchor="middle"
          fontWeight="500"
          letterSpacing="3"
          fontFamily="var(--font-host-grotesk), system-ui, sans-serif"
        >
          CONTRAST
        </text>
        <text
          x={PX}
          y={SURFACE_Y - 10}
          className="contrast-meter-inner-text"
          fontSize="6"
          textAnchor="middle"
          fontWeight="700"
          letterSpacing="2"
          fontFamily="var(--font-host-grotesk), system-ui, sans-serif"
          opacity={isGood ? 0.7 : 0.2}
        >
          AA
        </text>

        {/* Warning LED — top left corner */}
        {isWarn && (
          <circle
            cx={15}
            cy={15}
            r="12"
            fill={`url(#${idPrefix}-led-halo-${isCritical ? 'red' : 'amber'})`}
            className={isCritical ? "contrast-meter-blink-fast" : "contrast-meter-blink"}
          />
        )}
        <circle
          cx={15}
          cy={15}
          r="3"
          fill={isWarn ? ledColor : "#332a1a"}
          opacity={isWarn ? 1 : 0.4}
          className={isWarn ? (isCritical ? "contrast-meter-blink-fast" : "contrast-meter-blink") : ""}
        />

        {/* Red zone arc — center of ticks */}
        <path
          d={`M ${PX + arcS.x} ${PY + arcS.y} A ${midR} ${midR} 0 0 1 ${PX + arcE.x} ${PY + arcE.y}`}
          fill="none"
          stroke="#882222"
          strokeWidth="1.5"
          opacity="0.35"
        />

        {/* Major ticks */}
        {TICKS.map((t) => {
          const angle = ratioToAngle(t.ratio)
          const inner = polar(angle, INNER)
          const outer = polar(angle, OUTER)
          const lbl = polar(angle, LABEL_R)
          const color = t.ratio <= redUpTo ? "#aa3333" : "#888"
          return (
            <g key={`${idPrefix}-${t.ratio}`}>
              <line
                x1={PX + inner.x} y1={PY + inner.y}
                x2={PX + outer.x} y2={PY + outer.y}
                stroke={color}
                strokeWidth={t.weight}
                strokeLinecap="round"
              />
              <text
                x={PX + lbl.x}
                y={PY + lbl.y + 2}
                fill={color}
                fontSize={t.fontSize}
                fontWeight={t.ratio <= redUpTo ? 700 : 400}
                textAnchor="middle"
                className="contrast-meter-label"
              >
                {t.ratio}
              </text>
            </g>
          )
        })}

        {/* Minor ticks */}
        {MINOR_TICKS.map((angle) => {
          const inner = polar(angle, INNER)
          const outer = polar(angle, OUTER)
          return (
            <line
              key={`${idPrefix}-m-${angle}`}
              x1={PX + inner.x} y1={PY + inner.y}
              x2={PX + outer.x} y2={PY + outer.y}
              stroke="#2a2a2a"
              strokeWidth="0.5"
            />
          )
        })}

        {/* Needle — glow */}
        <line
          ref={glowRef}
          x1={PX} y1={PY}
          x2={PX + needleTip.x} y2={PY + needleTip.y}
          stroke="#ff4422"
          strokeWidth="0.8"
          strokeLinecap="round"
          filter={`url(#${idPrefix}-glow)`}
        />
        {/* Needle — core */}
        <line
          ref={needleRef}
          x1={PX} y1={PY}
          x2={PX + needleTip.x} y2={PY + needleTip.y}
          stroke="#ff8855"
          strokeWidth="0.3"
          strokeLinecap="round"
        />
      </g>

      {/* Bottom edge of meter well — subtle highlight */}
      <line
        x1="8" y1={SURFACE_Y}
        x2="152" y2={SURFACE_Y}
        className="contrast-meter-surface-edge"
        strokeWidth="0.5"
      />

      {/* Channel label on surface */}
      <text
        x={PX}
        y={SURFACE_Y + 19}
        className="contrast-meter-surface-text"
        fontSize="8.5"
        textAnchor="middle"
        fontWeight="600"
        letterSpacing="3"
        fontFamily="var(--font-host-grotesk), system-ui, sans-serif"
      >
        {label}
      </text>

      {/* Glass overlay — covers recessed meter well */}
      <rect x="6" y="6" width="148" height={SURFACE_Y - 6} rx="3" fill={`url(#${idPrefix}-glass)`} />
      <rect x="6" y="6" width="148" height={SURFACE_Y - 6} rx="3" fill={`url(#${idPrefix}-glare)`} />
    </svg>
  )
}

export function ContrastMeter({ pulse }: { pulse?: number }) {
  const headingColor = useTypographyStore((s) => s.headingsGroup.color)
  const bodyColor = useTypographyStore((s) => s.bodyGroup.color)
  const backgroundColor = useTypographyStore((s) => s.backgroundColor)

  return (
    <div className="flex gap-2">
      <div className="contrast-meter relative flex-1 min-w-0">
        <span className="hw-bolt" style={{ bottom: 4, left: 3 }} />
        <span className="hw-bolt" style={{ bottom: 4, right: 3 }} />
        <VUGauge
          fgColor={headingColor}
          bgColor={backgroundColor}
          label="HEADING"
          idPrefix="cm-h"
          kick={pulse}
        />
      </div>
      <div className="contrast-meter relative flex-1 min-w-0">
        <span className="hw-bolt" style={{ bottom: 4, left: 3 }} />
        <span className="hw-bolt" style={{ bottom: 4, right: 3 }} />
        <VUGauge
          fgColor={bodyColor}
          bgColor={backgroundColor}
          label="BODY"
          idPrefix="cm-b"
          redUpTo={4}
          kick={pulse}
        />
      </div>
    </div>
  )
}
