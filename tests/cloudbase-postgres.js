const fs = require('fs');
const assert = require('assert');

const app = fs.readFileSync('app.js', 'utf8');
const api = fs.readFileSync('cloudfunctions/planner-api/index.js', 'utf8');

assert(app.includes("https://the-o-d8gur95h32177d721.service.tcloudbase.com/the-o/api"));
assert(app.includes("_cloudRequest(table, action"));
assert(app.includes('isOnline() { return true; }'));
assert(app.includes("_failoverQueueKey: 'wb_failover_queue'"));
assert(api.includes("planner_monthly_goals"));
assert(api.includes("planner_daily_tasks"));
assert(api.includes("planner_online_sheet_links"));
assert(api.includes('ExecutePGSql'));
assert(api.includes("ON CONFLICT(id) DO UPDATE"));
assert(api.includes("planner_failover_operations"));
assert(api.includes("action==='ack_failover'"));
assert(api.includes('LOCK TABLE'));
assert(api.includes('body.op_ids'));
assert(api.includes('sequence_no'));
assert(api.includes('base_version'));
assert(api.includes('ORDER BY sequence_no'));

console.log('cloudbase-postgres: 16 assertions passed');
