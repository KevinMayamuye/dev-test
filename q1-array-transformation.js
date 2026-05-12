// Q1: Array Transformation
// Run with: node q1-array-transformation.js
//
// TASK: Implement groupAndSummarizeClaims(claims)
//
// Given an array of claim objects, return a new object that:
//   1. Groups claims by their `status` field
//   2. For each group, calculates the total `count` and `totalAmountClaimed`
//   3. Keeps ONLY groups that contain MORE THAN 2 claims
//
// Return shape:
//   {
//     [status]: { count: number, totalAmountClaimed: number },
//     ...
//   }


const claims = [
  { id: '1', patientName: 'Alice Dlamini',   status: 'Pending',  amountClaimed: 1500 },
  { id: '2', patientName: 'Bob Nkosi',        status: 'Approved', amountClaimed: 2000 },
  { id: '3', patientName: 'Carol Mokoena',    status: 'Pending',  amountClaimed: 800  },
  { id: '4', patientName: 'David Zulu',       status: 'Rejected', amountClaimed: 500  },
  { id: '5', patientName: 'Eve Sithole',      status: 'Pending',  amountClaimed: 1200 },
  { id: '6', patientName: 'Frank Khumalo',    status: 'Approved', amountClaimed: 3000 },
  { id: '7', patientName: 'Grace Ndlovu',     status: 'Pending',  amountClaimed: 600  },
];

function groupAndSummarizeClaims(claims) {
  //Your code here
  const grouped = claims.reduce((acc, claim) => {
    const { status, amountClaimed } = claim;
    if (!acc[status]) {
      acc[status] = { count: 0, totalAmountClaimed: 0 };
    }
    acc[status].count += 1;
    acc[status].totalAmountClaimed += amountClaimed;
    return acc;
  }, {});

  return Object.fromEntries(
    Object.entries(grouped).filter(([, { count }]) => count > 2)
  );
}

// Test Runner

function assert(label, actual, expected) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? '✓' : '✗'} ${label}`);
  if (!pass) {
    console.log('  Expected:', JSON.stringify(expected, null, 2));
    console.log('  Received:', JSON.stringify(actual, null, 2));
  }
}

const result = groupAndSummarizeClaims(claims);

assert(
  'Returns only statuses with more than 2 claims',
  Object.keys(result),
  ['Pending']
);

assert(
  'Pending group has the correct claim count',
  result.Pending?.count,
  4
);

assert(
  'Pending group has the correct total amount',
  result.Pending?.totalAmountClaimed,
  4100
);

assert(
  'Approved group is excluded (exactly 2 claims)',
  result.Approved,
  undefined
);

assert(
  'Rejected group is excluded (only 1 claim)',
  result.Rejected,
  undefined
);

assert(
  'Returns empty object for empty input',
  groupAndSummarizeClaims([]),
  {}
);
