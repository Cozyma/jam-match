# Bluegrass GONG

ブルーグラスのジャムセッションで「全員が弾ける共通曲」を即座に見つけるWebアプリ。
参加者が事前に登録したレパートリーをもとに、ルームに集まったメンバーの共通曲をリアルタイムでマッチング表示する。

## 主な機能

- メール/パスワード、Google OAuthによるユーザー認証
- 曲マスター（ブルーグラススタンダード50曲）の閲覧・検索
- レパートリー登録（メインパート / サブパート / ボーカル / 得意キー / 習熟度 / お気に入り）
- マイレパートリー管理（フィルタ・ソート・習熟度インライン切替）
- ルーム作成（QRコード生成・読み取り / 6桁コード共有、24時間で自動消滅）
- 3段階マッチング表示（Strict / Normal / Loose）、カード展開でメンバー詳細
- ルームメンバーの入退室をリアルタイム検知
- 演奏済み曲マーク（全メンバーにRealtime同期）

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5 |
| UI | shadcn/ui + Tailwind CSS v4 |
| アイコン | lucide-react |
| 状態管理 | zustand |
| BaaS | Supabase (PostgreSQL + Auth + Realtime) |
| Supabase連携 | @supabase/ssr 0.10 + @supabase/supabase-js 2.x |
| QRコード | qrcode.react（生成）/ html5-qrcode（読み取り） |
| コンポーネントカタログ | Storybook 10 |
| ランタイム | Node.js / React 19 |

## セットアップ手順

### 前提条件

- Node.js 20以上
- npm
- Docker Desktop（Supabaseローカル環境用）
- WSL2（Windows環境の場合）

### プロジェクトセットアップ

```bash
git clone <repository-url>
cd jam-match
npm install
```

### Supabase ローカル環境

#### Supabaseとは

PostgreSQLベースのオープンソースBaaS（Backend as a Service）。
データベース、認証、リアルタイム通信、ストレージが統合されており、自前のAPIサーバーを構築せずにクライアントから直接データベースを操作できる。
Row Level Security（RLS）により、クライアント直接アクセスでもセキュリティを担保する。

#### ローカル起動の仕組み

`supabase start` を実行すると、Docker上に以下のコンテナが全て起動する:

- **PostgreSQL** - メインデータベース
- **GoTrue** - 認証サーバー
- **Realtime** - WebSocketベースのリアルタイム通知
- **PostgREST** - PostgreSQLのRESTful API
- **Supabase Studio** - GUIダッシュボード

ローカルでも本番と同一のアーキテクチャで動作するため、開発環境と本番環境の差異が最小限になる。

#### 起動手順

```bash
# 1. Supabaseローカル環境を起動（初回はDockerイメージのpullで数分かかる）
npx supabase start

# 2. マイグレーション適用 + 初期データ投入
npx supabase db reset

```

> `seed.sql` にテストユーザー3名（auth.users + profiles + レパートリー）が含まれるため、`db reset` だけで全データが投入される。

#### 起動後のURL一覧

| サービス | URL |
|---------|-----|
| API (PostgREST) | http://localhost:54321 |
| Supabase Studio | http://localhost:54323 |
| Mailpit (メールテスト) | http://localhost:54324 |
| PostgreSQL | `postgresql://postgres:postgres@localhost:54322/postgres` |

#### テストユーザー

| メールアドレス | パスワード | パート |
|--------------|-----------|--------|
| test.user@gmail.com | testpass | Guitar |
| tanaka@example.com | testpass | Banjo |
| suzuki@example.com | testpass | Fiddle |

### 環境変数

`.env.local.example` をコピーして `.env.local` を作成する:

```bash
cp .env.local.example .env.local
```

| 変数名 | 説明 | ローカルでの値 |
|--------|------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase APIのURL | `http://localhost:54321` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabaseの匿名キー | `npx supabase status` で確認 |

`NEXT_PUBLIC_SUPABASE_ANON_KEY` の値は `npx supabase status` の出力に表示される `anon key` をコピーして設定する。

