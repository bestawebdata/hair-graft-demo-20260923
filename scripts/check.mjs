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
for (const file of ["app.js", "content.js"])
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
check(c.cases.length === 0, "症例データなし");
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
console.log("Static checks passed. Browser layout must be checked separately.");
