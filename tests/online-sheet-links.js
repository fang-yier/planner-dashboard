const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

const source = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const sql = fs.readFileSync('docs/supabase/online-sheet-links-migration.sql', 'utf8');

const groupMatch = source.match(/function groupOnlineSheetLinks\([\s\S]*?\n}/);
assert(groupMatch, 'groupOnlineSheetLinks should exist');
const splitMatch = source.match(/function splitOnlineSheetLinkRows\([\s\S]*?\n}/);
assert(splitMatch, 'splitOnlineSheetLinkRows should exist');
const urlMatch = source.match(/function normalizeOnlineLinkUrl\([\s\S]*?\n}/);
assert(urlMatch, 'normalizeOnlineLinkUrl should exist');
const errorMatch = source.match(/function onlineSheetLinkErrorMessage\([\s\S]*?\n}/);
assert(errorMatch, 'onlineSheetLinkErrorMessage should exist');
const categoriesMatch = source.match(/const ONLINE_SHEET_CATEGORIES = \[[^;]+;/);
assert(categoriesMatch, 'ONLINE_SHEET_CATEGORIES should exist');
const pinSettingMatch = source.match(/const ONLINE_LINK_PIN_SETTING_ID = [^;]+;/);
assert(pinSettingMatch, 'ONLINE_LINK_PIN_SETTING_ID should exist');

const sandbox = { URL };
vm.createContext(sandbox);
vm.runInContext(`${categoriesMatch[0]}${groupMatch[0]};${urlMatch[0]};this.groupOnlineSheetLinks=groupOnlineSheetLinks;this.normalizeOnlineLinkUrl=normalizeOnlineLinkUrl;`, sandbox);

const grouped = JSON.parse(JSON.stringify(sandbox.groupOnlineSheetLinks([
  { id: '3', title: 'B', category: '设计', sort_order: 2 },
  { id: '1', title: 'A', category: '页面', sort_order: 1 },
  { id: '2', title: 'C', category: '设计', sort_order: 1 },
], '设计')));
assert.deepStrictEqual(grouped, [
  ['设计', [
    { id: '2', title: 'C', category: '设计', sort_order: 1 },
    { id: '3', title: 'B', category: '设计', sort_order: 2 },
  ]],
  ['页面', [{ id: '1', title: 'A', category: '页面', sort_order: 1 }]],
]);
vm.runInContext(`${pinSettingMatch[0]}${splitMatch[0]};this.splitOnlineSheetLinkRows=splitOnlineSheetLinkRows;`, sandbox);
const split = JSON.parse(JSON.stringify(sandbox.splitOnlineSheetLinkRows([
  { id: '__online_link_pinned_category__', category: '设计' },
  { id: '1', title: 'A', category: '页面' },
])));
assert.deepStrictEqual(split, { links: [{ id: '1', title: 'A', category: '页面' }], pinnedCategory: '设计' });
assert.strictEqual(sandbox.normalizeOnlineLinkUrl('docs.qq.com/sheet/abc'), 'https://docs.qq.com/sheet/abc');
assert.strictEqual(sandbox.normalizeOnlineLinkUrl('javascript:alert(1)'), '');
const errorSandbox = {};
vm.createContext(errorSandbox);
vm.runInContext(`${errorMatch[0]};this.onlineSheetLinkErrorMessage=onlineSheetLinkErrorMessage;`, errorSandbox);
assert(errorSandbox.onlineSheetLinkErrorMessage(new Error('Insert 401 | 响应: {"code":"42501","message":"permission denied for table online_sheet_links"}')).includes('权限未放行'));
assert(errorSandbox.onlineSheetLinkErrorMessage(new Error('Invalid API key')).includes('密钥无效'));
assert(html.includes('<span>在线表链接</span>'));
assert(source.includes("_sbSelect('online_sheet_links')"));
assert(source.includes('data-action="online-link-add"'));
assert(source.includes("case 'online-link-pin-category'"));
assert(source.includes("case 'online-link-unpin-category'"));
assert(source.includes('savePinnedOnlineLinkCategory'));
assert(source.includes('function applyOnlineLinkSearchFilter'));
assert(!/onlineLinkSearch\.oninput[\s\S]{0,320}render\(\)/.test(source), 'search input must not rerender the page');
assert(source.includes("document.activeElement && document.activeElement.id === 'onlineLinkSearch'"));
assert(source.includes('data-online-link-category'));
assert(css.includes('.online-link-category'));
assert(sql.includes('create table if not exists public.online_sheet_links'));
assert(sql.includes('enable row level security'));
assert(sql.includes('create policy online_sheet_links_shared_select'));
assert(sql.includes('create policy online_sheet_links_shared_insert'));
assert(sql.includes('create policy online_sheet_links_shared_update'));
assert(sql.includes('create policy online_sheet_links_shared_delete'));
assert(sql.includes('to anon, authenticated'));
['id', 'title', 'category', 'url', 'description', 'owner', 'sort_order', 'created_at', 'updated_at'].forEach(column => {
  assert(sql.includes(`add column if not exists ${column}`), `migration should repair missing ${column} column`);
});
assert(source.includes('function onlineSheetLinkErrorMessage'));
assert(source.includes('云端字段不完整'));
assert(source.includes('Supabase 密钥无效'));
assert(source.includes("await DB._sbSelect('online_sheet_links')"));

console.log('online-sheet-links: 40 assertions passed');
