
# Googleフォームでファイルを受け取ってNotion Task Trackerにタスクを自動作成する手順

## 1. ファイル添付機能付きのGoogleフォームの作成

1. Googleフォームを作成
2. 質問タイプから「ファイルのアップロード」を選択
3. 「ファイルの種類」「アップロード数の制限」などを設定（必要に応じて）
4. 「Googleドライブに保存されることを通知」の表示確認

## 2. 添付先のフォルダIDの入手の仕方

1. Googleフォームの回答タブを開く
2. 「スプレッドシートにリンク」をクリックし、回答データをスプレッドシートに連携
3. 回答に添付されたファイルのリンク（Googleドライブ）を確認
4. ファイルが保存されるドライブフォルダを開く
5. URL例：
   ```
   https://drive.google.com/drive/folders/XXXXXXXXXXXXXXXXXXXXX
   ```
6. `XXXXXXXXXXXXXXXXXXXXX` の部分が「フォルダID」

## 3. Notion Integrationの設定の仕方とTOKENの入手

1. https://www.notion.so/my-integrations にアクセス
2. 「+ New integration」をクリック
3. 名前を入力し、必要な権限（少なくとも「Insert content」）を選択
4. 作成後に表示される「Internal Integration Token」をコピーして保存（例: `secret_xxxxxx`）

## 4. Notion Task TrackerのIDの入手

1. Notionで目的のTask Tracker（ボードビューなど）を開く
2. 右上の「…」メニューから「Copy link」またはURLバーを確認
3. URL例：
   ```
   https://www.notion.so/yourworkspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` の部分が「データベースID」

## 5. Apps Script の実装内容と設定

### スクリプトの作成

1. https://script.google.com にアクセスし「+ 新しいプロジェクト」を作成
2. `main.gs`の中の以下を修正して貼り付け

```javascript
const NOTION_TOKEN = 'secret_xxxxxxxxxxxxx'; // Step 3で取得したToken
const NOTION_DATABASE_ID = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Step 4で取得したDB ID
const FOLDER_ID = 'xxxxxxxxxxxxxxxxxxxx'; // Step 2で取得したフォルダID
```

### トリガーの設定（定期実行）

1. スクリプト画面左の「時計」アイコン（トリガー）をクリック
2. 「トリガーを追加」ボタンをクリック
3. 以下を設定：
   - 実行関数：`checkNewFilesAndCreateNotionTasks`
   - イベントの種類：時間主導型
   - 時間の間隔：15分など

---

