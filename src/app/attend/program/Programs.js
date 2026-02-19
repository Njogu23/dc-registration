'use client'

import { useState } from 'react'
import Image from 'next/image'

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

// On white background: use solid-ish tints instead of dark rgba
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
  const prog = PROGRAMME[activeDay]

  return (
    <>
      {/* Global print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .root { background: white !important; padding: 0 !important; }
          .content { padding: 16px !important; max-width: 100% !important; gap: 12px !important; }
          .tabs { display: none !important; }
          .date-rule { display: none !important; }
          .screen-only { display: none !important; }
          .print-all { display: flex !important; }

          /* Adjust grid for portrait */
          .table-head {
            grid-template-columns: 120px 1fr 180px 150px !important;
          }
          .row {
            grid-template-columns: 120px 1fr 180px 150px !important;
          }
          
          /* Reduce font sizes for portrait */
          .s-activity { font-size: 12px !important; }
          .s-person { font-size: 10.5px !important; }
          .s-time { font-size: 10px !important; }

          /* Header print tweaks */
          .logo-banner {
            box-shadow: none !important;
            border: 1px solid #dde2ec !important;
          }

          /* Day section headers for print */
          .print-day-heading {
            display: flex !important;
            background: #0d2055 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Rows */
          .row {
            break-inside: avoid;
            box-shadow: none !important;
            animation: none !important;
            transform: none !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .row:hover { transform: none !important; }
          .table-head { break-inside: avoid; }

          .day-block + .day-block { page-break-before: always; }

          /* Portrait orientation */
          @page { 
            size: A4 portrait; 
            margin: 12mm 15mm; 
          }
        }
      `}</style>

      <div className="root">
        <div className="content">

          {/* ── HEADER ─────────────────────────────────────────── */}
          <div className="header">
            <div className="logo-banner">
              <div className="logo-img-wrap">
                <Image
                  src="/ysmen-logo.png"
                  alt="Y's Men International"
                  width={180}
                  height={64}
                  style={{ objectFit: 'contain', display: 'block' }}
                  priority
                />
              </div>
              <div className="logo-divider" />
              <div className="logo-text">
                <span className="logo-top">Kenya District Conference</span>
                <span className="logo-bottom">22nd Annual · 2026</span>
              </div>

              {/* Download button — screen only */}
              <button className="dl-btn no-print" onClick={() => window.print()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download PDF
              </button>
            </div>

            <div className="conf-meta">
              <h1 className="conf-title">The 22<sup>nd</sup> Kenya District Conference Programme</h1>
              <div className="conf-details">
                <span>📅 20th–21st February 2026</span>
                <span className="sep">·</span>
                <span>📍 Sky Beach Resort, Kisumu</span>
              </div>
              <div className="conf-theme">
                <span className="theme-label">Theme:</span>
                <span className="theme-text">"{THEME}"</span>
              </div>
            </div>
          </div>

          {/* ── DAY TABS (screen only) ──────────────────────────── */}
          <div className="tabs no-print">
            {PROGRAMME.map((d, i) => (
              <button
                key={i}
                className={`tab ${activeDay === i ? 'tab--on' : ''}`}
                onClick={() => setActiveDay(i)}
              >
                <span className="tab-day">{d.day}</span>
                <span className="tab-date">{d.date.split(',')[0]}</span>
              </button>
            ))}
          </div>

          {/* ── SCREEN: active day only ─────────────────────────── */}
          <div className="screen-only">
            <div className="date-rule">
              <div className="rule-line" />
              <span className="rule-text">{prog.date}</span>
              <div className="rule-line" />
            </div>
            <SessionBlock sessions={prog.sessions} />
          </div>

          {/* ── PRINT: all days ─────────────────────────────────── */}
          <div className="print-all" style={{ display: 'none', flexDirection: 'column', gap: '20px' }}>
            {PROGRAMME.map((d, i) => (
              <div key={i} className="day-block">
                <div className="print-day-heading" style={{ display: 'none', alignItems: 'center', gap: 14, background: '#0d2055', padding: '9px 16px', borderRadius: '10px 10px 0 0', marginBottom: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.14em' }}>{d.day}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{d.date}</span>
                </div>
                <SessionBlock sessions={d.sessions} />
              </div>
            ))}
          </div>

          <p className="footer">Kenya District · Y's Men International · 2026</p>
        </div>
      </div>

      <style jsx>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Root: WHITE background ── */
        .root {
          min-height: 100vh;
          background: #f0f2f7;
          font-family: 'Segoe UI', 'Trebuchet MS', Arial, sans-serif;
          padding: 28px 16px 60px;
        }

        .content {
          max-width: 960px;
          margin: 0 auto;
          display: flex; flex-direction: column; gap: 20px;
        }

        /* ── Header card ── */
        .header {
          background: white;
          border-radius: 14px;
          border: 1px solid #e2e6ed;
          box-shadow: 0 2px 12px rgba(13,32,85,0.07);
          overflow: hidden;
        }

        .logo-banner {
          background: #0d2055;
          display: flex; align-items: center;
          gap: 16px; padding: 14px 20px;
          flex-wrap: wrap;
        }
        .logo-img-wrap {
          background: white;
          border-radius: 8px;
          padding: 6px 12px;
          display: flex; align-items: center;
          flex-shrink: 0;
        }
        .logo-divider {
          width: 1px; height: 36px;
          background: rgba(255,255,255,0.2);
          flex-shrink: 0;
        }
        .logo-text { display: flex; flex-direction: column; gap: 3px; flex: 1; }
        .logo-top  { font-size: 15px; font-weight: 700; color: white; letter-spacing: 0.01em; }
        .logo-bottom { font-size: 11px; color: rgba(200,16,46,0.85); letter-spacing: 0.12em; text-transform: uppercase; }

        .dl-btn {
          display: inline-flex; align-items: center; gap: 7px;
          background: #c8102e; border: none; border-radius: 8px;
          padding: 10px 18px; color: white;
          font-size: 13px; font-weight: 600; cursor: pointer;
          white-space: nowrap; flex-shrink: 0;
          transition: background 0.18s, transform 0.15s;
          box-shadow: 0 2px 8px rgba(200,16,46,0.35);
        }
        .dl-btn:hover { background: #a50d25; transform: translateY(-1px); }

        .conf-meta { padding: 18px 22px 16px; }
        .conf-title {
          font-size: clamp(16px, 2.5vw, 21px);
          font-weight: 700; color: #0d2055;
          font-family: Georgia, 'Times New Roman', serif;
          margin-bottom: 8px; letter-spacing: -0.01em;
        }
        .conf-title sup { font-size: 0.58em; vertical-align: super; }
        .conf-details {
          display: flex; flex-wrap: wrap; gap: 6px 14px;
          font-size: 13px; color: #374151; margin-bottom: 6px;
        }
        .sep { color: #c8102e; }
        .conf-theme { display: flex; align-items: baseline; gap: 7px; font-size: 13px; }
        .theme-label { font-weight: 700; color: #0d2055; }
        .theme-text  { color: #c8102e; font-style: italic; font-family: Georgia, serif; }

        /* ── Day tabs ── */
        .tabs {
          display: flex; gap: 10px;
        }
        .tab {
          flex: 1;
          background: white;
          border: 1px solid #dde2ec;
          border-radius: 12px; padding: 13px 12px;
          cursor: pointer; text-align: center;
          transition: all 0.22s;
          display: flex; flex-direction: column; gap: 4px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .tab:hover { border-color: rgba(200,16,46,0.4); background: #fff5f6; }
        .tab--on {
          background: #fff0f2;
          border-color: #c8102e;
          box-shadow: 0 0 0 3px rgba(200,16,46,0.1), 0 2px 8px rgba(200,16,46,0.15);
        }
        .tab-day  { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #c8102e; }
        .tab-date { font-size: 13px; font-weight: 600; color: #0d2055; }

        /* ── Date rule ── */
        .date-rule { display: flex; align-items: center; gap: 12px; }
        .rule-line { flex: 1; height: 1px; background: #e2e6ed; }
        .rule-text { font-size: 11px; color: #9ca3af; letter-spacing: 0.08em; white-space: nowrap; }

        /* ── Footer ── */
        .footer {
          text-align: center; font-size: 12px; color: #9ca3af;
          letter-spacing: 0.07em; padding-top: 4px;
        }

        @media (max-width: 600px) {
          .root { padding: 0 0 40px; }
          .header { border-radius: 0; border-left: none; border-right: none; }
          .dl-btn span { display: none; }
        }
      `}</style>
    </>
  )
}

