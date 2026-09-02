'use strict';

const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const CLI = path.join(__dirname, '..', 'bin', 'task.js');

let dir;
let tasksFile;

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'task-cli-'));
  tasksFile = path.join(dir, 'tasks.json');
});

afterEach(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

function run(args, env = {}) {
  return spawnSync(process.execPath, [CLI, ...args], {
    encoding: 'utf8',
    env: { ...process.env, TASKS_FILE: tasksFile, ...env },
  });
}

function add(title, ...tags) {
  const tagArgs = [];
  for (const tag of tags) {
    tagArgs.push('--tag', tag);
  }
  const result = run(['add', title, ...tagArgs]);
  assert.strictEqual(result.status, 0, result.stderr);
  return result.stdout.trim();
}

test('add then list shows the task with its title, tag and pending status', () => {
  const id = add('Write tests', 'work');
  assert.match(id, /^[0-9a-f-]{36}$/i);

  const result = run(['list']);
  assert.strictEqual(result.status, 0, result.stderr);
  assert.strictEqual(result.stdout, `${id} Write tests [work] pending\n`);
});

test('done <id> marks the task complete so a later list shows done', () => {
  const id = add('Finish CLI', 'work');

  const done = run(['done', id]);
  assert.strictEqual(done.status, 0, done.stderr);
  assert.strictEqual(done.stdout, `done ${id}\n`);

  const list = run(['list']);
  assert.strictEqual(list.status, 0, list.stderr);
  assert.strictEqual(list.stdout, `${id} Finish CLI [work] done\n`);
});

test('rm <id> removes the task so a later list omits it', () => {
  const id = add('Delete me', 'trash');

  const rm = run(['rm', id]);
  assert.strictEqual(rm.status, 0, rm.stderr);
  assert.strictEqual(rm.stdout, `removed ${id}\n`);

  const list = run(['list']);
  assert.strictEqual(list.status, 0, list.stderr);
  assert.strictEqual(list.stdout, '');
});

test('list --tag work shows only tasks carrying that tag', () => {
  add('Task with work', 'work');
  add('Task without', 'home');

  const list = run(['list', '--tag', 'work']);
  assert.strictEqual(list.status, 0, list.stderr);
  const lines = list.stdout.trim().split('\n').filter(Boolean);
  assert.strictEqual(lines.length, 1);
  assert.match(lines[0], /Task with work \[work\] pending/);
  assert.doesNotMatch(list.stdout, /Task without/);
});

test('list --search foo matches title case-insensitively', () => {
  add('Foo the first', 'a');
  add('Bar the second', 'b');

  const list = run(['list', '--search', 'foo']);
  assert.strictEqual(list.status, 0, list.stderr);
  assert.match(list.stdout, /Foo the first/);
  assert.doesNotMatch(list.stdout, /Bar the second/);
});

test('list --done shows only done tasks', () => {
  const id = add('Done task', 'x');
  add('Pending task', 'y');
  run(['done', id]);

  const list = run(['list', '--done']);
  assert.strictEqual(list.status, 0, list.stderr);
  assert.match(list.stdout, /Done task/);
  assert.doesNotMatch(list.stdout, /Pending task/);
});

test('list combines multiple filters with AND', () => {
  const id = add('Foo work task', 'work');
  add('Foo home task', 'home');
  add('Bar work task', 'work');
  run(['done', id]);

  const list = run(['list', '--tag', 'work', '--search', 'foo', '--done']);
  assert.strictEqual(list.status, 0, list.stderr);
  const lines = list.stdout.trim().split('\n').filter(Boolean);
  assert.strictEqual(lines.length, 1);
  assert.match(lines[0], /Foo work task/);
});

test('add accepts repeated --tag options and defaults tags to []', () => {
  const idA = add('Multi-tag', 'work', 'urgent');
  const idB = add('No tags');

  const list = run(['list']);
  assert.strictEqual(list.status, 0, list.stderr);
  assert.match(list.stdout, new RegExp(`${idA} Multi-tag \\[work, urgent\\] pending`));
  assert.match(list.stdout, new RegExp(`${idB} No tags \\[\\] pending`));
});

test('list prints tasks in creation order', () => {
  const first = add('First');
  const second = add('Second');

  const list = run(['list']);
  assert.strictEqual(list.status, 0, list.stderr);
  const lines = list.stdout.trim().split('\n');
  assert.strictEqual(lines[0], `${first} First [] pending`);
  assert.strictEqual(lines[1], `${second} Second [] pending`);
});

test('list with no tasks prints nothing and exits 0', () => {
  const result = run(['list']);
  assert.strictEqual(result.status, 0, result.stderr);
  assert.strictEqual(result.stdout, '');
});

test('unknown command prints usage to stderr and exits 1', () => {
  const result = run(['frobnicate']);
  assert.strictEqual(result.status, 1);
  assert.match(result.stderr, /[Uu]sage/);
});

test('add without a title prints usage to stderr and exits 1', () => {
  const result = run(['add']);
  assert.strictEqual(result.status, 1);
  assert.match(result.stderr, /[Uu]sage/);
});

test('done without an id prints usage to stderr and exits 1', () => {
  const result = run(['done']);
  assert.strictEqual(result.status, 1);
  assert.match(result.stderr, /[Uu]sage/);
});

test('done <missing-id> prints an error to stderr and exits 1', () => {
  const result = run(['done', 'does-not-exist']);
  assert.strictEqual(result.status, 1);
  assert.match(result.stderr, /does-not-exist|not found|no matching/i);
});

test('rm <missing-id> prints an error to stderr and exits 1', () => {
  const result = run(['rm', 'does-not-exist']);
  assert.strictEqual(result.status, 1);
  assert.match(result.stderr, /does-not-exist|not found|no matching/i);
});
