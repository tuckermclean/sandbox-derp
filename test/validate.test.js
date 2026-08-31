const { test } = require('node:test');
const assert = require('node:assert');
const { registerRule, validate } = require('../src/validate.js');

test('validate({}, {}) returns []', () => {
  assert.deepStrictEqual(validate({}, {}), []);
});

test('a schema naming an unregistered rule throws', () => {
  assert.throws(() => validate({ age: { type: 'number' } }, { age: 1 }));
});

test('an unregistered rule throws even when the field is absent', () => {
  assert.throws(() => validate({ age: { madeUpRule: true } }, {}));
});

test('a rule registered at test time is invoked and its message appears in the result', () => {
  registerRule('fake', (value, arg) => `fake violation for ${JSON.stringify(value)} with arg ${JSON.stringify(arg)}`);
  const result = validate({ x: { fake: 42 } }, { x: 'hello' });
  assert.deepStrictEqual(result, [
    { path: 'x', rule: 'fake', message: 'fake violation for "hello" with arg 42' },
  ]);
});

test('a rule returning true produces no violation', () => {
  registerRule('alwaysOk', () => true);
  assert.deepStrictEqual(validate({ name: { alwaysOk: 1 } }, { name: 'x' }), []);
});
