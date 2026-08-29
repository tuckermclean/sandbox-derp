const { test } = require('node:test');
const assert = require('node:assert/strict');
const { calculateWinner } = require('../src/tictactoe.js');

test('top row of X wins', () => {
  assert.strictEqual(
    calculateWinner(['X', 'X', 'X', null, null, null, null, null, null]),
    'X'
  );
});

test('left column of O wins', () => {
  assert.strictEqual(
    calculateWinner(['O', null, null, 'O', null, null, 'O', null, null]),
    'O'
  );
});

test('main diagonal of X wins', () => {
  assert.strictEqual(
    calculateWinner(['X', null, null, null, 'X', null, null, null, 'X']),
    'X'
  );
});

test('empty board has no winner', () => {
  assert.strictEqual(
    calculateWinner([null, null, null, null, null, null, null, null, null]),
    null
  );
});

test('anti-diagonal wins', () => {
  assert.strictEqual(
    calculateWinner([null, null, 'X', null, 'X', null, 'X', null, null]),
    'X'
  );
});

test('middle column wins', () => {
  assert.strictEqual(
    calculateWinner([null, 'O', null, null, 'O', null, null, 'O', null]),
    'O'
  );
});

test('full board with no winning line is a draw (null)', () => {
  assert.strictEqual(
    calculateWinner(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']),
    null
  );
});
