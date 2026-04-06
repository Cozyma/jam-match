---
title: 開発ガイド -- jam-match の育て方（具体例付き）
description: 本リポジトリで実際に機能を追加・変更する際のステップを具体例で解説するガイド
tags: [ガイド, 開発フロー, 具体例, Issue, PR, ブランチ, ADR]
---

# 開発ガイド -- jam-match の育て方

このドキュメントでは、本リポジトリで **実際に機能を追加・変更していく流れ** を具体例で解説します。

POLICY.md（開発ポリシー）の「理論」に対して、こちらは「実践」のドキュメントです。

---

## 目次

1. [全体の流れ（5分で理解）](#全体の流れ5分で理解)
2. [具体例 1: フロントエンド画面追加（Next.js App Router + shadcn/ui）](#具体例-1-フロントエンド画面追加nextjs-app-router--shadcnui)
3. [具体例 2: Supabaseテーブル追加・マイグレーション](#具体例-2-supabaseテーブル追加マイグレーション)
4. [具体例 3: リアルタイム機能追加（Supabase Realtime）](#具体例-3-リアルタイム機能追加supabase-realtime)
5. [ブランチ命名規則](#ブランチ命名規則)
6. [コミットメッセージの書き方](#コミットメッセージの書き方)
7. [ADR（設計判断記録）の書き方](#adr設計判断記録の書き方)
8. [よくある質問](#よくある質問)

---

## 全体の流れ（5分で理解）

どんな変更でも、基本は **Issue → ブランチ → 実装 → ADR → PR → マージ** の流れです。

```
1. Issue を作る
   「何を・なぜ作るか」を明文化する

2. ブランチを切る
   git checkout -b feature/XX-description

3. 実装する
   コードを書く + テストを書く

4. ADR を書く
   docs/design/decisions/ に「なぜそう作ったか」を記録する

5. コミット & プッシュ
   git push -u origin feature/XX-description

6. PR を作る
   gh pr create --title "feat: ... #XX"

7. レビュー & マージ
   gh pr merge --merge --delete-branch
```

**この流れをこれから具体例で見ていきます。**

---

## 具体例 1: フロントエンド画面追加（Next.js App Router + shadcn/ui）

> **例: マッチング一覧画面の実装**
>
> ユーザーのマッチング結果を一覧表示する画面を Next.js App Router で追加する。

### Step 1: Issue を作る

```
タイトル: [Impl]: マッチング一覧画面の実装

本文:
## 1. 関連する仕様・ADR
- docs/design/screens.md（画面設計）

## 2. 実装タスク
- [ ] /matches ページ（Server Component でデータ取得）
- [ ] MatchCard コンポーネント（shadcn/ui の Card ベース）
- [ ] 空状態の表示
- [ ] ローディング表示（loading.tsx）
- [ ] テスト

## 3. 完了条件 (Definition of Done)
- [ ] 画面が正常に表示されること
- [ ] テストが通ること
```

### Step 2: ブランチを切って実装する

```bash
# main を最新にしてからブランチを切る
git checkout main
git pull origin main
git checkout -b feature/12-matching-screen
```

**ディレクトリ構成（App Router）:**

```
src/app/matches/
├── page.tsx          →  /matches        （一覧・Server Component）
├── loading.tsx       →  ローディング表示
├── error.tsx         →  エラー表示
└── _components/
    └── match-card.tsx  →  マッチカード（Client Component）
```

**実装のポイント:**

| ファイル | 内容 |
|---------|------|
| `src/app/matches/page.tsx` | Server Component。Supabase からデータ取得して一覧表示 |
| `src/app/matches/_components/match-card.tsx` | shadcn/ui の Card を利用したマッチカード |
| `src/app/matches/loading.tsx` | Skeleton UI でローディング表示 |

### Step 3: ADR を書く

`docs/design/decisions/YYYY-MM-DD-matching-screen.md` を作成:

```markdown
---
title: "ADR-XXX: マッチング一覧画面の実装"
description: "マッチング一覧画面のコンポーネント構成と設計判断"
tags: [adr, Next.js, shadcn/ui]
date: YYYY-MM-DD
status: accepted
---

# ADR-XXX: マッチング一覧画面の実装

## 背景
マッチング結果をユーザーに一覧表示する画面が必要だった。

## 決定内容
- Server Component でデータ取得し、初回表示を高速化
- shadcn/ui の Card コンポーネントをベースにマッチカードを構築
- ページ固有コンポーネントは `_components/` に配置

## 代替案
| 案 | 却下理由 |
|---|---------|
| Client Component で全データ取得 | 初回表示が遅く、SEO にも不利 |
| カスタム CSS で Card を実装 | shadcn/ui で十分。統一感を優先 |

## 結果
- Server Component により初回表示のパフォーマンスが確保された
- shadcn/ui の活用でデザインの統一性を維持
```

**必ず `docs/INDEX.md` も更新します。**

### Step 4: コミット → PR → マージ

```bash
# ステージング
git add src/app/matches/ \
        docs/design/decisions/YYYY-MM-DD-matching-screen.md \
        docs/INDEX.md

# コミット（Conventional Commits で）
git commit -m "feat: マッチング一覧画面の実装

Server Component + shadcn/ui Cardでマッチング一覧を表示。

Closes #12"

# プッシュ & PR
git push -u origin feature/12-matching-screen
gh pr create --title "feat: マッチング一覧画面の実装 #12" --body "..."
```

---

## 具体例 2: Supabaseテーブル追加・マイグレーション

> **例: メッセージテーブルの追加**
>
> マッチしたユーザー間でチャットするためのメッセージテーブルを追加する。

### Step 1: マイグレーションファイルを作成する

```bash
# Supabase CLI でマイグレーションファイルを生成
supabase migration new create_messages_table
```

生成されたファイル（`supabase/migrations/YYYYMMDDHHMMSS_create_messages_table.sql`）に SQL を記述:

```sql
-- メッセージテーブル
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS を有効化
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ポリシー: マッチの当事者のみ読み書き可能
CREATE POLICY "マッチ当事者のみ参照可能" ON messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_a_id FROM matches WHERE id = match_id
      UNION
      SELECT user_b_id FROM matches WHERE id = match_id
    )
  );

CREATE POLICY "マッチ当事者のみ送信可能" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND auth.uid() IN (
      SELECT user_a_id FROM matches WHERE id = match_id
      UNION
      SELECT user_b_id FROM matches WHERE id = match_id
    )
  );

-- インデックス
CREATE INDEX idx_messages_match_id ON messages(match_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

### Step 2: ローカルで適用・確認する

```bash
# ローカル Supabase にマイグレーションを適用
supabase db reset

# 型定義を再生成
supabase gen types typescript --local > src/types/database.types.ts
```

### Step 3: ADR を書く → コミット → PR

ADR には以下を記録:
- テーブル設計の判断（正規化レベル、RLS ポリシーの方針）
- インデックス選定の理由
- 代替案（JSON カラムに格納 vs 正規化テーブル 等）

```bash
git add supabase/migrations/ src/types/database.types.ts \
        docs/design/decisions/YYYY-MM-DD-messages-table.md \
        docs/INDEX.md
git commit -m "feat: メッセージテーブル追加

マッチ当事者間チャット用のmessagesテーブルとRLSポリシーを追加。

Closes #18"
```

---

## 具体例 3: リアルタイム機能追加（Supabase Realtime）

> **例: チャットのリアルタイム受信**
>
> メッセージテーブルへの INSERT をリアルタイムで受信し、画面に即時反映する。

### Step 1: Supabase 側の設定

Supabase Dashboard または SQL でテーブルのリアルタイムを有効化:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

### Step 2: クライアント側の実装

```tsx
// src/app/matches/[matchId]/chat/_components/chat-messages.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ChatMessages({ matchId, initialMessages }) {
  const [messages, setMessages] = useState(initialMessages);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, supabase]);

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  );
}
```

**実装のポイント:**

| 観点 | 判断 |
|------|------|
| データ取得 | 初回は Server Component で取得し、props で渡す |
| リアルタイム | Client Component で Supabase Realtime を購読 |
| クリーンアップ | `useEffect` の return で `removeChannel` を呼ぶ |
| フィルタ | `match_id` でフィルタし、無関係なメッセージを除外 |

### Step 3: ADR → コミット → PR

ADR には Realtime vs Polling の比較、RLS との組み合わせの注意点などを記録する。

---

## ブランチ命名規則

| 接頭辞 | 用途 | 例 |
|-------|------|-----|
| `feature/` | 新機能・機能追加 | `feature/12-matching-screen` |
| `fix/` | バグ修正 | `fix/15-realtime-disconnect` |
| `docs/` | ドキュメント変更 | `docs/20-adr-matching-algorithm` |
| `chore/` | 設定・依存関係の更新 | `chore/update-dependencies` |
| `refactor/` | リファクタリング | `refactor/18-extract-hooks` |

**パターン:** `{接頭辞}/{Issue番号}-{英語の短い説明}`

---

## コミットメッセージの書き方

[Conventional Commits](https://www.conventionalcommits.org/) に従います。

```
{type}: {日本語の簡潔な説明}

{詳細な説明（任意）}

Closes #{Issue番号}
```

**type の一覧:**

| type | 用途 | 例 |
|------|------|-----|
| `feat` | 新機能 | `feat: マッチング一覧画面の実装` |
| `fix` | バグ修正 | `fix: Realtime接続切断時の再接続処理追加` |
| `docs` | ドキュメント | `docs: チャット機能ADR作成` |
| `test` | テスト | `test: メッセージ送信のテスト追加` |
| `chore` | 雑務・設定 | `chore: shadcn/ui Button追加` |
| `refactor` | リファクタリング | `refactor: Supabaseクライアント初期化をhookに分離` |
| `ci` | CI/CD | `ci: Vercelプレビューデプロイ設定` |

---

## ADR（設計判断記録）の書き方

**ADR = 「なぜそう作ったか」を未来の自分やチームメンバーに残す記録。**

### いつ書く？

- Issue を完了するとき（推奨）
- アーキテクチャ上の重要な判断をしたとき（必須）

### どこに置く？

```
docs/design/decisions/YYYY-MM-DD-{英語kebab-case}.md
```

### テンプレート

`docs/design/decisions/_template.md` を参照してください。

### 良い ADR の特徴

- **背景** が「なぜ必要だったか」を簡潔に説明している
- **決定内容** が箇条書きで具体的に書かれている
- **代替案** に検討した選択肢と却下理由がある
- **結果** にトレードオフが明記されている

### ADR を書いたら必ずやること

```bash
# docs/INDEX.md に1行追加
| `docs/design/decisions/YYYY-MM-DD-xxx.md` | タイトル | #adr |
```

---

## よくある質問

### Q: 小さなバグ修正でも Issue を作るべき？

軽微なバグ修正やタイポ修正は、仕様定義（Phase 1）を省略して直接実装から始めてOKです（POLICY.md 例外規定）。ただし、Issue は作った方がログとして残るのでおすすめです。

### Q: ADR は本当に毎回書く必要がある？

アーキテクチャ上の判断を伴う変更では必須です。単純な画面追加やバグ修正では省略可能ですが、「なぜそうしたか」を後で振り返りたい場面は意外と多いので、迷ったら書くのがおすすめです。

### Q: Supabase のマイグレーションはどう管理する？

`supabase migration new <名前>` でマイグレーションファイルを生成し、SQL を手書きします。ローカルでは `supabase db reset` で適用確認。本番は Supabase Dashboard またはCI経由で適用します。マイグレーションファイルは必ず Git で管理します。

### Q: Server Component と Client Component をどう使い分ける？

| 用途 | 選択 |
|------|------|
| データ取得・初回表示 | Server Component（デフォルト） |
| ユーザー操作・状態管理 | Client Component（`"use client"` 宣言） |
| リアルタイム受信 | Client Component（Supabase Realtime） |
| フォーム送信 | Server Actions または Client Component |

基本は Server Component で作り、インタラクションが必要な部分だけ Client Component にするのがベストプラクティスです。

### Q: shadcn/ui のコンポーネントはどう追加する？

```bash
npx shadcn@latest add button card dialog
```

追加されたコンポーネントは `src/components/ui/` に配置されます。そのまま使うか、プロジェクト固有のラッパーを作って利用します。

### Q: RLS（Row Level Security）はどこでテストする？

ローカルの Supabase 環境（`supabase start`）で検証します。テストユーザーでログインした状態でクエリを実行し、期待通りのデータのみ返されることを確認します。

### Q: PR のサイズの目安は？

**変更ファイル 10 以下、差分 300 行以下** が理想です。大きくなりそうなら Issue を分割してください。

### Q: Vercel へのデプロイはどうなる？

`main` ブランチへのマージで本番デプロイ、PR 作成でプレビューデプロイが自動実行されます。環境変数は Vercel Dashboard で管理します。

### Q: 依存する Issue が完了していない場合は？

待ちます。無理に並行して進めると、マージ時にコンフリクトが発生しやすくなります。依存順序を守って順番に進めるのが安全です。

### Q: テストはどこまで書けばいい？

- コンポーネント: 表示確認 + ユーザー操作（クリック・入力等）
- Server Actions / API Route: 正常系 + 主要な異常系
- Supabase 連携: RLS ポリシーの検証をローカルで実施
- 外部サービス連携: 必ずモック化
