const { test } = require('node:test');
const assert = require('node:assert');

test('baseline smoke test', () => {
  assert.strictEqual(1 + 1, 2);
});
