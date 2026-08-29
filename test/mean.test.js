const { test } = require('node:test');
const assert = require('node:assert/strict');
const { mean } = require('../src/math');

test('mean([2, 4, 6]) returns 4', () => {
  assert.strictEqual(mean([2, 4, 6]), 4);
});

test('mean([5]) returns 5', () => {
  assert.strictEqual(mean([5]), 5);
});

test('mean([1, 2]) returns 1.5', () => {
  assert.strictEqual(mean([1, 2]), 1.5);
});
