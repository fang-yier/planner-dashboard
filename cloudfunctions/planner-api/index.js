const { tcb } = require('tencentcloud-sdk-nodejs-tcb');

const ENV_ID = 'mac-worker-d6gqjxsfo1cfad0e9';
const TABLES = { monthly_goals:'planner_monthly_goals', daily_tasks:'planner_daily_tasks', online_sheet_links:'planner_online_sheet_links' };
const FAILOVER_TABLE = 'planner_failover_operations';

function client() { return new tcb.v20180608.Client({ credential:{ secretId:process.env.TENCENTCLOUD_SECRETID, secretKey:process.env.TENCENTCLOUD_SECRETKEY, token:process.env.TENCENTCLOUD_SESSIONTOKEN }, region:'ap-shanghai', profile:{ httpProfile:{ endpoint:'tcb.tencentcloudapi.com' } } }); }
function response(statusCode, body) {
  return { statusCode, headers:{ 'content-type':'application/json; charset=utf-8', 'access-control-allow-origin':'*', 'access-control-allow-methods':'GET,POST,PATCH,DELETE,OPTIONS', 'access-control-allow-headers':'content-type' }, body:JSON.stringify(body) };
}
function parseBody(event) {
  if (!event.body) return {};
  if (typeof event.body === 'object') return event.body;
  return JSON.parse(event.isBase64Encoded ? Buffer.from(event.body,'base64').toString('utf8') : event.body);
}
function literal(value) { return `'${String(value).replace(/'/g,"''")}'`; }
function cleanRow(value) { const row={...(value||{})}; delete row._id; return row; }
async function sql(statement) { return client().ExecutePGSql({ EnvId:ENV_ID, Sql:statement }); }
async function ensureFailoverTable() {
  await sql(`CREATE TABLE IF NOT EXISTS ${FAILOVER_TABLE}(op_id TEXT PRIMARY KEY,table_name TEXT NOT NULL,operation TEXT NOT NULL,payload JSONB NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()); ALTER TABLE ${FAILOVER_TABLE} ADD COLUMN IF NOT EXISTS sequence_no BIGSERIAL; ALTER TABLE ${FAILOVER_TABLE} ADD COLUMN IF NOT EXISTS record_id TEXT; ALTER TABLE ${FAILOVER_TABLE} ADD COLUMN IF NOT EXISTS base_version BIGINT NOT NULL DEFAULT 0; ALTER TABLE ${FAILOVER_TABLE} ADD COLUMN IF NOT EXISTS occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(); CREATE UNIQUE INDEX IF NOT EXISTS planner_failover_operations_sequence_uidx ON ${FAILOVER_TABLE}(sequence_no)`);
}
function resultRows(result) {
  const columns=result.Columns||[];
  return (result.Rows||[]).map(raw=>{ const values=JSON.parse(raw); return Object.fromEntries(columns.map((column,index)=>[column,values[index]])); });
}

