---
title: データベーススキーマ
description: jam-match Supabaseデータベースのスキーマ定義、RLSポリシー、インデックス、Realtime設定
tags: [データベース, Supabase, スキーマ]
---

# データベーススキーマ

## テーブル一覧

| テーブル名 | 説明 |
|-----------|------|
| profiles | ユーザー公開プロフィール（auth.usersと1:1） |
| songs | 曲マスター |
| user_repertoires | レパートリー（ユーザー x 曲） |
| rooms | ジャムセッションルーム |
| room_members | ルーム参加者 |

## ER図

```
auth.users
    |
    | 1:1 (CASCADE)
    v
profiles ──< user_repertoires >── songs
    |
    | 1:N (CASCADE)
    v
rooms ──< room_members >── profiles
```

- `profiles.id` は `auth.users.id` を参照（1:1）
- `user_repertoires` は `profiles` と `songs` の中間テーブル（UNIQUE: user_id + song_id）
- `room_members` は `rooms` と `profiles` の中間テーブル（UNIQUE: room_id + user_id）
- 全ての外部キーに ON DELETE CASCADE を設定

## テーブル定義

### profiles

ユーザーの公開プロフィール。Supabase Authの`auth.users`と1:1で紐付く。

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | uuid | PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE | ユーザーID（auth.uidと同一） |
| display_name | text | NOT NULL | 表示名 |
| main_part | text | | メイン担当パート |
| avatar_url | text | | アバター画像URL |
| created_at | timestamptz | DEFAULT now() | 作成日時 |
| updated_at | timestamptz | DEFAULT now() | 更新日時 |

### songs

曲マスターデータ。初期データとしてブルーグラススタンダード50曲をseed.sqlで投入。

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | 曲ID |
| title | text | NOT NULL, UNIQUE | 曲名 |
| has_vocal | boolean | DEFAULT true | 歌あり/インスト |
| main_instrument | text | | メイン楽器 |
| tempo | text | CHECK (tempo IN ('slow', 'medium', 'fast')) | テンポ感 |
| original_key | text | | 原曲キー |
| created_at | timestamptz | DEFAULT now() | 作成日時 |

### user_repertoires

ユーザーごとのレパートリー登録。1ユーザーにつき1曲1レコード（UNIQUE制約）。

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | レコードID |
| user_id | uuid | NOT NULL, REFERENCES profiles(id) ON DELETE CASCADE | ユーザーID |
| song_id | uuid | NOT NULL, REFERENCES songs(id) ON DELETE CASCADE | 曲ID |
| part | text | NOT NULL, CHECK (part IN ('guitar', 'banjo', 'mandolin', 'fiddle', 'bass', 'dobro', 'other')) | メインパート |
| sub_parts | text[] | NOT NULL, DEFAULT '{}' | サブパート（複数選択可） |
| vocal | text | DEFAULT 'none', CHECK (vocal IN ('lead', 'harmony_high', 'harmony_low', 'none')) | ボーカル |
| preferred_keys | text[] | DEFAULT '{}' | 得意キー（複数選択可） |
| proficiency | text | NOT NULL, CHECK (proficiency IN ('ready', 'with_practice', 'learning')) | 習熟度 |
| is_favorite | boolean | NOT NULL, DEFAULT false | お気に入り |
| created_at | timestamptz | DEFAULT now() | 作成日時 |
| updated_at | timestamptz | DEFAULT now() | 更新日時 |
| | | UNIQUE (user_id, song_id) | ユーザーx曲の一意制約 |

### rooms

ジャムセッションルーム。使い捨て(ephemeral)と永続(persistent)の2種類。

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | ルームID |
| code | text | NOT NULL, UNIQUE | 参加用6桁コード |
| name | text | | ルーム名 |
| owner_id | uuid | NOT NULL, REFERENCES profiles(id) ON DELETE CASCADE | 作成者ID |
| room_type | text | NOT NULL, DEFAULT 'ephemeral', CHECK (room_type IN ('ephemeral', 'persistent')) | ルーム種別 |
| expires_at | timestamptz | | 有効期限 |
| created_at | timestamptz | DEFAULT now() | 作成日時 |

### room_members

ルームへの参加状態を管理。Realtimeで購読される。

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | レコードID |
| room_id | uuid | NOT NULL, REFERENCES rooms(id) ON DELETE CASCADE | ルームID |
| user_id | uuid | NOT NULL, REFERENCES profiles(id) ON DELETE CASCADE | ユーザーID |
| joined_at | timestamptz | DEFAULT now() | 参加日時 |
| | | UNIQUE (room_id, user_id) | ルームxユーザーの一意制約 |

## RLSポリシー一覧

全テーブルでRow Level Security (RLS) を有効化。

| テーブル | ポリシー名 | 操作 | ルール |
|---------|-----------|------|--------|
| profiles | profiles_select | SELECT | 全員閲覧可（`true`） |
| profiles | profiles_insert | INSERT | 自分のレコードのみ（`auth.uid() = id`） |
| profiles | profiles_update | UPDATE | 自分のレコードのみ（`auth.uid() = id`） |
| songs | songs_select | SELECT | 全員閲覧可（`true`） |
| user_repertoires | repertoires_select | SELECT | 全員閲覧可（`true`） |
| user_repertoires | repertoires_insert | INSERT | 自分のレコードのみ（`auth.uid() = user_id`） |
| user_repertoires | repertoires_update | UPDATE | 自分のレコードのみ（`auth.uid() = user_id`） |
| user_repertoires | repertoires_delete | DELETE | 自分のレコードのみ（`auth.uid() = user_id`） |
| rooms | rooms_select | SELECT | 全員閲覧可（`true`） |
| rooms | rooms_insert | INSERT | 認証済みユーザー（`auth.uid() IS NOT NULL`） |
| room_members | members_select | SELECT | 全員閲覧可（`true`） |
| room_members | members_insert | INSERT | 自分のレコードのみ（`auth.uid() = user_id`） |
| room_members | members_delete | DELETE | 自分のレコードのみ（`auth.uid() = user_id`） |

## インデックス一覧

| インデックス名 | テーブル | カラム | 用途 |
|---------------|---------|--------|------|
| idx_user_repertoires_user | user_repertoires | user_id | ユーザー別レパートリー検索 |
| idx_user_repertoires_song | user_repertoires | song_id | 曲別レパートリー検索 |
| idx_room_members_room | room_members | room_id | ルーム別メンバー一覧取得 |
| idx_rooms_code | rooms | code | 参加コードによるルーム検索 |

## Realtime設定

`room_members` テーブルのみRealtimeを有効化。

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE room_members;
```

ルームへのメンバー入退室（INSERT/DELETE）をリアルタイムで検知し、マッチング結果を再計算するために使用。

## 初期データ

`supabase/seed.sql` にてブルーグラススタンダード50曲を投入済み。`supabase db reset` で適用される。
