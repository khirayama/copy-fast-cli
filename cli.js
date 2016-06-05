#!/usr/bin/env node
const chalk = require('chalk');
const logUpdate = require('log-update');
const ora = require('ora');
const api = require('./api');

let data = {};
const spinner = ora();

const speed = () => chalk[data.isDone ? 'green' : 'cyan'](data.speed + ' ' + chalk.dim(data.unit)) + '\n\n';

function exit() {
  logUpdate('\n\n    ' + speed());
  process.exit();
}

setInterval(() => {
  const pre = '\n\n  ' + chalk.gray.dim(spinner.frame());

  if (!data.speed) {
    logUpdate(pre + '\n');
    return;
  }
  logUpdate(pre + speed());
}, 50);

let timeout;

api((err, result) => {
  data = result;

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    data.isDone = true;
    exit();
  }, 5000);
  if (data.isDone) {
    exit();
  }
});
