const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const app = fs.readFileSync('app.js', 'utf8');
const start = app.indexOf('function completionRateForStatus');
const end = app.indexOf('function syncProgressToStatus', start);
assert(start >= 0 && end > start, 'completionRateForStatus helper must exist');
const derive = vm.runInNewContext(`${app.slice(start, end)}; completionRateForStatus`);
const average = vm.runInNewContext(`${app.slice(start, end)}; averageTaskCompletion`);
const completedCount = vm.runInNewContext(`${app.slice(start, end)}; completedTaskCount`);

assert.strictEqual(derive('审核中', 0.2), 0.9);
assert.strictEqual(derive('待上线', 0.2), 1);
assert.strictEqual(derive('已完成', 0.2), 1);
assert.strictEqual(derive('打白工', 0.2), 1);
assert.strictEqual(derive('未开始', 0.2), 0);
assert.strictEqual(derive('进行中', 0.4), 0.4);
for (const status of ['未开始','进行中','审核中','待上线','已完成','打白工']) {
  assert.strictEqual(derive(status, 1), 1, `manual 100% must survive status ${status}`);
}

assert(app.includes("completionRateForStatus(newStatus, currentTask?.completion_rate)"));
assert(app.includes("completionRateForStatus(status, data.completion_rate)"));
assert.strictEqual(average([{ completion_rate: 1 }, { completion_rate: 0.9 }, { completion_rate: 0 }]), 1.9 / 3);
assert.strictEqual(completedCount([{ completion_rate: 1 }, { completion_rate: 0.9 }, { completion_rate: 1 }]), 2);
assert(app.includes('const r = averageTaskCompletion(ownerTasks)'));
assert(app.includes('sum: 0'));

console.log('task-progress-status: 18 assertions passed');
