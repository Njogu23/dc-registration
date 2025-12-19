// src/components/RegistrationPage.js
"use client"
import React, { useState } from 'react';
import { CheckCircle, Calendar, MapPin, Users } from 'lucide-react';
import { ysMenClubs, ysYouthClubs } from '@/data/clubsData';
import { paymentTypes } from '@/data/paymentTypes';
import { calculateTotal } from '@/utils/helpers';

const RegistrationPage = () => {
  const [participants, setParticipants] = useState([{
    id: 1,
    fullName: '',
    email: '',
    designation: '',
    memberType: "Y's Man",
    club: '',
    paymentType: "Early Bird Y's Man"
  }]);
  const [paymentCode, setPaymentCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');

  const addParticipant = () => {
    setParticipants([...participants, {
      id: participants.length + 1,
      fullName: '',
      email: '',
      designation: '',
      memberType: "Y's Man",
      club: '',
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
        
        return updated;
      }
      return p;
    }));
  };

  const handleSubmit = async () => {
    const isValid = participants.every(p => 
      p.fullName && p.email && p.designation && p.club && paymentCode
    );

    if (!isValid) {
      setError('Please fill in all required fields for all participants');
      return;
    }

    setSubmitting(true);
    setError('');

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

      setConfirmationCode(data.confirmationCode);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setParticipants([{
          id: 1,
          fullName: '',
          email: '',
          designation: '',
          memberType: "Y's Man",
          club: '',
          paymentType: "Early Bird Y's Man"
        }]);
        setPaymentCode('');
        setSubmitSuccess(false);
        setConfirmationCode('');
      }, 5000);
    } catch (err) {
      setError(err.message || 'Failed to submit registration');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Kenya District {"Y's"} Men International</h1>
              <p className="text-blue-100 mt-1">District Conference & Youth Convocation 2026</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-blue-100 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  20th - 21st February 2026
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  Sky Beach Resort, Kisumu
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Conference Registration</h2>
          
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold">Registration Successful!</p>
                <p className="text-sm">Confirmation Code: <span className="font-mono font-bold">{confirmationCode}</span></p>
                <p className="text-sm mt-1">Confirmation emails have been sent to all participants.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg mb-6">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

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
                      Full Name *
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
                      Designation *
                    </label>
                    <input
                      type="text"
                      value={participant.designation}
                      onChange={(e) => updateParticipant(participant.id, 'designation', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., President, Secretary, Member"
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