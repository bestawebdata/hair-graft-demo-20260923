(() => {
  'use strict';
  const C = window.CoordinationCore, $ = s => document.querySelector(s);
  let state = C.seed(), view = 'admin', provider = 'doctor', patientId = 'P05', receptionEventId = 'E1', lastFocus = null, toastTimer;
  const esc = x => String(x ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const date = iso => new Intl.DateTimeFormat('ja-JP', { month: 'long', day: 'numeric', weekday: 'short', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
  const shortDate = iso => `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))}`;
  const clinic = id => state.clinics.find(c => c.id === id);
  const currentPatient = () => state.patients.find(p => p.id === patientId);
  const event = id => state.events.find(e => e.id === id);
  const button = (label, action, id = '', style = '', disabled = false) => `<button type="button" class="button ${style}" data-action="${action}" data-id="${esc(id)}"${disabled ? ' disabled' : ''}>${label}</button>`;
  function toast(message) { $('#toast').textContent = message; $('#toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 5000); }
  function status(e) {
    if (e.status === 'expired') return { text: '期限切れ', className: 'neutral' };
    if (e.status === 'cancelled') return { text: '解除済み', className: 'neutral' };
    if (e.status === 'confirmed' && e.date < state.today) return { text: '日程経過', className: 'neutral' };
    const r = C.readiness(state, e);
    if (r.issue) return { text: '要再調整', className: 'alert' };
    if (e.status === 'confirmed') return { text: '開催確定', className: 'success' };
    return r.ready ? { text: '開催判断へ', className: 'success' } : { text: '参加希望受付中', className: 'amber' };
  }
  const badge = s => `<span class="badge ${s.className}">${s.text}</span>`;
  function showView(next, focus = true) {
    view = next;
    for (const key of ['admin', 'providers', 'patient', 'reception']) $(`#${key}-view`).hidden = key !== next;
    document.querySelectorAll('[data-view]').forEach(b => b.dataset.view === next ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current'));
    const titles = { admin: ['日程調整を、ひとつの画面で。', '先生と医療機関の空き時間を照合。参加希望を集め、開催の判断につなげます。'], providers: ['空き時間の回答が、候補日になる。', '先生・医療機関それぞれの回答を変更して、自動照合の動きをお試しください。'], patient: ['候補日を見て、参加希望を回答。', '患者さんには会場と日程を案内。人数や内部の調整状況は表示しません。'] };
    titles.reception = ['受付の判断を、次の案内につなぐ。', '本人の回答から、予約を希望する方・まず相談したい方・次の日程を待つ方を整理します。'];
    $('#page-title').textContent = titles[next][0]; $('#page-intro').textContent = titles[next][1];
    if (focus) $('#main').focus();
  }
  const intakeLabels = { readiness: { ready: '日時と場所が合えば予約したい', consult: '担当者に相談してから決めたい', undecided: 'まだ検討中' }, alternatives: { limited: 'ほかの日時・会場は希望しない', flexible: 'ほかの日時・会場も相談できる', ask: '変更する場合は先に相談したい' }, followup: { wait: '今後の日程案内を受け取る', contact: '案内の前に担当者と相談したい', stop: 'いったん日程案内を止めたい' } };
  function intakeFields(p) {
    const values = C.intakeOf(p);
    return `<div class="intake-fields">${[['readiness', '予約についてのお気持ち'], ['alternatives', 'ほかの日時・会場でもよいですか？'], ['followup', '今後のご案内']].map(([key, label]) => `<label>${label}<select name="${key}" required>${Object.entries(intakeLabels[key]).map(([value, text]) => `<option value="${value}"${values[key] === value ? ' selected' : ''}>${text}</option>`).join('')}</select></label>`).join('')}</div>`;
  }
  function patientIntake(p) {
    if (p.assignedEventId) return '';
    return `<details class="patient-intake"><summary>受付の希望を伝える・変更する</summary><p>予約を進めたいか、ほかの日時・会場も相談できるかをお知らせください。日時を変えるときは、あらためてご都合を確認します。</p><form id="patient-intake-form"><input type="hidden" name="patientId" value="${p.id}">${intakeFields(p)}<button type="submit" class="button outline">受付の希望を反映する〈デモ〉</button></form></details>`;
  }
  function receptionHTML() {
    const events = state.events.filter(e => e.status === 'held');
    const sample = `<div class="guide-card"><div><b>8人の受付例で試す</b><p>予約を希望する5人、まず相談したい1人、まだ決めていない1人、案内を止めたい1人。架空の回答を読み込めます。</p></div>${button('8人の受付例を読み込む', 'reception-sample', '', 'outline')}</div>`;
    if (!events.length) return `${sample}<div class="empty-state"><h2>次の募集日程をお待ちください。</h2><p>運営画面で日程を仮押さえすると、受付状況から案内候補を提案します。確定済みの対象者は運営画面で確認できます。</p></div>`;
    if (!events.some(e => e.id === receptionEventId)) receptionEventId = events[0].id;
    const plan = C.receptionPlan(state, receptionEventId), e = plan.event;
    return `${sample}<div class="reception-overview panel"><div><p class="eyebrow">RECEPTION ASSIST</p><h2>この日程で、誰に何を案内するか。</h2><p>この日時に来院でき、予約を希望する方を一覧にします。ほかの日時・会場を希望しない方から順にご案内する提案です。</p></div><label>確認する日程<select id="reception-event">${events.map(x => `<option value="${x.id}"${x.id === e.id ? ' selected' : ''}>${date(x.date)}・${esc(clinic(x.clinicId).area)}</option>`).join('')}</select></label></div>
      <div class="reception-summary"><div><span>今回の案内候補</span><strong>${plan.proposed.length}<small>人 / ${e.capacity}枠</small></strong></div><div><span>相談・回答の確認</span><strong>${plan.rows.filter(r => ['consult', 'pending'].includes(r.kind)).length}<small>人</small></strong></div><div><span>次回待ち・案内停止</span><strong>${plan.rows.filter(r => ['waiting', 'paused'].includes(r.kind) || (r.kind === 'ready' && !plan.proposed.includes(r.patient.id))).length}<small>人</small></strong></div></div>
      <div class="reception-decision panel"><div><b>${plan.issue ? '日程の確認が必要です。' : plan.canConfirm ? `${plan.proposed.length}人の案内候補がそろいました。` : '本人の回答・開催条件がそろうのを待ちます。'}</b><p>${plan.issue ? esc(plan.issue) : '提案を確認し、必要に応じて対象者を変更してから開催を確定できます。'}</p></div>${button('提案した対象者で開催確認へ', 'confirm', e.id, '', !plan.canConfirm)}</div>
      <p class="section-note reception-rule">ご案内の順番：この日時で来院でき、予約を希望する方が対象です。その中で、ほかの日時・会場を希望しない方を先にします。同じ条件なら登録順です。日時を変更するときは、ご本人に確認します。</p>
      <div class="reception-grid">${plan.rows.map((r, i) => `<article class="reception-card ${plan.proposed.includes(r.patient.id) ? 'proposed' : ''}" data-patient="${r.patient.id}"><div class="card-top"><b>${esc(r.patient.label)}</b>${badge({ text: plan.proposed.includes(r.patient.id) ? `案内候補 ${plan.proposed.indexOf(r.patient.id) + 1}` : r.title, className: plan.proposed.includes(r.patient.id) ? 'success' : r.kind === 'consult' ? 'amber' : 'neutral' })}</div><dl><div><dt>来院</dt><dd>${({ yes: 'この日時で来院できる', no: 'この日時は来院できない', pending: 'まだ決まっていない・未回答' })[r.response]}</dd></div><div><dt>予約の希望</dt><dd>${esc(r.intake.readiness === 'ready' && r.response === 'yes' ? 'この日時で予約を進めたい' : intakeLabels.readiness[r.intake.readiness])}</dd></div><div><dt>日時・会場の変更</dt><dd>${esc(intakeLabels.alternatives[r.intake.alternatives])}</dd></div></dl><p class="reception-reason">${esc(r.reason)}</p><p class="reception-next"><span>次の対応</span>${esc(r.next)}</p><div class="reception-actions">${button('本人回答を変更', 'intake-edit', r.patient.id, 'quiet', Boolean(r.patient.assignedEventId))}${button('対応文を見る', 'intake-message', r.patient.id, 'text', Boolean(plan.issue) || r.kind === 'paused' || r.kind === 'assigned')}</div></article>`).join('')}</div><p class="small muted">本人回答を前提にした受付順の提案です。臨床上の優先度や施術可否を判定する機能ではありません。相談希望の方には個別対応を残します。</p>`;
  }
  function intakeModal(id) {
    const p = state.patients.find(x => x.id === id);
    openModal(`<p class="eyebrow">PATIENT PREFERENCES</p><h2 id="modal-title">${esc(p.label)}の本人回答</h2><p>本人から確認した希望として反映する操作デモです。人物評価やキャンセル確率を入力する欄はありません。</p><form id="intake-form"><input type="hidden" name="patientId" value="${p.id}">${intakeFields(p)}<button type="submit" class="button">本人回答を反映して再提案する</button></form>`);
  }
  function intakeMessage(id) {
    const plan = C.receptionPlan(state, receptionEventId), r = plan.rows.find(x => x.patient.id === id), e = plan.event;
    if (!r || plan.issue || ['paused', 'assigned'].includes(r.kind)) throw new Error('この方への新しい案内は作成しません。');
    const opening = `${r.patient.label} 様\n`;
    const body = r.kind === 'consult' ? 'ご相談の希望を受け付けました。日程や会場など、ご希望の条件を担当者が確認してから、次の手順をご案内します。' : r.kind === 'pending' ? `${date(e.date)}・${clinic(e.clinicId).name}について、ご参加の可否と、予約手続きに進むご希望をお知らせください。ご相談してから決めることもできます。` : plan.proposed.includes(id) ? `${date(e.date)}・${clinic(e.clinicId).name}への参加希望を承っています。開催が確定しましたら、診察・説明と予約手続きについてあらためてご案内します。現時点では予約確定ではありません。` : r.intake.alternatives === 'flexible' ? '別の日程・会場の候補が整い次第、ご案内します。新しい候補のご都合を確認してから手続きを進めます。' : 'ご希望に合う候補や次の空き枠を確認しています。条件が整い次第、あらためてご案内します。';
    openModal(`<p class="eyebrow">RECEPTION MESSAGE / NOT SENT</p><h2 id="modal-title">次の対応に合わせた文面</h2><p>${esc(r.next)}。デモでは作成のみで送信しません。</p><label class="field-label">文面（未送信）<textarea rows="10" readonly>${esc(opening + body + '\n\n※架空の回答・会場によるデモ文面です。送信されていません。')}</textarea></label>`);
  }
  function adminHTML() {
    const matches = C.candidates(state), available = matches.filter(c => !c.blocked);
    const activeEvents = state.events.filter(e => ['held', 'confirmed'].includes(e.status));
    const needsAction = activeEvents.filter(e => C.readiness(state, e).ready).length;
    const entryCount = state.patients.filter(p => !p.assignedEventId).length;
    const waitingLabel = activeEvents.some(e => e.status === 'held' && !C.eventIssue(state, e)) ? '候補日を案内中' : '次の日程案内待ち';
    return `<div class="metrics"><div><span>エントリー</span><strong>${state.patients.length}<small>人</small></strong><p>地域の希望入力なし</p></div><div><span>新たに確保できる候補</span><strong>${available.length}<small>件</small></strong><p>先生 × 医療機関を自動照合</p></div><div><span>開催判断を待つ日程</span><strong>${needsAction}<small>件</small></strong><p>この日時で予約を希望する方が5人以上</p></div><div><span>開催確定</span><strong>${state.events.filter(e => e.status === 'confirmed').length}<small>件</small></strong><p>次の候補を待つ登録者 ${entryCount}人</p></div></div>
      <div class="guide-card"><div class="guide-icon" aria-hidden="true">↗</div><div><b>${needsAction ? '開催判断に進める日程があります。' : 'まずは「患者さんの回答」を試してみましょう。'}</b><p>${needsAction ? '受付・案内順で本人の希望を確認し、対象者を選べます。' : '患者画面で参加希望と手続きへの希望を反映すると、案内候補の人数が更新されます。'}</p></div>${button('患者画面を開く →', 'try-patient', '', 'outline')}</div>
      <div class="reception-shortcut">${button('受付・案内順を自動整理する →', 'reception', '', 'outline')}<span>本人の条件から、次に誰へ何を案内するかを提案</span></div><ol class="process-strip"><li><b>01</b>空き時間を回答</li><li><b>02</b>候補日を自動照合</li><li><b>03</b>仮押さえ・参加希望</li><li><b>04</b>運営が開催を確定</li></ol>
      <div class="section-heading"><div><p class="eyebrow">IN PROGRESS</p><h2>仮押さえ・開催状況</h2></div><span class="muted">運営側だけの情報です</span></div>
      <div class="event-grid">${activeEvents.length ? activeEvents.map(e => eventCard(e)).join('') : '<div class="empty-state"><h3>現在、募集している日程はありません。</h3><p>下の候補から会場と日程を仮押さえすると、患者さんの回答画面に表示されます。</p></div>'}</div>
      <div class="section-heading"><div><p class="eyebrow">AUTOMATIC MATCHING</p><h2>空き時間から見つかった候補</h2></div>${button('空き時間を変更する', 'providers', '', 'quiet')}</div>
      <p class="section-note">開催枠5時間・受け入れ5人以上・先生は1日1会場、という仮の運用設定で照合します。回答期間を確保できる日程が対象です。</p>
      <div class="candidate-grid">${matches.length ? matches.map(c => `<article class="candidate-card ${c.blocked ? 'blocked' : ''}"><div class="card-top"><span class="area-pill">${esc(clinic(c.clinicId).area)}</span><span class="mini-label">${c.blocked ? '確保枠あり' : '空き時間一致'}</span></div><h3>${date(c.date)}</h3><p class="time-range">${c.start} — ${c.end}</p><p>${esc(clinic(c.clinicId).name)}</p><div class="match-signals"><span>✓ 先生</span><span>✓ 医療機関</span><span>枠 ${c.capacity}人</span></div>${c.blocked ? `<p class="blocked-reason">${esc(c.blocked)}</p>` : button('仮押さえして募集する', 'hold', c.key, 'outline')}</article>`).join('') : '<div class="empty-state"><h3>開催条件に合う候補がありません。</h3><p>先生・医療機関の空き時間を確認してください。</p></div>'}</div>
      <div class="lower-grid"><section class="panel"><div class="section-heading compact"><h2>エントリー一覧</h2><span>${state.patients.length}人・すべて架空</span></div><div class="table-scroll"><table><thead><tr><th>登録者</th><th>年代・居住地</th><th>入口</th><th>状況</th></tr></thead><tbody>${state.patients.map(p => `<tr><th>${esc(p.label)}</th><td>${esc(p.age)}・${esc(p.city)}</td><td>${esc(p.channel)}</td><td>${p.assignedEventId ? `${shortDate(event(p.assignedEventId).date)} 個別案内対象` : waitingLabel}</td></tr>`).join('')}</tbody></table></div></section><section class="panel"><div class="section-heading compact"><h2>操作履歴</h2><span>このデモ内のみ</span></div><ol class="activity-list">${state.activity.slice(0, 8).map(a => `<li><time>${shortDate(a.date)}</time><p>${esc(a.message)}</p></li>`).join('')}</ol></section></div>
      ${state.events.some(e => ['expired', 'cancelled'].includes(e.status)) ? `<details class="archive panel"><summary>終了した仮押さえ・回答履歴</summary>${state.events.filter(e => ['expired', 'cancelled'].includes(e.status)).map(e => `<p>${date(e.date)}・${esc(clinic(e.clinicId).area)} ${badge(status(e))} 回答履歴 ${Object.keys(state.responses[e.id] || {}).length}件</p>`).join('')}</details>` : ''}
      <details class="integration panel"><summary>実運用でつなぐもの</summary><div class="integration-grid"><div><b>カレンダー連携</b><p>空き時間の取得と仮押さえの書き込み。現時点では未接続です。</p></div><div><b>LINE・メール通知</b><p>候補日の案内と回答期限の通知。デモは文面表示までです。</p></div><div><b>認証・データ保存</b><p>役割ごとのログインと安全な保存。本画面の切替はログインではありません。</p></div></div></details>`;
  }
  function eventCard(e) {
    const r = C.readiness(state, e), isHeld = e.status === 'held', count = isHeld ? r.count : e.participants.length;
    return `<article class="event-card" data-event="${e.id}"><div class="card-top"><span class="area-pill">${esc(clinic(e.clinicId).area)}会場</span>${badge(status(e))}</div><h3>${date(e.date)}</h3><p class="time-range">${e.start} — ${e.end}</p><p>${esc(clinic(e.clinicId).name)}</p><div class="participation"><div><span>${isHeld ? 'この日時で予約を希望する方' : '個別案内対象'}</span><strong>${count}<small>人</small></strong></div><div class="progress-track" aria-hidden="true"><span style="width:${Math.min(100, count / state.settings.minimum * 100)}%"></span></div><p>${isHeld ? r.ready ? '人数の目安に達しました。参加者を確認して開催判断へ。' : `開催判断まで、あと${r.remaining}人。` : '開催を確定しました。施術予約は別途ご案内・確認します。'}</p></div>${isHeld ? `<p class="deadline">仮押さえ・回答期限 <b>${date(e.deadline)}まで</b></p>` : ''}${r.issue ? `<p class="inline-alert" role="status">${esc(r.issue)}。患者向けの新規回答を停止しています。</p>` : ''}<div class="card-actions">${isHeld ? button('参加者を確認して開催確定', 'confirm', e.id, '', !r.ready) : ''}${button('案内文を見る', 'message', e.id, 'quiet', Boolean(r.issue))}${isHeld ? button('仮押さえを解除', 'release', e.id, 'text') : ''}</div></article>`;
  }
  function providersHTML() {
    const entity = provider === 'doctor' ? state.doctor : clinic(provider);
    return `<div class="panel provider-panel"><div class="section-heading compact"><div><p class="eyebrow">AVAILABILITY</p><h2>対応できる日時を回答</h2></div><span class="badge neutral">カレンダー未接続</span></div><div class="provider-picker"><label for="provider-select">回答者を切り替えて体験</label><select id="provider-select"><option value="doctor"${provider === 'doctor' ? ' selected' : ''}>上田 敬博 医師（架空の予定）</option>${state.clinics.map(c => `<option value="${c.id}"${provider === c.id ? ' selected' : ''}>${esc(c.name)}</option>`).join('')}</select></div><p class="section-note">対応できる日にチェックを入れ、空いている時間帯を設定してください。保存すると、運営側の候補日を自動で再計算します。時刻は日本時間です。</p><form id="availability-form"><div class="availability-list">${C.dates.map((d, i) => { const s = entity.availability.find(r => r.date === d); return `<div class="availability-row" data-date="${d}"><label class="day-check"><input type="checkbox" name="enabled-${i}" ${s ? 'checked' : ''}><span>${date(d)}</span></label><div class="time-fields"><label>開始<input type="time" name="start-${i}" value="${s?.start || '09:00'}" ${s ? '' : 'disabled'} required></label><span aria-hidden="true">—</span><label>終了<input type="time" name="end-${i}" value="${s?.end || '17:00'}" ${s ? '' : 'disabled'} required></label></div></div>`; }).join('')}</div><p id="availability-error" class="inline-alert" role="alert" hidden></p><button class="button" type="submit">回答を反映して自動照合する →</button></form></div><aside class="panel provider-explainer"><p class="eyebrow">AUTOMATION</p><h2>予定が変わっても、見落とさない。</h2><ol><li>先生と医療機関の時間帯の重なりを計算</li><li>開催枠を確保できる日程だけ候補に表示</li><li>すでに確保した同日の別会場を候補から除外</li><li>仮押さえ後の時間変更は「要再調整」として募集を停止</li></ol><p>神戸会場の10月18日は、先生の空き時間が4時間のため初期状態では候補になりません。先生の終了時刻を延ばすと、候補が増える動きを試せます。</p><p class="small muted">実際の予定を取得するには、各カレンダーの利用許可と連携が必要です。このデモの予定は実在する医師・病院の予定ではありません。</p></aside>`;
  }
  function patientHTML() {
    const p = currentPatient();
    const shown = state.events.filter(e => e.status === 'held' ? !C.eventIssue(state, e) : e.status === 'confirmed' && e.date >= state.today && (!C.eventIssue(state, e) || p.assignedEventId === e.id));
    return `<div class="patient-controls panel"><div><p class="eyebrow">PATIENT PREVIEW</p><h2>患者さんとして操作する</h2><p>会場と日程への回答に加え、予約の希望や、ほかの日時・会場も相談できるかを伝えられます。</p></div><div class="patient-selector"><label for="patient-select">回答するデモ患者</label><select id="patient-select">${state.patients.map(x => `<option value="${x.id}"${x.id === patientId ? ' selected' : ''}>${esc(x.label)}${x.assignedEventId ? '・案内対象確定' : ''}</option>`).join('')}</select>${button('架空の新規エントリーを追加', 'add-patient', '', 'quiet')}</div></div><div class="patient-preview"><header><span class="brand-symbol">H</span><span>毛根グラフト再生治療<small>施術日程のご案内〈デモ〉</small></span></header><div class="patient-content"><p class="eyebrow">YOUR NEXT STEP</p><h2>参加できる日程を、<br>お聞かせください。</h2><p>大阪・伊丹・神戸エリアの候補をご案内します。会場と日程をご確認のうえ、ご都合をお知らせください。</p><p class="patient-notice">${esc(p.label)}としての操作体験です。回答は実際の申し込み・予約にはなりません。</p>${patientIntake(p)}${shown.length ? shown.map(e => patientEvent(e, p)).join('') : '<div class="patient-empty"><span aria-hidden="true">▦</span><h3>次回の日程を調整しています。</h3><p>候補が整い次第、ご案内する流れを体験できます。運営画面で日程を仮押さえすると、ここに表示されます。</p></div>'}<div class="next-time"><h3>今回は予定が合わなくても大丈夫です。</h3><p>エントリーを残して、次のご案内をお待ちいただけます。開催が決まった日程では、費用や当日の流れなどをあらためてご案内します。</p></div></div></div>`;
  }
  function patientEvent(e, p) {
    const response = state.responses[e.id]?.[p.id] || 'pending', assigned = p.assignedEventId === e.id, confirmed = e.status === 'confirmed', issue = C.eventIssue(state, e);
    return `<article class="patient-event"><div class="card-top"><span class="area-pill">${esc(clinic(e.clinicId).area)}</span><span class="badge ${confirmed ? 'success' : 'amber'}">${issue ? '日程を再調整中' : confirmed ? '開催決定' : '開催予定・参加希望受付中'}</span></div><h3>${date(e.date)}</h3><p class="time-range">${e.start} — ${e.end}</p><p><strong>${esc(clinic(e.clinicId).name)}</strong></p><p class="small muted">担当：${esc(state.doctor.name)}<br>この会場名・日程・対応予定はすべてデモです。</p>${confirmed ? `<p class="patient-notice">${issue ? '日程に変更があり、運営が調整中です。あらためてご案内します。' : assigned ? 'この日程の個別案内対象になりました。実際には診察・説明を経て施術予約へ進みます。' : 'この日程の参加希望受付は終了しました。次のご案内をお待ちいただけます。'}</p>` : p.assignedEventId ? '<p class="patient-notice">別の日程で個別案内対象となっています。変更の際は運営にご相談いただく想定です。</p>' : `<form class="response-form" data-event="${e.id}"><fieldset><legend>この日程のご都合</legend>${[['yes', '参加を希望する'], ['pending', 'まだ分からない'], ['no', '今回は都合が合わない']].map(([value, label]) => `<label class="response-option"><input type="radio" name="response" value="${value}" ${response === value ? 'checked' : ''}><span>${label}</span></label>`).join('')}</fieldset><button type="submit" class="button">この回答を反映する〈デモ〉</button><p class="response-saved">${state.responses[e.id]?.[p.id] ? '現在の回答：' + ({ yes: '参加希望', no: '今回は見送り', pending: '未定' })[response] : 'まだ回答していません'}</p></form>`}<p class="small muted">${confirmed ? '' : `回答・開催判断の期限：${date(e.deadline)}まで。`}参加希望は施術予約の確定ではありません。</p></article>`;
  }
  function render() {
    $('#demo-date').textContent = `${state.today.replaceAll('-', '/')}（固定シナリオ）`;
    $('#reception-view').innerHTML = receptionHTML(); $('#admin-view').innerHTML = adminHTML(); $('#providers-view').innerHTML = providersHTML(); $('#patient-view').innerHTML = patientHTML(); showView(view, false);
  }
  function openModal(html) {
    lastFocus = document.activeElement; $('#modal-body').innerHTML = html; $('#modal-error').hidden = true; $('#modal-backdrop').hidden = false; document.body.classList.add('modal-open');
    const target = $('#modal-body input:not([type=hidden])') || $('#modal-body button') || $('#close-modal'); target.focus();
  }
  function closeModal() { $('#modal-backdrop').hidden = true; document.body.classList.remove('modal-open'); if (lastFocus?.isConnected) lastFocus.focus(); else $('#main').focus(); }
  function refresh(message) { closeModal(); render(); if (message) toast(message); }
  function holdModal(key) {
    const c = C.candidates(state).find(x => x.key === key); if (!c || c.blocked) throw new Error('候補が変わりました。再確認してください。');
    const max = C.addDays(c.date, -1), defaultDate = [C.addDays(state.today, 2), max].sort()[0];
    openModal(`<p class="eyebrow">TENTATIVE HOLD</p><h2 id="modal-title">この日程を仮押さえしますか？</h2><div class="modal-summary"><b>${date(c.date)} ${c.start}–${c.end}</b><p>${esc(clinic(c.clinicId).name)}</p></div><p>デモ内で先生・会場の枠を確保し、患者向け画面に参加希望の受付を表示します。同日の別会場は確保できなくなります。</p><form id="hold-form"><input type="hidden" name="key" value="${esc(key)}"><label class="field-label">仮押さえ・回答期限<input type="date" name="deadline" min="${C.addDays(state.today, 1)}" max="${max}" value="${defaultDate}" required></label><button type="submit" class="button">仮押さえして募集を表示する</button></form><p class="small muted">実際のカレンダーへの書き込み・案内の送信はありません。</p>`);
  }
  function confirmModal(id) {
    const e = event(id), r = C.readiness(state, e); if (!r.ready) throw new Error(r.issue || '人数の目安に達していません。');
    const plan = C.receptionPlan(state, id), patients = plan.rows.filter(r => r.kind === 'ready').map(r => r.patient);
    openModal(`<p class="eyebrow">REVIEW & CONFIRM</p><h2 id="modal-title">参加者を確認して開催を確定</h2><div class="modal-summary"><b>${date(e.date)} ${e.start}–${e.end}</b><p>${esc(clinic(e.clinicId).name)}</p></div><p>手続きの案内へ進める${patients.length}人のうち、${state.settings.minimum === e.capacity ? e.capacity : `${state.settings.minimum}〜${e.capacity}`}人を個別案内対象として選びます。本人の参加回答・手続きの希望から提案した方にチェックしています。選ばなかった方は次回の候補を待てます。</p><form id="confirm-form"><input type="hidden" name="eventId" value="${e.id}"><fieldset class="participant-options"><legend>今回の個別案内対象</legend>${patients.map((p, i) => `<label><input type="checkbox" name="participants" value="${p.id}"${plan.proposed.includes(p.id) ? ' checked' : ''}><span>${esc(p.label)}<small>${esc(p.age)}・${esc(p.city)}</small></span></label>`).join('')}</fieldset><p class="patient-notice">開催の確定を体験します。施術可否の判断、個別の施術予約、通知の送信は行いません。</p><button type="submit" class="button">開催を確定する〈デモ〉</button></form>`);
  }
  function messageModal(id) {
    const e = event(id); if (!e || C.eventIssue(state, e)) throw new Error('日程を確認してから案内文を作成してください。');
    const text = e.status === 'confirmed' ? `施術日程が決まりました。\n${date(e.date)} ${e.start}〜${e.end}\n会場：${clinic(e.clinicId).name}\n担当：${state.doctor.name}\n費用や当日の流れ、診察・予約の手順をあらためてご案内します。\n\n※これは架空の日程によるデモ文面です。送信されていません。` : `施術候補日のご案内です。\n${date(e.date)} ${e.start}〜${e.end}\n会場：${clinic(e.clinicId).name}\n${date(e.deadline)}までに、ご都合をお知らせください。\n現在は開催予定です。条件が整い次第、正式にご案内します。\n\n※これは架空の日程によるデモ文面です。送信されていません。`;
    openModal(`<p class="eyebrow">MESSAGE PREVIEW / NOT SENT</p><h2 id="modal-title">案内文のプレビュー</h2><p>本運用では、対象の登録者へLINEやメールで案内する想定です。</p><label class="field-label">文面（未送信）<textarea rows="12" readonly>${esc(text)}</textarea></label>${button('閉じる', 'close', '', 'outline')}`);
  }
  document.addEventListener('click', ev => {
    const viewButton = ev.target.closest('[data-view]'); if (viewButton) return showView(viewButton.dataset.view);
    const b = ev.target.closest('[data-action]'); if (!b || b.disabled) return;
    try {
      const { action, id } = b.dataset;
      if (action === 'hold') holdModal(id);
      if (action === 'confirm') confirmModal(id);
      if (action === 'message') messageModal(id);
      if (action === 'providers') showView('providers');
      if (action === 'reception') showView('reception');
      if (action === 'intake-edit') intakeModal(id);
      if (action === 'intake-message') intakeMessage(id);
      if (action === 'reception-sample') openModal(`<p class="eyebrow">RECEPTION SCENARIO</p><h2 id="modal-title">8人の受付例に切り替えますか？</h2><p>今のデモ操作をリセットし、本人の回答に違いがある8人の架空データを読み込みます。</p>${button('受付例を読み込む', 'reception-load')}`);
      if (action === 'reception-load') { state = C.receptionSeed(); receptionEventId = 'E1'; view = 'reception'; refresh('8人の本人回答をもとに、案内候補を提案しました。'); }
      if (action === 'try-patient') { patientId = state.patients.find(p => !p.assignedEventId && p.id === 'P05')?.id || state.patients.find(p => !p.assignedEventId)?.id || 'P01'; render(); showView('patient'); }
      if (action === 'add-patient') { patientId = C.addPatient(state).id; render(); toast('架空の登録者を追加しました。実際の情報は送信・保存していません。'); $('#patient-select').focus(); }
      if (action === 'release') openModal(`<p class="eyebrow">RELEASE HOLD</p><h2 id="modal-title">仮押さえを解除しますか？</h2><p>${date(event(id).date)}・${esc(clinic(event(id).clinicId).area)}の募集を停止します。回答履歴はこのデモ内に残ります。</p>${button('解除する〈デモ〉', 'release-confirm', id, 'danger')}`);
      if (action === 'release-confirm') { C.release(state, id); refresh('仮押さえを解除しました。患者向けの募集表示も停止しました。'); }
      if (action === 'close') closeModal();
      if (action === 'reset-confirm') { state = C.seed(); patientId = 'P05'; provider = 'doctor'; view = 'admin'; refresh('初期状態に戻しました。'); }
    } catch (err) { toast(err.message); }
  });
  document.addEventListener('change', ev => {
    if (ev.target.id === 'reception-event') { receptionEventId = ev.target.value; $('#reception-view').innerHTML = receptionHTML(); $('#reception-event').focus(); }
    if (ev.target.id === 'provider-select') { provider = ev.target.value; $('#providers-view').innerHTML = providersHTML(); $('#provider-select').focus(); }
    if (ev.target.id === 'patient-select') { patientId = ev.target.value; $('#patient-view').innerHTML = patientHTML(); $('#patient-select').focus(); }
    if (ev.target.matches('#availability-form input[type=checkbox]')) ev.target.closest('.availability-row').querySelectorAll('input[type=time]').forEach(x => { x.disabled = !ev.target.checked; });
  });
  document.addEventListener('submit', ev => {
    if (!['availability-form', 'hold-form', 'confirm-form', 'intake-form', 'patient-intake-form'].includes(ev.target.id) && !ev.target.matches('.response-form')) return;
    ev.preventDefault(); const form = ev.target;
    try {
      if (['intake-form', 'patient-intake-form'].includes(form.id)) {
        C.updateIntake(state, form.elements.patientId.value, { readiness: form.elements.readiness.value, alternatives: form.elements.alternatives.value, followup: form.elements.followup.value });
        refresh('本人の希望を反映し、案内候補を再計算しました。');
      } else if (form.id === 'availability-form') {
        const rows = C.dates.flatMap((date, i) => form.elements[`enabled-${i}`].checked ? [{ date, start: form.elements[`start-${i}`].value, end: form.elements[`end-${i}`].value }] : []);
        C.updateAvailability(state, provider, rows); render(); toast('空き時間を反映し、候補日を再計算しました。'); $('#availability-form button').focus();
      } else if (form.id === 'hold-form') { C.hold(state, form.elements.key.value, form.elements.deadline.value); refresh('仮押さえしました。患者さんの画面に候補日を表示しています。'); }
      else if (form.id === 'confirm-form') { C.confirm(state, form.elements.eventId.value, [...form.querySelectorAll('[name=participants]:checked')].map(x => x.value)); refresh('開催を確定しました。案内文を確認できます。通知は送信していません。'); }
      else { const id = form.dataset.event; C.respond(state, id, patientId, form.elements.response.value); render(); toast('回答をデモ内に反映しました。運営画面の人数も更新されています。'); $(`.response-form[data-event="${id}"] button`)?.focus(); }
    } catch (err) {
      if (form.id === 'availability-form') { $('#availability-error').textContent = err.message; $('#availability-error').hidden = false; }
      else if (!$('#modal-backdrop').hidden) { $('#modal-error').textContent = err.message; $('#modal-error').hidden = false; }
      else toast(err.message);
    }
  });
  $('#close-modal').addEventListener('click', closeModal);
  $('#modal-backdrop').addEventListener('click', e => { if (e.target === $('#modal-backdrop')) closeModal(); });
  document.addEventListener('keydown', e => {
    if ($('#modal-backdrop').hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
    if (e.key === 'Tab') {
      const items = [...$('.modal').querySelectorAll('button:not([disabled]),input:not([disabled]):not([type=hidden]),select,textarea')];
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  $('#advance').addEventListener('click', () => { C.advance(state); render(); toast('デモ基準日を1日進め、期限を確認しました。'); });
  $('#reset').addEventListener('click', () => openModal(`<p class="eyebrow">RESET DEMO</p><h2 id="modal-title">最初の状態に戻しますか？</h2><p>この画面で変更した空き時間・回答・仮押さえを消し、初期データに戻します。</p>${button('最初から試す', 'reset-confirm')}`));
  window.CoordinationDemo = Object.freeze({ snapshot: () => C.copy(state) });
  if (location.hash === '#reception') { state = C.receptionSeed(); view = 'reception'; }
  render();
})();
