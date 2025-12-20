// src/app/district-conference-list/List.js

"use client"
import React, { useState, useEffect } from 'react'
import { Search, Filter, Mail, CheckCircle, XCircle, Users, RefreshCw, Copy, Check } from 'lucide-react'
import { paymentTypes } from '@/data/paymentTypes'

const AdminPage = () => {
  const [registrations, setRegistrations] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      setError('')
      
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (filterStatus !== 'all') params.append('filter', filterStatus)

      const response = await fetch(`/api/registrations?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch registrations')
      }

      const data = await response.json()
      setRegistrations(data)
    } catch (err) {
      setError(err.message)
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchRegistrations()
  }

  const handleFilterChange = (value) => {
    setFilterStatus(value)
    setTimeout(fetchRegistrations, 0)
  }

  const togglePaymentStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/registrations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentConfirmed: !currentStatus
        }),
      })

      if (response.ok) {
        const updated = await response.json()
        setRegistrations(registrations.map(r => 
          r.id === id ? updated : r
        ))
      } else {
        throw new Error('Failed to update payment status')
      }
    } catch (err) {
      console.error('Update error:', err)
      alert('Failed to update payment status')
    }
  }

  const toggleEmailStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/registrations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailSent: !currentStatus
        }),
      })

      if (response.ok) {
        const updated = await response.json()
        setRegistrations(registrations.map(r => 
          r.id === id ? updated : r
        ))
      } else {
        throw new Error('Failed to update email status')
      }
    } catch (err) {
      console.error('Update error:', err)
      alert('Failed to update email status')
    }
  }

  const copyFormattedLists = () => {
  // Better filtering logic that matches your actual memberType values
  const ysMen = registrations.filter(r => {
    const memberType = r.memberType.toLowerCase();
    return (
      memberType.includes('men') || 
      memberType.includes('member') ||
      memberType.includes('adult') ||
      memberType === "y's men" ||
      memberType === "y's men member" ||
      memberType === "ys men" ||
      !memberType.includes('youth') // If it's not youth, assume it's men
    );
  });
  
  const ysYouth = registrations.filter(r => {
    const memberType = r.memberType.toLowerCase();
    return (
      memberType.includes('youth') ||
      memberType === "y's youth" ||
      memberType === "ys youth"
    );
  });

  console.log('Debug - All registrations:', registrations);
  console.log('Debug - Y\'s Men count:', ysMen.length);
  console.log('Debug - Y\'s Youth count:', ysYouth.length);
  console.log('Debug - Member types found:', [...new Set(registrations.map(r => r.memberType))]);

  // Format the text
  let formattedText = "*Y's Men List*\n";
  
  // Add Y's Men
  if (ysMen.length > 0) {
    ysMen.forEach(reg => {
      const status = reg.paymentConfirmed ? '✅' : '❌';
      // Handle club name - use otherClub if club is "Other"
      const clubDisplay = reg.club === 'Other' && reg.otherClub 
        ? reg.otherClub 
        : reg.club;
      formattedText += `${reg.designation} ${reg.fullName}  -  ${clubDisplay} ${status}\n`;
    });
  } else {
    formattedText += "No Y's Men registrations\n";
  }
  
  // Add separator
  formattedText += "\n";
  formattedText += "----------------------\n";
  formattedText += "\n";
  
  // Add Y's Youth
  formattedText += "*Y's Youth List*\n";
  if (ysYouth.length > 0) {
    ysYouth.forEach(reg => {
      const status = reg.paymentConfirmed ? '✅' : '❌';
      // Handle club name - use otherClub if club is "Other"
      const clubDisplay = reg.club === 'Other' && reg.otherClub 
        ? reg.otherClub 
        : reg.club;
      formattedText += `${reg.designation} ${reg.fullName}  -  ${clubDisplay} ${status}\n`;
    });
  } else {
    formattedText += "No Y's Youth registrations\n";
  }
   formattedText += "\n";
  formattedText += "----------------------\n";
  formattedText += "\n";
  // Add summary
  formattedText += `\nTotal: ${registrations.length} registration${registrations.length !== 1 ? 's' : ''} (${ysMen.length} Y's Men, ${ysYouth.length} Y's Youth)`;
  formattedText += `\nConfirmed: ${registrations.filter(r => r.paymentConfirmed).length}`;
  formattedText += `\nPending: ${registrations.filter(r => !r.paymentConfirmed).length}`;

  console.log('Debug - Formatted text:', formattedText);

  // Copy to clipboard
  navigator.clipboard.writeText(formattedText).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = formattedText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  });
}

  const groupedRegistrations = registrations.reduce((acc, reg) => {
    if (!acc[reg.confirmationCode]) {
      acc[reg.confirmationCode] = []
    }
    acc[reg.confirmationCode].push(reg)
    return acc
  }, {})

  const totalRevenue = registrations
    .filter(r => r.paymentConfirmed)
    .reduce((total, r) => {
      const payment = paymentTypes[r.memberType]?.find(pt => pt.label === r.paymentType)
      return total + (payment ? payment.amount : 0)
    }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Admin Panel</h1>
              <p className="text-gray-300 mt-1">Registration Management System</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Registrations</div>
            <div className="text-3xl font-bold text-blue-600">{registrations.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Confirmed Payments</div>
            <div className="text-3xl font-bold text-green-600">
              {registrations.filter(r => r.paymentConfirmed).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Pending Payments</div>
            <div className="text-3xl font-bold text-yellow-600">
              {registrations.filter(r => !r.paymentConfirmed).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-green-600">
              KES {totalRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-gray-800">All Registrations</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={copyFormattedLists}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  copied 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                }`}
                disabled={registrations.length === 0}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Lists'}
              </button>
              <button
                onClick={fetchRegistrations}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, club, or confirmation code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
                <select
                  value={filterStatus}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white w-full md:w-auto"
                >
                  <option value="all">All Registrations</option>
                  <option value="confirmed">Payment Confirmed</option>
                  <option value="pending">Payment Pending</option>
                </select>
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg mb-6">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <RefreshCw size={48} className="mx-auto mb-4 opacity-50 animate-spin" />
              <p className="text-lg font-medium">Loading registrations...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedRegistrations).map(([confirmationCode, regs]) => (
                <div key={confirmationCode} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <span className="font-semibold text-gray-700">Group Registration</span>
                        <span className="text-sm text-gray-600">
                          Code: <span className="font-mono font-semibold text-blue-600">{confirmationCode}</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          ({regs.length} participant{regs.length > 1 ? 's' : ''})
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Payment Code: <span className="font-mono">{regs[0].paymentCode}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Club</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Member Type</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {regs.map((reg) => {
                          const payment = paymentTypes[reg.memberType]?.find(pt => pt.label === reg.paymentType)
                          return (
                            <tr key={reg.id} className="border-t border-gray-200 hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div>
                                  <div className="font-medium text-gray-900">{reg.fullName}</div>
                                  <div className="text-sm text-gray-500">{reg.designation}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">{reg.email}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {reg.club === 'Other' && reg.otherClub 
                                  ? `${reg.club} (${reg.otherClub})` 
                                  : reg.club}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">{reg.memberType}</td>
                              <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                KES {payment?.amount.toLocaleString() || 'N/A'}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => togglePaymentStatus(reg.id, reg.paymentConfirmed)}
                                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                    reg.paymentConfirmed
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  }`}
                                >
                                  {reg.paymentConfirmed ? (
                                    <>
                                      <CheckCircle size={14} />
                                      Confirmed
                                    </>
                                  ) : (
                                    <>
                                      <XCircle size={14} />
                                      Pending
                                    </>
                                  )}
                                </button>
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => toggleEmailStatus(reg.id, reg.emailSent)}
                                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                    reg.emailSent
                                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                  }`}
                                >
                                  <Mail size={14} />
                                  {reg.emailSent ? 'Sent' : 'Not Sent'}
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {registrations.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No registrations found</p>
                  <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage