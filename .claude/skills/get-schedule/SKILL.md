---
name: get-schedule
description: プロレスの興行スケジュールを取得するスキル
---

このスキルは、今後の日本国内のプロレスの興行スケジュールを取得するためのものです。以下の手順で説明します。:

1. 以下のサイトからスケジュールを取得します。引数で団体を指定できるようにします。
   - 新日本プロレス: https://www.njpw.co.jp/schedule
   - 全日本プロレス: https://www.all-japan.co.jp/events
   - プロレスリング・ノア: https://www.noah.co.jp/schedule
   - DDTプロレスリング: https://www.ddtpro.jp/schedules
2. スケジュールのページから以下の情報を取得します。スケジュールページから取得できない場合は、興行の詳細ページから取得します。
   - 日付
   - 興行名
   - 会場
   - 都道府県
   - リンク
   - 開始時間
3. 抽出した情報をdata/events以下にYAML形式で保存します。
   - ファイル名は{promotion}_{year}.yamlとします。
   - 例: njpw_2026.yaml
4. 次ページがある場合は、次ページも同様に処理します。
   - 例: https://www.njpw.co.jp/schedule?page=2