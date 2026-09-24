const assert = require('node:assert/strict');
const C = require('../dist/coordination/core.js');
let count = 0;
function test(label, run) { run(); count++; console.log('PASS ' + label); }
const change = (s, id, values) => C.updateIntake(s, id, { ...C.intakeOf(s.patients.find(p => p.id === id)), ...values });
test('8人から手続きへ進める5人を抽出し、候補限定の方を先に提案', () => {
  const s = C.receptionSeed(), p = C.receptionPlan(s, 'E1');
  assert.deepEqual(p.proposed, ['P01', 'P03', 'P02', 'P04', 'P05']);
  assert.equal(p.canConfirm, true); assert.equal(p.rows.length, 8);
});
test('相談・未定・案内停止を分け、キャンセル扱いにしない', () => {
  const s = C.receptionSeed(), p = C.receptionPlan(s, 'E1');
  assert.equal(p.rows.find(r => r.patient.id === 'P06').kind, 'consult');
  assert.equal(p.rows.find(r => r.patient.id === 'P07').kind, 'pending');
  assert.equal(p.rows.find(r => r.patient.id === 'P08').kind, 'paused');
  assert.equal(s.patients.length, 8); assert.equal(s.patients[7].assignedEventId, null);
});
test('相談希望へ変えたら提案と確定対象から即時に除外', () => {
  const s = C.receptionSeed(); change(s, 'P01', { readiness: 'consult' });
  assert.equal(C.receptionPlan(s, 'E1').canConfirm, false);
  assert.throws(() => C.confirm(s, 'E1', ['P01', 'P02', 'P03', 'P04', 'P05']));
});
test('案内停止は参加可能と回答済みでも優先', () => {
  const s = C.receptionSeed(); change(s, 'P02', { followup: 'stop' });
  assert(!C.eligible(s, 'E1').some(p => p.id === 'P02'));
  assert.equal(C.receptionPlan(s, 'E1').rows.find(r => r.patient.id === 'P02').kind, 'paused');
});
test('他日程の提案に同意していても、その日程の未回答を参加として数えない', () => {
  const s = C.receptionSeed(); const c = C.candidates(s).find(c => !c.blocked);
  const e = C.hold(s, c.key, '2026-10-03');
  assert.equal(C.receptionPlan(s, e.id).proposed.length, 0);
  assert.equal(s.patients.filter(p => p.assignedEventId).length, 0);
});
test('満員なら次の候補を提案し、柔軟な方も自動で別日に確定しない', () => {
  const s = C.receptionSeed(); change(s, 'P07', { readiness: 'ready', alternatives: 'flexible' }); C.respond(s, 'E1', 'P07', 'yes');
  const p = C.receptionPlan(s, 'E1'); assert.equal(p.readyCount, 6); assert.equal(p.proposed.length, 5);
  assert.match(p.rows.find(r => r.patient.id === 'P07').next, /再回答待ち/);
  assert(s.patients.every(p => p.assignedEventId === null));
});
test('年齢・住所・連絡経路を変えても提案順は変わらない', () => {
  const s = C.receptionSeed(), before = C.receptionPlan(s, 'E1').proposed;
  s.patients.forEach(p => { p.age = '未回答'; p.city = '別の地域'; p.channel = '別経路'; });
  assert.deepEqual(C.receptionPlan(s, 'E1').proposed, before);
});
test('同じ条件なら登録順を保つ', () => {
  const s = C.receptionSeed(); s.patients.forEach(p => { p.intake.alternatives = 'flexible'; });
  assert.deepEqual(C.receptionPlan(s, 'E1').proposed, ['P01', 'P02', 'P03', 'P04', 'P05']);
});
test('提案対象の確定後に重複案内せず、確定済みの希望変更は個別対応', () => {
  const s = C.receptionSeed(); C.confirm(s, 'E1', C.receptionPlan(s, 'E1').proposed);
  const e = C.hold(s, C.candidates(s).find(c => !c.blocked).key, '2026-10-03');
  assert.equal(C.receptionPlan(s, e.id).rows.filter(r => r.kind === 'assigned').length, 5);
  assert.throws(() => change(s, 'P01', { followup: 'stop' }));
});
test('空き時間変更・失効した日程では案内候補を作成しない', () => {
  const s = C.receptionSeed(); C.updateAvailability(s, 'doctor', []);
  assert.equal(C.receptionPlan(s, 'E1').proposed.length, 0);
  const expired = C.receptionSeed(); C.advance(expired); C.advance(expired); C.advance(expired);
  assert.equal(C.receptionPlan(expired, 'E1').proposed.length, 0);
});
test('不正な受付回答を拒否し、既存の希望を壊さない', () => {
  const s = C.receptionSeed(), before = C.copy(s);
  assert.throws(() => change(s, 'P01', { alternatives: '<script>' })); assert.deepEqual(s, before);
});
test('新規エントリーは手続きの意思を未確認として開始', () => {
  const s = C.receptionSeed(), p = C.addPatient(s); C.respond(s, 'E1', p.id, 'yes');
  assert(!C.receptionPlan(s, 'E1').proposed.includes(p.id));
  change(s, p.id, { readiness: 'ready' }); assert(C.eligible(s, 'E1').some(x => x.id === p.id));
});
console.log(`${count} reception domain checks passed.`);
