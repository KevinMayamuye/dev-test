// Q4: Parallel Document Uploads
// Run with: node q4-async-uploads.js
//
// TASK: Implement uploadDocuments(files, uploadFn)
//
// Uploads an array of file objects IN PARALLEL using the provided uploadFn.
// Returns a result object separating successful and failed uploads.
//
// Rules:
//   - All uploads must start at the same time (parallel, not sequential)
//   - If one file fails, the others must still complete — do not abort early
//   - The function itself must NEVER throw or reject
//   - Preserve the original file order within each output array
//
// Return shape:
//   {
//     successful: [{ fileName: string, url: string }, ...],
//     failed:     [{ fileName: string, error: string }, ...],
//   }
//
// Hint: look up Promise.allSettled
// ──────

// Mock upload function — do not modify
function mockUpload(file) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (file.name.startsWith('invalid-')) {
        reject(new Error(`Storage rejected: ${file.name}`));
      } else {
        resolve({ url: `https://storage.netcareplus.co.za/documents/${file.name}` });
      }
    }, 50);
  });
}
// ─────

async function uploadDocuments(files, uploadFn = mockUpload) {
  try {
    if (!files.length) {
      return { successful: [], failed: [] };
    }
    const settled = await Promise.allSettled(files.map((file) => uploadFn(file)));
    const successful = [];
    const failed = [];
    settled.forEach((outcome, index) => {
      const file = files[index];
      const fileName = file.name;
      if (outcome.status === 'fulfilled') {
        successful.push({ fileName, url: outcome.value.url });
      } else {
        const reason = outcome.reason;
        const error = reason instanceof Error ? reason.message : String(reason);
        failed.push({ fileName, error });
      }
    });
    return { successful, failed };
  } catch {
    return { successful: [], failed: [] };
  }
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

const files = [
  { name: 'invoice.pdf',         size: 204800, type: 'application/pdf' },
  { name: 'invalid-xray.jpg',   size: 512000, type: 'image/jpeg'       },
  { name: 'referral-letter.pdf', size: 102400, type: 'application/pdf' },
];

(async () => {
  const result = await uploadDocuments(files);

  assert('Successful uploads have correct shape', result.successful, [
    { fileName: 'invoice.pdf',         url: 'https://storage.netcareplus.co.za/documents/invoice.pdf'         },
    { fileName: 'referral-letter.pdf', url: 'https://storage.netcareplus.co.za/documents/referral-letter.pdf' },
  ]);

  assert('Failed uploads include the error message', result.failed, [
    { fileName: 'invalid-xray.jpg', error: 'Storage rejected: invalid-xray.jpg' },
  ]);

  assert('Result object is returned (function does not throw)', typeof result, 'object');

  // Edge case: all files succeed
  const allGood = [
    { name: 'doc-a.pdf', size: 1000, type: 'application/pdf' },
    { name: 'doc-b.pdf', size: 2000, type: 'application/pdf' },
  ];
  const allGoodResult = await uploadDocuments(allGood);
  assert('All-success: failed array is empty', allGoodResult.failed, []);
  assert('All-success: both files in successful', allGoodResult.successful.length, 2);

  // Edge case: all files fail
  const allBad = [
    { name: 'invalid-a.pdf', size: 1000, type: 'application/pdf' },
    { name: 'invalid-b.pdf', size: 2000, type: 'application/pdf' },
  ];
  const allBadResult = await uploadDocuments(allBad);
  assert('All-fail: successful array is empty', allBadResult.successful, []);
  assert('All-fail: both files in failed', allBadResult.failed.length, 2);

  // Edge case: empty array
  const emptyResult = await uploadDocuments([]);
  assert('Empty input returns empty arrays', emptyResult, { successful: [], failed: [] });
})();
