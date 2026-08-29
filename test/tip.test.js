const { test } = require('node:test');
const assert = require('node:assert/strict');
const { calculateTip } = require('../src/tip.js');

test('calculateTip(100, 20, 2) returns tip 20, total 120, per person 60', () => {
  assert.deepEqual(calculateTip(100, 20, 2), {
    tipAmount: 20,
    total: 120,
    perPerson: 60,
  });
});

test('calculateTip(50, 10, 1) returns tip 5, total 55, per person 55', () => {
  assert.deepEqual(calculateTip(50, 10, 1), {
    tipAmount: 5,
    total: 55,
    perPerson: 55,
  });
});

test('calculateTip(80, 25, 4) returns tip 20, total 100, per person 25', () => {
  assert.deepEqual(calculateTip(80, 25, 4), {
    tipAmount: 20,
    total: 100,
    perPerson: 25,
  });
});