### 開発サーバー起動

```bash
npm run dev       # Next.js → http://localhost:3000
npm run storybook # Storybook → http://localhost:6006
```

## Supabase アーキテクチャ解説

### ディレクトリ構成

```
supabase/
├── config.toml                              # Supabase設定（ポート、Realtime、Studio等）
├── migrations/
│   ├── 20260406000000_initial_schema.sql    # 初期スキーマ（5テーブル）
│   ├── 20260407000000_add_favorite.sql      # is_favorite カラム追加
│   ├── 20260407000001_add_sub_parts.sql     # sub_parts カラム追加
│   ├── 20260407000002_add_profile_fields.sql # area, band_name カラム追加
│   └── 20260407000003_add_room_played_songs.sql # 演奏済み曲テーブル追加
└── seed.sql                                 # 初期データ（曲50曲 + テストユーザー3名 + レパートリー）
```

### データベース設計

6つのテーブルで構成される:

```
auth.users (Supabase管理)
    │
    │ 1:1
    ▼
profiles ──────────────────┐
    │                      │
    │ 1:N                  │ 1:N
    ▼                      ▼
user_repertoires        rooms
    │                      │
    │ N:1                  │ 1:N
    ▼                      ▼
songs                 room_members ← Realtime購読対象
                          │
                          │ 1:N
                          ▼
                    room_played_songs ← Realtime購読対象
```

| テーブル | 役割 |
|---------|------|
| `profiles` | ユーザー公開プロフィール。`auth.users` と1:1でCASCADE削除 |
| `songs` | 曲マスター。タイトル（UNIQUE）、ボーカル有無、メイン楽器、テンポ、原曲キー |
| `user_repertoires` | ユーザーのレパートリー。パート / ボーカル / 得意キー / 習熟度を保持。user_id + song_id でUNIQUE |
| `rooms` | ジャムルーム。6桁コード（UNIQUE）、ephemeral（24h消滅）/ persistent の2種類 |
| `room_members` | ルーム参加者。room_id + user_id でUNIQUE。入退室をRealtimeで購読 |
| `room_played_songs` | ルーム内演奏済み曲。room_id + song_id でUNIQUE。Realtimeで全メンバーに同期 |

#### 主要カラム詳細

**user_repertoires**

| カラム | 値 | 説明 |
|--------|---|------|
| `part` | `guitar` / `banjo` / `mandolin` / `fiddle` / `bass` / `dobro` / `other` | メインパート |
| `sub_parts` | text[] | サブパート（複数選択可） |
| `vocal` | `lead` / `harmony_high` / `harmony_low` / `none` | ボーカル担当 |
| `proficiency` | `ready` / `with_practice` / `learning` | 習熟度（いつでもOK / たぶん弾ける / 挑戦中） |
| `preferred_keys` | text[] | 得意キー（ボーカル担当時のみ） |
| `is_favorite` | boolean | お気に入り |

### クライアント構成（3種類の使い分け）

Next.js App Routerでは実行コンテキストが3つあり、それぞれ別のSupabaseクライアントが必要になる:

| ファイル | 用途 | いつ使う |
|---------|------|---------|
| `src/lib/supabase/client.ts` | ブラウザ用 | `"use client"` コンポーネント内 |
| `src/lib/supabase/server.ts` | サーバー用 | Server Components, Route Handlers |
| `src/lib/supabase/middleware.ts` | ミドルウェア（プロキシ）用 | リクエストごとのセッション更新 |

#### なぜ3つ必要か

Supabaseの認証情報（セッション）はクッキーに保存される。しかし、クッキーへのアクセス方法が実行コンテキストごとに異なる:

| コンテキスト | クッキーアクセス方法 |
|------------|-------------------|
| ブラウザ | `createBrowserClient` が内部で `document.cookie` を使用 |
| サーバー | Next.jsの `cookies()` API経由で `getAll` / `setAll` を実装 |
| ミドルウェア | `request.cookies` で読み取り、`response.cookies` で書き込み |

