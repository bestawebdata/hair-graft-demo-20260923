(() => {
  "use strict";
  const C = window.SITE_CONTENT;
  const $ = (selector) => document.querySelector(selector);
  const e = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const paths = {
    leaf: '<path d="M12 22V3m0 12C3 15 3 7 3 7s9 0 9 8Zm0 4c9 0 9-8 9-8s-9 0-9 8Z"/>',
    book: '<path d="M12 5v16M12 5C8 2 4 3 2 4v15c4-2 7-1 10 2 3-3 6-4 10-2V4c-2-1-6-2-10 1Z"/>',
    person: '<circle cx="12" cy="7" r="4"/><path d="M3 22v-3a9 7 0 0 1 18 0v3Z"/>',
    image: '<rect x="2" y="3" width="20" height="18" rx="2"/><circle cx="8" cy="9" r="2"/><path d="m3 20 6-6 4 3 4-6 5 6"/>',
    yen: '<circle cx="12" cy="12" r="10"/><path d="m8 6 4 6 4-6M8 12h8m-8 4h8m-4-4v8"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    form: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 7h8m-8 5h8m-8 5h3"/><circle cx="16" cy="17" r="1"/>',
    calendar: '<rect x="3" y="5" width="18" height="17" rx="2"/><path d="M7 2v6m10-6v6M3 11h18m-13 4h1m6 0h1m-8 4h1m6 0h1"/>',
    bell: '<path d="M5 10a7 7 0 0 1 14 0c0 8 3 8 3 10H2c0-2 3-2 3-10Z"/><path d="M10 23h4"/>',
    grid: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 8h2m3 0h2m3 0h1M7 12h2m3 0h2m3 0h1M7 16h10"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-11v1"/>',
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.info}</svg>`;
  function fillIcons(root = document) { root.querySelectorAll("[data-icon]").forEach((el) => { el.innerHTML = icon(el.dataset.icon); }); }
  const imagePath = (value) => /^assets\/(doctor|treatment|cases)\/[a-zA-Z0-9_-]+\.(webp|png|jpe?g)$/.test(value) ? "../" + value : "";
  const sourceImage = (photo) => imagePath(photo.image) ? `<img src="${e(imagePath(photo.image))}" width="${Number(photo.width) || 400}" height="${Number(photo.height) || 400}" alt="${e(photo.alt)}" loading="lazy" decoding="async">` : "";
  const action = (label, key, style = "green") => `<button type="button" class="button ${style}" data-open="${key}">${e(label)} <span aria-hidden="true">→</span></button>`;
  const menuTitles = { about: "治療について", doctor: "医師紹介", cases: "症例写真", price: "料金・リスク", regions: "希望する地域", register: "施術希望登録", account: "このデモについて" };
  const content = {
    about: () => `<p class="content-eyebrow">ABOUT THE TREATMENT</p><h2 tabindex="-1">髪の変化に、<br>新しい治療の選択肢。</h2><p>${e(C.medical.purpose)}</p><p>${e(C.medical.overview)}</p><p class="source-note">${e(C.medical.purposeNote)}</p><div class="treatment-highlights">${C.medical.highlights.map((item) => `<article><h3>${e(item.title)}</h3><p>${e(item.text)}</p></article>`).join("")}</div><p class="source-note">${e(C.medical.aftercareNote)}</p><figure class="info-image">${sourceImage(C.treatmentVisuals.equipment)}<figcaption>${e(C.treatmentVisuals.equipment.name)}</figcaption></figure><p class="source-note">${e(C.treatmentVisuals.note)}</p><h3>治療の流れ</h3><ol class="treatment-steps">${C.medical.steps.map((s, i) => `<li><b>0${i + 1}</b><div><strong>${e(s.title)}</strong><p>${e(s.text)}</p></div></li>`).join("")}</ol>${action("リスク・副作用を確認する", "price", "outline")}${action("希望地域を選ぶ", "regions")}`,
    doctor: () => `<p class="content-eyebrow">DOCTOR</p><div class="doctor-summary"><img src="../assets/doctor/ueda-portrait.webp" width="1000" height="1500" alt="上田敬博医師"><div><h2 tabindex="-1">${e(C.doctor.name)}</h2><p>${e(C.doctor.credential)}</p></div></div><h3>${e(C.doctor.headline)}</h3><p>${e(C.doctor.introduction)}</p><h3>主な経歴</h3><ol class="career-list">${C.doctor.career.map(([year, detail]) => `<li><time>${e(year)}</time><span>${e(detail)}</span></li>`).join("")}</ol><p class="source-note">${e(C.doctor.availability)}</p>${action("治療について見る", "about", "outline")}${action("施術希望を登録する", "register")}`,
    cases: () => {
      const B = C.brochureGallery;
      const records = B?.enabled && B.publicationAuthorized ? B.records : [];
      return `<p class="content-eyebrow">CASE FOLLOW-UP</p><h2 tabindex="-1">経過を、丁寧に見ていく。</h2><p>${e(records.length ? B.intro : "症例写真は掲載準備中です。")}</p><div class="line-cases">${records.map((r) => `<article class="case-card"><h3>${e(r.title)}</h3><div class="case-pair">${r.observations.map((o) => `<figure><figcaption>${e(o.label)}</figcaption>${sourceImage(o)}</figure>`).join("")}</div></article>`).join("")}</div>${records.length ? `<p>${e(B.note)}</p>` : ""}${action("料金・リスクを確認する", "price", "outline")}${action("施術希望を登録する", "register")}`;
    },
    price: () => `<p class="content-eyebrow">PRICE & RISKS</p><h2 tabindex="-1">費用とリスクについて</h2><div class="cost-card"><p>${e(C.treatment.name)}</p><div class="cost-amount"><b>${e(C.treatment.price)}</b><span>${e(C.treatment.priceUnit)}</span><small>（仮）</small></div><p class="cost-state">${e(C.treatment.priceStatus)}。正式な金額ではありません。</p><p>自由診療・保険適用外</p><p class="small muted">税込・税別、施術範囲・回数、診察・麻酔・再診等の費用が含まれる範囲は確認中です。</p></div><p class="source-note">再施術には別途費用がかかり、返金保証はありません。総額・追加費用・お支払い条件は、正式なご案内でお知らせします。</p><h3>主なリスク・副作用</h3><ul class="risk-list">${C.medical.risks.map((r) => `<li>${e(r)}</li>`).join("")}</ul><h3>ダウンタイム・施術後の生活</h3><dl class="detail-list">${C.medical.downtime.map(([k, v]) => `<div><dt>${e(k)}</dt><dd>${e(v)}</dd></div>`).join("")}</dl><h3>診察時にご確認ください</h3><p>${e(C.medical.precautions)}</p><p class="source-note">施術後は担当医の指示に従ってください。異常な痛み・腫れ・発熱などがある場合は、速やかに医療機関へ連絡してください。</p>${action("施術希望を登録する", "register")}`,
    regions: () => `<p class="content-eyebrow">YOUR PREFERRED AREA</p><h2 tabindex="-1">通いやすい地域を、<br>お聞かせください。</h2><p>ご希望を地域ごとに集め、条件が整った地域から医師・医療機関と開催を調整する予定です。</p><div class="region-list">${C.regions.map((r) => `<button type="button" class="region-choice" data-region="${e(r.id)}"><b>${e(r.name)}</b><small>${e(r.status)}</small><span>この地域で希望登録する →</span></button>`).join("")}</div><div class="location-note"><strong>${e(C.venue.text)}</strong><p>${e(C.venue.status)}・${e(C.venue.date)}</p><p class="small muted">医療機関名・住所・担当医は、契約と調整が整った後にご案内します。希望する地域での開催を確約するものではありません。</p></div>`,
    account: () => `<p class="content-eyebrow">ABOUT THIS DEMO</p><h2 tabindex="-1">LINEでつながる、<br>ご相談の窓口を。</h2><p>LINE公式アカウントとリッチメニューから、治療のご案内や地域ごとの施術希望登録へ進む流れを体験できます。</p><p>この画面はWeb上の操作デモです。実際のLINEアカウントへの接続、友だち追加、メッセージ送信、受付・予約は行いません。</p><p>フォームの内容は送信・保存されません。実際の個人情報は入力せず、デモ入力をお使いください。</p>${action("希望地域を選んで試す", "regions")}`,
  };

  const ages = ["20代未満", "20代", "30代", "40代", "50代", "60代", "70代以上", "回答を控える"];
  const prefectures = "北海道 青森県 岩手県 宮城県 秋田県 山形県 福島県 茨城県 栃木県 群馬県 埼玉県 千葉県 東京都 神奈川県 新潟県 富山県 石川県 福井県 山梨県 長野県 岐阜県 静岡県 愛知県 三重県 滋賀県 京都府 大阪府 兵庫県 奈良県 和歌山県 鳥取県 島根県 岡山県 広島県 山口県 徳島県 香川県 愛媛県 高知県 福岡県 佐賀県 長崎県 熊本県 大分県 宮崎県 鹿児島県 沖縄県 海外".split(" ");
  const experiences = ["治療を受けたことはない", "現在、治療を受けている", "以前、治療を受けていた", "相談時に伝えたい"];
  const options = (items) => items.map((x) => `<option>${e(x)}</option>`).join("");
  const required = '<span class="required">必須</span>';
  $("#form-mount").innerHTML = `<form id="line-form" autocomplete="off" novalidate>
    <div class="demo-fill"><p>実際の個人情報は入力せず、<br>デモ用の内容でお試しください。</p><button type="button" id="fill-demo">デモ入力</button></div>
    <div class="field"><label for="entry-name">お名前${required}</label><input id="entry-name" name="fullName" maxlength="60" placeholder="例：デモ 太郎" required></div>
    <div class="field"><label for="entry-age">年代${required}</label><select id="entry-age" name="age" required><option value="">選択してください</option>${options(ages)}</select></div>
    <fieldset class="field"><legend>お住まいの地域${required}</legend><div class="residence-fields"><select name="prefecture" aria-label="お住まいの都道府県" required><option value="">都道府県</option>${options(prefectures)}</select><input name="city" aria-label="お住まいの市区町村" placeholder="例：伊丹市" maxlength="100" required></div><p class="field-help">番地・建物名は不要です。</p></fieldset>
    <fieldset class="field"><legend>ご連絡先${required}</legend><div class="contact-options"><label><input type="radio" name="contactMethod" value="email" checked>メール</label><label><input type="radio" name="contactMethod" value="phone">電話</label></div><input id="entry-contact" name="contact" type="email" inputmode="email" aria-label="メールアドレス" maxlength="254" placeholder="例：demo@example.com" required></fieldset>
    <div class="field"><label for="entry-experience">これまでの治療経験${required}</label><select id="entry-experience" name="experience" required><option value="">選択してください</option>${options(experiences)}</select></div>
    <div class="field"><label for="entry-region">施術を希望する地域${required}</label><select id="entry-region" name="region" required><option value="">選択してください</option>${C.regions.map((r) => `<option value="${e(r.id)}">${e(r.name)}</option>`).join("")}</select></div>
    <div id="other-region-field" class="field" hidden><label for="entry-other-region">具体的な希望地域${required}</label><input id="entry-other-region" name="otherRegion" maxlength="100" placeholder="例：京都市内" disabled></div>
    <div class="field"><label for="entry-message">ご質問・ご希望<span class="required">任意</span></label><textarea id="entry-message" name="message" rows="3" maxlength="1000" placeholder="気になることやご希望の時期など"></textarea></div>
    <p class="field-help">希望登録は予約・契約ではなく、開催や施術を確約するものではありません。</p>
    <label class="consent"><input type="checkbox" name="acknowledge" required><span>デモのため入力内容は送信・保存されず、実際の登録は行われないことを確認しました。</span></label>
    <p id="form-error" class="form-error" role="alert" hidden></p><button type="submit" class="button green">入力内容を確認する <span aria-hidden="true">→</span></button><p class="form-footnote">入力例です。実際には送信されません。</p>
  </form>`;
  const form = $("#line-form");
  const field = (name) => form.elements.namedItem(name);
  let stage = 0;
  let snapshot = null;
  let panelOpen = false;
  let currentPanel = "register";
  let lastTrigger = $("#rich-menu [data-open=register]");
  const narrow = window.matchMedia("(max-width: 700px)");

  function syncVisibility() {
    document.body.classList.toggle("detail-open", panelOpen);
    for (const [selector, inactive] of [[".chat-column", narrow.matches && panelOpen], [".detail-column", narrow.matches && !panelOpen]]) {
      const column = $(selector);
      column.inert = inactive;
      if (inactive) column.setAttribute("aria-hidden", "true"); else column.removeAttribute("aria-hidden");
    }
  }
  narrow.addEventListener("change", syncVisibility);
  function focusHeading(heading) {
    $("#detail-scroll").scrollTop = 0;
    heading?.focus({ preventScroll: true });
  }
  function syncRegion() {
    const other = field("region").value === "other";
    $("#other-region-field").hidden = !other;
    field("otherRegion").disabled = !other;
    field("otherRegion").required = other;
  }
  function syncContact() {
    const phone = field("contactMethod").value === "phone";
    const input = field("contact");
    input.type = phone ? "tel" : "email";
    input.inputMode = phone ? "tel" : "email";
    input.setAttribute("aria-label", phone ? "電話番号" : "メールアドレス");
    input.placeholder = phone ? "例：090-0000-0000" : "例：demo@example.com";
    if (phone) input.pattern = "[+0-9０-９()（）ー−\\s-]{8,25}"; else input.removeAttribute("pattern");
    input.setCustomValidity("");
  }
  function clearErrors() {
    $("#form-error").hidden = true;
    for (const element of form.elements) {
      element.removeAttribute("aria-invalid");
      if (element.setCustomValidity) element.setCustomValidity("");
    }
  }
  function setStage(next, moveFocus = true) {
    stage = next;
    form.hidden = next !== 0;
    $("#confirm-view").hidden = next !== 1;
    $("#success-view").hidden = next !== 2;
    document.querySelectorAll(".progress li").forEach((li, i) => {
      li.classList.toggle("done", i < next);
      if (i === next) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    if (moveFocus) focusHeading($(next === 0 ? "#registration-title" : next === 1 ? "#confirm-title" : "#success-title"));
  }
  function clearRegistration() {
    snapshot = null;
    form.reset();
    syncRegion();
    syncContact();
    clearErrors();
    $("#confirm-values").replaceChildren();
    $("#success-region").textContent = "";
    setStage(0, false);
  }
  function appendEvent(title, text, key, completed = false) {
    const item = document.createElement("div");
    item.className = "chat-event";
    item.innerHTML = `<div class="user-event"><span>${e(title)}</span></div><div class="event-response${completed ? " event-complete" : ""}"><p>${e(text)}</p><button type="button" data-open="${key}">${completed ? "希望地域のご案内を見る" : "もう一度開く"} →</button></div>`;
    const events = $("#chat-events");
    events.append(item);
    while (events.children.length > 5) events.firstElementChild.remove();
    $("#chat-scroll").scrollTop = $("#chat-scroll").scrollHeight;
  }
  function updateActiveMenu() {
    document.querySelectorAll("#rich-menu [data-open]").forEach((button) => {
      if (button.dataset.open === currentPanel && panelOpen) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
    });
  }
  function openPanel(key, trigger = null, region = null, log = true) {
    if (!Object.hasOwn(menuTitles, key)) return;
    if (trigger?.closest(".chat-column")) lastTrigger = trigger;
    if (region && !C.regions.some((r) => r.id === region)) return;
    currentPanel = key;
    panelOpen = true;
    $("#view-title").textContent = menuTitles[key];
    $("#detail-label-text").textContent = key === "register" ? "LINEから開く登録フォーム" : "LINEから開く治療のご案内";
    $("#registration-view").hidden = key !== "register";
    $("#information-view").hidden = key === "register";
    if (key === "register") {
      if (stage === 2) clearRegistration();
      if (region) {
        snapshot = null;
        $("#confirm-values").replaceChildren();
        field("region").value = region;
        syncRegion();
        clearErrors();
        setStage(0, false);
      }
    } else {
      $("#information-view").innerHTML = `<section class="information-section">${content[key]()}</section>`;
    }
    syncVisibility();
    updateActiveMenu();
    const heading = key === "register" ? $(stage === 0 ? "#registration-title" : stage === 1 ? "#confirm-title" : "#success-title") : $("#information-view h2");
    focusHeading(heading);
    if (log) appendEvent(menuTitles[key], key === "register" ? "希望登録フォームを開きました。デモ用の内容でお試しください。" : `${menuTitles[key]}の画面を開きました。`, key);
  }
  function closePanel() {
    panelOpen = false;
    currentPanel = null;
    syncVisibility();
    updateActiveMenu();
    if (!narrow.matches) {
      $("#registration-view").hidden = true;
      $("#information-view").hidden = false;
      $("#view-title").textContent = "画面を選ぶ";
      $("#detail-label-text").textContent = "メニューから開くご案内";
      $("#information-view").innerHTML = `<div class="empty-view"><span>${icon("grid")}</span><h2>気になるメニューを<br>選んでみてください。</h2><p>治療のご案内から、<br>希望地域の選択・登録まで体験できます。</p>${action("希望登録を試す", "register")}</div>`;
    }
    const focusTarget = lastTrigger?.isConnected && !$("#rich-menu").hidden ? lastTrigger : $("#menu-toggle");
    focusTarget.focus({ preventScroll: true });
  }

  document.addEventListener("click", (event) => {
    const region = event.target.closest("[data-region]");
    if (region) { openPanel("register", region, region.dataset.region); return; }
    const target = event.target.closest("[data-open]");
    if (target) openPanel(target.dataset.open, target);
  });
  $("#menu-toggle").addEventListener("click", () => {
    const menu = $("#rich-menu");
    menu.hidden = !menu.hidden;
    $("#menu-toggle").setAttribute("aria-expanded", String(!menu.hidden));
  });
  $("#back-to-chat").addEventListener("click", closePanel);
  $("#success-chat").addEventListener("click", closePanel);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && panelOpen) closePanel(); });
  field("region").addEventListener("change", syncRegion);
  document.querySelectorAll('[name="contactMethod"]').forEach((input) => input.addEventListener("change", () => { field("contact").value = ""; syncContact(); }));
  form.addEventListener("focusin", () => {
    if (!narrow.matches && currentPanel === "register") { panelOpen = true; syncVisibility(); updateActiveMenu(); }
  });
  form.addEventListener("input", (event) => {
    event.target.setCustomValidity?.("");
    event.target.removeAttribute("aria-invalid");
    $("#form-error").hidden = true;
  });
  $("#fill-demo").addEventListener("click", () => {
    const chosenRegion = field("region").value || "itami";
    field("fullName").value = "デモ 太郎";
    field("age").value = "50代";
    field("prefecture").value = "兵庫県";
    field("city").value = "伊丹市";
    field("contactMethod").value = "email";
    syncContact();
    field("contact").value = "demo@example.com";
    field("experience").value = "治療を受けたことはない";
    field("region").value = chosenRegion;
    syncRegion();
    if (chosenRegion === "other") field("otherRegion").value = "京都市内";
    field("message").value = "開催予定について知りたいです。（デモ入力）";
    clearErrors();
    field("fullName").focus();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (stage !== 0) return;
    for (const name of ["fullName", "city", "contact", "otherRegion"]) {
      const input = field(name);
      input.value = input.value.trim();
      input.setCustomValidity(input.required && !input.value ? "入力してください。" : "");
    }
    if (field("contactMethod").value === "phone") {
      const digits = field("contact").value.normalize("NFKC").replace(/\D/g, "");
      if (digits.length < 8 || digits.length > 15) field("contact").setCustomValidity("電話番号をご確認ください。");
    }
    if (!form.checkValidity()) {
      $("#form-error").textContent = "必須項目と入力形式をご確認ください。";
      $("#form-error").hidden = false;
      const invalid = form.querySelector("input:invalid, select:invalid, textarea:invalid");
      if (invalid) { invalid.setAttribute("aria-invalid", "true"); invalid.focus(); invalid.reportValidity(); }
      return;
    }
    snapshot = Object.fromEntries(new FormData(form).entries());
    const region = snapshot.region === "other" ? snapshot.otherRegion : C.regions.find((r) => r.id === snapshot.region)?.name;
    if (!region) return;
    const rows = [["お名前", snapshot.fullName], ["年代", snapshot.age], ["お住まい", `${snapshot.prefecture} ${snapshot.city}`], ["ご連絡先", snapshot.contact], ["治療経験", snapshot.experience], ["希望地域", region], ["ご質問・ご希望", snapshot.message || "記入なし"]];
    $("#confirm-values").innerHTML = rows.map(([k, v]) => `<div><dt>${e(k)}</dt><dd>${e(v)}</dd></div>`).join("");
    setStage(1);
  });
  $("#edit-input").addEventListener("click", () => { snapshot = null; $("#confirm-values").replaceChildren(); setStage(0); field("fullName").focus(); });
  $("#complete-demo").addEventListener("click", () => {
    if (stage !== 1 || !snapshot) return;
    const region = snapshot.region === "other" ? snapshot.otherRegion : C.regions.find((r) => r.id === snapshot.region).name;
    clearRegistration();
    $("#success-region").textContent = `ご希望の地域「${region}」をもとに調整する流れを予定しています。`;
    setStage(2);
    appendEvent("希望登録のデモを完了", `希望地域：${region}。登録の体験が完了しました。入力内容は送信・保存されていません。`, "regions", true);
  });
  $("#register-again").addEventListener("click", () => { clearRegistration(); setStage(0); });
  $("#reset-demo").addEventListener("click", () => {
    clearRegistration();
    $("#chat-events").replaceChildren();
    $("#chat-scroll").scrollTop = 0;
    $("#rich-menu").hidden = false;
    $("#menu-toggle").setAttribute("aria-expanded", "true");
    currentPanel = "register";
    panelOpen = false;
    $("#view-title").textContent = "施術希望登録";
    $("#detail-label-text").textContent = "LINEから開く登録フォーム";
    $("#registration-view").hidden = false;
    $("#information-view").hidden = true;
    $("#information-view").replaceChildren();
    syncVisibility();
    updateActiveMenu();
    $("#detail-scroll").scrollTop = 0;
    lastTrigger = $("#rich-menu [data-open=register]");
    lastTrigger.focus({ preventScroll: true });
  });
  fillIcons();
  syncRegion();
  syncContact();
  syncVisibility();
  setStage(0, false);
})();
