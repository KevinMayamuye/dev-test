// Q5: Fetch API Integration
// Run with: node q5-fetch-api.js
//
// TASK: Implement fetchClaims(filters)
//
// Makes a GET request to the NetcarePlus claims API and returns the parsed JSON.
//
// Base URL:  'http://localhost:3001/api'
// Endpoint:  GET /claims
//
// Rules:
//   - Build a query string from the filters object
//   - Skip any filter value that is undefined, null, or an empty string ''
//   - If the response status is not OK (non-2xx), throw:
//       new Error(`Request failed: <status> <statusText>`)
//   - On success, return the parsed JSON body
//
// Examples:
//   fetchClaims({ status: 'Pending', page: 1 })
//     → GET http://localhost:3001/api/claims?status=Pending&page=1
//
//   fetchClaims({ status: 'Approved', memberId: '', page: undefined })
//     → GET http://localhost:3001/api/claims?status=Approved
//
//   fetchClaims({})
//     → GET http://localhost:3001/api/claims
// ─────

const BASE_URL = 'http://localhost:3001/api';

async function fetchClaims(filters = {}) {
  const parts = [];
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }
  const query = parts.length ? `?${parts.join('&')}` : '';
  const url = `${BASE_URL}/claims${query}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Mock fetch — do not modify
const MOCK_CLAIMS = [
  { id: '1', patientName: 'Alice Dlamini', status: 'Pending',  amountClaimed: 1500 },
  { id: '2', patientName: 'Bob Nkosi',     status: 'Approved', amountClaimed: 2000 },
];

global.fetch = async (url) => {
  if (url.includes('triggerError=true')) {
    return { ok: false, status: 403, statusText: 'Forbidden' };
  }
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => MOCK_CLAIMS,
  };
};
// ───────────

function assert(label, actual, expected) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? '✓' : '✗'} ${label}`);
  if (!pass) {
    console.log('  Expected:', JSON.stringify(expected, null, 2));
    console.log('  Received:', JSON.stringify(actual, null, 2));
  }
}

(async () => {
  // Intercept fetch to capture the URL being called
  let lastUrl = '';
  const originalFetch = global.fetch;
  global.fetch = async (url, ...rest) => { lastUrl = url; return originalFetch(url, ...rest); };

  await fetchClaims({});
  assert('No filters: URL has no query string',
    lastUrl,
    'http://localhost:3001/api/claims'
  );

  await fetchClaims({ status: 'Pending', page: 1 });
  assert('Filters are appended to the URL',
    lastUrl,
    'http://localhost:3001/api/claims?status=Pending&page=1'
  );

  await fetchClaims({ status: 'Approved', memberId: '', page: undefined });
  assert('Empty and undefined filter values are skipped',
    lastUrl,
    'http://localhost:3001/api/claims?status=Approved'
  );

  await fetchClaims({ status: 'Rejected', page: null });
  assert('Null filter values are skipped',
    lastUrl,
    'http://localhost:3001/api/claims?status=Rejected'
  );

  const data = await fetchClaims({});
  assert('Returns parsed JSON on a successful response', data, MOCK_CLAIMS);

  let caughtError = null;
  try {
    await fetchClaims({ triggerError: 'true' });
  } catch (err) {
    caughtError = err.message;
  }
  assert('Throws a descriptive error on non-2xx response',
    caughtError,
    'Request failed: 403 Forbidden'
  );
})();
