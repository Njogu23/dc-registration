'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ysMenClubs, ysYouthClubs, getClubMembership } from '@/data/clubsData'

const CLUB_GROUPS = [
  { label: "Y's Men Clubs",  clubs: ysMenClubs  },
  { label: "YS Youth Clubs", clubs: ysYouthClubs },
]

function IcnAlert() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8"  x2="12"    y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}

export default function AttendPage() {
  const router = useRouter()

  const [query,         setQuery]         = useState('')
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')
  const [showWalkin,    setShowWalkin]    = useState(false)
  const [walkin,        setWalkin]        = useState({ fullName: '', email: '', designation: '', club: '', memberType: '' })
  const [walkinLoading, setWalkinLoading] = useState(false)
  const [walkinError,   setWalkinError]   = useState('')

  const clubMembership  = walkin.club ? getClubMembership(walkin.club) : null
  const needsMemberType = clubMembership === 'both'

  const inputRef = useRef(null)
  useEffect(() => { inputRef.current?.focus() }, [])

  async function handleCheckIn(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      if (res.ok && data.found) {
        const p = new URLSearchParams({
          name:      data.participant.fullName,
          club:      data.participant.club,
          code:      data.participant.confirmationCode,
          returning: data.alreadyCheckedIn ? '1' : '0',
        })
        router.push(`/attend/welcome?${p}`)
      } else {
        setError(data.error || 'Not found.')
        setShowWalkin(true)
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleWalkin(e) {
    e.preventDefault()
    setWalkinError('')
    setWalkinLoading(true)
    try {
      const res  = await fetch('/api/attendance/walkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(walkin),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const p = new URLSearchParams({
          name:      data.participant.fullName,
          club:      data.participant.club,
          code:      data.participant.confirmationCode,
          walkin:    '1',
          returning: '0',
        })
        router.push(`/attend/welcome?${p}`)
      } else {
        setWalkinError(data.error || 'Registration failed.')
      }
    } catch {
      setWalkinError('Connection error. Please try again.')
    } finally {
      setWalkinLoading(false)
    }
  }

  const walkinValid =
    walkin.fullName &&
    walkin.email &&
    walkin.designation &&
    walkin.club &&
    (!needsMemberType || walkin.memberType)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 font-serif p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-[460px] mx-auto flex flex-col gap-5 relative z-10">

        {/* ── Header ── */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-xl p-3 mb-[18px] shadow-[0_0_0_6px_rgba(59,130,246,0.15),0_4px_24px_rgba(0,0,0,0.3)] animate-[float_4s_ease-in-out_infinite]">
            <Image
              src="/ysmen-logo.png"
              alt="Y's Men International"
              width={60}
              height={60}
              className="object-contain block"
              priority
            />
          </div>
          <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-400/30 text-blue-200 font-sans text-[10px] tracking-wider uppercase px-4 py-1 rounded-full mb-3">
            Kenya District
          </div>
          <h1 className="text-[clamp(26px,6vw,40px)] font-bold text-white/90 tracking-tight leading-tight mb-2 drop-shadow-lg">
            District Conference
          </h1>
          <p className="font-sans text-xs text-blue-200/60 tracking-wide">
            Sky Beach Resort, Kisumu · 20–21 Feb 2026
          </p>
        </div>

        {/* ── Check-in card ── */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-7 shadow-2xl animate-[fadeIn_0.45s_ease_both]">
          <div className="flex items-center gap-2 font-sans text-[10px] tracking-wider uppercase text-blue-200/60 mb-2.5">
            <span className="w-[7px] h-[7px] rounded-full bg-emerald-400 shadow-[0_0_7px_#34d399] animate-pulse" />
            Attendance Check-In
          </div>
          <h2 className="text-xl font-bold text-white/90 tracking-tight mb-1.5">
            Welcome! Let's find you.
          </h2>
          <p className="font-sans text-xs text-blue-200/60 mb-5 leading-relaxed">
            Enter your email, confirmation code, or phone number.
          </p>

          <form onSubmit={handleCheckIn} className="flex flex-col gap-3">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/40 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={inputRef}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3.5 pl-10 pr-3.5 text-white font-sans text-sm outline-none transition-all focus:border-blue-400/60 focus:bg-white/10 placeholder:text-blue-200/40"
                type="text"
                placeholder="Email / YMIABC123 / +254712…"
                value={query}
                onChange={e => { setQuery(e.target.value); setError(''); setShowWalkin(false) }}
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-rose-500/10 backdrop-blur-sm border border-rose-400/30 rounded-lg p-3 text-rose-200 font-sans text-sm">
                <IcnAlert />
                {error}
              </div>
            )}

            <button 
              className="w-full py-3.5 rounded-lg font-sans font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_28px_rgba(59,130,246,0.5)]"
              type="submit" 
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>Check In <span>→</span></>
              )}
            </button>
          </form>
        </div>

        {/* ── Walk-in card ── */}
        {showWalkin && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-7 shadow-2xl animate-[fadeIn_0.45s_ease_both] animate-delay-100">
            <div className="flex items-center gap-2 font-sans text-[10px] tracking-wider uppercase text-blue-200/60 mb-2.5">
              <span className="w-[7px] h-[7px] rounded-full bg-amber-400 shadow-[0_0_7px_#fbbf24] animate-pulse" />
              Walk-in Registration
            </div>
            <h2 className="text-xl font-bold text-white/90 tracking-tight mb-1.5">
              Not registered yet?
            </h2>
            <p className="font-sans text-xs text-blue-200/60 mb-5 leading-relaxed">
              Fill in your details to join as a walk-in guest.
            </p>

            <form onSubmit={handleWalkin} className="flex flex-col gap-3">

              {/* Full Name */}
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/40 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3.5 pl-10 pr-3.5 text-white font-sans text-sm outline-none transition-all focus:border-blue-400/60 focus:bg-white/10 placeholder:text-blue-200/40"
                  type="text"
                  placeholder="Full Name"
                  value={walkin.fullName}
                  onChange={e => setWalkin(w => ({ ...w, fullName: e.target.value }))}
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/40 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3.5 pl-10 pr-3.5 text-white font-sans text-sm outline-none transition-all focus:border-blue-400/60 focus:bg-white/10 placeholder:text-blue-200/40"
                  type="email"
                  placeholder="Email Address"
                  value={walkin.email}
                  onChange={e => setWalkin(w => ({ ...w, email: e.target.value }))}
                  required
                />
              </div>

              {/* Designation */}
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/40 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3.5 pl-10 pr-3.5 text-white font-sans text-sm outline-none transition-all focus:border-blue-400/60 focus:bg-white/10 placeholder:text-blue-200/40"
                  type="text"
                  placeholder="Designation (e.g. CP, DG, PDG, Y's Man)"
                  value={walkin.designation}
                  onChange={e => setWalkin(w => ({ ...w, designation: e.target.value }))}
                  required
                />
              </div>

              {/* Club */}
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/40 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3.5 pl-10 pr-3.5 text-white font-sans text-sm outline-none transition-all focus:border-blue-400/60 focus:bg-white/10 cursor-pointer"
                  value={walkin.club}
                  onChange={e => setWalkin(w => ({ ...w, club: e.target.value, memberType: '' }))}
                  required
                >
                  <option value="" className="bg-slate-800 text-white/70">Select your Club</option>
                  {CLUB_GROUPS.map(g => (
                    <optgroup key={g.label} label={g.label} className="bg-slate-800 text-white/90">
                      {g.clubs.map(c => <option key={g.label + c} value={c} className="bg-slate-800 text-white/80">{c}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Member type toggle — only when club is in both lists */}
              {needsMemberType && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3.5 animate-[fadeIn_0.25s_ease]">
                  <p className="font-sans text-xs text-blue-200/60 mb-2.5 leading-relaxed">
                    This club has both Y's Men and YS Youth members. Which are you?
                  </p>
                  <div className="flex gap-2">
                    {["Y's Men", "YS Youth"].map(t => (
                      <button
                        key={t}
                        type="button"
                        className={`flex-1 py-2 px-2 bg-white/5 border border-white/10 rounded-lg text-blue-200/70 font-sans text-sm cursor-pointer transition-all hover:bg-white/10 hover:border-blue-400/40 hover:text-white ${
                          walkin.memberType === t ? 'bg-blue-500/20 border-blue-400/60 text-white font-semibold' : ''
                        }`}
                        onClick={() => setWalkin(w => ({ ...w, memberType: t }))}
                      >
                        {t === "Y's Men" ? '👔' : '🌱'} {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {walkinError && (
                <div className="flex items-center gap-2 bg-rose-500/10 backdrop-blur-sm border border-rose-400/30 rounded-lg p-3 text-rose-200 font-sans text-sm">
                  <IcnAlert />
                  {walkinError}
                </div>
              )}

              <button
                className="w-full py-3.5 rounded-lg font-sans font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_28px_rgba(245,158,11,0.5)]"
                type="submit"
                disabled={walkinLoading || !walkinValid}
              >
                {walkinLoading ? (
                  <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>Register & Check In <span>→</span></>
                )}
              </button>
            </form>
          </div>
        )}

        <p className="text-center font-sans text-xs text-blue-200/40 tracking-wide">
          Kenya District · Y's Men International
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}