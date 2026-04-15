# コード進行 小節区切り表示 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** コード進行をUI上で小節単位のボックス区切りで表示し、曲ごとの小節区切り数をDB・UIから管理可能にする。

**Architecture:** `songs.bar_group` カラム（integer, default 4）を追加し、フロント側のパーサー関数 `parseChordSections` でコード文字列を構造化データに変換。`song-detail-sheet.tsx` のコード表示部分をボックス区切りUIに改修。Nashville度数表示トグルは既存のまま維持。

**Tech Stack:** Supabase (PostgreSQL), Next.js App Router, React, TypeScript, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-04-15-chord-bar-grouping-design.md`

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `supabase/migrations/20260415000000_add_bar_group.sql` | bar_group カラム追加 |
| Modify | `src/types/database.ts:194-241` | songs 型に bar_group 追加 (手動) |
| Modify | `src/lib/chord-utils.ts` | `parseChordSections` 関数追加 |
| Modify | `src/components/song-detail-sheet.tsx:63-65, 210-246` | コード表示をボックスUIに改修 + 編集UIに bar_group セレクタ追加 |

---

### Task 1: DB マイグレーション + 型定義

**Files:**
- Create: `supabase/migrations/20260415000000_add_bar_group.sql`
- Modify: `src/types/database.ts:194-241`

- [ ] **Step 1: マイグレーションファイルを作成**

```sql
-- supabase/migrations/20260415000000_add_bar_group.sql
ALTER TABLE songs ADD COLUMN bar_group integer DEFAULT 4;
```

- [ ] **Step 2: TypeScript 型定義を手動更新**

`src/types/database.ts` の `songs` テーブル定義3箇所（Row, Insert, Update）に `bar_group` を追加:

**Row** (line 194-209 付近):
```typescript
Row: {
  artist: string | null
  bar_group: number | null   // ← 追加
  chords: string | null
  // ... 以下既存フィールド
}
```

**Insert** (line 210-225 付近):
```typescript
Insert: {
  artist?: string | null
  bar_group?: number | null   // ← 追加
  chords?: string | null
  // ... 以下既存フィールド
}
```

**Update** (line 226-241 付近):
```typescript
Update: {
  artist?: string | null
  bar_group?: number | null   // ← 追加
  chords?: string | null
  // ... 以下既存フィールド
}
```

- [ ] **Step 3: コミット**

```bash
git add supabase/migrations/20260415000000_add_bar_group.sql src/types/database.ts
git commit -m "feat: songs テーブルに bar_group カラム追加"
```

---

### Task 2: コードパーサー関数

**Files:**
- Modify: `src/lib/chord-utils.ts`

- [ ] **Step 1: parseChordSections 関数と型を追加**

`src/lib/chord-utils.ts` の末尾に以下を追加:

```typescript
export type ChordSection = {
  label: string | null
  lines: string[][]
}

const SECTION_LABEL_RE = /^(A|B|C|D|Verse|Chorus|Bridge|Intro|Outro|Tag)\s*:\s*/i

