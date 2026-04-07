---
title: ドキュメント一覧
description: jam-match プロジェクトのドキュメント目次
tags: [Index, ドキュメント]
---

# Documentation Index

本プロジェクトのドキュメント一覧です。
ファイル名/パスは英語・ケバブケース、内容は日本語で記述されています。

| File Path | Title / Description (Japanese) | Tags |
| :--- | :--- | :--- |
| `docs/INDEX.md` | **ドキュメント一覧**<br>本ファイル。ドキュメント全体の目次。 | #Index |
| `docs/standards/coding.md` | **コーディング規約**<br>Next.js / TypeScript / Supabase のコーディング規約（SSOT）。 | #規約 #コーディング |
| `docs/standards/naming.md` | **命名規則**<br>コード・データベース・ファイルの命名規則（SSOT）。 | #規約 #命名規則 |
| `docs/standards/testing.md` | **テスト規約**<br>Vitest / React Testing Library / Playwright のテスト方針・規約（SSOT）。 | #規約 #テスト |
| `docs/policies/docs-and-testing-policy.md` | **ドキュメント管理方針とテスト基本方針**<br>docs管理・エージェント運用・テスト基本方針。 | #規約 #ドキュメント #テスト |
| `docs/design/` | **設計**<br>設計ドキュメントを集約（置き分け: `docs/design/document-placement-guide.md`）。 | #設計 |
| `docs/design/document-placement-guide.md` | **設計ドキュメント配置ガイド**<br>`basic` と `functional-specs` の置き分け基準。 | #設計 #ガイド |
| `docs/design/screens.md` | **画面設計**<br>画面一覧（MVP）、ナビゲーション構成、ワイヤーフレーム。 | #設計 #画面 |
| `docs/design/components.md` | **コンポーネント設計**<br>共通コンポーネント設計、カラーテーマ、習熟度カラー、shadcn/ui基盤コンポーネント詳細一覧。 | #設計 #コンポーネント |
| `docs/design/decisions/` | **設計判断**<br>ADR（Architecture Decision Records）。 | #設計 #ADR |
| `docs/design/basic/screen-design/` | **設計（基本）**<br>画面設計書。 | #設計 |
| `docs/design/functional-specs/` | **設計（機能）**<br>機能設計書（仕様・計画・ガイド）を格納。 | #設計 |
| `docs/design/functional-specs/use-cases.md` | **ドメイン操作ユースケース一覧**<br>ルーム・レパートリーの操作系・表示系ユースケースと実装状況。 | #設計 #ユースケース |
| `docs/design/detailed/` | **設計（詳細）**<br>処理フロー・実装詳細。 | #設計 #実装 |
| `docs/database/` | **データベース**<br>Supabase スキーマドキュメント。 | #データベース |
| `docs/operations-guide/` | **運用ガイド**<br>運用手順、テストデータ作成手順など。 | #運用 |
| `docs/POLICY.md` | **開発ポリシー**<br>仕様駆動+Issue駆動の開発ワークフロー、SSOT原則、コミット規約、ブランチ命名規則。 | #規約 #ポリシー #ワークフロー |
| `docs/guidelines/development-guide.md` | **開発ガイド**<br>開発フローの具体例付き実践ガイド（画面追加・DB変更・Realtime）。 | #ガイド #開発フロー #具体例 |
| `docs/design/decisions/_template.md` | **ADRテンプレート**<br>設計判断記録のテンプレート。 | #ADR #テンプレート |
| `docs/design/decisions/001-v0dev-prototyping.md` | **ADR-001: v0.devによるUIプロトタイピング採用**<br>MVP UI構築にv0.devを採用、コピペ方式で運用する決定。 | #ADR #v0 #プロトタイプ |
| `docs/design/decisions/002-storybook-tailwind-v4.md` | **ADR-002: Storybook + Tailwind CSS v4 の互換性対応**<br>Storybook webpack環境でTailwind v4を動作させるためのPostCSS設定。 | #ADR #Storybook #Tailwind |
| `docs/design/decisions/003-supabase-nextjs16-integration.md` | **ADR-003: Supabase + Next.js 16 App Router 統合方針**<br>@supabase/ssrを使用したクライアント3種構成とNext.js 16 proxy対応。 | #ADR #Supabase #Next.js |
| `docs/database/schema.md` | **データベーススキーマ**<br>5テーブルの定義、RLSポリシー、インデックス、Realtime設定。 | #データベース #Supabase #スキーマ |
| `docs/design/v0-prompts.md` | **v0.devプロンプト集**<br>画面プロトタイプ生成用プロンプト。推奨順に8画面分。 | #設計 #v0 #プロトタイプ |
