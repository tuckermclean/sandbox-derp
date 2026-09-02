const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const store = require('../src/store.js');

let dir;
let filePath;

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'store-test-'));
  filePath = path.join(dir, 'tasks.json');
});

afterEach(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

test('writing tasks then reading them back returns the same list', () => {
  const tasks = [
    {
      id: '1',
      title: 'Write store',
      tags: ['derp', 'storage'],
      done: false,
      created: '2026-08-31T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'Test store',
      tags: [],
      done: true,
      created: '2026-08-31T01:00:00.000Z',
    },
  ];

  store.writeTasks(tasks, filePath);
  const result = store.readTasks(filePath);

  assert.deepStrictEqual(result, tasks);
});

test('writing tasks writes pretty-printed JSON with two-space indentation', () => {
  const tasks = [{ id: '1', title: 't', tags: [], done: false, created: 'c' }];

  store.writeTasks(tasks, filePath);

  const raw = fs.readFileSync(filePath, 'utf8');
  assert.strictEqual(raw, JSON.stringify(tasks, null, 2));
});

test('an absent tasks file reads as []', () => {
  const result = store.readTasks(filePath);

  assert.deepStrictEqual(result, []);
});

test('a corrupt tasks file reads as [] and does not throw', () => {
  fs.writeFileSync(filePath, 'not json', 'utf8');

  const result = store.readTasks(filePath);

  assert.deepStrictEqual(result, []);
});

test('writeTasks uses an atomic rename and leaves no temporary files behind', () => {
  const tasks = [{ id: '1', title: 't', tags: [], done: false, created: 'c' }];

  store.writeTasks(tasks, filePath);

  const entries = fs.readdirSync(dir);
  assert.deepStrictEqual(entries, ['tasks.json']);
  assert.deepStrictEqual(store.readTasks(filePath), tasks);
});
