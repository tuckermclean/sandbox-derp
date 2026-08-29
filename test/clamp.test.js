const { test } = require('node:test');
const assert = require('node:assert/strict');
const { clamp } = require('../src/math.js');

test('clamp returns n when within range', () => {
  assert.equal(clamp(5, 0, 10), 5);
});

test('clamp returns lo when n < lo', () => {
  assert.equal(clamp(-3, 0, 10), 0);
});

test('clamp returns hi when n > hi', () => {
  assert.equal(clamp(42, 0, 10), 10);
});