#### @supabase/ssr とは

上記3パターンのクライアント生成を統一的に扱うライブラリ。
`createBrowserClient` / `createServerClient` を提供し、クッキーのハンドリングを抽象化する。
旧 `@supabase/auth-helpers-nextjs` の後継にあたる。

### 認証フロー

```
[ログイン画面 /login]
    │
    ├─→ メール/パスワード認証 (signInWithEmail / signUpWithEmail)
    │       → Supabase Auth がセッション発行 → クッキーに保存
    │
    └─→ Google OAuth (signInWithGoogle)
            → /auth/callback でコード交換 → セッション発行
    │
    ▼
[proxy.ts] → 全リクエストで updateSession() を実行
    │         → クッキーからセッションを読み取り、期限切れなら自動更新
    ▼
[app-layout.tsx] → useAuth() でユーザー取得
    │              → 未認証なら /login へリダイレクト
    ▼
[useProfile.ensureProfile()] → 初回ログイン時に profiles テーブルへ自動レコード作成
```

> **Next.js 16対応**: Next.js 16では `middleware.ts` が非推奨になったため、`src/proxy.ts` の `proxy` 関数でセッション管理を行っている。

### Row Level Security (RLS)

RLS（Row Level Security）は、PostgreSQLのテーブルレベルで「誰が何を読み書きできるか」をSQLポリシーで定義する仕組み。これにより、APIサーバーを挟まずクライアントからSupabaseに直接アクセスしても安全にデータを保護できる。

#### 本プロジェクトのポリシー

| テーブル | SELECT | INSERT | UPDATE | DELETE |
|---------|--------|--------|--------|--------|
| `profiles` | 全員可 | 自分のみ (`auth.uid() = id`) | 自分のみ | - |
| `songs` | 全員可 | - | - | - |
| `user_repertoires` | 全員可 | 自分のみ (`auth.uid() = user_id`) | 自分のみ | 自分のみ |
| `rooms` | 全員可 | 認証済みユーザー (`auth.uid() IS NOT NULL`) | - | - |
| `room_members` | 全員可 | 自分のみ (`auth.uid() = user_id`) | - | 自分のみ |
| `room_played_songs` | 全員可 | 自分がマーク (`auth.uid() = marked_by`) | - | 自分がマーク |

- **SELECT が全テーブル公開**: マッチングのために全ユーザーのレパートリーを参照する必要があるため
- **書き込み系は `auth.uid()` で制御**: 自分のデータのみ作成・更新・削除が可能

### リアルタイム

`room_members` と `room_played_songs` テーブルがSupabase Realtimeの購読対象として設定されている。

`use-room.ts` の `useRoomMembers` フック内で、メンバーの入退室をWebSocketで検知する:

```typescript
const channel = supabase
  .channel(`room-${roomId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'room_members',
    filter: `room_id=eq.${roomId}`,
  }, () => {
    // メンバー一覧を再取得 → マッチング再計算
    fetch()
  })
  .subscribe()
