// Q3: Safe localStorage Read
// Run with: node q3-local-storage.js
//
// TASK: Implement loadSavedProgress()
//
// The claim submission wizard saves its progress to localStorage under the
// key 'claimProgress'. This function should read and return that saved state.
//
// Rules:
//   - Return the parsed object if the key exists and contains valid JSON
//   - Return null if the key does not exist
//   - Return null if the stored value is empty or cannot be parsed
//   - NEVER throw — always handle errors internally and return null
//
// The stored object shape (for reference only, you do not need to validate it):
//   {
//     step: number,
//     claimFor: 'member' | 'dependant',
//     completedSteps: string[],
//   }

// localStorage mock — do not modify 
const _store = {};
const localStorage = {
  getItem:    (key)        => key in _store ? _store[key] : null,
  setItem:    (key, value) => { _store[key] = String(value); },
  removeItem: (key)        => { delete _store[key]; },
  clear:      ()           => { Object.keys(_store).forEach(k => delete _store[k]); },
};
// —————————————————

function loadSavedProgress() {
  try {
    const raw = localStorage.getItem('claimProgress');
    if (raw === null || raw === '') {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
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

localStorage.clear();
assert('Returns null when nothing is saved', loadSavedProgress(), null);

localStorage.setItem('claimProgress', JSON.stringify({
  step: 2,
  claimFor: 'member',
  completedSteps: ['personal-details', 'medical-event'],
}));
assert('Returns parsed object when valid data exists', loadSavedProgress(), {
  step: 2,
  claimFor: 'member',
  completedSteps: ['personal-details', 'medical-event'],
});

localStorage.setItem('claimProgress', 'not{{valid--json');
assert('Returns null for corrupted JSON without throwing', loadSavedProgress(), null);

localStorage.setItem('claimProgress', '');
assert('Returns null for empty stored string', loadSavedProgress(), null);

localStorage.removeItem('claimProgress');
assert('Returns null after key is removed', loadSavedProgress(), null);

const progress = { step: 4, claimFor: 'dependant', completedSteps: ['a', 'b', 'c', 'd'] };
localStorage.setItem('claimProgress', JSON.stringify(progress));
assert('Round-trips a complete progress object', loadSavedProgress(), progress);
