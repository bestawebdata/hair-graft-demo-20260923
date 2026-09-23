(() => {
  "use strict";
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("mobile-nav");
  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    nav.hidden = true;
  }
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(expanded));
    nav.hidden = !expanded;
    if (expanded)
      nav.style.top = `${document.querySelector(".site-header").getBoundingClientRect().bottom}px`;
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !nav.hidden) {
      closeMenu();
      toggle.focus();
    }
  });
  const C = window.SITE_CONTENT;
  const escape = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const badge = (text) => `<span class="badge">${escape(text)}</span>`;
  const V = C.treatmentVisuals;
  const sourceImage = (photo) => `<img src="${escape(photo.image)}" width="${photo.width}" height="${photo.height}" alt="${escape(photo.alt)}" loading="lazy" decoding="async">`;
  const equipmentPanel = `<div class="wrap equipment-feature" aria-labelledby="equipment-title">
    <figure class="equipment-main">${sourceImage(V.equipment)}<figcaption><span>資料掲載機器</span>${escape(V.equipment.name)}</figcaption></figure>
    <div class="equipment-copy"><p class="eyebrow">EQUIPMENT & PROCESS</p><h3 id="equipment-title">治療に用いる機器を、<br>写真で知る。</h3><p>採取した組織を細かくする工程には、専用の機器を用います。提供資料には、リジェネラ装置と専用カートリッジが紹介されています。</p>
      <figure class="cartridge-detail">${sourceImage(V.cartridge)}<figcaption><b>${escape(V.cartridge.caption)}</b><span>${escape(V.cartridge.source)}</span></figcaption></figure>
      <p class="source-note">機器写真：${escape(V.equipment.source)}</p>
    </div><p class="equipment-note">${escape(V.note)}</p></div>`;
  const procedureGallery = `<div class="procedure-gallery-heading"><p class="eyebrow">PROCEDURE IN PICTURES</p><h3>資料で見る、治療の工程。</h3><p>提供資料に掲載された写真で、処理と注入の場面をご紹介します。</p></div><div class="procedure-gallery">${V.procedurePhotos.map((photo) => `<figure class="procedure-photo"><div class="procedure-photo-frame">${sourceImage(photo)}<span>工程の参考写真</span></div><figcaption><h4>${escape(photo.label)}</h4><p>${escape(photo.caption)}</p><small>${escape(photo.source)}</small></figcaption></figure>`).join("")}</div><p class="procedure-source-note">${escape(V.note)}</p>`;
  document.getElementById("page-details").innerHTML = `
    <section id="about" class="section about"><div class="wrap two-column">
      <div class="section-heading"><p class="eyebrow">ABOUT THE TREATMENT</p><h2>自分の組織を、<br>頭皮の治療に用いる。</h2><span class="section-number" aria-hidden="true">01</span></div>
      <div class="about-body"><p class="lead">${escape(C.medical.overview)}</p><div class="treatment-diagram" aria-label="治療の概要：皮膚組織の採取、微細化、頭皮へ注入"><span><b>採取</b><small>耳の後ろの皮膚組織</small></span><i aria-hidden="true">→</i><span><b>微細化</b><small>専用機器で注入液に</small></span><i aria-hidden="true">→</i><span><b>注入</b><small>薄毛が気になる頭皮</small></span></div><p>${escape(C.medical.purpose)}</p><p class="source-note">治療説明資料・施術同意書に基づく概要です。具体的な治療計画は診察でご確認ください。</p><a class="text-link" href="#risks">リスクとダウンタイムを確認する</a></div>
    </div>${equipmentPanel}</section>
    <section id="doctor" class="section wrap"><div class="doctor-panel"><div class="doctor-intro"><p class="eyebrow">DOCTOR</p><p class="doctor-kicker">治療説明資料に記載された医師</p><h2>${escape(C.doctor.name)}<small>${escape(C.doctor.credential)}</small></h2><p class="doctor-english">${escape(C.doctor.english)}</p><p class="doctor-description">熱傷治療と、自家培養表皮を用いた治療に携わってきた医師として、提供資料に紹介されています。</p><p class="doctor-footnote">担当医・監修体制は調整中です。すべての施術を上田医師が担当することを示すものではありません。</p></div><div class="doctor-career"><h3>主な経歴<span>提供資料より</span></h3><ol>${C.doctor.career.map(([year, text]) => `<li><time>${escape(year)}</time><p>${escape(text)}</p></li>`).join("")}</ol><p class="source-note">${escape(C.doctor.source)}</p></div></div><div class="doctor-gallery">${C.doctor.gallery.map((photo) => `<figure class="doctor-photo ${escape(photo.className)}"><div class="doctor-photo-frame"><img src="${escape(photo.image)}" width="${photo.width}" height="${photo.height}" alt="${escape(photo.alt)}" loading="lazy"></div><figcaption><span>${escape(photo.label)}</span><p>${escape(photo.caption)}</p></figcaption></figure>`).join("")}</div><p class="doctor-gallery-note">10ページ資料の医師紹介ページと同じ写真を使用しています。診療・学術活動の写真であり、今回の毛根グラフト治療の施術や治療結果を示すものではありません。</p></section>
    <section id="for-you" class="section for-you"><div class="wrap"><div class="section-heading"><p class="eyebrow">FOR YOU</p><h2>こんなお悩みを、<br class="mobile-only">まずはご相談ください。</h2></div><div class="concerns"><div><span aria-hidden="true">01</span><h3>以前より髪が<br>細くなったと感じる</h3></div><div><span aria-hidden="true">02</span><h3>内服薬を使うことが<br>難しく、相談したい</h3></div><div><span aria-hidden="true">03</span><h3>自分の組織を用いる<br>治療について知りたい</h3></div></div><p class="muted small">治療説明資料に挙げられた相談の例です。治療の対象になるかどうかは医師が診察して判断します。</p></div></section>
    <section id="flow" class="section wrap"><div class="section-heading"><p class="eyebrow">TREATMENT FLOW</p><h2>納得して進めるための、<br>治療の流れ。</h2></div><p class="section-intro">希望登録後、開催条件が整った地域から日程をご案内する予定です。施術は、診察・説明と同意の後に行います。</p>${procedureGallery}<ol class="flow-list">${C.medical.steps.map((step, i) => `<li><span class="step-index">0${i + 1}</span><div><h3>${escape(step.title)}</h3><p>${escape(step.text)}</p></div></li>`).join("")}</ol><div class="subtle-note"><strong>施術時間の目安</strong><span>提供された同意書では概ね30〜60分程度。診察・待ち時間を含む所要時間は、日程案内時にご確認ください。</span></div></section>
    <section id="cases" class="section cases-section"><div class="wrap"><div class="section-heading"><p class="eyebrow">CASE FOLLOW-UP</p><h2>経過を、丁寧に見ていく。</h2></div><p class="section-intro">使用許可と掲載内容を確認できた症例から、同じ条件で撮影した経過写真を順次掲載する予定です。</p><div id="case-gallery"></div><p id="cases-empty-note" class="small muted">現在、掲載できる症例写真はありません。治療結果を示す架空の写真・画像は使用していません。</p></div></section>
    <section id="price" class="section wrap"><div class="two-column price-layout"><div class="section-heading"><p class="eyebrow">PRICE</p><h2>費用について</h2><p class="section-intro">自由診療のため、<br>健康保険は適用されません。</p></div><div class="price-card"><div class="price-top"><h3>${escape(C.treatment.name)}</h3>${badge(C.treatment.priceStatus)}</div><p class="price-amount"><strong>${escape(C.treatment.price)}</strong><span>${escape(C.treatment.priceUnit)}</span><small>（仮）</small></p><p class="price-status">料金は検討中です。正式な金額ではありません。</p><dl class="price-details"><div><dt>税込・税別の区分</dt><dd>確認中</dd></div><div><dt>施術範囲・回数</dt><dd>確認中</dd></div><div><dt>診察・麻酔・再診等の費用</dt><dd>含まれる範囲を確認中</dd></div></dl><p class="small muted">総額・追加費用・お支払い条件は、正式なご案内でお知らせします。同意書では再施術は別途費用、返金保証なしとされています。最終条件は公開前に確認します。</p></div></div></section>
    <section id="risks" class="section risks-section"><div class="wrap"><div class="section-heading"><p class="eyebrow">RISKS & AFTERCARE</p><h2>リスクとダウンタイムも、<br>事前にご確認ください。</h2></div><div class="risk-columns"><div><h3>主なリスク・副作用</h3><ul class="bullet-list">${C.medical.risks.map((r) => `<li>${escape(r)}</li>`).join("")}</ul></div><div><h3>施術後の経過・生活の目安</h3><dl class="aftercare-list">${C.medical.downtime.map(([term, text]) => `<div><dt>${escape(term)}</dt><dd>${escape(text)}</dd></div>`).join("")}</dl></div></div><div class="risk-note"><h3>診察時にお伝えいただきたいこと</h3><p>${escape(C.medical.precautions)}</p><p>症状や回復の経過には個人差があります。異常な痛み・腫れ・発熱などがある場合は、速やかに医療機関へ連絡してください。</p></div><p class="source-note">提供された治療説明資料・施術同意書に基づく説明です。担当医が最終確認した内容を公開前に反映します。</p></div></section>
    <section id="location" class="section wrap"><div class="two-column location-layout"><div><p class="eyebrow">LOCATION</p><h2>通いやすい地域を、<br>お聞かせください。</h2><p class="section-intro">初期の施術場所は、伊丹市内を軸に調整しています。他の地域のご希望も、今後の開催を検討するために伺います。</p><a class="text-link" href="#register" data-intent="inquiry">施術場所について問い合わせる</a></div><div class="location-card">${badge(C.venue.status)}<h3>${escape(C.venue.text)}</h3><p class="venue-date">${escape(C.venue.date)}</p><p class="small muted">医療機関名・住所・担当医・開催日は、契約と調整が整った後にご案内します。</p></div></div><div class="region-picker"><p>希望する地域を選んで、登録フォームへ</p><div>${C.regions.map((r) => `<a class="region-option" href="#register" data-region="${escape(r.id)}"><strong>${escape(r.name)}</strong><small>${escape(r.status)}</small><span aria-hidden="true">↗</span></a>`).join("")}</div></div><details class="service-plan"><summary>地域連携の運営構想を見る <span>ご説明用</span></summary><div><p>希望登録を地域ごとに集約し、医師・医療機関と開催日を調整するサービスへの発展を想定しています。</p><ol><li><b>希望登録・地域</b><span>地域ごとの希望状況を把握</span></li><li><b>医師・医療機関</b><span>担当可能な医師と会場を調整</span></li><li><b>開催日・予約</b><span>条件の確定後、個別にご案内</span></li><li><b>症例・経過</b><span>同意と確認のもと継続して記録</span></li></ol><p class="small muted">本デモに管理機能・実際の登録情報の蓄積はありません。開催人数の基準、地域の拡大、運営体制は検討中です。</p></div></details></section>`;

  function renderCases() {
    const validObservation = (o) =>
      /^(assets\/cases\/)[a-zA-Z0-9_./-]+\.(webp|png|jpe?g)$/.test(o.image) &&
      !o.image.includes("..") && o.alt && o.label;
    const brochure = C.brochureGallery;
    const brochureRecords = brochure?.enabled && brochure.publicationAuthorized
      ? brochure.records.filter((record) => record.observations?.length >= 2 && record.observations.every(validObservation))
      : [];
    const approved = C.cases.filter(
      (c) =>
        c.status === "approved" &&
        c.consentConfirmed === true &&
        c.medicalReviewConfirmed === true &&
        c.sameConditionsConfirmed === true &&
        c.treatment &&
        c.totalCost &&
        c.risks &&
        c.observations?.length &&
        c.observations.every(validObservation),
    );
    const gallery = document.getElementById("case-gallery");
    document.getElementById("cases-empty-note").hidden = approved.length > 0 || brochureRecords.length > 0;
    if (brochureRecords.length) {
      document.querySelector("#cases .section-intro").textContent = brochure.intro;
    }
    if (!approved.length && !brochureRecords.length) {
      gallery.innerHTML = `<div class="case-placeholder case-editorial"><div class="case-placeholder-heading"><span class="eyebrow">PHOTOGRAPHIC RECORD</span><h3>症例写真掲載予定</h3><p>同じ条件の写真で、変化を記録する。</p></div><div class="planned-photo-pair" aria-label="症例写真掲載予定の空枠"><div><span>BEFORE</span><b>施術前</b><small>写真掲載予定</small></div><div><span>FOLLOW-UP</span><b>施術後の経過</b><small>写真掲載予定</small></div></div><div class="case-timeline"><span>撮影条件を統一</span><i aria-hidden="true"></i><span>経過を記録</span><i aria-hidden="true"></i><span>継続して掲載</span></div><small>掲載許可・内容の確認後、経過写真を順次追加します。</small></div>`;
      return;
    }
    const brochureHTML = brochureRecords.length ? `<div class="brochure-gallery">${brochureRecords.map((record) => `<article class="brochure-record"><h3>${escape(record.title)}</h3><div class="brochure-photo-pair">${record.observations.map((o, i) => `<figure><figcaption><span aria-hidden="true">${i === 0 ? "BEFORE" : "FOLLOW-UP"}</span><b>${escape(o.label)}</b></figcaption><div class="brochure-photo-frame">${sourceImage(o)}</div></figure>`).join("")}</div></article>`).join("")}</div><div class="brochure-caption"><p class="brochure-source">出典：${escape(brochure.source)}</p><p>${escape(brochure.note)}</p><p class="small muted">${escape(brochure.details)}</p><div class="brochure-related"><a class="text-link" href="#price">現在の仮料金を見る</a><a class="text-link" href="#risks">リスク・副作用を見る</a></div></div>` : "";
    gallery.innerHTML = brochureHTML + approved
      .map(
        (c) =>
          `<article class="case-record"><h3>${escape(c.title || "治療経過")}</h3><div class="case-photos">${c.observations.map((o) => `<figure><img src="${escape(o.image)}" alt="${escape(o.alt)}" loading="lazy" width="600" height="600"><figcaption>${escape(o.label)}</figcaption></figure>`).join("")}</div><dl><dt>治療内容・回数</dt><dd>${escape(c.treatment)}</dd><dt>費用総額</dt><dd>${escape(c.totalCost)}</dd><dt>主なリスク・副作用</dt><dd>${escape(c.risks)}</dd></dl><p class="small">治療結果には個人差があり、同様の結果を保証するものではありません。</p></article>`,
      )
      .join("");
  }
  renderCases();

  const prefectures = [
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県",
    "海外",
  ];
  document.getElementById("registration-content").innerHTML =
    `<div class="registration-grid"><aside class="registration-aside"><h3>今すぐ治療を決めなくても、<br>大丈夫です。</h3><p>希望する地域や治療経験をお聞かせいただき、条件が整った際のご案内につなげるためのフォームです。</p><ul><li>希望登録は予約・契約ではありません。</li><li>開催や施術を確約するものではありません。</li><li>正式な費用・日程は個別案内を予定しています。</li></ul><div class="demo-note"><b>このフォームはデモです</b><p>入力内容は送信・保存されません。実際の個人情報は入力せず、デモ用の内容でお試しください。</p><button type="button" id="fill-demo" class="text-button">デモ用の内容を入力する <span aria-hidden="true">↗</span></button></div></aside><div class="form-shell"><ol class="form-progress" aria-label="入力の進行状況"><li aria-current="step"><span>1</span>入力</li><li><span>2</span>確認</li><li><span>3</span>完了</li></ol><form id="interest-form" autocomplete="off" novalidate><fieldset class="intent-field"><legend>ご希望の内容 <span class="required">必須</span></legend><label><input type="radio" name="intent" value="register" checked> 施術希望登録</label><label><input type="radio" name="intent" value="inquiry"> お問い合わせ</label></fieldset><div class="form-row"><label for="full-name">お名前 <span class="required">必須</span></label><input id="full-name" name="fullName" required maxlength="60" placeholder="例：デモ 太郎" autocomplete="off"></div><div class="form-row"><label for="age">年代 <span class="required">必須</span></label><select id="age" name="age" required><option value="">選択してください</option>${["20代未満", "20代", "30代", "40代", "50代", "60代", "70代以上", "回答を控える"].map((x) => `<option>${x}</option>`).join("")}</select></div><fieldset class="residence-field"><legend>お住まいの地域 <span class="required">必須</span></legend><div class="split-fields"><div><label for="prefecture">都道府県</label><select id="prefecture" name="prefecture" required><option value="">選択してください</option>${prefectures.map((x) => `<option>${x}</option>`).join("")}</select></div><div><label for="city">市区町村</label><input id="city" name="city" required maxlength="100" placeholder="例：伊丹市"></div></div><p class="field-help">番地・建物名は不要です。</p></fieldset><fieldset class="contact-field"><legend>ご連絡先 <span class="required">必須</span></legend><div class="contact-options"><label><input type="radio" name="contactMethod" value="email" checked> メール</label><label><input type="radio" name="contactMethod" value="phone"> 電話</label></div><label class="visually-hidden" for="contact" id="contact-label">メールアドレス</label><input id="contact" name="contact" type="email" inputmode="email" required maxlength="254" placeholder="例：demo@example.com" aria-describedby="contact-help"><p id="contact-help" class="field-help">デモのため、メールの送信・電話の発信は行いません。</p></fieldset><div class="form-row"><label for="experience">これまでの薄毛治療 <span class="required">必須</span></label><select id="experience" name="experience" required><option value="">選択してください</option>${["治療を受けたことはない", "現在、治療を受けている", "以前、治療を受けていた", "相談時に伝えたい"].map((x) => `<option>${x}</option>`).join("")}</select></div><div class="form-row"><label for="region">施術を希望する地域 <span class="required">必須</span></label><select id="region" name="region" required><option value="">選択してください</option>${C.regions.map((r) => `<option value="${escape(r.id)}">${escape(r.name)}</option>`).join("")}</select><p class="field-help">希望地域での開催をお約束するものではありません。</p></div><div class="form-row" id="other-region-row" hidden><label for="other-region">具体的な希望地域 <span class="required">必須</span></label><input id="other-region" name="otherRegion" maxlength="100" placeholder="例：京都市内" disabled></div><div class="form-row"><label for="message">ご質問・ご希望 <span class="optional">任意</span></label><textarea id="message" name="message" rows="4" maxlength="1000" placeholder="気になることや、ご希望の時期などをご記入ください。"></textarea></div><label class="consent"><input type="checkbox" name="acknowledge" required><span>デモであり、入力内容は送信・保存されず、実際の希望登録・予約は行われないことを確認しました。<span class="required">必須</span></span></label><p class="form-error" id="form-error" role="alert" hidden></p><button class="button form-submit" type="submit">入力内容を確認する <span aria-hidden="true">→</span></button><p class="field-help form-note">実際の個人情報の取扱い方針は、本受付の開始前に掲載します。</p></form><section id="form-confirmation" tabindex="-1" hidden aria-labelledby="confirmation-title"><p class="eyebrow">CONFIRMATION</p><h3 id="confirmation-title">入力内容をご確認ください</h3><dl id="confirmation-values" class="confirmation-values"></dl><p class="demo-inline">実際の登録・送信は行われません。</p><div class="form-actions"><button type="button" class="button button-outline" id="edit-form">入力に戻る</button><button type="button" class="button" id="complete-demo">登録デモを完了する</button></div></section><section id="form-success" tabindex="-1" hidden aria-labelledby="success-title"><span class="success-mark" aria-hidden="true">✓</span><p class="eyebrow">DEMO COMPLETE</p><h3 id="success-title">登録のデモが完了しました</h3><p>入力内容は送信・保存されていません。<br>実際の希望登録・予約は行われていません。</p><div class="next-guidance"><b>本受付の開始後は</b><p id="success-region"></p><p>地域ごとの希望状況をもとに、医師・医療機関と開催を調整。条件が整い次第、個別にご案内する流れを予定しています。</p></div><button type="button" class="button button-outline" id="restart-demo">入力内容を消去して戻る</button></section></div></div>`;

  const form = document.getElementById("interest-form");
  const confirmPanel = document.getElementById("form-confirmation");
  const successPanel = document.getElementById("form-success");
  const error = document.getElementById("form-error");
  const field = (name) => form.elements.namedItem(name);
  let snapshot = null;
  let currentStage = 0;
  function stage(index) {
    currentStage = index;
    form.hidden = index !== 0;
    confirmPanel.hidden = index !== 1;
    successPanel.hidden = index !== 2;
    document.querySelectorAll(".form-progress li").forEach((li, i) => {
      li.classList.toggle("done", i < index);
      if (i === index) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
    });
    document.getElementById("fill-demo").disabled = index !== 0;
  }
  function syncRegion() {
    const isOther = field("region").value === "other";
    document.getElementById("other-region-row").hidden = !isOther;
    field("otherRegion").disabled = !isOther;
    field("otherRegion").required = isOther;
    if (!isOther) field("otherRegion").value = "";
  }
  function syncContact() {
    const phone = field("contactMethod").value === "phone";
    const contact = field("contact");
    contact.type = phone ? "tel" : "email";
    contact.inputMode = phone ? "tel" : "email";
    contact.placeholder = phone ? "例：090-0000-0000" : "例：demo@example.com";
    if (phone) contact.pattern = "[+0-9０-９()（）ー−\\s-]{8,25}";
    else contact.removeAttribute("pattern");
    document.getElementById("contact-label").textContent = phone
      ? "電話番号"
      : "メールアドレス";
    contact.setCustomValidity("");
  }
  field("region").addEventListener("change", syncRegion);
  form.querySelectorAll('[name="contactMethod"]').forEach((input) =>
    input.addEventListener("change", () => {
      field("contact").value = "";
      syncContact();
    }),
  );
  form.addEventListener("input", (event) => {
    if (event.target.setCustomValidity) event.target.setCustomValidity("");
    event.target.removeAttribute("aria-invalid");
    error.hidden = true;
  });
  function selectRegion(region) {
    if (!C.regions.some((r) => r.id === region))
      throw new Error("未対応の地域です");
    if (currentStage !== 0)
      throw new Error("入力画面に戻ってから地域を選択してください");
    field("region").value = region;
    syncRegion();
    return {
      region,
      name: C.regions.find((r) => r.id === region).name,
      stage: "input",
      sent: false,
    };
  }
  document.querySelectorAll("[data-region]").forEach((a) =>
    a.addEventListener("click", () => {
      if (currentStage !== 0) {
        stage(0);
        snapshot = null;
      }
      selectRegion(a.dataset.region);
    }),
  );
  document.querySelectorAll("[data-intent]").forEach((a) =>
    a.addEventListener("click", () => {
      stage(0);
      snapshot = null;
      field("intent").value = "inquiry";
    }),
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    ["fullName", "city", "contact", "otherRegion"].forEach((name) => {
      const el = field(name);
      el.value = el.value.trim();
      el.setCustomValidity(
        el.required && !el.value ? "入力してください。" : "",
      );
    });
    if (field("contactMethod").value === "phone") {
      const normalized = field("contact")
        .value.normalize("NFKC")
        .replace(/\D/g, "");
      if (normalized.length < 8 || normalized.length > 15)
        field("contact").setCustomValidity("電話番号を確認してください。");
    }
    if (!form.checkValidity()) {
      error.textContent = "必須項目と入力形式をご確認ください。";
      error.hidden = false;
      const invalid = form.querySelector(
        "input:invalid, select:invalid, textarea:invalid",
      );
      if (invalid) {
        invalid.setAttribute("aria-invalid", "true");
        invalid.focus();
        invalid.reportValidity();
      }
      return;
    }
    snapshot = Object.fromEntries(new FormData(form).entries());
    const regionName = C.regions.find((r) => r.id === snapshot.region)?.name;
    const rows = [
      [
        "ご希望の内容",
        snapshot.intent === "register" ? "施術希望登録" : "お問い合わせ",
      ],
      ["お名前", snapshot.fullName],
      ["年代", snapshot.age],
      ["お住まい", `${snapshot.prefecture} ${snapshot.city}`],
      ["ご連絡先", snapshot.contact],
      ["治療経験", snapshot.experience],
      [
        "希望地域",
        snapshot.region === "other" ? snapshot.otherRegion : regionName,
      ],
      ["ご質問・ご希望", snapshot.message || "記入なし"],
    ];
    document.getElementById("confirmation-values").innerHTML = rows
      .map(([k, v]) => `<div><dt>${escape(k)}</dt><dd>${escape(v)}</dd></div>`)
      .join("");
    stage(1);
    confirmPanel.focus();
  });
  document.getElementById("edit-form").addEventListener("click", () => {
    snapshot = null;
    stage(0);
    field("fullName").focus();
  });
  document.getElementById("complete-demo").addEventListener("click", () => {
    if (!snapshot || currentStage !== 1) return;
    const region =
      snapshot.region === "other"
        ? snapshot.otherRegion
        : C.regions.find((r) => r.id === snapshot.region).name;
    document.getElementById("success-region").textContent =
      `ご希望の地域「${region}」をもとに調整します。`;
    stage(2);
    form.reset();
    syncRegion();
    syncContact();
    snapshot = null;
    document.getElementById("confirmation-values").replaceChildren();
    successPanel.focus();
  });
  document.getElementById("restart-demo").addEventListener("click", () => {
    snapshot = null;
    form.reset();
    syncRegion();
    syncContact();
    document.getElementById("success-region").textContent = "";
    document.getElementById("confirmation-values").replaceChildren();
    stage(0);
    field("fullName").focus();
  });
  document.getElementById("fill-demo").addEventListener("click", () => {
    if (currentStage !== 0) return;
    field("fullName").value = "デモ 太郎";
    field("age").value = "50代";
    field("prefecture").value = "兵庫県";
    field("city").value = "伊丹市";
    field("contactMethod").value = "email";
    syncContact();
    field("contact").value = "demo@example.com";
    field("experience").value = "治療を受けたことはない";
    field("region").value = "itami";
    syncRegion();
    field("message").value = "開催予定について知りたいです。（デモ入力）";
    error.hidden = true;
    form
      .querySelectorAll("[aria-invalid]")
      .forEach((el) => el.removeAttribute("aria-invalid"));
    for (const el of form.elements)
      if (el.setCustomValidity) el.setCustomValidity("");
    field("fullName").focus();
  });

  // 対応ブラウザだけで希望地域の選択を公開。個人情報取得・実送信ツールは持たない。
  if (document.modelContext?.registerTool) {
    const lifecycle = new AbortController();
    try {
      Promise.resolve(
        document.modelContext.registerTool(
          {
            name: "select_preferred_region",
            title: "希望地域を選択",
            description:
              "登録デモの入力画面で希望地域を選択します。登録・送信はしません。",
            inputSchema: {
              type: "object",
              properties: {
                regionId: { type: "string", enum: C.regions.map((r) => r.id) },
              },
              required: ["regionId"],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false, untrustedContentHint: false },
            execute(input) {
              if (
                !input ||
                typeof input !== "object" ||
                Object.keys(input).some((k) => k !== "regionId") ||
                typeof input.regionId !== "string"
              )
                throw new Error("regionIdを指定してください");
              const result = selectRegion(input.regionId);
              document.getElementById("register").scrollIntoView();
              return result;
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {}
    window.addEventListener("pagehide", () => lifecycle.abort(), {
      once: true,
    });
  }
})();
