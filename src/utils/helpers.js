// src/utils/helpers.js

import { paymentTypes } from "@/data/paymentTypes";

/**
 * Generate a unique confirmation code
 * Format: YMI + timestamp + random string
 */
export const generateConfirmationCode = () => {
  return 'YMI' + Date.now().toString(36).toUpperCase() + 
         Math.random().toString(36).substring(2, 6).toUpperCase();
};

/**
 * Calculate total amount for all participants
 * @param {Array} participants - Array of participant objects
 * @returns {number} Total amount in KES
 */
export const calculateTotal = (participants) => {
  return participants.reduce((total, participant) => {
    const payment = paymentTypes[participant.memberType]?.find(
      pt => pt.label === participant.paymentType
    );
    return total + (payment ? payment.amount : 0);
  }, 0);
};

/**
 * Format currency in KES
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return `KES ${amount.toLocaleString()}`;
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};