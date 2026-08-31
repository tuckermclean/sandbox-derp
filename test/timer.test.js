const { test } = require('node:test');
const assert = require('node:assert');

const { formatDuration } = require('../src/timer.js');

test('formatDuration zero-pads minutes and seconds', () => {
  assert.strictEqual(formatDuration(65), '00:01:05');
});

test('formatDuration carries seconds into hours, minutes, and seconds', () => {
  assert.strictEqual(formatDuration(3661), '01:01:01');
});

test('formatDuration of zero is 00:00:00', () => {
  assert.strictEqual(formatDuration(0), '00:00:00');
});

test('formatDuration pads hours to two digits', () => {
  assert.strictEqual(formatDuration(3600), '01:00:00');
});
