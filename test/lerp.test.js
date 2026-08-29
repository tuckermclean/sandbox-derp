const { test } = require('node:test');
const assert = require('node:assert');

const { lerp } = require('../src/math.js');

test('lerp(0, 10, 0.5) returns 5', () => {
  assert.strictEqual(lerp(0, 10, 0.5), 5);
});

test('lerp(0, 10, 0) returns 0', () => {
  assert.strictEqual(lerp(0, 10, 0), 0);
});

test('lerp(0, 10, 1) returns 10', () => {
  assert.strictEqual(lerp(0, 10, 1), 10);
});
