const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

const source = fs.readFileSync('app.js', 'utf8');
const match = source.match(/function groupGoalsByPeriod\([\s\S]*?\n}/);
assert(match, 'groupGoalsByPeriod should exist');

const sandbox = { goalPeriod: goal => String(goal && goal.month || '').trim() };
vm.createContext(sandbox);
vm.runInContext(`${match[0]}; this.groupGoalsByPeriod = groupGoalsByPeriod;`, sandbox);
const goals = [
  { id: 'a', month: '2026-W34' },
  { id: 'b', month: '2026-W35' },
  { id: 'c', month: '2026-W34' },
  { id: 'd', month: '' },
];
const grouped = JSON.parse(JSON.stringify(sandbox.groupGoalsByPeriod(goals)));

assert.deepStrictEqual(grouped.map(group => group.period), ['2026-W35', '2026-W34', '未设置时间']);
assert.deepStrictEqual(grouped[1].goals.map(goal => goal.id), ['a', 'c']);
assert(source.includes("renderGoalManagementPeriods(goals, 'week')"));
assert(source.includes("renderGoalManagementPeriods(goals, 'month')"));
assert(source.includes("renderGoalBoardGroups(weekGoals, 'week')"));
assert(source.includes("renderGoalBoardGroups(monthGoals, 'month')"));

console.log('management-goal-periods: 7 assertions passed');
