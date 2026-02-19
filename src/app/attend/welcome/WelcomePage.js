'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// ── Confetti engine ──────────────────────────────────────────────────────────
function ConfettiCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf

    const W = canvas.width = window.innerWidth
    const H = canvas.height = window.innerHeight

    const COLORS = [
      '#d4a017', '#22c55e', '#f59e0b', '#16a34a',
      '#fbbf24', '#86efac', '#ffffff', '#fde68a',
    ]

    const pieces = Array.from({ length: 140 }, () => ({
      x: Math.random() * W,
      y: Math.random() * -H,
      r: Math.random() * 8 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 4 + 2,
      spin: (Math.random() - 0.5) * 0.2,
      angle: Math.random() * Math.PI * 2,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }))

    function draw() {
      ctx.clearRect(0, 0, W, H)
      for (const p of pieces) {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.fillStyle = p.color
        ctx.globalAlpha = 0.88
        if (p.shape === 'rect') {
          ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()

        p.x += p.vx
        p.y += p.vy
        p.angle += p.spin

        if (p.y > H + 20) {
          p.y = -20
          p.x = Math.random() * W
        }
      }
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-70 z-0"
    />
  )
}

// ── Main content ─────────────────────────────────────────────────────────────
function WelcomeContent() {
  const router = useRouter()
  const params = useSearchParams()
  const [visible, setVisible] = useState(false)

  const name = params.get('name') || 'Guest'
  const club = params.get('club') || ''
  const code = params.get('code') || ''
  const isWalkin = params.get('walkin') === '1'
  const isReturning = params.get('returning') === '1'

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  function goToProgram() {
    router.push('/attend/program')
  }

  const firstName = name.split(' ')[0]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 font-serif p-6 relative overflow-hidden">
      <ConfettiCanvas />

      <div 
        className={`relative z-10 w-full max-w-[420px] bg-white/5 backdrop-blur-2xl border border-amber-500/20 rounded-3xl p-10 text-center shadow-[0_0_60px_rgba(212,160,23,0.08),0_24px_80px_rgba(0,0,0,0.6)] transition-all duration-600 ${
          visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-5'
        }`}
      >
        {/* Crown / star icon */}
        <div className="w-20 h-20 mx-auto mb-5 flex items-center justify-center bg-amber-500/10 rounded-full border border-amber-500/25 animate-[floatIcon_3s_ease-in-out_infinite]">
          <svg viewBox="0 0 48 48" fill="none" className="w-14 h-14">
            <circle cx="24" cy="24" r="23" stroke="#fcfcfc" strokeWidth="1.5" opacity="0.3" />
            <text x="24" y="32" textAnchor="middle" fontSize="24" fill="currentColor" className="text-amber-500">
              {isReturning ? '👋' : isWalkin ? '🤝' : '🎉'}
            </text>
          </svg>
        </div>

        {/* Status tag */}
        <div className="inline-block bg-green-500/15 border border-green-500/35 text-green-300 font-sans text-[11px] tracking-widest uppercase px-3.5 py-1 rounded-full mb-5">
          {isReturning
            ? 'Welcome back!'
            : isWalkin
            ? 'Walk-in Registered'
            : '✓ Checked In'}
        </div>

        {/* Name */}
        <h1 className="text-[clamp(26px,6vw,36px)] font-bold leading-tight text-amber-100/70 mb-4">
          {isReturning ? `Good to see you,` : `Welcome,`}
          <br />
          <span className="text-amber-500 drop-shadow-[0_0_40px_rgba(212,160,23,0.4)]">
            {firstName}!
          </span>
        </h1>

        {/* Club + code */}
        <div className="flex gap-2 justify-center flex-wrap mb-5">
          {club && (
            <span className="font-sans text-xs px-3 py-1.5 rounded-full tracking-wide bg-green-900/25 border border-green-500/25 text-green-300">
              {club}
            </span>
          )}
          {code && (
            <span className="font-sans text-xs px-3 py-1.5 rounded-full tracking-wide bg-amber-800/20 border border-amber-500/30 text-amber-200 font-mono tracking-widest">
              {code}
            </span>
          )}
        </div>

        {/* Message */}
        <p className="font-sans text-sm leading-relaxed text-amber-100/55 mb-7 max-w-[320px] mx-auto">
          {isReturning
            ? 'Your attendance has already been recorded. Enjoy the rest of the conference!'
            : isWalkin
            ? 'You are now registered as a walk-in guest. We are delighted to have you with us today!'
            : 'Your attendance has been recorded. We are thrilled to have you at the Kenya District Conference!'}
        </p>

        {/* CTA */}
        <button 
  className="inline-flex items-center justify-center gap-2.5 w-full bg-gradient-to-r from-rose-500 to-red-700 border-none rounded-xl px-7 py-4 text-white font-sans font-semibold cursor-pointer shadow-[0_6px_24px_rgba(220,38,38,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(220,38,38,0.45)] mb-4"
  onClick={goToProgram}
>



          View Event Programme
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        <p className="font-sans text-xs text-amber-100/25 tracking-wide">
          20–21 February 2026 · Sky Beach Resort, Kisumu
        </p>
      </div>

      <style jsx>{`
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900" />}>
      <WelcomeContent />
    </Suspense>
  )
}