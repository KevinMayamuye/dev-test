// Q6: Date Utilities
// Run with: node q6-date-utils.js
//
// TASK: Implement getDaysBetween and isWithinClaimWindow
//
// --- getDaysBetween(dateA, dateB) ---
//   Accepts two ISO date strings (e.g. '2026-01-15').
//   Returns the number of whole days between them.
//   Always returns a positive number regardless of argument order.
//
// --- isWithinClaimWindow(serviceDate, submissionDate, windowDays = 90) ---
//   Returns true if the number of days between serviceDate and submissionDate
//   is less than or equal to windowDays.
//   Uses getDaysBetween internally.
//
// Hint: 1 day = 1000 * 60 * 60 * 24 milliseconds
//       new Date('2026-01-15') gives you a Date object you can do maths on
// ───────

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getDaysBetween(dateA, dateB) {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  return Math.floor(Math.abs(b - a) / MS_PER_DAY);
}

function isWithinClaimWindow(serviceDate, submissionDate, windowDays = 90) {
  return getDaysBetween(serviceDate, submissionDate) <= windowDays;
}

// Test Runner

function assert(label, actual, expected) {
  const pass = actual === expected;
  console.log(`${pass ? '✓' : '✗'} ${label}`);
  if (!pass) {
    console.log('  Expected:', expected);
    console.log('  Received:', actual);
  }
}

// getDaysBetween
assert('99 days apart (Jan 1 → Apr 10)',       getDaysBetween('2026-01-01', '2026-04-10'), 99);
assert('Same day returns 0',                   getDaysBetween('2026-03-15', '2026-03-15'), 0);
assert('Argument order does not matter',       getDaysBetween('2026-04-10', '2026-01-01'), 99);
assert('Exactly 1 day apart',                  getDaysBetween('2026-06-01', '2026-06-02'), 1);
assert('7 days spanning a month boundary',     getDaysBetween('2026-01-28', '2026-02-04'), 7);
assert('59 days (Jan 1 → Mar 1)',              getDaysBetween('2026-01-01', '2026-03-01'), 59);

// isWithinClaimWindow
assert('59 days is within the 90-day window',  isWithinClaimWindow('2026-01-01', '2026-03-01'),      true);
assert('90 days is within the 90-day window',  isWithinClaimWindow('2026-01-01', '2026-04-01'),      true);
assert('99 days exceeds the 90-day window',    isWithinClaimWindow('2026-01-01', '2026-04-10'),      false);
assert('90 days is within a 120-day window',   isWithinClaimWindow('2026-01-01', '2026-04-01', 120), true);
assert('Same day is always within any window', isWithinClaimWindow('2026-05-01', '2026-05-01'),      true);
assert('Custom 30-day window: 7 days passes',  isWithinClaimWindow('2026-01-28', '2026-02-04', 30),  true);
assert('Custom 30-day window: 59 days fails',  isWithinClaimWindow('2026-01-01', '2026-03-01', 30),  false);
