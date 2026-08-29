const { test } = require('node:test');
const assert = require('node:assert');

const { multiply } = require('../src/math.js');

test('multiply(2, 3) returns 6', () => {
  assert.strictEqual(multiply(2, 3), 6);
});

test('multiply(-4, 5) returns -20', () => {
  assert.strictEqual(multiply(-4, 5), -20);
});
