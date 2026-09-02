'use strict';

const fs = require('node:fs');
const path = require('node:path');

function readTasks(filePath = process.env.TASKS_FILE || '.tasks.json') {
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }

  try {
    const tasks = JSON.parse(raw);
    return Array.isArray(tasks) ? tasks : [];
  } catch (err) {
    return [];
  }
}

function writeTasks(tasks, filePath = process.env.TASKS_FILE || '.tasks.json') {
  const serialized = JSON.stringify(tasks, null, 2);
  const dir = path.dirname(filePath);
  const tmpPath = path.join(
    dir,
    `.tasks-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}.tmp`
  );

  try {
    fs.writeFileSync(tmpPath, serialized, 'utf8');
    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    try {
      fs.unlinkSync(tmpPath);
    } catch (_) {
      // ignore cleanup failure; rethrow the original error
    }
    throw err;
  }
}

module.exports = { readTasks, writeTasks };