export function parseChordSections(raw: string, barGroup: number = 4): ChordSection[] {
  if (!raw.trim()) return []

  const segments = raw.split('|').map(s => s.trim()).filter(Boolean)
  const sections: ChordSection[] = []

  for (const segment of segments) {
    const labelMatch = segment.match(SECTION_LABEL_RE)
    const label = labelMatch ? labelMatch[1] : null
    const chordsStr = labelMatch ? segment.slice(labelMatch[0].length).trim() : segment
    const chords = chordsStr.split(/\s+/).filter(Boolean)

    if (chords.length === 0) continue

    const lines: string[][] = []
    for (let i = 0; i < chords.length; i += barGroup) {
      lines.push(chords.slice(i, i + barGroup))
    }

    // Merge with previous section if both have no label
    if (label === null && sections.length > 0 && sections[sections.length - 1].label === null) {
      sections[sections.length - 1].lines.push(...lines)
    } else {
      sections.push({ label, lines })
    }
  }

  return sections
}
```

- [ ] **Step 2: 手動検証 — ブラウザ console で動作確認**

ブラウザの devtools console で以下を確認（ビルドが通ることの確認も兼ねる）:

```bash
npm run dev
```

dev server が正常に起動することを確認。

- [ ] **Step 3: コミット**

```bash
git add src/lib/chord-utils.ts
git commit -m "feat: parseChordSections コードパーサー関数追加"
```

---

### Task 3: コード表示UIをボックス区切りに改修

**Files:**
- Modify: `src/components/song-detail-sheet.tsx:63-65, 210-246`

- [ ] **Step 1: import 追加とパース処理を追加**

`src/components/song-detail-sheet.tsx` の import 行を変更:

既存:
```typescript
import { chordsToNashville } from "@/lib/chord-utils"
```

変更後:
```typescript
import { chordsToNashville, parseChordSections, type ChordSection } from "@/lib/chord-utils"
```

- [ ] **Step 2: displayChords のロジックを構造化データに変更**

既存の `displayChords` 変数（line 63-65）:

```typescript
const displayChords = song.chords
  ? showNashville ? chordsToNashville(song.chords, song.original_key) : song.chords
  : null
```

以下に置き換え:

```typescript
const chordSections: ChordSection[] = song.chords
  ? parseChordSections(
      showNashville ? chordsToNashville(song.chords, song.original_key) : song.chords,
      song.bar_group ?? 4
    )
  : []
