---
title: テスト規約
description: jam-match プロジェクトにおける Vitest / React Testing Library / Playwright のテスト方針・規約
tags: [規約, テスト, Vitest, Playwright, SSOT]
---

# テスト規約 (Testing Standards)

本ドキュメントは jam-match プロジェクトのテスト規約の**唯一の情報源 (SSOT)** です。

> **TL;DR** – Unit テスト（Vitest）とコンポーネントテスト（React Testing Library）でカバレッジを確保し、主要フローは E2E（Playwright）で担保する。Supabase のテストはローカル DB を利用する。

## テスト階層

| 層 | ツール | DB 利用 | 責務 |
| :--- | :--- | :--- | :--- |
| **Unit** | Vitest | なし | 関数・ロジック単体の検証。**カバレッジの主担当**。 |
| **Component** | Vitest + React Testing Library | なし | コンポーネントの振る舞い（レンダリング・インタラクション）の検証。 |
| **E2E** | Playwright | Supabase (ローカル) | ユーザー操作を模した画面遷移・機能結合の検証。 |

## テスト実行コマンド

| 対象 | コマンド |
| :--- | :--- |
| **全 Unit / Component** | `npx vitest` |
| **単一ファイル** | `npx vitest run path/to/file.test.ts` |
| **カバレッジ** | `npx vitest run --coverage` |
| **E2E（全テスト）** | `npx playwright test` |
| **E2E（UIモード）** | `npx playwright test --ui` |

## ディレクトリ構成

```
src/
├── __tests__/              # Unit / Component テスト（コロケーション可）
├── components/
│   └── room-card.tsx
│       room-card.test.tsx  # コロケーション配置の例
tests/
└── e2e/                    # E2E テスト（Playwright）
    ├── rooms.spec.ts
    └── auth.spec.ts
```

### テストファイルの配置方針

- Unit / Component テストはテスト対象と**同ディレクトリにコロケーション**するのを推奨する
- E2E テストは `tests/e2e/` に集約する

## Unit テスト方針

### 対象

- ユーティリティ関数、カスタムフック、ビジネスロジック
- 純粋関数（入力→出力の変換・計算・判定）を優先する

### 規約

- `assertTrue(true)` のみで成立するテストは作成しない
- private 関数の直接テストは避け、public API 経由で検証する
- モックは「入出力契約」の検証に用い、内部実装への強い依存は避ける
- 時間依存のテストは `vi.useFakeTimers()` で時間を固定する

### 例

```typescript
import { describe, it, expect } from "vitest";
import { formatRoomName } from "@/lib/format-room-name";

describe("formatRoomName", () => {
  it("空白をトリムして返す", () => {
    // Arrange
    const input = "  My Room  ";

    // Act
    const result = formatRoomName(input);

    // Assert
    expect(result).toBe("My Room");
  });
});
```

## Component テスト方針

### 対象

- ユーザーインタラクションを持つコンポーネント
- 条件分岐による表示切り替え

### 規約

- `render` → ユーザー操作（`userEvent`）→ アサーションの順で記述する
- DOM クエリは `getByRole`, `getByLabelText` などアクセシビリティベースのクエリを優先する
- スナップショットテストは原則使用しない（変更検知が粗いため）

### 例

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { RoomCard } from "@/components/room-card";

describe("RoomCard", () => {
  it("参加ボタンクリックで onJoin が呼ばれる", async () => {
    // Arrange
    const onJoin = vi.fn();
    render(<RoomCard room={mockRoom} onJoin={onJoin} />);

    // Act
    await userEvent.click(screen.getByRole("button", { name: "参加" }));

    // Assert
    expect(onJoin).toHaveBeenCalledWith(mockRoom.id);
  });
});
```

## E2E テスト方針（Playwright）

### 対象

- 主要なユーザーフロー（ログイン、ルーム作成・参加、レパートリー管理など）
- 画面遷移を伴う機能結合

### 規約

- テスト名は対象ページが具体的に分かる記載にする（例: `ルーム一覧(/rooms): アクティブなルームが表示される`）
- テストデータはシードスクリプトまたは API 経由で準備する
- テスト間の依存を避け、各テストは独立して実行可能にする

### データとDB運用

- E2E テストは Supabase ローカル開発環境（`supabase start`）を使用する
- テストデータは `supabase/seed.sql` で管理する
- テストで作成したデータは、テスト終了時にクリーンアップする

## Supabase テスト戦略

### ローカル DB の利用

- `supabase start` でローカルの Supabase インスタンスを起動する
- マイグレーション（`supabase/migrations/`）とシード（`supabase/seed.sql`）が適用された状態でテストする
- RLS ポリシーのテストもローカル環境で実施する

### Supabase クライアントのモック

Unit / Component テストでは Supabase クライアントをモック化する:

```typescript
vi.mock("@/lib/supabase", () => ({
  createBrowserClient: () => ({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    }),
  }),
}));
```

## テストコーディング規約

### AAA パターン（必須）

すべてのテストは **Arrange（準備）→ Act（実行）→ Assert（検証）** の構造を厳守。

### テスト命名

**パターン**: 日本語で振る舞いを記述する

```typescript
describe("RoomService", () => {
  it("定員に達したルームには参加できない", async () => {
    // ...
  });

  it("オーナーはルームを削除できる", async () => {
    // ...
  });
});
```

## カバレッジ目標

- **ビジネスロジック**: 80% 以上
- **コンポーネント**: 主要なインタラクションをカバー
- **E2E**: 主要ユーザーフローを網羅

## FAQ

**Q: どのテストを書くべきか迷ったら?**

1. まず **Unit テスト** で書けないか検討
2. コンポーネントの振る舞い検証 → **Component テスト**
3. 画面遷移や複数機能の結合 → **E2E テスト**

**Q: Supabase のモックが複雑になったら?**

モック対象が多い場合は、テスト用のヘルパー関数を `tests/helpers/` に切り出して共通化する。
