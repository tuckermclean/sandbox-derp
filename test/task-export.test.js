const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { writeTasks } = require('../src/store.js');

const EXPORT_BIN = path.join(__dirname, '..', 'bin', 'task-export.js');

function setup(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'task-export-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return { dir, file: path.join(dir, 'tasks.json') };
}

function run(file, args) {
  return spawnSync(process.execPath, [EXPORT_BIN, ...args], {
    encoding: 'utf8',
    env: { ...process.env, TASKS_FILE: file },
  });
}

const tasks = [
  { id: '1', title: 'First task', tags: ['work'], done: false, created: '2024-01-01T00:00:00.000Z' },
  { id: '2', title: 'Second task', tags: ['home'], done: true, created: '2024-01-02T00:00:00.000Z' },
];

test('task-export --csv emits a header row and one row per task', async (t) => {
  const { file } = setup(t);
  await writeTasks(tasks, file);

  const res = run(file, ['--csv']);
  assert.strictEqual(res.status, 0, res.stderr);

  const lines = res.stdout.trim().split('\n');
  assert.strictEqual(lines.length, 3, 'expected a header row plus two data rows');

  assert.match(lines[0], /id/);
  assert.match(lines[0], /title/);
  assert.match(lines[0], /tags/);
  assert.match(lines[0], /done/);
  assert.match(lines[0], /created/);

  assert.match(res.stdout, /First task/);
  assert.match(res.stdout, /Second task/);
});

test('task-export --json emits valid JSON', async (t) => {
  const { file } = setup(t);
  await writeTasks(tasks, file);

  const res = run(file, ['--json']);
  assert.strictEqual(res.status, 0, res.stderr);

  const data = JSON.parse(res.stdout);
  assert.ok(Array.isArray(data));
  assert.strictEqual(data.length, 2);
  assert.deepStrictEqual(
    data.map((task) => task.title),
    ['First task', 'Second task'],
  );
});
