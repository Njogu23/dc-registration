// src/components/RegForm.js
"use client"
import React, { useState } from 'react';
import { CheckCircle, Calendar, MapPin, Users, Copy, Check } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { ysMenClubs, ysYouthClubs } from '@/data/clubsData';
import { paymentTypes } from '@/data/paymentTypes';
import { calculateTotal } from '@/utils/helpers';

const RegistrationPage = () => {
  const [participants, setParticipants] = useState([{
    id: 1,
    fullName: '',
    email: '',
    telephone: '',
    profession: '',
    residentialAddress: '',
    designation: '',
    memberType: "Y's Man",
    club: '',
    otherClub: '',
    paymentType: "Early Bird Y's Man"
  }]);
  const [paymentCode, setPaymentCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyPhoneNumber = () => {
    const phoneNumber = '+254720424456';
    navigator.clipboard.writeText(phoneNumber).then(() => {
      setCopied(true);
      toast.success('Phone number copied!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const addParticipant = () => {
    setParticipants([...participants, {
      id: participants.length + 1,
      fullName: '',
      email: '',
      telephone: '',
      profession: '',
      residentialAddress: '',
      designation: '',
      memberType: "Y's Man",
      club: '',
      otherClub: '',
      paymentType: "Early Bird Y's Man"
    }]);
  };

  const removeParticipant = (id) => {
    if (participants.length > 1) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const updateParticipant = (id, field, value) => {
    setParticipants(participants.map(p => {
      if (p.id === id) {
        const updated = { ...p, [field]: value };
        
        if (field === 'memberType') {
          updated.paymentType = value === "Y's Man" 
            ? "Early Bird Y's Man" 
            : "Early Bird Y's Youth";
        }
        
        // Clear otherClub if club is not "Other"
        if (field === 'club' && value !== 'Other') {
          updated.otherClub = '';
        }
        
        return updated;
      }
      return p;
    }));
  };

  const handleSubmit = async () => {
    // Validate all required fields including otherClub when club is "Other"
    const isValid = participants.every(p => {
      const basicFieldsValid = p.fullName && p.email && p.telephone && 
                               p.profession && p.residentialAddress && 
                               p.designation && p.club;
      const otherClubValid = p.club === 'Other' ? p.otherClub.trim() !== '' : true;
      return basicFieldsValid && otherClubValid && paymentCode;
    });

    if (!isValid) {
      toast.error('Please fill in all required fields for all participants');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participants,
          paymentCode
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Show success toast with confirmation code
      toast.success(
        <div>
          <p className="font-semibold">Registration Successful!</p>
          <p className="text-sm mt-1">Confirmation Code: <span className="font-mono font-bold">{data.confirmationCode}</span></p>
          <p className="text-sm mt-1">Confirmation emails have been sent to all participants.</p>
        </div>,
        { duration: 6000 }
      );
      
      // Reset form
      setTimeout(() => {
        setParticipants([{
          id: 1,
          fullName: '',
          email: '',
          telephone: '',
          profession: '',
          residentialAddress: '',
          designation: '',
          memberType: "Y's Man",
          club: '',
          otherClub: '',
          paymentType: "Early Bird Y's Man"
        }]);
        setPaymentCode('');
      }, 1000);
    } catch (err) {
      toast.error(err.message || 'Failed to submit registration');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#10b981',
              color: 'white',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: 'white',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#ef4444',
            },
          },
        }}
      />
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <img 
                src="/ysmen-logo.png" 
                alt="Y's Men International Logo" 
                className="h-16 w-16 md:h-20 md:w-20 object-contain"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Kenya District {"Y's"} Men International
                </h1>

                <p className="text-blue-100 mt-1">
                  District Conference & Youth Convocation 2026
                </p>

                {/* Event details */}
                <div className="flex items-center gap-4 mt-2 text-sm text-blue-100 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    20th – 21st February 2026
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin size={16} />
                    Sky Beach Resort, Kisumu
                  </span>
                </div>

                {/* Payment details */}
                <div className="mt-3 text-sm text-blue-100 space-y-1">
                  <p className="flex items-center gap-2 flex-wrap">
                    <span>
                      <strong>Payment:</strong> M-Pesa to <strong>Jared Musima</strong> -{" "}
                      <strong>+254720424456</strong>
                    </span>
                    <button
                      onClick={copyPhoneNumber}
                      className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs font-medium transition"
                      title="Copy phone number"
                    >
                      {copied ? (
                        <>
                          <Check size={14} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy
                        </>
                      )}
                    </button>
                  </p>
                  <p className="italic text-blue-200">
                    After payment, please submit the M-Pesa confirmation message on the form.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Conference Registration</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>💡 Registering Multiple People?</strong> If you're registering others using your email, 
              you can use email aliases. For example with Gmail: <span className="font-mono text-xs bg-white px-1 py-0.5 rounded">yourname+person1@gmail.com</span>{' '}
              or <span className="font-mono text-xs bg-white px-1 py-0.5 rounded">yourname+person2@gmail.com</span>. All emails will arrive in the same inbox!
            </p>
          </div>
          
          <div>
            {participants.map((participant, index) => (
              <div key={participant.id} className="mb-8 pb-8 border-b border-gray-200 last:border-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <Users size={20} />
                    Participant {index + 1}
                  </h3>
                  {participants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(participant.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *(as you would like it on your badge)
                    </label>
                    <input
                      type="text"
                      value={participant.fullName}
                      onChange={(e) => updateParticipant(participant.id, 'fullName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={participant.email}
                      onChange={(e) => updateParticipant(participant.id, 'email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telephone Number *
                    </label>
                    <input
                      type="tel"
                      value={participant.telephone}
                      onChange={(e) => updateParticipant(participant.id, 'telephone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., +254712345678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profession *
                    </label>
                    <input
                      type="text"
                      value={participant.profession}
                      onChange={(e) => updateParticipant(participant.id, 'profession', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Teacher, Engineer, Student"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Residential Address *
                    </label>
                    <input
                      type="text"
                      value={participant.residentialAddress}
                      onChange={(e) => updateParticipant(participant.id, 'residentialAddress', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="full address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation *
                    </label>
                    <input
                      type="text"
                      value={participant.designation}
                      onChange={(e) => updateParticipant(participant.id, 'designation', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., CP, DG, PDG, DYR, Y's Man, Y's Youth"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type of Member *
                    </label>
                    <select
                      value={participant.memberType}
                      onChange={(e) => updateParticipant(participant.id, 'memberType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Y's Man">{"Y's Man"}</option>
                      <option value="Y's Youth">{"Y's Youth"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Club *
                    </label>
                    <select
                      value={participant.club}
                      onChange={(e) => updateParticipant(participant.id, 'club', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Club</option>
                      <optgroup label="Y's Men Clubs">
                        {ysMenClubs.map(club => (
                          <option key={club} value={club}>{club}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Y's Youth Clubs">
                        {ysYouthClubs.map(club => (
                          <option key={club} value={club}>{club}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {participant.club === 'Other' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specify Other Club *
                      </label>
                      <input
                        type="text"
                        value={participant.otherClub}
                        onChange={(e) => updateParticipant(participant.id, 'otherClub', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your club name"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Type *
                    </label>
                    <select
                      value={participant.paymentType}
                      onChange={(e) => updateParticipant(participant.id, 'paymentType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {paymentTypes[participant.memberType].map(pt => (
                        <option key={pt.label} value={pt.label}>
                          {pt.label} - KES {pt.amount.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addParticipant}
              className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              <Users size={18} />
              Add Another Participant
            </button>

            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">
                  KES {calculateTotal(participants).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                For {participants.length} participant{participants.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Confirmation Code/Reference *
              </label>
              <input
                type="text"
                value={paymentCode}
                onChange={(e) => setPaymentCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter M-PESA confirmation code or bank reference"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter your M-PESA transaction code or bank payment reference
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Processing Registration...' : 'Complete Registration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;