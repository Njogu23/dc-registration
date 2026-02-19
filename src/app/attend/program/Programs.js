'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

const THEME = "Growing the Movement Impacting Communities"

const PROGRAMME = [
  {
    day: 'Day One',
    date: 'Friday, 20 February 2026',
    sessions: [
      { time: '8:30am – 9:00am',   activity: 'Registration',                                                resource: 'DYR Benson Kasuti / PDYR George Njogu',                        moderator: 'PDG Morris Kimuli',    type: 'logistics', icon: '📋' },
      { time: '9:00am – 9:30am',   activity: 'Devotion and Prayers',                                        resource: 'CP Steve Jaoko',                                               moderator: '',                     type: 'ceremony',  icon: '🙏' },
      { time: '9:30am – 10:30am',  activity: "Y's Men Hymn · Welcome Remarks · Roll Call of Clubs · Welcome Remarks by DG · Fraternal Greetings", resource: 'PDG Morris Kimuli · CP Steve Jaoko · DG Esther Mbaabu · PDG John Ombija', moderator: '', type: 'ceremony', icon: '🏳️' },
      { time: '10:30am – 11:00am', activity: 'TEA BREAK',                                                   resource: 'CP Steve Jaoko',                                               moderator: '',                     type: 'break',     icon: '☕' },
      { time: '11:00am – 11:30am', activity: 'From Conclaves to ACTION',                                    resource: 'IPDG Morris Kimuli',                                           moderator: 'DG Dr. Esther Mbaabu', type: 'session',   icon: '⚡' },
      { time: '11:30am – 12:15pm', activity: 'GUEST SPEAKER',                                               resource: "H.E. Prof. Peter Anyang Nyong'o – Governor of Kisumu County",  moderator: 'DG Dr. Esther Mbaabu', type: 'keynote',   icon: '🎤' },
      { time: '12:15pm – 1:00pm',  activity: 'PLENARY',                                                     resource: 'PDG Morris Kimuli',                                            moderator: 'APE Jared Musima',     type: 'session',   icon: '💬' },
      { time: '1:00pm – 2:00pm',   activity: 'LUNCH BREAK',                                                 resource: 'CP Steve Jaoko',                                               moderator: '',                     type: 'break',     icon: '🍽️' },
      { time: '2:00pm – 2:30pm',   activity: 'DG Report',                                                   resource: 'DG Esther Mbaabu',                                             moderator: '',                     type: 'session',   icon: '📊' },
      { time: '2:30pm – 3:15pm',   activity: "Y's Youth Report",                                            resource: 'DYR Benson Kasuti',                                            moderator: '',                     type: 'youth',     icon: '🌱' },
      { time: '3:15pm – 4:15pm',   activity: 'Creating Visibility through Sharing and Impact',              resource: 'CP Arnold Magina',                                             moderator: '',                     type: 'session',   icon: '📡' },
      { time: '4:15pm – 4:45pm',   activity: 'GROUP DISCUSSION',                                            resource: 'DG Dr. Esther Mbaabu',                                         moderator: 'DGE Jenifer Kimuli',   type: 'session',   icon: '🗣️' },
      { time: '4:45pm – 5:15pm',   activity: 'PLENARY',                                                     resource: '',                                                             moderator: 'PDG Robert Kariuki',   type: 'session',   icon: '💬' },
      { time: '6:30pm – 8:30pm',   activity: 'DINNER',                                                      resource: 'CP Steve Jaoko',                                               moderator: '',                     type: 'social',    icon: '🍷' },
    ],
  },
  {
    day: 'Day Two',
    date: 'Saturday, 21 February 2026',
    sessions: [
      { time: '9:00am – 9:20am',   activity: 'DEVOTION',                 resource: 'DGE Jenifer Kimuli', moderator: '', type: 'ceremony', icon: '🙏' },
      { time: '9:20am – 10:00am',  activity: 'Vision 2032',              resource: 'PAP Tom Waka',       moderator: '', type: 'keynote',  icon: '🔭' },
      { time: '10:00am – 10:30am', activity: 'Club Reports',             resource: 'DGE Jenifer Kimuli', moderator: '', type: 'session',  icon: '📋' },
      { time: '10:30am – 11:00am', activity: 'TEA BREAK',                resource: 'CP Steve Jaoko',     moderator: '', type: 'break',    icon: '☕' },
      { time: '11:00am – 11:45am', activity: 'Club Reports (Continued)', resource: 'DGE Jenifer Kimuli', moderator: '', type: 'session',  icon: '📋' },
      { time: '11:45am – 12:30pm', activity: 'DGE Goals for 2026/2027', resource: 'DGE Jenifer Kimuli', moderator: '', type: 'session',  icon: '🎯' },
      { time: '12:30pm – 1:30pm',  activity: 'WAY FORWARD',             resource: 'DG Esther Mbaabu',   moderator: '', type: 'keynote',  icon: '🚀' },
      { time: '1:30pm – 2:30pm',   activity: 'LUNCH BREAK',             resource: 'CP Steve Jaoko',     moderator: '', type: 'break',    icon: '🍽️' },
      { time: '2:30pm – 5:30pm',   activity: 'EXCURSION',               resource: 'CP Steve Jaoko',     moderator: '', type: 'social',   icon: '🚌' },
    ],
  },
]

const TYPE_CONFIG = {
  keynote:  { bg: '#fff0f2', border: '#f5b8c4', tag: '#c8102e', tagBg: '#fde0e5', label: 'Keynote',    timeColor: '#9b1428', actBold: true  },
  ceremony: { bg: '#f0f4ff', border: '#c0cdf7', tag: '#1a3a7a', tagBg: '#dde5f9', label: 'Ceremony',   timeColor: '#1a3a7a', actBold: false },
  session:  { bg: '#f8f9fb', border: '#dde2ec', tag: '#374151', tagBg: '#e9ecf2', label: 'Session',    timeColor: '#374151', actBold: false },
  youth:    { bg: '#f0fdf5', border: '#a7f3c0', tag: '#166534', tagBg: '#d1fae5', label: "Y's Youth",  timeColor: '#166534', actBold: false },
  social:   { bg: '#fff8ee', border: '#fcd9a0', tag: '#92400e', tagBg: '#fef3c7', label: 'Social',     timeColor: '#92400e', actBold: true  },
  break:    { bg: '#f9fafb', border: '#e5e7eb', tag: '#6b7280', tagBg: '#f3f4f6', label: 'Break',      timeColor: '#6b7280', actBold: true  },
  logistics:{ bg: '#f9fafb', border: '#e5e7eb', tag: '#6b7280', tagBg: '#f3f4f6', label: 'Logistics',  timeColor: '#6b7280', actBold: false },
}

