const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fsp = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

const store = require('../src/store.js');

const sampleTasks = [
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

let dir;
let filePath;

beforeEach(async () => {
  dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'store-test-'));
  filePath = path.join(dir, 'tasks.json');
});

afterEach(async () => {
  await fsp.rm(dir, { recursive: true, force: true });
});

test('writing tasks then reading them back returns the same list', async () => {
  await store.saveTasks(sampleTasks, filePath);

  const result = await store.loadTasks(filePath);

  assert.deepStrictEqual(result, sampleTasks);
});

test('loadTasks and saveTasks return promises', async () => {
  const saveResult = store.saveTasks(sampleTasks, filePath);
  assert.ok(saveResult instanceof Promise);
  await saveResult;

  const loadResult = store.loadTasks(filePath);
  assert.ok(loadResult instanceof Promise);
  await loadResult;
});

test('an absent tasks file reads as []', async () => {
  const result = await store.loadTasks(filePath);

  assert.deepStrictEqual(result, []);
});

test('a corrupt tasks file reads as []', async () => {
  await fsp.writeFile(filePath, 'not json', 'utf8');

  const result = await store.loadTasks(filePath);

  assert.deepStrictEqual(result, []);
});

test('a task file that is not a JSON array reads as []', async () => {
  await fsp.writeFile(filePath, '{"id":"1"}', 'utf8');

  const result = await store.loadTasks(filePath);

  assert.deepStrictEqual(result, []);
});

test('a failed save leaves the original file unchanged', async () => {
  const original = '{"id":"original"}\n';
  await fsp.writeFile(filePath, original, 'utf8');

  const realRename = fsp.rename;
  fsp.rename = async () => {
    throw new Error('simulated rename failure');
  };

  try {
    await assert.rejects(
      () => store.saveTasks(sampleTasks, filePath),
      /simulated rename failure/
    );
  } finally {
    fsp.rename = realRename;
  }

  const after = await fsp.readFile(filePath, 'utf8');
  assert.strictEqual(after, original);
});

test('a successful save is atomic and leaves no temporary files behind', async () => {
  await store.saveTasks(sampleTasks, filePath);

  const entries = await fsp.readdir(dir);
  assert.deepStrictEqual(entries, ['tasks.json']);
  assert.deepStrictEqual(await store.loadTasks(filePath), sampleTasks);
});