```

- メンバーがルームに参加/退出すると、同じルームを見ている全クライアントに即座に通知が届き、マッチング結果が自動更新される。
- 演奏済み曲のマーク/解除も同様に全メンバーにリアルタイム同期される。

### 型安全

DBスキーマからTypeScript型を自動生成する:

```bash
npx supabase gen types typescript --local > src/types/database.ts
```

生成される型は3種類:

| 型 | 用途 |
|---|------|
| `Row` | テーブルから取得した行の型 |
| `Insert` | 挿入時に渡すデータの型（デフォルト値のあるカラムはオプショナル） |
| `Update` | 更新時に渡すデータの型（全カラムがオプショナル） |

全クライアント（`client.ts` / `server.ts`）に `Database` 型パラメータを渡すことで、`.from('テーブル名').select(...)` などのクエリが型安全になる:

```typescript
import { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### マイグレーション管理

```bash
npx supabase migration new <name>    # 新規マイグレーションファイル作成
npx supabase db reset                # 全マイグレーション再適用 + seed実行
npx supabase db diff                 # 現在のDB状態との差分からSQL自動生成
```

- `supabase/migrations/` にタイムスタンプ付きSQLファイルとして管理
- Git管理されるため変更履歴が追跡可能
- `db reset` でマイグレーション → `seed.sql` の順に自動適用

## カスタムHooks一覧

| Hook | ファイル | 役割 | 主な関数/値 |
|------|---------|------|-----------|
| `useAuth` | `src/hooks/use-auth.ts` | 認証状態の監視 | `user`, `loading` |
| `useProfile` | `src/hooks/use-profile.ts` | プロフィールのCRUD | `profile`, `updateProfile`, `ensureProfile` |
| `useSongs` | `src/hooks/use-songs.ts` | 曲マスター取得 | `songs`, `loading` |
| `useRepertoire` | `src/hooks/use-repertoire.ts` | レパートリーのCRUD | `repertoire`, `addRepertoire`, `removeRepertoire` |
| `useRoom` | `src/hooks/use-room.ts` | ルーム作成・参加・退出 | `createRoom`, `joinRoom`, `leaveRoom` |
| `useMyRooms` | `src/hooks/use-room.ts` | 参加中ルーム一覧取得 | `rooms`, `loading` |
| `useRoomMembers` | `src/hooks/use-room.ts` | ルームメンバーのリアルタイム監視 | `members`, `loading` |
| `useMatching` | `src/hooks/use-matching.ts` | 共通曲マッチング計算 | `songs` (MatchedSong[]), `loading` |
| `usePlayedSongs` | `src/hooks/use-played-songs.ts` | 演奏済み曲のリアルタイム管理 | `playedSongIds`, `markPlayed`, `unmarkPlayed` |

## 画面構成

| パス | 画面 | 主なHook |
|-----|------|---------|
| `/login` | ログイン | `signInWithEmail`, `signInWithGoogle` |
| `/` | ホーム | `useAuth` |
| `/repertoire` | マイレパートリー / 曲検索（タブ切替） | `useSongs`, `useRepertoire` |
| `/room/create` | ルーム作成（QRコード・コード表示） | `useRoom` |
| `/room/join` | ルーム参加（コード入力） | `useRoom` |
| `/room/[id]` | ルーム内マッチング画面 | `useRoomMembers`, `useMatching`, `usePlayedSongs` |
| `/profile` | プロフィール設定 | `useProfile` |
| `/auth/callback` | OAuth コールバック（Route Handler） | - |

## Storybook

```bash
npm run storybook   # http://localhost:6006 で起動
```

- 全UIコンポーネントのstoryが `src/stories/` に用意されている
- Tailwind CSS v4対応済み（`.storybook/main.ts` でPostCSS設定を追加）
- コンポーネント: SongCard, SongMiniCard, JamRoomScreen, AppLayout, HomeScreen, SongSearchScreen, SongRegisterSheet, RoomCreatedScreen, JoinRoomScreen, ProfileScreen

## ドキュメント

- `docs/INDEX.md` にプロジェクト全ドキュメントの一覧がある
- ADR（Architecture Decision Records）は `docs/design/decisions/` に格納
- データベーススキーマ詳細は `docs/database/schema.md`
- 画面設計は `docs/design/screens.md`
- コンポーネント設計は `docs/design/components.md`

## よくある操作

| やりたいこと | コマンド |
|------------|---------|
| DB初期化（マイグレーション + seed再適用） | `npx supabase db reset` |
| 型再生成 | `npx supabase gen types typescript --local > src/types/database.ts` |
| テーブル確認（GUI） | http://localhost:54323 (Supabase Studio) |
| メール確認（テスト用） | http://localhost:54324 (Mailpit) |
| Supabase停止 | `npx supabase stop` |
| 新規マイグレーション作成 | `npx supabase migration new <name>` |
| DB差分からSQL生成 | `npx supabase db diff` |
| Lint | `npm run lint` |
| ビルド | `npm run build` |
