const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

const source = fs.readFileSync('app.js', 'utf8');
const match = source.match(/function deriveGoalProgressState\([\s\S]*?\n}/);
assert(match, 'deriveGoalProgressState should exist');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${match[0]}; this.deriveGoalProgressState = deriveGoalProgressState;`, sandbox);
const derive = tasks => JSON.parse(JSON.stringify(sandbox.deriveGoalProgressState(tasks)));

assert.deepStrictEqual(derive([]), { progress: 0, status: '未开始' });
assert.deepStrictEqual(derive([{ completion_rate: 0 }, { completion_rate: 0.5 }]), { progress: 0.25, status: '进行中' });
assert.deepStrictEqual(derive([{ completion_rate: 1 }, { completion_rate: 1 }]), { progress: 1, status: '已完成' });
assert.deepStrictEqual(derive([{ completion_rate: 1 }, { completion_rate: 0.8 }]), { progress: 0.9, status: '进行中' });
assert(source.includes('syncAllGoalProgressStates();'));
assert((source.match(/\['未开始','进行中','已完成','已暂停'\]/g) || []).length === 2);

console.log('goal-status-sync: 7 assertions passed');
