'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');

const defaultFile = () => process.env.TASKS_FILE || '.tasks.json';

async function loadTasks(filePath = defaultFile()) {
  let raw;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    return [];
  }

  try {
    const tasks = JSON.parse(raw);
    return Array.isArray(tasks) ? tasks : [];
  } catch (err) {
    return [];
  }
}

async function saveTasks(tasks, filePath = defaultFile()) {
  const serialized = JSON.stringify(tasks, null, 2);
  const dir = path.dirname(filePath);
  const tmpPath = path.join(
    dir,
    `.tasks-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}.tmp`
  );

  try {
    await fs.writeFile(tmpPath, serialized, 'utf8');
    await fs.rename(tmpPath, filePath);
  } catch (err) {
    try {
      await fs.unlink(tmpPath);
    } catch (_) {
      // ignore cleanup failure; rethrow the original error
    }
    throw err;
  }
}

module.exports = { loadTasks, saveTasks };
