const { test } = require('node:test');
const assert = require('node:assert');

const { sign } = require('../src/math.js');

test('sign returns -1 for negative numbers', () => {
  assert.strictEqual(sign(-5), -1);
});

test('sign returns 1 for positive numbers', () => {
  assert.strictEqual(sign(5), 1);
});

test('sign returns 0 for zero', () => {
  assert.strictEqual(sign(0), 0);
});
