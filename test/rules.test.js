const { test } = require('node:test');
const assert = require('node:assert');
require('../src/rules.js');
const { validate } = require('../src/validate.js');

test('required: true reports a missing field', () => {
  const result = validate({ age: { required: true } }, {});
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].path, 'age');
  assert.strictEqual(result[0].rule, 'required');
  assert.strictEqual(typeof result[0].message, 'string');
  assert.ok(result[0].message.length > 0);
});

test('required: true passes when the field is present', () => {
  assert.deepStrictEqual(validate({ age: { required: true } }, { age: 30 }), []);
});

test('required: false always passes, even when the field is absent', () => {
  assert.deepStrictEqual(validate({ age: { required: false } }, {}), []);
});

test('type: "number" reports a string', () => {
  const result = validate({ age: { type: 'number' } }, { age: 'old' });
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].path, 'age');
  assert.strictEqual(result[0].rule, 'type');
});

test('type: "number" passes for a number', () => {
  assert.deepStrictEqual(validate({ age: { type: 'number' } }, { age: 30 }), []);
});

test('type: "object" rejects null and arrays, and passes for a plain object', () => {
  assert.strictEqual(validate({ doc: { type: 'object' } }, { doc: null }).length, 1);
  assert.strictEqual(validate({ doc: { type: 'object' } }, { doc: [] }).length, 1);
  assert.deepStrictEqual(validate({ doc: { type: 'object' } }, { doc: {} }), []);
});

test('minLength: 3 reports "ab"', () => {
  const result = validate({ name: { minLength: 3 } }, { name: 'ab' });
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].path, 'name');
  assert.strictEqual(result[0].rule, 'minLength');
});

test('minLength applies to arrays', () => {
  assert.strictEqual(validate({ tags: { minLength: 2 } }, { tags: ['a'] }).length, 1);
  assert.deepStrictEqual(validate({ tags: { minLength: 2 } }, { tags: ['a', 'b'] }), []);
});

test('range: [0, 130] reports 999', () => {
  const result = validate({ age: { range: [0, 130] } }, { age: 999 });
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].path, 'age');
  assert.strictEqual(result[0].rule, 'range');
});

test('range is inclusive at both boundaries', () => {
  assert.deepStrictEqual(validate({ age: { range: [0, 130] } }, { age: 0 }), []);
  assert.deepStrictEqual(validate({ age: { range: [0, 130] } }, { age: 130 }), []);
});

test('an absent field with required: true and another rule produces exactly one violation', () => {
  const result = validate({ age: { required: true, type: 'number' } }, {});
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].rule, 'required');
});

test('an absent field with only non-required rules produces no violations', () => {
  assert.deepStrictEqual(validate({ age: { type: 'number', range: [0, 130] } }, {}), []);
});

test('a malformed schema (wrong-shaped arg) throws', () => {
  assert.throws(() => validate({ age: { type: 'banana' } }, { age: 1 }));
  assert.throws(() => validate({ name: { minLength: -1 } }, { name: 'a' }));
  assert.throws(() => validate({ age: { range: [0] } }, { age: 1 }));
  assert.throws(() => validate({ age: { required: 'yes' } }, { age: 1 }));
});
