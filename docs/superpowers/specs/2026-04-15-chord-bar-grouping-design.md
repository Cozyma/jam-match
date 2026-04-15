# コード進行 小節区切り表示機能

## 概要

コード進行をUI上で小節単位（4/6/8小節）のボックス区切りで表示する。
パートラベル付き（A:/B:/Verse:/Chorus:）の曲はラベルをボックスヘッダに表示し、
フラットなコード列の曲は `bar_group` カラムの値で自動改行する。

## 背景

- 全236曲中、約60曲がパートラベル付き、約175曲がフラットな一列コード
- 現状は `<pre>` でテキストをそのまま表示しており、構造的な区切りがない
- 演奏中にコード進行を追うには、小節単位の視覚的区切りが必要

## データ層

### DBマイグレーション

`songs` テーブルに1カラム追加:

```sql
ALTER TABLE songs ADD COLUMN bar_group integer DEFAULT 4;
```

- デフォルト値 `4`（ほとんどのブルーグラス曲は4/4拍子で4小節区切り）
- 3拍子ワルツ等は `6`、長めのパターンは `8` に設定
- moderator または作成者がUIから変更可能

### CSVフォーマット

現状維持。`bar_group` カラムをCSVに追加する場合は別タスク。
初期値はすべて `4` で、必要な曲だけUI経由で調整。

### TypeScript型定義

`database.ts` の songs Row に `bar_group: number | null` が自動生成される。

## パーサー

`src/lib/chord-utils.ts` に追加:

```typescript
export type ChordSection = {
  label: string | null     // "A", "B", "Verse", "Chorus", null
  lines: string[][]        // [["G","G","Em","Em"], ["G","G","D","G"]]
}

export function parseChordSections(raw: string, barGroup: number): ChordSection[]
```

### パース処理フロー

1. `|` でセグメント分割
2. 各セグメントの先頭で `A:`, `B:`, `Verse:`, `Chorus:`, `Bridge:` 等のラベルを検出・抽出
3. 残りのコードトークンをスペース区切りで分割
4. `barGroup` 個ずつグループ化して `lines` に格納
5. 連続する同一ラベル（or ラベルなし）のセグメントはマージ

### パートラベル検出パターン

```
/^(A|B|C|D|Verse|Chorus|Bridge|Intro|Outro|Tag)\s*:/i
```

### 入出力例

**入力**: `"A: A D A A E A | B: A A A E A"`, barGroup=4

**出力**:
```json
[
  { "label": "A", "lines": [["A","D","A","A"], ["E","A"]] },
  { "label": "B", "lines": [["A","A","A","E"], ["A"]] }
]
```

**入力**: `"G G Em Em G G D G"`, barGroup=4

**出力**:
```json
[
  { "label": null, "lines": [["G","G","Em","Em"], ["G","G","D","G"]] }
]
```

## UI表示

### コンポーネント構造

`song-detail-sheet.tsx` 内のコード表示部分を改修。

現状の `<pre>{displayChords}</pre>` を、構造化された `ChordSection[]` のレンダリングに置き換え。

### ビジュアルデザイン

Tailwind CSSの `border`, `rounded`, `divide-y` で実装。

#### パートラベル付き

```
┌ A ─────────────────┐
│ A   D   A   A       │
│ E   A               │
├ B ─────────────────┤
│ A   A   A   E       │
│ A                   │
└─────────────────────┘
```

- 各セクションは `border` + `divide-y` で区切り
- ラベルは左上に小さいバッジとして表示（`bg-stone-200 text-xs rounded px-1.5`）
- セクション間はボーダーで区切り、1つの連続ボックスとして表示

#### フラット（ラベルなし）

```
┌─────────────────────┐
│ G   G   Em   Em     │
├─────────────────────┤
│ G   G   D    G      │
└─────────────────────┘
```

- 各行（barGroup個のコード）を `divide-y` で区切り

#### コードのレイアウト

- 各コードは `font-mono` で等幅表示
- コード間はスペースで区切り（`gap-3` or `min-w-[2.5rem]` で幅を揃える）
- Nashville度数表示もそのまま適用（トグルは既存のまま）

### Nashville対応

`parseChordSections` はコード文字列をそのまま保持。
表示時に `showNashville` フラグに応じて各コードトークンに `chordsToNashville` 内のコード→度数変換を適用。

既存の `chordsToNashville` はテキスト全体を変換する関数なので、
個別コードトークンに適用するための小さなラッパー or 各行を結合して適用。

## 編集UI

既存の編集モード（Key/テンポの横）に `bar_group` セレクタを追加:

```
[Key: G ▼]  [テンポ: Fast ▼]  [小節区切り: 4 ▼]
```

- ラベル: 「区切り」
- 選択肢: `4` / `6` / `8`
- 保存時に `bar_group` もDBに書き込み

## 影響範囲

### 変更ファイル

1. `supabase/migrations/XXXXXX_add_bar_group.sql` — マイグレーション
2. `src/types/database.ts` — 型再生成（`supabase gen types` で自動）
3. `src/lib/chord-utils.ts` — `parseChordSections` 関数追加
4. `src/components/song-detail-sheet.tsx` — コード表示部分の改修 + 編集UIに `bar_group` セレクタ追加

### 変更しないもの

- `song-search-screen.tsx` — 検索・フィルタに影響なし
- `song-card.tsx` — カード上のコード表示は現状のまま（詳細シートのみ改修）
- `seed.sql` — 既存データはそのまま（`DEFAULT 4` で対応）
- CSVフォーマット — 変更なし

## テスト観点

- パートラベル付き曲のパースが正しく動作すること
- フラットなコード列が barGroup 値で正しく分割されること
- barGroup=6 の場合（ワルツ等）で正しく区切られること
- Nashville表示モードとの組み合わせが正しく動作すること
- 編集モードで bar_group が保存・反映されること
- コードが空 or null の曲でエラーにならないこと
