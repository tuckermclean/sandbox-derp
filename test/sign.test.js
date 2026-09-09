const { test } = require('node:test');
const assert = require('node:assert');

const { sign } = require('../src/math.js');

test('sign(-5) returns -1', () => {
  assert.strictEqual(sign(-5), -1);
});

test('sign(5) returns 1', () => {
  assert.strictEqual(sign(5), 1);
});

test('sign(0) returns 0', () => {
  assert.strictEqual(sign(0), 0);
});
