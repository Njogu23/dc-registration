// src/data/clubsData.js

export const ysMenClubs = [
  "Githumu",
  "Kakamega",
  "Kisumu",
  "Kitui",
  "Mutomo",
  "Nairobi",
  "Nairobi City",
  "Nairobi Metro",
  "Nairobi South",
  "Thika",
  "Triple Y",
  "Other"
];

export const ysYouthClubs = [
  "Kakamega",
  "Kisumu",
  "Kitui",
  "Meru",
  "Nairobi",
  "Nairobi Metro",
  "Other"
];

// All clubs combined, deduplicated, sorted alphabetically
export const allClubs = [
  ...new Set([...ysMenClubs, ...ysYouthClubs])
].sort((a, b) => a === 'Other' ? 1 : b === 'Other' ? -1 : a.localeCompare(b));

/**
 * Given a club name, returns whether it belongs to Y's Men, YS Youth, or both.
 * Useful for walk-in registration to infer memberType.
 */
export function getClubMembership(club) {
  const inMen   = ysMenClubs.includes(club)
  const inYouth = ysYouthClubs.includes(club)
  if (inMen && inYouth) return 'both'
  if (inYouth) return 'YS Youth'
  if (inMen)  return "Y's Men"
  return 'Guest'
}