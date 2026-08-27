const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

const source = fs.readFileSync('app.js', 'utf8');
const match = source.match(/function taskGoalLinkVisible\([\s\S]*?\n}/);
assert(match, 'taskGoalLinkVisible should exist');
const labelMatch = source.match(/function taskGoalOptionLabel\([\s\S]*?\n}/);
assert(labelMatch, 'taskGoalOptionLabel should exist');

const sandbox = {
  goalPeriod: goal => String(goal && goal.month || '').trim(),
  isWeekGoal: goal => /^\d{4}-W\d{2}$/.test(String(goal && goal.month || '').trim()),
  goalTaskRange: goal => ({ end: goal.period_end }),
};
vm.createContext(sandbox);
vm.runInContext(`${match[0]}; this.taskGoalLinkVisible = taskGoalLinkVisible;`, sandbox);
vm.runInContext(`${labelMatch[0]}; this.taskGoalOptionLabel = taskGoalOptionLabel;`, sandbox);

const visible = sandbox.taskGoalLinkVisible;
const args = ['2026-W34', '2026-08', '2026-08-18'];

assert.strictEqual(visible({ id: 'w1', month: '2026-W34', status: '进行中', period_end: '2026-08-23' }, '', ...args), true);
assert.strictEqual(visible({ id: 'm1', month: '2026-08', status: '进行中', period_end: '2026-08-31' }, '', ...args), true);
assert.strictEqual(visible({ id: 'future-week', month: '2026-W36', status: '进行中', period_end: '2026-09-06' }, '', ...args), true);
assert.strictEqual(visible({ id: 'future-month', month: '2026-09', status: '进行中', period_end: '2026-09-30' }, '', ...args), false);
assert.strictEqual(visible({ id: 'old', month: '2026-W33', status: '进行中', period_end: '2026-08-16' }, '', ...args), false);
assert.strictEqual(visible({ id: 'done', month: '2026-08', status: '已完成', period_end: '2026-08-31' }, '', ...args), false);
assert.strictEqual(visible({ id: 'expired', month: '2026-08', status: '进行中', period_end: '2026-08-17' }, '', ...args), false);
assert.strictEqual(visible({ id: 'old-linked', month: '2026-W33', status: '已完成', period_end: '2026-08-16' }, 'old-linked', ...args), true);
assert.strictEqual(visible({ id: 'profile', month: '2026-08', status: '__profile__', period_end: '2026-08-31' }, 'profile', ...args), false);
assert.strictEqual(sandbox.taskGoalOptionLabel({ id: 'week-34', month: '2026-W34', name: '111' }), '【W34周目标】111');
assert.strictEqual(sandbox.taskGoalOptionLabel({ id: 'month-8', month: '2026-08', name: '333' }), '【2026-08月目标】333');

console.log('task-goal-link-filter: 13 assertions passed');
