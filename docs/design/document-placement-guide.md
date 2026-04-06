---
title: 設計ドキュメント配置ガイド
description: docs/design/basic と docs/design/functional-specs の置き分け基準と、文書の粒度を揃えるための指針
tags: [設計, ドキュメント, ガイド]
---

# 設計ドキュメント配置ガイド

## 目的

- 「どこに置くべきか」で迷う時間を減らす
- 同じ内容が別フォルダに重複して増えるのを防ぐ
- 仕様→画面→実装詳細のトレーサビリティを揃える

## 大原則（まずこれで判断）

- **`docs/design/functional-specs/`**: 機能の **What（何を満たすか）** を定義する
- **`docs/design/basic/`**: 画面・操作・入力/表示など、ユーザー接点の **UI設計（画面の振る舞い）** を定義する

（実装の How を深掘りする場合は `docs/design/detailed/` を優先）

## 置き分け基準

### `docs/design/functional-specs/` に置くもの

- ビジネスルール、状態遷移、判定条件、冪等性、エラー方針などの **機能仕様**
- 外部連携の **I/F 前提**（Supabase Edge Functions、外部 API 連携の仕様）
- 「画面がなくても成立する」仕様（API・バッチ処理・マッチングロジック等）
- 実装計画（`*-implementation-plan-*`）や提案（`*-proposal`）のような、仕様策定プロセスの成果物

### `docs/design/basic/` に置くもの

- 画面単位の仕様（表示項目、入力項目、イベント、画面遷移、文言、バリデーションのUI要件）
- 画面とサーバー側の結線（どの Server Action / API Route を呼ぶか、必要なデータ、コンポーネントに渡す Props の粒度）
- 画面テンプレート・画面イベント定義など、画面設計を効率化するための成果物

### `docs/design/detailed/` に置くもの

- 実装の How（処理フロー、トランザクション境界、例外ハンドリング、パフォーマンス考慮）
- DB スキーマの詳細設計（Supabase マイグレーション設計）
- 外部サービス連携の実装詳細

## 迷ったときの決め方（短い判断フロー）

1. **主語が「画面」か?**（ボタン押下/表示/入力/イベント）→ `basic/`
2. **主語が「機能」か?**（可否判定/状態遷移/ルール/外部I/F）→ `functional-specs/`
3. **実装の How（処理フロー/Tx/詳細手順）に踏み込むか?** → `detailed/`

## 同一機能の推奨セット（揃える粒度）

機能ごとに、最低限以下の揃い方を推奨します。

- `docs/design/functional-specs/<feature>/<feature>-spec-*.md`（機能仕様: ルールのSSOT）
- `docs/design/basic/<feature>/...`（画面がある場合: 画面イベント/表示/入力）
- `docs/design/detailed/<feature>-*-detail.md`（実装詳細: 処理フロー/例外/性能等）
