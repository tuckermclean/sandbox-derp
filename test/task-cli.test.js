const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const TASK_BIN = path.join(__dirname, '..', 'bin', 'task.js');

function setup(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'task-cli-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return { dir, file: path.join(dir, 'tasks.json') };
}

function run(file, args) {
  return spawnSync(process.execPath, [TASK_BIN, ...args], {
    encoding: 'utf8',
    env: { ...process.env, TASKS_FILE: file },
  });
}

test('add then list shows the task; done marks it complete; rm removes it', (t) => {
  const { file } = setup(t);

  let res = run(file, ['add', 'Write report']);
  assert.strictEqual(res.status, 0, res.stderr);
  const id = res.stdout.trim();
  assert.ok(id.length > 0, 'add should print the new task id');

  res = run(file, ['list']);
  assert.strictEqual(res.status, 0, res.stderr);
  assert.match(res.stdout, /Write report/);

  res = run(file, ['list', '--done']);
  assert.strictEqual(res.status, 0, res.stderr);
  assert.doesNotMatch(res.stdout, /Write report/);

  res = run(file, ['done', id]);
  assert.strictEqual(res.status, 0, res.stderr);

  res = run(file, ['list', '--done']);
  assert.strictEqual(res.status, 0, res.stderr);
  assert.match(res.stdout, /Write report/);

  res = run(file, ['rm', id]);
  assert.strictEqual(res.status, 0, res.stderr);

  res = run(file, ['list', '--done']);
  assert.strictEqual(res.status, 0, res.stderr);
  assert.doesNotMatch(res.stdout, /Write report/);
});

test('list --tag shows only tasks carrying that tag', (t) => {
  const { file } = setup(t);

  let res = run(file, ['add', 'Alpha', '--tag', 'work']);
  assert.strictEqual(res.status, 0, res.stderr);
  res = run(file, ['add', 'Beta', '--tag', 'home']);
  assert.strictEqual(res.status, 0, res.stderr);

  res = run(file, ['list', '--tag', 'work']);
  assert.strictEqual(res.status, 0, res.stderr);
  assert.match(res.stdout, /Alpha/);
  assert.doesNotMatch(res.stdout, /Beta/);
});

test('list --search matches on title', (t) => {
  const { file } = setup(t);

  let res = run(file, ['add', 'buy foo snacks']);
  assert.strictEqual(res.status, 0, res.stderr);
  res = run(file, ['add', 'buy bar snacks']);
  assert.strictEqual(res.status, 0, res.stderr);

  res = run(file, ['list', '--search', 'foo']);
  assert.strictEqual(res.status, 0, res.stderr);
  assert.match(res.stdout, /buy foo snacks/);
  assert.doesNotMatch(res.stdout, /buy bar snacks/);
});
