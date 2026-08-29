const { test } = require('node:test');
const assert = require('node:assert');

const { sum } = require('../sum.js');

test('sum(2, 3) returns 5', () => {
  assert.strictEqual(sum(2, 3), 5);
});

test('sum(-1, 1) returns 0', () => {
  assert.strictEqual(sum(-1, 1), 0);
});
