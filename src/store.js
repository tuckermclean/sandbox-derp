'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

function defaultFile() {
  return process.env.TASKS_FILE || '.tasks.json';
}

async function readTasks(file = defaultFile()) {
  let raw;
  try {
    raw = await fs.readFile(file, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeTasks(tasks, file = defaultFile()) {
  const dir = path.dirname(file);
  const tmp = path.join(dir, `.${path.basename(file)}.${process.pid}.${crypto.randomUUID()}.tmp`);
  const json = JSON.stringify(tasks, null, 2);
  await fs.writeFile(tmp, json, 'utf8');
  await fs.rename(tmp, file);
}

module.exports = { readTasks, writeTasks };
