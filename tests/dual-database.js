const fs = require('fs');
const assert = require('assert');

const app = fs.readFileSync('app.js', 'utf8');

assert(app.includes("giovhqojkpistbkneriv.supabase.co"));
assert(app.includes("/rest/v1/${table}?order=created_at.desc"));
assert(app.includes("method: 'POST', headers: this._sbHeaders()"));
assert(app.includes("method: 'PATCH', headers"));
assert(app.includes("method: 'DELETE', headers"));
assert(app.includes("_failoverQueueKey: 'wb_failover_queue'"));
assert(app.includes('async _stageFailover(table, operation, payload, baseVersion = 0)'));
assert(app.includes('async _flushLocalFailoverToCloud()'));
assert(app.includes('if (this._failoverRecovering || this._failoverTransferring)'));
assert(app.includes("await this._cloudRequest(item.table, 'stage', { op_id: item.op_id"));
assert(app.includes('entry.op_id !== item.op_id'));
assert(app.includes('async _recoverSupabaseFromFailover()'));
assert(app.includes("this._cloudRequest(item.table, 'stage'"));
assert(app.includes("this._cloudRequest('monthly_goals', 'pending_failover')"));
assert(app.includes("this._cloudRequest('monthly_goals', 'ack_failover'"));
assert(!app.includes("this._cloudRequest('monthly_goals', 'clear_failover')"));
assert(app.includes('async _verifySupabaseOperation(item)'));
assert(app.includes('error.unavailable = r.status === 429 || r.status >= 500'));
assert(app.includes('_cachedSyncRow(table, id)'));
assert(app.includes('sync_version=eq.${baseVersion}'));
assert(app.includes("Prefer: 'return=representation'"));
assert(app.includes("_recordSyncConflict(item, current)"));
assert(app.includes("planner_sync_tombstones"));
assert(app.includes('current?.last_op_id === item.op_id'));
assert(app.includes('Supabase 主库'));
assert(app.includes('CloudBase 备份'));

console.log('dual-database: 24 assertions passed');
