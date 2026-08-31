const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const bin = path.join(__dirname, '..', 'bin', 'validate.js');
const fixtures = path.join(__dirname, 'fixtures');

function runCli(schema, data) {
  return spawnSync(
    process.execPath,
    [bin, path.join(fixtures, schema), path.join(fixtures, data)],
    { encoding: 'utf8' }
  );
}

test('CLI exits 0 on clean data and prints nothing', () => {
  const result = runCli('clean.schema.json', 'clean.data.json');
  assert.strictEqual(result.status, 0);
  assert.strictEqual(result.stdout.trim(), '');
});

test('CLI exits 1 on violations and prints one violation per line', () => {
  const result = runCli('violations.schema.json', 'violations.data.json');
  assert.strictEqual(result.status, 1);
  const lines = result.stdout.trim().split('\n');
  assert.strictEqual(lines.length, 2);
});
