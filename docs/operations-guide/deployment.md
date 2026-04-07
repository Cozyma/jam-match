---
title: デプロイガイド
description: Bluegrass GONG の本番環境デプロイ手順（Vercel + Supabase Cloud）
tags: [運用, デプロイ, Vercel, Supabase]
created: 2026-04-07
---

# デプロイガイド

## 構成

| サービス | 用途 | プラン | URL |
|---------|------|--------|-----|
| Vercel | Next.js ホスティング | Hobby（無料） | https://jam-match.vercel.app |
| Supabase Cloud | DB・Auth・Realtime | Free | https://ptrhfxwuccewanwytges.supabase.co |

## 初回デプロイ手順

### 1. Supabase Cloud プロジェクト作成

1. https://supabase.com でプロジェクト作成（リージョン: Tokyo 推奨）
2. Settings > API Keys から **Publishable key** と **Project URL** を控える

### 2. マイグレーション適用

```bash
# Supabase CLI ログイン（トークンは https://supabase.com/dashboard/account/tokens で生成）
export SUPABASE_ACCESS_TOKEN=<your-token>

# プロジェクトをリンク
npx supabase link --project-ref <project-ref>

# マイグレーション適用
npx supabase db push

# Seed データ投入
npx supabase db query -f supabase/seed.sql --linked
```

### 3. Supabase Auth 設定

Dashboard → Authentication → URL Configuration で以下を設定:

- **Site URL**: `https://jam-match.vercel.app`
- **Redirect URLs**: `https://jam-match.vercel.app/**`

### 4. Vercel デプロイ

```bash
# Vercel CLI ログイン
npx vercel login

# プロジェクトをリンク
npx vercel link --yes

# 環境変数を設定
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production --value "https://<project-ref>.supabase.co" --yes
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --value "<publishable-key>" --yes

# 本番デプロイ
npx vercel --prod --yes
```

## 更新デプロイ

```bash
# コードを push 後に手動デプロイ
npx vercel --prod --yes
```

GitHub リポジトリを Vercel に接続すれば、push で自動デプロイも可能（Vercel Dashboard → Git Integration）。

## DB マイグレーション追加時

```bash
export SUPABASE_ACCESS_TOKEN=<your-token>
npx supabase db push
```

## 注意事項

- **Supabase Free 枠**: 1 週間無操作で DB が一時停止する（アクセスで自動復帰）
- **Vercel Hobby 枠**: 商用利用は Pro プラン推奨。100GB/月 帯域制限あり
- **環境変数**: `NEXT_PUBLIC_` プレフィクスはクライアントに公開される（anon key は公開前提の設計）