/* ── Session table component ─────────────────────────────────────────────── */
function SessionBlock({ sessions }) {
  return (
    <div className="session-wrap">
      {/* Column headers */}
      <div className="table-head">
        <div className="th">Time</div>
        <div className="th">Activity</div>
        <div className="th hide-sm">Resource Person</div>
        <div className="th hide-sm">Moderator</div>
      </div>

      {/* Rows */}
      <div className="sessions">
        {sessions.map((s, i) => {
          const cfg = TYPE_CONFIG[s.type]
          return (
            <div
              key={i}
              className="row"
              style={{
                background: cfg.bg,
                borderColor: cfg.border,
                animationDelay: `${i * 0.04}s`,
              }}
            >
              {/* Time col */}
              <div className="col-time" style={{ borderRightColor: cfg.border }}>
                <span className="s-icon">{s.icon}</span>
                <span className="s-time" style={{ color: cfg.timeColor }}>{s.time}</span>
                <span className="s-tag" style={{ color: cfg.tag, background: cfg.tagBg }}>{cfg.label}</span>
              </div>

              {/* Activity col */}
              <div className="col-activity" style={{ borderRightColor: cfg.border }}>
                <span className={`s-activity ${cfg.actBold ? 's-activity--bold' : ''}`}>
                  {s.activity}
                </span>
              </div>

              {/* Resource col */}
              <div className="col-person hide-sm" style={{ borderRightColor: cfg.border }}>
                {s.resource && <span className="s-person">{s.resource}</span>}
              </div>

              {/* Moderator col */}
              <div className="col-person col-mod hide-sm">
                {s.moderator && <span className="s-person s-mod">{s.moderator}</span>}
              </div>

              {/* Mobile: stacked people */}
              {(s.resource || s.moderator) && (
                <div className="mobile-meta show-sm">
                  {s.resource  && <span className="mm"><b>Resource:</b> {s.resource}</span>}
                  {s.moderator && <span className="mm"><b>Moderator:</b> {s.moderator}</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .session-wrap {
          background: white;
          border-radius: 14px;
          border: 1px solid #e2e6ed;
          box-shadow: 0 2px 12px rgba(13,32,85,0.07);
          overflow: hidden;
        }

        /* Table header */
        .table-head {
          display: grid;
          grid-template-columns: 155px 1fr 210px 185px;
          background: #f8f9fc;
          border-bottom: 2px solid #c8102e;
        }
        .th {
          padding: 9px 14px;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.13em; text-transform: uppercase;
          color: #6b7280;
        }
        .th + .th { border-left: 1px solid #e5e7eb; }

        /* Sessions list */
        .sessions { display: flex; flex-direction: column; gap: 0; }

        /* Each row */
        .row {
          border: 1px solid;
          border-left-width: 0; border-right-width: 0; border-top-width: 0;
          display: grid;
          grid-template-columns: 155px 1fr 210px 185px;
          align-items: stretch;
          animation: up 0.38s ease both;
          transition: filter 0.15s;
          min-height: 50px;
        }
        .row:hover { filter: brightness(0.972); }
        @keyframes up { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

        /* Time col */
        .col-time {
          display: flex; flex-direction: column;
          align-items: flex-start; gap: 5px;
          padding: 12px 12px 12px 16px;
          border-right: 1px solid;
          justify-content: center;
        }
        .s-icon  { font-size: 17px; line-height: 1; }
        .s-time  { font-size: 11px; font-weight: 600; line-height: 1.4; }
        .s-tag   {
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 2px 8px; border-radius: 100px;
        }

        /* Activity col */
        .col-activity {
          padding: 12px 14px;
          border-right: 1px solid;
          display: flex; align-items: center;
        }
        .s-activity      { font-size: 13.5px; color: #111827; line-height: 1.45; }
        .s-activity--bold { font-weight: 700; }

        /* Person cols */
        .col-person {
          padding: 12px 12px;
          border-right: 1px solid #e5e7eb;
          display: flex; align-items: center;
        }
        .col-mod { border-right: none; }
        .s-person { font-size: 12px; color: #374151; line-height: 1.5; }
        .s-mod    { color: #1a3a7a; font-style: italic; }

        /* Mobile */
        .mobile-meta {
          grid-column: 1 / -1;
          display: flex; flex-direction: column; gap: 3px;
          padding: 4px 14px 12px;
        }
        .mm { font-size: 11.5px; color: #4b5563; }
        .mm b { color: #c8102e; font-weight: 600; }

        .hide-sm { display: flex; }
        .show-sm  { display: none;  }

        @media (max-width: 640px) {
          .table-head  { grid-template-columns: 115px 1fr; }
          .row         { grid-template-columns: 115px 1fr; }
          .hide-sm     { display: none; }
          .show-sm     { display: flex; }
          .col-activity { border-right: none; }
        }
      `}</style>
    </div>
  )
}