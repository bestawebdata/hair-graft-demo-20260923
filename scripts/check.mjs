import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "dist/index.html"), "utf8");
const check = (ok, message) => {
  if (!ok) throw new Error(message);
  console.log("OK " + message);
};
for (const file of ["app.js", "content.js", "line-demo.js"])
  execFileSync(process.execPath, [
    "--check",
    path.join(root, "dist/assets", file),
  ]);
check(html.includes("noindex,nofollow,noarchive"), "検索除外のデモ設定");
check(/<html lang="ja">/.test(html), "日本語文書");
for (const [, ref] of html.matchAll(/(?:src|href)="(assets\/[^"#]+)"/g))
  check(
    fs.existsSync(path.join(root, "dist", ref.split("?")[0])),
    `参照ファイル ${ref}`,
  );
const sandbox = { window: {} };
vm.runInNewContext(
  fs.readFileSync(path.join(root, "dist/assets/content.js"), "utf8"),
  sandbox,
);
const c = sandbox.window.SITE_CONTENT;
check(
  c.treatment.price === "30" && c.treatment.priceStatus.includes("検討中"),
  "料金30万円・仮表示",
);
check(
  c.venue.text.includes("伊丹市内") && c.venue.date.includes("未定"),
  "仮の開催地・未定日程",
);
check(c.cases.length === 0, "将来の経過記録に架空データなし");
check(c.brochureGallery.enabled && c.brochureGallery.publicationAuthorized && c.brochureGallery.records.length === 6, "確認済みパンフレット写真6組を表示");
for (const record of c.brochureGallery.records) {
  check(record.observations.length === 2 && record.observations.map((o) => o.label).join("/") === "術前/4か月後", `${record.id} 原資料の左右対応と経過表記`);
  for (const photo of record.observations)
    check(photo.image.startsWith("assets/cases/") && fs.existsSync(path.join(root, "dist", photo.image)) && photo.alt && photo.width > 0 && photo.height > 0, `症例写真 ${photo.image}`);
}
const js = fs.readFileSync(path.join(root, "dist/assets/app.js"), "utf8");
check(
  !/\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage)\b/.test(js),
  "送信・永続保存APIなし",
);
check(
  !/(?:src|href)="https?:\/\//.test(html) && !/https?:\/\//.test(js),
  "外部通信の参照なし",
);
check(c.doctor.name === "上田 敬博", "医師名");
for (const photo of c.doctor.gallery)
  check(
    fs.existsSync(path.join(root, "dist", photo.image)),
    `医師画像 ${photo.image}`,
  );
for (const photo of [c.treatmentVisuals.equipment, c.treatmentVisuals.cartridge, ...c.treatmentVisuals.procedurePhotos])
  check(
    fs.existsSync(path.join(root, "dist", photo.image)) && photo.alt && photo.source && photo.width > 0 && photo.height > 0,
    `出典付き参考写真 ${photo.image}`,
  );
console.log("Static checks passed. Browser layout must be checked separately.");
const lineHtml = fs.readFileSync(path.join(root, "dist/line/index.html"), "utf8");
check(lineHtml.includes("noindex,nofollow,noarchive"), "LINEデモの検索除外設定");
check(html.includes('href="line/index.html"'), "治療LPからLINEデモへのリンク");
for (const [, ref] of lineHtml.matchAll(/(?:src|href)="((?:\.\.\/assets\/)[^"#]+)"/g))
  check(fs.existsSync(path.resolve(root, "dist/line", ref.split("?")[0])), `LINE参照ファイル ${ref}`);
const coordinationDir = path.join(root, 'dist/coordination');
const coordinationHtml = fs.readFileSync(path.join(coordinationDir, 'index.html'), 'utf8');
check(coordinationHtml.includes('noindex,nofollow,noarchive'), '日程調整デモの検索除外設定');
check(html.includes('href="coordination/index.html"'), '治療LPから日程調整デモへのリンク');
for (const file of ['core.js', 'app.js']) execFileSync(process.execPath, ['--check', path.join(coordinationDir, file)]);
for (const [, ref] of coordinationHtml.matchAll(/(?:src|href)="([^"#]+)"/g))
  check(!/^https?:/.test(ref) && fs.existsSync(path.resolve(coordinationDir, ref.split('?')[0])), `日程調整参照ファイル ${ref}`);
