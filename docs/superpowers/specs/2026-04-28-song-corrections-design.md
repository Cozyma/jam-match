# 曲データ修正リクエスト機能

## 概要

一般ユーザーがコード進行やキー等の誤りを見つけた際に、曲詳細画面からフリーテキストで修正提案を送信できる機能。モデレーターは同じ曲詳細画面内でリクエストを確認し、対応後に削除する。

## 背景

- 曲データ（コード進行・キー・テンポ等）はClaude生成の初期データを含むため誤りがある可能性
- 編集権限はモデレーターと曲作成者のみ
- ユーザーが気軽に誤りを報告できる導線が必要
- GitHub Issue 連携等は不要。DB管理でシンプルに

## データ層

### テーブル定義

```sql
CREATE TABLE song_corrections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id uuid NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

### RLS ポリシー

```sql
ALTER TABLE song_corrections ENABLE ROW LEVEL SECURITY;

-- ログインユーザーは自分の修正提案を投稿できる
CREATE POLICY "Users can insert own corrections"
  ON song_corrections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分の投稿を閲覧できる
CREATE POLICY "Users can view own corrections"
  ON song_corrections FOR SELECT
  USING (auth.uid() = user_id);

-- モデレーターは全件閲覧できる
CREATE POLICY "Moderators can view all corrections"
  ON song_corrections FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'moderator'));

-- モデレーターは対応済みリクエストを削除できる
CREATE POLICY "Moderators can delete corrections"
  ON song_corrections FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'moderator'));
```

### TypeScript 型

`database.ts` の songs テーブル定義と同じパターンで `song_corrections` を追加。

## ユーザー側UI

### 修正提案フォーム（曲詳細画面内）

- 曲詳細シートにログイン済みユーザー向けの「修正を提案」ボタンを追加
- ボタンを押すとテキストエリアが展開される
- テキストエリア + 「送信」「キャンセル」ボタン
- 送信後はフォームを閉じて完了表示（トースト等は不要、フォームが閉じれば十分）
- placeholder: 「コード進行やキーの誤りなど、気づいた点を記入してください」

### 配置

タグセクションの下、編集・削除ボタンの上に配置。

## モデレーター側UI

### 修正リクエスト一覧（曲詳細画面内）

- モデレーターが曲詳細を開くと、その曲への修正リクエスト一覧が表示される
- 各リクエストの表示内容:
  - 本文
  - 投稿日時（相対時間: 「3日前」等）
  - 削除ボタン（ゴミ箱アイコン、対応済みで消す用）
- リクエストが0件の場合は何も表示しない
- 配置: コード進行セクションと編集ボタンの間

## Hooks

### `src/hooks/use-corrections.ts`

```typescript
// 曲IDに紐づく修正リクエストを取得（モデレーター用）
// 修正リクエストを投稿
// 修正リクエストを削除（モデレーター用）
```

Supabase クライアントを使った CRUD 操作。リアルタイム購読は不要。

## 影響範囲

### 変更ファイル

1. `supabase/migrations/XXXXXX_song_corrections.sql` — テーブル + RLS
2. `src/types/database.ts` — song_corrections 型追加
3. `src/hooks/use-corrections.ts` — 新規（fetch / insert / delete）
4. `src/components/song-detail-sheet.tsx` — 提案フォーム + モデレーター用一覧

### 変更しないもの

- 他の画面・コンポーネント
- 既存のテーブル・RLS
- 通知システム（今回スコープ外）

## スコープ外

- 修正リクエストの一覧ページ（`/corrections`）
- 未対応件数のバッジ表示
- 承認/却下ステータス管理
- 通知（メール・プッシュ）
- 投稿者名の表示（プライバシー考慮で今回は省略、モデレーターには日時と本文のみ）
