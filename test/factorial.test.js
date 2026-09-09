const { test } = require('node:test');
const assert = require('node:assert');

const { factorial } = require('../src/math.js');

test('factorial(0) returns 1', () => {
  assert.equal(factorial(0), 1);
});

test('factorial(5) returns 120', () => {
  assert.equal(factorial(5), 120);
});

test('factorial(1) returns 1', () => {
  assert.equal(factorial(1), 1);
});
