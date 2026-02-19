'use client'

import { useEffect, useState, useCallback } from 'react'

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-KE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const MEMBER_COLORS = {
  Member:       { bg: '#dde5f9', text: '#1a3a7a' },
  'Non-Member': { bg: '#fde0e5', text: '#9b1428' },
  Friend:       { bg: '#d1fae5', text: '#166534' },
}

function MemberBadge({ type }) {
  const style = MEMBER_COLORS[type] || { bg: '#e9ecf2', text: '#374151' }
  return (
    <span
      className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {type}
    </span>
  )
}

export default function AttendeesPage() {
  const [attendees, setAttendees] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAttendees = useCallback(async (q = '') => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/attendance/attendees?search=${encodeURIComponent(q)}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setAttendees(data)
    } catch (e) {
      setError('Could not load attendees. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchAttendees(search), 300)
    return () => clearTimeout(t)
  }, [search, fetchAttendees])

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-[#0d2055] px-5 py-4 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight">Attendees</h1>
              <p className="text-white/60 text-xs mt-0.5">Conference check-ins · 2026</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white font-bold text-sm">{attendees.length}</span>
                <span className="text-white/60 text-xs">checked in</span>
              </div>
              <a
                href="/attend"
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all hover:-translate-y-px shadow-md whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Check in for someone
              </a>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, club or member type…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d2055]/20 focus:border-[#0d2055] bg-gray-50 placeholder-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {error ? (
              <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">{error}</p>
                <button onClick={() => fetchAttendees(search)} className="text-xs text-[#0d2055] hover:underline">Try again</button>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                <span className="text-sm">Loading attendees…</span>
              </div>
            ) : attendees.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm">{search ? 'No attendees match your search.' : 'No check-ins yet.'}</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-red-600">
                    <th className="text-left text-[10px] font-bold tracking-wider uppercase text-gray-500 px-4 py-2.5">#</th>
                    <th className="text-left text-[10px] font-bold tracking-wider uppercase text-gray-500 px-4 py-2.5">Name</th>
                    <th className="text-left text-[10px] font-bold tracking-wider uppercase text-gray-500 px-4 py-2.5 hidden sm:table-cell">Club</th>
                    <th className="text-left text-[10px] font-bold tracking-wider uppercase text-gray-500 px-4 py-2.5 hidden md:table-cell">Type</th>
                    <th className="text-left text-[10px] font-bold tracking-wider uppercase text-gray-500 px-4 py-2.5">Checked In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendees.map((a, i) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 text-xs w-8">{i + 1}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#0d2055] leading-tight">{a.fullName}</p>
                        {a.designation && (
                          <p className="text-xs text-gray-400 mt-0.5">{a.designation}</p>
                        )}
                        {/* Club shown on mobile only */}
                        <p className="text-xs text-gray-500 mt-0.5 sm:hidden">{a.club}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{a.club}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <MemberBadge type={a.memberType} />
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700 text-xs font-medium">{formatTime(a.attendedAt)}</p>
                        <p className="text-gray-400 text-[10px] mt-0.5">{formatDate(a.attendedAt)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}