export default function ProgramPage() {
  const [activeDay, setActiveDay] = useState(0)
  const searchParams = useSearchParams()
  const isPrint = searchParams.get('print') === '1'

  const prog = PROGRAMME[activeDay]

  const handleDownload = () => {
    window.location.href = '/api/download-programme'
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .table-head { grid-template-columns: 115px 1fr !important; }
          .row        { grid-template-columns: 115px 1fr !important; }
          .hide-sm    { display: none !important; }
          .show-sm    { display: flex !important; }
          .col-activity { border-right: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-gray-100 font-sans py-7 px-4 md:py-8 md:px-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-5">

          {/* ── HEADER ─────────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-[#0d2055] flex items-center gap-4 p-3.5 md:p-4 flex-wrap">
              <div className="bg-white rounded-lg p-1.5 md:p-2 flex items-center flex-shrink-0">
                <Image
                  src="/ysmen-logo.png"
                  alt="Y's Men International"
                  width={180}
                  height={64}
                  className="object-contain block"
                  priority
                />
              </div>
              <div className="w-px h-9 bg-white/20 flex-shrink-0" />
              <div className="flex flex-col gap-0.5 flex-1">
                <span className="text-sm md:text-base font-bold text-white tracking-tight">Kenya District Conference</span>
                <span className="text-[11px] text-red-500/90 uppercase tracking-wider">22nd Annual · 2026</span>
              </div>

              {/* Download button — hidden on print view */}
              {!isPrint && (
                <button
                  className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 border-none rounded-lg px-4 py-2.5 text-white text-xs md:text-sm font-semibold cursor-pointer whitespace-nowrap flex-shrink-0 transition-all hover:-translate-y-px shadow-md"
                  onClick={handleDownload}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download PDF
                </button>
              )}
            </div>

            <div className="p-4 md:p-5">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-[#0d2055] font-serif mb-2 tracking-tight">
                The 22<sup className="text-xs align-super">nd</sup> Kenya District Conference Programme
              </h1>
              <div className="flex flex-wrap gap-1.5 md:gap-3.5 text-xs md:text-sm text-gray-700 mb-1.5">
                <span>📅 20th–21st February 2026</span>
                <span className="text-red-600">·</span>
                <span>📍 Sky Beach Resort, Kisumu</span>
              </div>
              <div className="flex items-baseline gap-1.5 md:gap-2 text-xs md:text-sm">
                <span className="font-bold text-[#0d2055]">Theme:</span>
                <span className="text-red-600 italic font-serif">"{THEME}"</span>
              </div>
            </div>
          </div>

          {/* ── DAY TABS — only on interactive screen view ──────── */}
          {!isPrint && (
            <div className="flex gap-2.5">
              {PROGRAMME.map((d, i) => (
                <button
                  key={i}
                  className={`flex-1 bg-white border border-gray-200 rounded-xl p-3 md:p-4 cursor-pointer text-center transition-all flex flex-col gap-1 shadow-sm ${
                    activeDay === i
                      ? 'bg-red-50 border-red-600 shadow-[0_0_0_3px_rgba(200,16,46,0.1)]'
                      : 'hover:border-red-300 hover:bg-red-50/50'
                  }`}
                  onClick={() => setActiveDay(i)}
                >
                  <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase text-red-600">{d.day}</span>
                  <span className="text-xs md:text-sm font-semibold text-[#0d2055]">{d.date.split(',')[0]}</span>
                </button>
              ))}
            </div>
          )}

          {/* ── CONTENT ─────────────────────────────────────────── */}
          {isPrint ? (
            // Print view: all days
            <div className="flex flex-col gap-5">
              {PROGRAMME.map((d, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 bg-[#0d2055] px-4 py-2 rounded-t-lg">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">{d.day}</span>
                    <span className="text-[11px] text-white/60">{d.date}</span>
                  </div>
                  <SessionBlock sessions={d.sessions} />
                </div>
              ))}
            </div>
          ) : (
            // Interactive view: active day only
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[11px] text-gray-400 tracking-wide whitespace-nowrap">{prog.date}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <SessionBlock sessions={prog.sessions} />
            </div>
          )}

          <p className="text-center text-xs text-gray-400 tracking-wide pt-1">
            Kenya District · Y's Men International · 2026
          </p>
        </div>
      </div>
    </>
  )
}

/* ── Session table component ─────────────────────────────────────────────── */
function SessionBlock({ sessions }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Column headers */}
      <div className="table-head grid grid-cols-[155px_1fr_210px_185px] bg-gray-50 border-b-2 border-red-600">
        <div className="px-3.5 py-2 text-[10px] font-bold tracking-wider uppercase text-gray-500">Time</div>
        <div className="px-3.5 py-2 text-[10px] font-bold tracking-wider uppercase text-gray-500 border-l border-gray-200">Activity</div>
        <div className="px-3.5 py-2 text-[10px] font-bold tracking-wider uppercase text-gray-500 border-l border-gray-200 hide-sm">Resource Person</div>
        <div className="px-3.5 py-2 text-[10px] font-bold tracking-wider uppercase text-gray-500 border-l border-gray-200 hide-sm">Moderator</div>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {sessions.map((s, i) => {
          const cfg = TYPE_CONFIG[s.type]
          return (
            <div
              key={i}
              className="row grid grid-cols-[155px_1fr_210px_185px] border border-t-0 border-l-0 border-r-0 items-stretch hover:brightness-95 min-h-[50px]"
              style={{
                backgroundColor: cfg.bg,
                borderColor: cfg.border,
                animation: `fadeIn 0.38s ease ${i * 0.04}s both`,
              }}
            >
              {/* Time col */}
              <div
                className="flex flex-col items-start gap-1.5 p-3 pl-4 border-r justify-center"
                style={{ borderRightColor: cfg.border }}
              >
                <span className="text-lg leading-none">{s.icon}</span>
                <span className="text-[11px] font-semibold leading-tight" style={{ color: cfg.timeColor }}>{s.time}</span>
                <span
                  className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                  style={{ color: cfg.tag, backgroundColor: cfg.tagBg }}
                >
                  {cfg.label}
                </span>
              </div>

              {/* Activity col */}
              <div className="col-activity p-3 border-r flex items-center" style={{ borderRightColor: cfg.border }}>
                <span className={`text-[13.5px] text-gray-900 leading-relaxed ${cfg.actBold ? 'font-bold' : ''}`}>
                  {s.activity}
                </span>
              </div>

              {/* Resource col */}
              <div className="p-3 border-r flex items-center hide-sm" style={{ borderRightColor: cfg.border }}>
                {s.resource && <span className="text-xs text-gray-700 leading-relaxed">{s.resource}</span>}
              </div>

              {/* Moderator col */}
              <div className="p-3 flex items-center hide-sm">
                {s.moderator && <span className="text-xs text-[#1a3a7a] italic leading-relaxed">{s.moderator}</span>}
              </div>

              {/* Mobile stacked people */}
              {(s.resource || s.moderator) && (
                <div className="col-span-full flex-col gap-0.5 px-3.5 pb-3 show-sm hidden">
                  {s.resource  && <span className="text-[11.5px] text-gray-600"><b className="text-red-600 font-semibold">Resource:</b> {s.resource}</span>}
                  {s.moderator && <span className="text-[11.5px] text-gray-600"><b className="text-red-600 font-semibold">Moderator:</b> {s.moderator}</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}