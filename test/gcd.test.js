const { test } = require('node:test');
const assert = require('node:assert');
const { gcd } = require('../src/math.js');

test('gcd(12, 8) returns 4', () => {
  assert.strictEqual(gcd(12, 8), 4);
});

test('gcd(17, 5) returns 1', () => {
  assert.strictEqual(gcd(17, 5), 1);
});

test('gcd(0, 9) returns 9', () => {
  assert.strictEqual(gcd(0, 9), 9);
});
