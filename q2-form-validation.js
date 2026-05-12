// Q2: Form Validation
// Run with: node q2-form-validation.js
//
// TASK: Implement validateClaimForm(data)
//
// Validates a claim submission form. Returns an object of field-level error
// messages. If all fields are valid, returns an empty object {}.
// All errors that apply must be returned at the same time (not just the first).
//
// Validation rules:
//   name          required — must be a non-empty string
//   surname       required — must be a non-empty string
//   idNumber      required — must be exactly 13 numeric digits (no letters/spaces)
//   serviceDate   required — must NOT be in the future
//   amountClaimed required — must be a number strictly greater than 0
//
// Error messages (use these exact strings):
//   name:          'Name is required'
//   surname:       'Surname is required'
//   idNumber:      'ID number must be exactly 13 digits'
//   serviceDate:   'Service date is required'
//                  'Service date cannot be in the future'
//   amountClaimed: 'Amount claimed must be a positive number'

function validateClaimForm(data) {
  const errors = {};

  const name = data.name;
  if (typeof name !== 'string' || name.trim() === '') {
    errors.name = 'Name is required';
  }

  const surname = data.surname;
  if (typeof surname !== 'string' || surname.trim() === '') {
    errors.surname = 'Surname is required';
  }

  const idNumber = data.idNumber;
  if (typeof idNumber !== 'string' || !/^\d{13}$/.test(idNumber)) {
    errors.idNumber = 'ID number must be exactly 13 digits';
  }

  const serviceDate = data.serviceDate;
  if (serviceDate === undefined || serviceDate === null || String(serviceDate).trim() === '') {
    errors.serviceDate = 'Service date is required';
  } else {
    const svc = new Date(serviceDate);
    const now = new Date();
    const svcDay = Date.UTC(svc.getUTCFullYear(), svc.getUTCMonth(), svc.getUTCDate());
    const todayDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    if (svcDay > todayDay) {
      errors.serviceDate = 'Service date cannot be in the future';
    }
  }

  const amountClaimed = data.amountClaimed;
  if (typeof amountClaimed !== 'number' || Number.isNaN(amountClaimed) || amountClaimed <= 0) {
    errors.amountClaimed = 'Amount claimed must be a positive number';
  }

  return errors;
}

// Test Runner

function assert(label, actual, expected) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? '✓' : '✗'} ${label}`);
  if (!pass) {
    console.log('  Expected:', JSON.stringify(expected));
    console.log('  Received:', JSON.stringify(actual));
  }
}

const PAST_DATE   = '2026-01-15';
const FUTURE_DATE = '2030-06-01';

assert('Valid form returns no errors', validateClaimForm({
  name: 'Alice', surname: 'Dlamini', idNumber: '9001015009087',
  serviceDate: PAST_DATE, amountClaimed: 1500,
}), {});

assert('Missing name', validateClaimForm({
  name: '', surname: 'Dlamini', idNumber: '9001015009087',
  serviceDate: PAST_DATE, amountClaimed: 1500,
}), { name: 'Name is required' });

assert('Whitespace-only name', validateClaimForm({
  name: '   ', surname: 'Dlamini', idNumber: '9001015009087',
  serviceDate: PAST_DATE, amountClaimed: 1500,
}), { name: 'Name is required' });

assert('Missing surname', validateClaimForm({
  name: 'Alice', surname: '', idNumber: '9001015009087',
  serviceDate: PAST_DATE, amountClaimed: 1500,
}), { surname: 'Surname is required' });

assert('ID number too short', validateClaimForm({
  name: 'Alice', surname: 'Dlamini', idNumber: '12345',
  serviceDate: PAST_DATE, amountClaimed: 1500,
}), { idNumber: 'ID number must be exactly 13 digits' });

assert('ID number contains letters', validateClaimForm({
  name: 'Alice', surname: 'Dlamini', idNumber: '900101500908X',
  serviceDate: PAST_DATE, amountClaimed: 1500,
}), { idNumber: 'ID number must be exactly 13 digits' });

assert('ID number too long', validateClaimForm({
  name: 'Alice', surname: 'Dlamini', idNumber: '90010150090871',
  serviceDate: PAST_DATE, amountClaimed: 1500,
}), { idNumber: 'ID number must be exactly 13 digits' });

assert('Missing service date', validateClaimForm({
  name: 'Alice', surname: 'Dlamini', idNumber: '9001015009087',
  serviceDate: '', amountClaimed: 1500,
}), { serviceDate: 'Service date is required' });

assert('Future service date', validateClaimForm({
  name: 'Alice', surname: 'Dlamini', idNumber: '9001015009087',
  serviceDate: FUTURE_DATE, amountClaimed: 1500,
}), { serviceDate: 'Service date cannot be in the future' });

assert('Zero amount', validateClaimForm({
  name: 'Alice', surname: 'Dlamini', idNumber: '9001015009087',
  serviceDate: PAST_DATE, amountClaimed: 0,
}), { amountClaimed: 'Amount claimed must be a positive number' });

assert('Negative amount', validateClaimForm({
  name: 'Alice', surname: 'Dlamini', idNumber: '9001015009087',
  serviceDate: PAST_DATE, amountClaimed: -100,
}), { amountClaimed: 'Amount claimed must be a positive number' });

assert('Multiple errors returned together', validateClaimForm({
  name: '', surname: '', idNumber: 'INVALID',
  serviceDate: FUTURE_DATE, amountClaimed: -50,
}), {
  name:          'Name is required',
  surname:       'Surname is required',
  idNumber:      'ID number must be exactly 13 digits',
  serviceDate:   'Service date cannot be in the future',
  amountClaimed: 'Amount claimed must be a positive number',
});
