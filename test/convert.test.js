const { test } = require('node:test');
const assert = require('node:assert');

const { convert } = require('../src/convert.js');

test('convert metres to kilometres', () => {
  assert.strictEqual(convert(1000, 'm', 'km'), 1);
});

test('convert Celsius to Fahrenheit', () => {
  assert.strictEqual(convert(100, 'C', 'F'), 212);
});

test('convert returns null across different families', () => {
  assert.strictEqual(convert(1, 'm', 'C'), null);
});

test('convert length: feet to metres', () => {
  assert.strictEqual(convert(1, 'ft', 'm'), 0.3048);
});

test('convert length: metres to centimetres', () => {
  assert.strictEqual(convert(1, 'm', 'cm'), 100);
});

test('convert temperature: Fahrenheit to Celsius', () => {
  assert.strictEqual(convert(212, 'F', 'C'), 100);
});
