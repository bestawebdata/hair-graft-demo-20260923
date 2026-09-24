/* 日程調整のデモ用ドメインロジック。外部接続・永続保存なし。 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CoordinationCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const copy = value => JSON.parse(JSON.stringify(value));
  const dates = ['2026-10-10', '2026-10-11', '2026-10-17', '2026-10-18'];
  function minutes(value) {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new Error('時刻は00:00〜23:59で入力してください。');
    const [h, m] = value.split(':').map(Number); return h * 60 + m;
  }
  function time(value) { return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`; }
  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const d = new Date(`${value}T00:00:00Z`); return !Number.isNaN(d.valueOf()) && d.toISOString().slice(0, 10) === value;
  }
  function addDays(value, n) {
    if (!validDate(value)) throw new Error('日付を確認してください。');
    const d = new Date(`${value}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10);
  }
  const slot = (date, start, end) => ({ date, start, end });
  function seed() {
    return {
      today: '2026-10-01', nextEvent: 2, nextPatient: 9,
      settings: { minimum: 5, blockMinutes: 300, oneVenuePerDay: true },
      doctor: { id: 'ueda', name: '上田 敬博 医師', availability: [slot(dates[0], '10:00', '17:00'), slot(dates[1], '09:00', '17:00'), slot(dates[2], '10:00', '18:00'), slot(dates[3], '09:00', '13:00')] },
      clinics: [
        { id: 'osaka', name: '大阪デモクリニック A', area: '大阪', capacity: 5, active: true, availability: [slot(dates[0], '09:00', '16:00'), slot(dates[2], '09:00', '17:00')] },
        { id: 'itami', name: '伊丹デモ医療機関 B', area: '伊丹', capacity: 5, active: true, availability: [slot(dates[0], '10:00', '18:00'), slot(dates[1], '09:00', '16:00')] },
        { id: 'kobe', name: '神戸デモクリニック C', area: '神戸', capacity: 5, active: true, availability: [slot(dates[2], '10:00', '18:00'), slot(dates[3], '09:00', '18:00')] },
      ],
      patients: Array.from({ length: 8 }, (_, i) => ({ id: `P${String(i + 1).padStart(2, '0')}`, label: `デモ患者 ${String(i + 1).padStart(2, '0')}`, age: i % 3 === 0 ? '60代' : i % 2 === 0 ? '50代' : '40代', city: ['大阪市', '伊丹市', '神戸市'][i % 3], channel: i % 3 === 0 ? 'Web' : 'LINE', assignedEventId: null, intake: { readiness: 'ready', alternatives: 'ask', followup: 'wait' } })),
      events: [{ id: 'E1', clinicId: 'osaka', doctorId: 'ueda', date: dates[0], start: '10:00', end: '15:00', capacity: 5, deadline: '2026-10-03', status: 'held', participants: [] }],
      responses: { E1: { P01: 'yes', P02: 'yes', P03: 'yes', P04: 'yes', P06: 'no' } },
      activity: [{ date: '2026-10-01', message: '大阪会場をデモ内で仮押さえ。参加希望4人からスタートします。' }],
    };
  }
  function log(s, message) { s.activity.unshift({ date: s.today, message }); s.activity = s.activity.slice(0, 30); }
  function getEvent(s, id) { const e = s.events.find(x => x.id === id); if (!e) throw new Error('日程が見つかりません。'); return e; }
  function getPatient(s, id) { const p = s.patients.find(x => x.id === id); if (!p) throw new Error('登録者が見つかりません。'); return p; }
  function covers(rows, e) { return rows.some(r => r.date === e.date && minutes(r.start) <= minutes(e.start) && minutes(r.end) >= minutes(e.end)); }
  function availabilityIssue(s, e) {
    const c = s.clinics.find(x => x.id === e.clinicId);
    if (!c || !c.active) return '医療機関の受け入れ状態を確認してください';
    if (!covers(s.doctor.availability, e)) return '先生の空き時間が変更されています';
    if (!covers(c.availability, e)) return '医療機関の空き時間が変更されています';
    return '';
  }
  function active(e, s) { return (e.status === 'held' && e.deadline >= s.today && e.date > s.today) || (e.status === 'confirmed' && e.date >= s.today); }
  function clash(s, c, excluding = '') {
    return s.events.find(e => e.id !== excluding && active(e, s) && e.date === c.date && (s.settings.oneVenuePerDay || (minutes(e.start) < minutes(c.end) && minutes(c.start) < minutes(e.end))));
  }
  function eventIssue(s, e) {
    if (e.status === 'expired') return '仮押さえ期限切れ';
    if (e.status === 'cancelled') return '仮押さえ解除済み';
    if (e.status === 'held' && e.deadline < s.today) return '仮押さえ期限切れ';
    if (e.date <= s.today && e.status === 'held') return '募集できる日程ではありません';
    return availabilityIssue(s, e) || (clash(s, e, e.id) ? '同日の別会場と重複しています' : '');
  }
  function candidates(s) {
    const result = [], seen = new Set();
    for (const c of s.clinics.filter(x => x.active)) for (const d of s.doctor.availability) for (const r of c.availability) {
      if (d.date !== r.date || d.date <= addDays(s.today, 1)) continue;
      const start = Math.max(minutes(d.start), minutes(r.start)), end = Math.min(minutes(d.end), minutes(r.end));
      if (end - start < s.settings.blockMinutes || c.capacity < s.settings.minimum) continue;
      const item = { clinicId: c.id, doctorId: s.doctor.id, date: d.date, start: time(start), end: time(start + s.settings.blockMinutes), capacity: c.capacity };
      item.key = `${c.id}:${item.date}:${item.start}`;
      if (seen.has(item.key)) continue; seen.add(item.key);
      const booked = clash(s, item);
      item.blocked = booked ? `同日を${s.clinics.find(x => x.id === booked.clinicId).area}会場で確保中` : '';
      item.currentEventId = booked?.clinicId === c.id && booked.start === item.start ? booked.id : null;
      result.push(item);
    }
    return result.sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start) || a.clinicId.localeCompare(b.clinicId));
  }
  function intakeOf(p) { return p.intake || { readiness: 'undecided', alternatives: 'ask', followup: 'wait' }; }
  function eligible(s, eventId) { return s.patients.filter(p => s.responses[eventId]?.[p.id] === 'yes' && intakeOf(p).readiness === 'ready' && intakeOf(p).followup !== 'stop' && intakeOf(p).followup !== 'contact' && (!p.assignedEventId || p.assignedEventId === eventId)); }
  function updateIntake(s, patientId, values) {
    const p = getPatient(s, patientId);
    if (p.assignedEventId) throw new Error('案内先が確定しています。日程変更は運営担当者へ相談する流れです。');
    if (!['ready', 'consult', 'undecided'].includes(values.readiness) || !['limited', 'flexible', 'ask'].includes(values.alternatives) || !['wait', 'contact', 'stop'].includes(values.followup)) throw new Error('受付の希望を選び直してください。');
    p.intake = { readiness: values.readiness, alternatives: values.alternatives, followup: values.followup };
    log(s, `${p.label}の本人回答を反映し、案内候補と次の対応を更新しました（デモ）。`);
  }
  function receptionSeed() {
    const s = seed();
    s.responses.E1 = { P01: 'yes', P02: 'yes', P03: 'yes', P04: 'yes', P05: 'yes', P06: 'yes', P07: 'pending', P08: 'no' };
    s.patients.forEach((p, i) => { p.intake = { readiness: i === 5 ? 'consult' : i === 6 ? 'undecided' : 'ready', alternatives: [0, 2, 5, 7].includes(i) ? 'limited' : i === 6 ? 'ask' : 'flexible', followup: i === 5 ? 'contact' : i === 7 ? 'stop' : 'wait' }; });
    s.activity = [{ date: s.today, message: '8人の受付例を開始。手続きへ進める5人・相談1人・未定1人・本人希望で案内停止1人。すべて架空の回答です。' }];
    return s;
  }
  function receptionPlan(s, eventId) {
    const e = getEvent(s, eventId), issue = eventIssue(s, e) || (e.status !== 'held' ? 'この日程の新しい案内候補は作成できません' : '');
    const rows = s.patients.map((p, order) => {
      const a = intakeOf(p), response = s.responses[e.id]?.[p.id] || 'pending';
      let kind, title, reason, next;
      if (p.assignedEventId) { kind = 'assigned'; title = '案内先確定済み'; reason = 'すでに個別案内対象の日程があります。'; next = '確定済みの案内を確認'; }
      else if (a.followup === 'stop') { kind = 'paused'; title = '本人希望で案内停止'; reason = '本人が「今は案内不要」と回答。登録の削除や治療のキャンセル確定はしません。'; next = '自動の案内対象から外す'; }
      else if (a.readiness === 'consult' || a.followup === 'contact') { kind = 'consult'; title = '個別相談を先に'; reason = '本人が手続き前の相談を希望しています。'; next = '櫻庭さんが条件を確認'; }
      else if (response === 'no') { kind = 'waiting'; title = '別の候補を待つ'; reason = a.alternatives === 'limited' ? 'この候補は都合が合わず、希望条件も限られています。' : 'この候補は都合が合いません。'; next = a.alternatives === 'flexible' ? '別日・別会場を提案' : '条件に合う候補を確認'; }
      else if (a.readiness !== 'ready' || response !== 'yes') { kind = 'pending'; title = '本人の回答待ち'; reason = 'この日程で手続きに進めるという回答がそろっていません。'; next = '意思・日程を確認する案内'; }
      else { kind = 'ready'; title = '手続きの案内へ進める'; reason = a.alternatives === 'limited' ? 'この日程で参加可能。別の候補が難しいため先に案内を提案します。' : a.alternatives === 'flexible' ? 'この日程で参加可能。代案も受け取れますが、別日への変更には再回答が必要です。' : 'この日程で参加可能。他の候補へ変える場合は希望の確認が必要です。'; next = '今回の日程を案内'; }
      return { patient: p, kind, title, reason, next, order, response, intake: a };
    });
    const priority = { ready: 0, consult: 1, pending: 2, waiting: 3, paused: 4, assigned: 5 };
    rows.sort((a, b) => priority[a.kind] - priority[b.kind] || (a.kind === 'ready' ? Number(b.intake.alternatives === 'limited') - Number(a.intake.alternatives === 'limited') : 0) || a.order - b.order);
    const ready = rows.filter(r => r.kind === 'ready');
    const proposed = issue ? [] : ready.slice(0, e.capacity).map(r => r.patient.id);
    for (const row of ready) if (!proposed.includes(row.patient.id)) row.next = issue ? '日程を再調整してから案内' : row.intake.alternatives === 'flexible' ? '次の候補を提案（再回答待ち）' : '次の空き枠を待つ';
    return { event: e, issue, rows, proposed, readyCount: ready.length, canConfirm: !issue && proposed.length >= s.settings.minimum };
  }
  function readiness(s, e) {
    const issue = eventIssue(s, e), count = eligible(s, e.id).length;
    return { count, issue, ready: e.status === 'held' && !issue && count >= s.settings.minimum, remaining: Math.max(0, s.settings.minimum - count) };
  }
  function hold(s, key, deadline) {
    const c = candidates(s).find(x => x.key === key);
    if (!c || c.blocked) throw new Error('この候補は現在確保できません。空き時間を再確認してください。');
    if (!validDate(deadline) || deadline <= s.today || deadline >= c.date) throw new Error('仮押さえ期限は、明日以降・開催日の前日までで設定してください。');
    const { blocked, currentEventId, key: ignored, ...fields } = c;
    const e = { ...fields, id: `E${s.nextEvent++}`, deadline, status: 'held', participants: [] };
    s.events.push(e); s.responses[e.id] = {}; log(s, `${c.date}・${s.clinics.find(x => x.id === c.clinicId).area}を仮押さえ。患者向け候補に反映しました（デモ内）。`); return e;
  }
  function respond(s, eventId, patientId, value) {
    const e = getEvent(s, eventId), p = getPatient(s, patientId);
    if (!['yes', 'no', 'pending'].includes(value)) throw new Error('回答を選んでください。');
    if (e.status !== 'held' || eventIssue(s, e)) throw new Error('この日程の回答受付は停止しています。');
    if (p.assignedEventId) throw new Error('案内先が確定しています。運営担当者へご相談ください。');
    s.responses[e.id] ||= {}; s.responses[e.id][p.id] = value;
    log(s, `${p.label}が${e.date}の候補に回答。手続きの案内へ進める方は現在${eligible(s, e.id).length}人です。`);
  }
  function confirm(s, eventId, ids) {
    const e = getEvent(s, eventId), ready = readiness(s, e), selected = new Set(ids);
    if (!ready.ready) throw new Error(ready.issue || '開催条件がまだ整っていません。');
    if (ids.length !== selected.size || selected.size < s.settings.minimum || selected.size > e.capacity) throw new Error(`重複なく${s.settings.minimum}〜${e.capacity}人を選んでください。`);
    const allowed = new Set(eligible(s, eventId).map(p => p.id));
    if ([...selected].some(id => !allowed.has(id))) throw new Error('参加希望・他の日程の確定状態が変わりました。');
    e.status = 'confirmed'; e.participants = [...selected];
    for (const id of selected) getPatient(s, id).assignedEventId = e.id;
    log(s, `${e.date}・${s.clinics.find(c => c.id === e.clinicId).area}の開催を確定。${selected.size}人を個別案内対象にしました。送信・施術予約は未実施です。`);
  }
  function release(s, id) { const e = getEvent(s, id); if (e.status !== 'held') throw new Error('募集中の仮押さえだけ解除できます。'); e.status = 'cancelled'; log(s, `${e.date}の仮押さえを解除。回答履歴を残し、募集を停止しました。`); }
  function updateAvailability(s, provider, rows) {
    const entity = provider === 'doctor' ? s.doctor : s.clinics.find(c => c.id === provider);
    if (!entity) throw new Error('回答者を確認してください。');
    for (const row of rows) if (!validDate(row.date) || minutes(row.end) <= minutes(row.start)) throw new Error('日付と開始・終了時刻を確認してください。');
    if (new Set(rows.map(r => r.date)).size !== rows.length) throw new Error('同じ日付が重複しています。');
    entity.availability = copy(rows); log(s, `${entity.name}の空き時間を更新し、候補日を自動で再計算しました。`);
  }
  function advance(s) {
    s.today = addDays(s.today, 1);
    for (const e of s.events) if (e.status === 'held' && (e.deadline < s.today || e.date <= s.today)) { e.status = 'expired'; log(s, `${e.date}の仮押さえが期限切れ。募集を停止し、デモ内の確保枠を解放しました。`); }
  }
  function addPatient(s) {
    const n = String(s.nextPatient++).padStart(2, '0'), p = { id: `P${n}`, label: `デモ患者 ${n}`, age: '50代', city: '未指定', channel: 'Web', assignedEventId: null, intake: { readiness: 'undecided', alternatives: 'ask', followup: 'wait' } };
    s.patients.push(p); log(s, `${p.label}が新規エントリー。地域の希望は聞かず、候補日の案内対象に追加しました。`); return p;
  }
  return { seed, copy, dates, minutes, time, addDays, candidates, eligible, readiness, eventIssue, availabilityIssue, hold, respond, confirm, release, updateAvailability, advance, addPatient, intakeOf, updateIntake, receptionSeed, receptionPlan };
});
