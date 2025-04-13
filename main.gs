const NOTION_TOKEN = 'XXXX'; // Notion Integrationのシークレット
const NOTION_DATABASE_ID = 'YYYY'; // Notion DBのID
const FOLDER_ID = 'ZZZZ'; // Google DriveのフォルダID

// フォルダ内の新しいファイルをチェック（最終実行時間より後のもの）
function checkNewFilesAndCreateNotionTasks() {
  // logNotionDatabaseProperties()
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.getFiles();
  const lastCheck = PropertiesService.getScriptProperties().getProperty('lastCheck') || 0;
  const now = new Date().getTime();

  while (files.hasNext()) {
    const file = files.next();
    const createdTime = file.getDateCreated().getTime();
    if (createdTime > lastCheck) {
      const fileName = file.getName();
      const fileUrl = file.getUrl();
      createNotionTask(fileName, fileUrl);
    }
  }

  // 最後のチェック時間を更新
  PropertiesService.getScriptProperties().setProperty('lastCheck', now);
}

// Notionにタスクを作成
function createNotionTask(title, url) {
  const payload = {
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      "名前": {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      "ステータス": {
        status: {
          name: "未着手", // ← ステータスは "未着手" / "進行中" / "完了" のどれか
        },
      },
      "関連リンク": {
        url: url,
      },
    },
  };

  const options = {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(payload),
  };

  UrlFetchApp.fetch('https://api.notion.com/v1/pages', options);
}

function logNotionDatabaseProperties() {
  const options = {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
  };

  const response = UrlFetchApp.fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}`, options);
  const json = JSON.parse(response.getContentText());

  Logger.log(JSON.stringify(json.properties, null, 2));
}