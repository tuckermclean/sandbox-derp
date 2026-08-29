const { test } = require('node:test');
const assert = require('node:assert/strict');
const { calculateWinner } = require('../src/tictactoe.js');

test('top row win returns X', () => {
  assert.strictEqual(
    calculateWinner(['X', 'X', 'X', null, null, null, null, null, null]),
    'X'
  );
});

test('left column win returns O', () => {
  assert.strictEqual(
    calculateWinner(['O', null, null, 'O', null, null, 'O', null, null]),
    'O'
  );
});

test('main diagonal win returns X', () => {
  assert.strictEqual(
    calculateWinner(['X', null, null, null, 'X', null, null, null, 'X']),
    'X'
  );
});

test('empty board returns null', () => {
  assert.strictEqual(
    calculateWinner([null, null, null, null, null, null, null, null, null]),
    null
  );
});

test('middle row win returns O', () => {
  assert.strictEqual(
    calculateWinner([null, null, null, 'O', 'O', 'O', null, null, null]),
    'O'
  );
});

test('bottom row win returns X', () => {
  assert.strictEqual(
    calculateWinner([null, null, null, null, null, null, 'X', 'X', 'X']),
    'X'
  );
});

test('middle column win returns O', () => {
  assert.strictEqual(
    calculateWinner([null, 'O', null, null, 'O', null, null, 'O', null]),
    'O'
  );
});

test('right column win returns X', () => {
  assert.strictEqual(
    calculateWinner([null, null, 'X', null, null, 'X', null, null, 'X']),
    'X'
  );
});

test('anti-diagonal win returns O', () => {
  assert.strictEqual(
    calculateWinner([null, null, 'O', null, 'O', null, 'O', null, null]),
    'O'
  );
});

test('board with no winning line returns null', () => {
  assert.strictEqual(
    calculateWinner(['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O']),
    null
  );
});