```

- [ ] **Step 3: コード表示部分をボックスUIに置き換え**

既存のコード表示ブロック（line 210-246）:

```tsx
{displayChords && (
  <div>
    <div className="mb-1.5 flex items-center justify-between">
      <h4 className="text-sm font-semibold text-stone-700 flex items-center gap-1">
        <Music className="h-3.5 w-3.5" />
        コード進行
      </h4>
      <div className="flex rounded-md border border-stone-200 overflow-hidden text-xs">
        {/* トグルボタン */}
      </div>
    </div>
    <div className="rounded-lg bg-stone-50 border border-stone-200 p-3">
      <pre className="text-sm text-stone-800 whitespace-pre-wrap font-mono leading-relaxed">
        {displayChords}
      </pre>
    </div>
  </div>
)}
```

以下に置き換え:

```tsx
{chordSections.length > 0 && (
  <div>
    <div className="mb-1.5 flex items-center justify-between">
      <h4 className="text-sm font-semibold text-stone-700 flex items-center gap-1">
        <Music className="h-3.5 w-3.5" />
        コード進行
      </h4>
      <div className="flex rounded-md border border-stone-200 overflow-hidden text-xs">
        <button
          type="button"
          onClick={() => setShowNashville(false)}
          className={cn(
            "px-2.5 py-1 transition-colors",
            !showNashville ? "bg-stone-800 text-white" : "bg-white text-stone-600 hover:bg-stone-50"
          )}
        >
          コード
        </button>
        <button
          type="button"
          onClick={() => setShowNashville(true)}
          className={cn(
            "px-2.5 py-1 transition-colors border-l border-stone-200",
            showNashville ? "bg-stone-800 text-white" : "bg-white text-stone-600 hover:bg-stone-50"
          )}
        >
          度数
        </button>
      </div>
    </div>
    <div className="rounded-lg border border-stone-200 overflow-hidden">
      {chordSections.map((section, si) => (
        <div key={si} className={cn(si > 0 && "border-t border-stone-300")}>
          {section.label && (
            <div className="bg-stone-200 px-3 py-0.5">
              <span className="text-xs font-semibold text-stone-600">{section.label}</span>
            </div>
          )}
          <div className="divide-y divide-stone-100 bg-stone-50">
            {section.lines.map((line, li) => (
              <div key={li} className="flex gap-3 px-3 py-1.5">
                {line.map((chord, ci) => (
                  <span key={ci} className="min-w-[2.5rem] font-mono text-sm text-stone-800">
                    {chord}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
```

- [ ] **Step 4: コードが空の場合の条件分岐を更新**

既存（line 261-265）:

```tsx
{!song.chords && !song.lyrics && (
```

この部分はそのまま維持（`song.chords` を直接チェックしているので影響なし）。

- [ ] **Step 5: ビルド確認**

```bash
npm run build
```

ビルドエラーがないことを確認。

- [ ] **Step 6: コミット**

```bash
git add src/components/song-detail-sheet.tsx
git commit -m "feat: コード進行をボックス区切りUIで表示"
```

---

### Task 4: 編集UIに bar_group セレクタ追加

**Files:**
- Modify: `src/components/song-detail-sheet.tsx`

- [ ] **Step 1: editBarGroup ステートを追加**

既存のステート宣言（line 48-54 付近）に追加:

```typescript
const [editBarGroup, setEditBarGroup] = useState("4")
```

- [ ] **Step 2: startEdit 関数に bar_group の初期化を追加**

既存の `startEdit` 関数（line 77-82）:

```typescript
function startEdit() {
  setEditChords(song!.chords || "")
  setEditKey(song!.original_key || "")
  setEditTempo(song!.tempo || "")
  setEditing(true)
}
```

変更後:

```typescript
function startEdit() {
  setEditChords(song!.chords || "")
  setEditKey(song!.original_key || "")
  setEditTempo(song!.tempo || "")
  setEditBarGroup(String(song!.bar_group ?? 4))
  setEditing(true)
}
```

- [ ] **Step 3: handleSave に bar_group の保存を追加**

既存の `handleSave` 関数（line 84-95）の update オブジェクト:

```typescript
await supabase.from("songs").update({
  chords: editChords || null,
  original_key: editKey || null,
  tempo: editTempo || null,
}).eq("id", songId)
```

変更後:

```typescript
await supabase.from("songs").update({
  chords: editChords || null,
  original_key: editKey || null,
  tempo: editTempo || null,
  bar_group: parseInt(editBarGroup, 10),
}).eq("id", songId)
```

- [ ] **Step 4: 編集フォームに bar_group セレクタを追加**

既存の編集UIの Key/テンポ セレクタの横（`<div className="flex gap-3">` 内、line 171-192 付近）に3つ目のセレクタを追加。

既存のテンポ `</div>` の直後（line 192 の閉じ `</div>` の前）に追加:

```tsx
<div className="flex-1 flex flex-col gap-1">
  <Label className="text-xs">区切り</Label>
  <Select value={editBarGroup} onValueChange={setEditBarGroup}>
    <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="区切り" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="4">4小節</SelectItem>
      <SelectItem value="6">6小節</SelectItem>
      <SelectItem value="8">8小節</SelectItem>
    </SelectContent>
  </Select>
</div>
```

- [ ] **Step 5: ビルド確認**

```bash
npm run build
```

ビルドエラーがないことを確認。

- [ ] **Step 6: コミット**

```bash
git add src/components/song-detail-sheet.tsx
git commit -m "feat: 編集UIに小節区切りセレクタ追加"
```

---

### Task 5: 動作確認 + 最終コミット

- [ ] **Step 1: ローカルで Supabase マイグレーション適用**

```bash
npx supabase db push
```

または、ローカル開発の場合:

```bash
npx supabase migration up
```

マイグレーションが正常に適用されることを確認。

- [ ] **Step 2: ブラウザで動作確認**

```bash
npm run dev
```

以下を確認:
1. パートラベル付きの曲（例: Cripple Creek `A: A D A A E A | B: A A A E A`）がラベル付きボックスで表示される
2. フラットなコード列の曲（例: Foggy Mountain Breakdown `G G Em Em G G D G`）が4小節区切りで表示される
3. Nashville度数トグルが正常に動作する
4. 編集モードで「区切り」セレクタが表示され、値を変更して保存できる
5. 保存後、表示が更新される

- [ ] **Step 3: 問題があれば修正してコミット**
