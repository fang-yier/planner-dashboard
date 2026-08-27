const fs = require('fs');
const assert = require('assert');

const css = fs.readFileSync('style.css', 'utf8');
const source = fs.readFileSync('app.js', 'utf8');

assert(css.includes('.dashboard-goal-slide .goal-board-card{padding:8px}'));
assert(css.includes('.dashboard-goal-slide .owner-card-head{gap:8px;margin-bottom:5px}'));
assert(css.includes('.dashboard-goal-slide .owner-avatar{width:30px;height:30px;font-size:13px}'));
assert(css.includes('.dashboard-goal-slide .owner-progress{height:3px;margin-bottom:5px}'));
assert(css.includes('.dashboard-goal-slide .goal-board-period{padding-top:6px;margin-top:6px}'));
assert(css.includes('.dashboard-goal-title-line{display:flex;align-items:baseline;gap:6px;min-width:0;flex:1}'));
assert(css.includes('.dashboard-goal-title-line .dashboard-target-goal-desc{min-width:0;flex:1;margin:0}'));
assert(!css.includes('.dashboard-goal-slide .dashboard-target-goal-desc{display:none}'));
assert(source.includes('class="dashboard-goal-board-head"'));
assert(source.includes('class="dashboard-goal-inline-progress"'));
assert(source.includes("manage ? `<div class=\"owner-card-head\">"));
assert(/dashboard-goal-title-line[\s\S]{0,300}dashboard-target-goal-desc[\s\S]{0,200}dashboard-goal-owner-tags/.test(source));

console.log('dashboard-goal-compact: 12 assertions passed');
