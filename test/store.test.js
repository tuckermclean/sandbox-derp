'use strict';

const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const store = require('../src/store.js');

let dir;
let filePath;
let previousTasksFile;

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'store-test-'));
  filePath = path.join(dir, 'tasks.json');
  previousTasksFile = process.env.TASKS_FILE;
  process.env.TASKS_FILE = filePath;
});

afterEach(() => {
  if (previousTasksFile === undefined) {
    delete process.env.TASKS_FILE;
  } else {
    process.env.TASKS_FILE = previousTasksFile;
  }
  fs.rmSync(dir, { recursive: true, force: true });
});

// AC1: writing tasks then reading them back returns the same list.
test('AC1: adding tasks then listing them returns the same tasks', () => {
  const seeded = [
    store.addTask('Write store', ['derp', 'storage']),
    store.addTask('Test store', []),
  ];

  assert.deepEqual(store.listTasks(), seeded);
});

// AC2: an absent or corrupt tasks file reads as [].
test('AC2: an absent tasks file reads as []', () => {
  assert.deepEqual(store.listTasks(), []);
});

test('AC2: a corrupt tasks file reads as []', () => {
  fs.writeFileSync(filePath, 'not json', 'utf8');

  assert.deepEqual(store.listTasks(), []);
});

test('AC2: valid JSON that is not an array reads as []', () => {
  fs.writeFileSync(filePath, '{"not":"an array"}', 'utf8');

  assert.deepEqual(store.listTasks(), []);
});

// AC3: a failed save does not corrupt an existing tasks file.
test('AC3: a failed save leaves the existing tasks file intact', () => {
  const original = [
    { id: 'keep', title: 'original', tags: [], done: false, created: '2026-01-01T00:00:00.000Z' },
  ];
  fs.writeFileSync(filePath, JSON.stringify(original), 'utf8');

  const renameSync = fs.renameSync;
  fs.renameSync = () => {
    throw new Error('rename failed');
  };

  try {
    assert.throws(() => store.addTask('new task'), /rename failed/);
  } finally {
    fs.renameSync = renameSync;
  }

  const after = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  assert.deepEqual(after, original);
});

test('addTask returns a task with a whitespace-free id, done false, ISO created', () => {
  const task = store.addTask('hello', ['x']);

  assert.equal(task.title, 'hello');
  assert.deepEqual(task.tags, ['x']);
  assert.equal(task.done, false);
  assert.equal(typeof task.id, 'string');
  assert.doesNotMatch(task.id, /\s/);
  assert.equal(task.created, new Date(task.created).toISOString());
});

test('addTask defaults tags to []', () => {
  const task = store.addTask('no tags');

  assert.deepEqual(task.tags, []);
});

test('markDone sets done true and persists', () => {
  const task = store.addTask('done me');

  const updated = store.markDone(task.id);

  assert.equal(updated.done, true);
  assert.equal(store.listTasks()[0].done, true);
});

test('markDone throws when the id is not found', () => {
  assert.equal(typeof store.markDone, 'function');
  assert.throws(() => store.markDone('missing'));
});

test('removeTask removes and returns the task', () => {
  const task = store.addTask('remove me');

  const removed = store.removeTask(task.id);

  assert.deepEqual(removed, task);
  assert.deepEqual(store.listTasks(), []);
});

test('removeTask throws when the id is not found', () => {
  assert.equal(typeof store.removeTask, 'function');
  assert.throws(() => store.removeTask('missing'));
});
