const { test } = require('node:test');
const assert = require('node:assert');

const { wordCount } = require('../src/notes.js');

test('wordCount counts whitespace-separated tokens', () => {
  assert.strictEqual(wordCount('hello world'), 2);
});

test('wordCount of empty string is 0', () => {
  assert.strictEqual(wordCount(''), 0);
});

test('wordCount ignores leading, trailing, and repeated whitespace', () => {
  assert.strictEqual(wordCount('  hello   world  '), 2);
});

test('wordCount of a single word is 1', () => {
  assert.strictEqual(wordCount('hello'), 1);
});
