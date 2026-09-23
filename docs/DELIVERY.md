# 公開情報

2026年9月23日、GitHub Pagesのビルド成功と公開URLのHTTP 200応答を確認しました。

- [ブラウザで見るデモ](https://bestawebdata.github.io/hair-graft-demo-20260923/)
- [新規GitHubリポジトリ](https://github.com/bestawebdata/hair-graft-demo-20260923)
- ソースブランチ：`codex/hair-graft-demo`
- 公開ブランチ：`gh-pages`（`dist/` の内容だけを公開）

HTML・JavaScript・CSS・画像・robots.txtの6ファイルが、ローカル版と同じ内容で配信されていることをハッシュ比較で確認しました。公開URLからのDOM実行でも治療説明とフォームが読み込まれることを確認しています。

## ローカルで見る

`dist/index.html` をブラウザで直接開くか、Macでは `デモを開く.command` をダブルクリックしてください。ネット接続・ビルド・サーバーは不要です。

GitHub Pagesは公開URLです。デモ表記と検索除外を設定していますが、URLを知っている方は閲覧できます。実際の受付・予約・送信はありません。

## 残る確認

自動ブラウザがこの実行環境の権限制約で起動できず、実画面のスクリーンショット検証は未完了です。詳しくは `QA.md` を参照してください。医療・広告・価格・施設の最終確認事項は `../TODO.md` にまとめています。
