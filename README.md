# TODO List API

Hono + Cloudflare Workers + Neon PostgreSQL で構築された TODO リスト管理用の REST API です。

## 技術スタック

- **フレームワーク**: [Hono](https://hono.dev/) v4.10.1
- **ランタイム**: Cloudflare Workers
- **データベース**: Neon PostgreSQL (Serverless)
- **言語**: TypeScript

## 本番環境

- **API URL**: https://hono-api.itu268.workers.dev

## セットアップ

### 前提条件

- Node.js 18 以上
- npm または pnpm
- Cloudflare アカウント
- Neon アカウント

### インストール

```bash
npm install
```

### 環境変数の設定

#### ローカル開発用

`.dev.vars` ファイルを作成:

```bash
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

#### 本番環境用

```bash
npx wrangler secret put DATABASE_URL
```

### データベースセットアップ

Neon SQL Editor で以下を実行:

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, completed) VALUES
  ('Study Hono', false),
  ('Running', true);
```

## 開発

### ローカルサーバー起動

```bash
npm run dev
```

サーバーは `http://localhost:8787` で起動します。

### デプロイ

```bash
npm run deploy
```

## API エンドポイント

### タスク管理

#### 全タスク取得

```http
GET /tasks
```

**レスポンス例**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Study Hono",
      "completed": false
    }
  ]
}
```

#### 単一タスク取得

```http
GET /tasks/:id
```

**レスポンス例**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Study Hono",
    "completed": false
  }
}
```

#### タスク作成

```http
POST /tasks
Content-Type: application/json

{
  "title": "New Task",
  "completed": false
}
```

**レスポンス例**:

```json
{
  "success": true,
  "data": {
    "id": 3,
    "title": "New Task",
    "completed": false
  },
  "message": "Task created successfully"
}
```

#### タスク更新

```http
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Updated Task",
  "completed": true
}
```

**レスポンス例**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Task",
    "completed": true
  },
  "message": "Task updated successfully"
}
```

#### タスク削除

```http
DELETE /tasks/:id
```

**レスポンス例**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Deleted Task",
    "completed": true
  },
  "message": "Task deleted successfully"
}
```

### その他

#### データベース接続確認

```http
GET /db
```

**レスポンス例**:

```json
{
  "version": "PostgreSQL 17.7 ..."
}
```

## フロントエンドとの連携

CORS 設定済みなので、どのフロントエンドからでも利用可能です。

### 使用例 (JavaScript)

```javascript
// 全タスク取得
const response = await fetch("https://hono-api.itu268.workers.dev/tasks");
const data = await response.json();
console.log(data.data);

// タスク作成
const response = await fetch("https://hono-api.itu268.workers.dev/tasks", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "New Task",
    completed: false,
  }),
});
const data = await response.json();
```

## プロジェクト構造

```
src/
├── index.tsx              # エントリーポイント、CORS設定
├── components/
│   └── view.tsx          # JSXコンポーネント
├── routes/
│   ├── tasks.ts          # タスクCRUD API
│   ├── admin.ts          # 管理者エリア (Basic認証)
│   └── db.ts             # DB接続確認
└── data/
    └── tasks.ts          # Task型定義
```

## エラーレスポンス

全てのエラーレスポンスは以下の形式:

```json
{
  "success": false,
  "error": "エラーメッセージ"
}
```

### HTTP ステータスコード

- `200` - 成功
- `201` - 作成成功
- `400` - バリデーションエラー
- `404` - リソースが見つからない
- `500` - サーバーエラー

## セキュリティ

- データベース接続文字列は `wrangler secret` で暗号化管理
- CORS 設定により安全なクロスオリジン通信
- SQL インジェクション対策（パラメータ化クエリ使用）