exports.main = async event => {
  const method=String(event.httpMethod||event.requestContext?.httpMethod||'GET').toUpperCase();
  if (method==='OPTIONS') return response(204,{});
  try {
    const body=parseBody(event);
    const action=body.action||event.queryStringParameters?.action||'list';
    if (action==='pending_failover') {
      await ensureFailoverTable();
      const rows=resultRows(await sql(`SELECT op_id,table_name,operation,payload,record_id,base_version,occurred_at,created_at FROM ${FAILOVER_TABLE} ORDER BY sequence_no`));
      return response(200,{data:rows.map(row=>({...row,payload:typeof row.payload==='string'?JSON.parse(row.payload):row.payload}))});
    }
    if (action==='ack_failover') {
      await ensureFailoverTable();
      const opIds=Array.isArray(body.op_ids)?[...new Set(body.op_ids.filter(value=>typeof value==='string'&&value))]:[];
      if (!opIds.length) return response(400,{error:'缺少已确认的 op_ids'});
      const values=opIds.map(literal).join(',');
      await sql(`BEGIN; LOCK TABLE ${FAILOVER_TABLE} IN ACCESS EXCLUSIVE MODE; DELETE FROM ${FAILOVER_TABLE} WHERE op_id IN (${values}); DO $$ BEGIN IF NOT EXISTS(SELECT 1 FROM ${FAILOVER_TABLE}) THEN TRUNCATE TABLE ${TABLES.monthly_goals},${TABLES.daily_tasks},${TABLES.online_sheet_links}; END IF; END $$; COMMIT;`);
      return response(200,{data:{acknowledged:opIds}});
    }
    const tableName=body.table||event.queryStringParameters?.table;
    const table=TABLES[tableName];
    if (!table) return response(400,{error:'不支持的数据表'});
    if (action==='stage') {
      await ensureFailoverTable();
      const operation=body.operation;
      const payload=cleanRow(body.payload);
      const opId=body.op_id||`${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const recordId=payload.row?.id||payload.id||'';
      const baseVersion=Number(body.base_version)||0;
      let mutation='';
      if (operation==='save') {
        const row=cleanRow(payload.row);
        if (!row.id) return response(400,{error:'缺少 id'});
        const createdAt=/^\d{4}-\d{2}-\d{2}T/.test(row.created_at||'')?literal(row.created_at):'now()';
        mutation=`INSERT INTO ${table}(id,data,created_at) VALUES(${literal(row.id)},${literal(JSON.stringify(row))}::jsonb,${createdAt}) ON CONFLICT(id) DO UPDATE SET data=EXCLUDED.data,created_at=EXCLUDED.created_at`;
      } else if (operation==='update') {
        if (!payload.id) return response(400,{error:'缺少 id'});
        mutation=`UPDATE ${table} SET data=data||${literal(JSON.stringify(cleanRow(payload.patch)))}::jsonb WHERE id=${literal(payload.id)}`;
      } else if (operation==='delete') {
        if (!payload.id) return response(400,{error:'缺少 id'});
        mutation=`DELETE FROM ${table} WHERE id=${literal(payload.id)}`;
      } else return response(400,{error:'不支持的临时操作'});
      await sql(`BEGIN; ${mutation}; INSERT INTO ${FAILOVER_TABLE}(op_id,table_name,operation,payload,record_id,base_version,occurred_at) VALUES(${literal(opId)},${literal(tableName)},${literal(operation)},${literal(JSON.stringify(payload))}::jsonb,${literal(recordId)},${baseVersion},now()) ON CONFLICT(op_id) DO NOTHING; COMMIT;`);
      return response(200,{data:{op_id:opId,staged:true}});
    }
    if (action==='list') {
      const rows=resultRows(await sql(`SELECT data FROM ${table} ORDER BY created_at DESC`));
      return response(200,{data:rows.map(row=>typeof row.data==='string'?JSON.parse(row.data):row.data)});
    }
    if (action==='get') {
      const rows=resultRows(await sql(`SELECT data FROM ${table} WHERE id=${literal(body.id)} LIMIT 1`));
      const value=rows[0]?.data;
      return response(200,{data:value?(typeof value==='string'?JSON.parse(value):value):null});
    }
    if (action==='save') {
      const row=cleanRow(body.row);
      if (!row.id) return response(400,{error:'缺少 id'});
      const createdAt=/^\d{4}-\d{2}-\d{2}T/.test(row.created_at||'')?literal(row.created_at):'now()';
      await sql(`INSERT INTO ${table}(id,data,created_at) VALUES(${literal(row.id)},${literal(JSON.stringify(row))}::jsonb,${createdAt}) ON CONFLICT(id) DO UPDATE SET data=EXCLUDED.data,created_at=EXCLUDED.created_at`);
      return response(200,{data:row});
    }
    if (action==='update') {
      if (!body.id) return response(400,{error:'缺少 id'});
      const patch=cleanRow(body.patch); delete patch.id;
      await sql(`UPDATE ${table} SET data=data||${literal(JSON.stringify(patch))}::jsonb WHERE id=${literal(body.id)}`);
      return response(200,{data:{...patch,id:body.id}});
    }
    if (action==='delete') {
      if (!body.id) return response(400,{error:'缺少 id'});
      await sql(`DELETE FROM ${table} WHERE id=${literal(body.id)}`);
      return response(200,{data:{id:body.id}});
    }
    return response(400,{error:'不支持的操作'});
  } catch(error) { console.error(error); return response(500,{error:error.message||'CloudBase PostgreSQL 服务异常'}); }
};
