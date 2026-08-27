const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

const source = fs.readFileSync('app.js', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const match = source.match(/function buildBoardLoad\([\s\S]*?\n}/);
assert(match, 'buildBoardLoad should exist');

const sandbox = { normalizeStatus: status => status === '已阻塞' ? '打白工' : status };
vm.createContext(sandbox);
vm.runInContext(`${match[0]}; this.buildBoardLoad = buildBoardLoad;`, sandbox);

const goals = [
  { id: 'g1', board: '页面' },
  { id: 'g2', board: '设计' },
  { id: 'g3', board: '' },
];
const tasks = [
  { goal_id: 'g1', status: '未开始' },
  { goal_id: 'g1', status: '进行中' },
  { goal_id: 'g1', status: '审核中' },
  { goal_id: 'g2', status: '待上线' },
  { goal_id: 'g2', status: '已完成' },
  { goal_id: 'missing', status: '打白工' },
  { goal_id: 'g3', status: '已阻塞' },
  { goal_id: '', status: '进行中' },
];

const actual = JSON.parse(JSON.stringify(sandbox.buildBoardLoad(tasks, goals)));
assert.deepStrictEqual(actual, [
  ['页面', { total: 3, done: 0, doing: 1, review: 1, release: 0, todo: 1, blocked: 0 }],
  ['设计', { total: 2, done: 1, doing: 0, review: 0, release: 1, todo: 0, blocked: 0 }],
]);
assert(!actual.some(([board]) => board === '未关联板块'));
assert(source.includes('板块需求分布'));
assert(source.includes('${boardBarsHtml'));
assert(css.includes('.grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-bottom:16px}'));

console.log('board-demand-distribution: 6 assertions passed');
