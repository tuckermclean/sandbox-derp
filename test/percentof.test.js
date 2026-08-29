const { test } = require('node:test');
const assert = require('node:assert/strict');
const { percentOf } = require('../src/math.js');

test('percentOf(25, 200) returns 12.5', () => {
  assert.strictEqual(percentOf(25, 200), 12.5);
});

test('percentOf(1, 4) returns 25', () => {
  assert.strictEqual(percentOf(1, 4), 25);
});

test('percentOf(3, 3) returns 100', () => {
  assert.strictEqual(percentOf(3, 3), 100);
});
