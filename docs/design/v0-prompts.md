---
title: v0.dev プロンプト集
description: v0.devで画面プロトタイプを生成するためのプロンプト一覧。推奨順に並べている。
tags: [design, v0, prototype, ui]
---

# v0.dev プロンプト集

生成順序はコア部品 → 画面の順。生成結果は `src/components/` に取り込む。

---

## 1. SongMiniCard + SongDetail（最重要コンポーネント）

```
Create a mobile-first song card component for a bluegrass jam session app using shadcn/ui and Tailwind CSS.

Theme: warm woody natural feel - amber-700 primary, stone-50 background, white cards, stone-200 borders.

**SongMiniCard (collapsed state):**
- Song title on top-left, key badge on top-right (e.g. "Key: G")
- Middle row: instrument icons with count (🎸×2 🪕×1 🎻×1) on left, vocal summary (🎤Lead+Har) on right
- Bottom row: colored proficiency dots on left (green=ready, amber=needs practice, gray=learning), coverage "5/5人" on right
- White card with subtle stone-200 border, rounded-lg

**SongDetail (expanded via accordion/collapsible):**
When card is tapped, expand to show per-member details in a table-like layout:
- Each row: member name, instrument icon, proficiency dot, vocal role, preferred keys
- Example rows:
  - 田中 🎸 ●(green) Lead G,A
  - 鈴木 🪕 ●(green) - G
  - 佐藤 🎻 ●(amber) Harmony(H) G,D

Use shadcn/ui Card, Collapsible, Badge components. Show 3 example cards in a list, one expanded.
```

---

## 2. MatchToggle + マッチング画面

```
Create a mobile jam session room screen for a bluegrass app using shadcn/ui and Tailwind CSS.

Theme: amber-700 primary, stone-50 background, emerald-600 accent.

**Header:**
- Back arrow on left, room name "Room: JAM-A3F2" center, share button on right
- "参加者: 5人" subtitle

**Match Toggle (segmented control):**
- Three options: "Strict" / "Normal" / "Loose"
- "Normal" selected by default with amber-700 active state
- Use shadcn/ui ToggleGroup

**Song List:**
- Below toggle, show "共通曲: 12曲" count
- List of SongMiniCard components (placeholder cards with song title, key, instrument icons, proficiency dots, coverage)
- 3-4 example cards

**Bottom Bar (room-specific):**
- Two buttons: "👥 メンバー" and "退出"
- Replaces normal bottom nav
- Sticky bottom, white background, top border

Full mobile viewport (375px width). Japanese text.
```

---

## 3. BottomNav + レイアウトシェル

```
Create a mobile app layout shell for a bluegrass jam session app using shadcn/ui and Tailwind CSS.

Theme: amber-700 primary, stone-50 background.

**Header:**
- App name "Bluegrass GONG" with a music note icon, left-aligned
- Clean, minimal

**Bottom Navigation (3 tabs):**
- Home (🏠 ホーム), Repertoire (🎸 レパートリー), Profile (👤 プロフィール)
- Active tab: amber-700 color with filled icon
- Inactive: stone-400 with outline icon
- White background, top border stone-200
- Sticky bottom, safe-area padding for mobile

Show the layout with placeholder content area. Mobile viewport 375px.
```

---

## 4. ホーム画面

```
Create a mobile home screen for a bluegrass jam session app called "Bluegrass GONG" using shadcn/ui and Tailwind CSS.

Theme: warm woody - amber-700 primary, stone-50 background, white cards.

**Content (3 action cards, stacked vertically with gap):**

Card 1: "🎸 マイレパートリー"
- Subtitle: "42曲登録済み"
- Right arrow indicator
- Tappable card style

Card 2: "🚪 ルームに参加"
- Subtitle: "コードを入力"
- Right arrow indicator

Card 3: "＋ ルームを作成"
- Subtitle: "新しいセッションを始める"
- Amber-700 background, white text (primary action)

Cards should have subtle shadow, rounded-lg, padding. Mobile viewport with bottom nav placeholder.
```

---

## 5. 曲検索 + フィルタ

```
Create a mobile song search screen for a bluegrass repertoire app using shadcn/ui and Tailwind CSS.

Theme: amber-700 primary, stone-50 background.

**Search Bar:**
- Search icon + placeholder "曲名で検索..."
- Full width, rounded, stone-100 background

**Filter Row 1 (chips/toggles):**
- Three toggle chips: "歌あり" / "インスト" / "All"
- "All" selected by default (amber-700 active)

**Filter Row 2 (dropdowns):**
- Two select dropdowns side by side: "Key ▼" and "テンポ ▼"
- Compact, stone-100 background

**Results List:**
- Song items, each showing:
  - Song title (left), key + tempo + main instrument (below title, muted text)
  - Action button on right: "＋ 追加" (outline) or "✓ 登録済" (emerald, disabled look)
- Divider between items
- Show 5-6 example songs (Foggy Mountain Breakdown, Blue Moon of Kentucky, etc.)

Use shadcn/ui Input, Toggle, Select, Button. Mobile viewport.
```

---

## 6. RepertoireForm（レパートリー登録）

```
Create a mobile form for registering a song to a user's repertoire in a bluegrass app using shadcn/ui and Tailwind CSS.

Theme: amber-700 primary, stone-50 background.

**Context:** User tapped "追加" on "Foggy Mountain Breakdown" - show as sheet/drawer from bottom.

**Form fields:**

1. Song title (read-only display): "Foggy Mountain Breakdown" with Key: G badge

2. パート (Part) - required, single select:
   Options: Guitar / Banjo / Mandolin / Fiddle / Bass / Dobro / Other
   Use icon + text for each option. Radio group or segmented style.

3. ボーカル (Vocal) - single select:
   Options: Lead / Harmony (High) / Harmony (Low) / なし
   Default: なし

4. 得意キー (Preferred Keys) - multi select:
   Chip-style toggles: C, D, E, F, G, A, B♭, B
   Multiple can be selected (amber-700 active)

5. 習熟度 (Proficiency) - required, single select:
   ◎ いつでもOK (green dot) / ○ 練習すればOK (amber dot) / △ 挑戦中 (gray dot)
   Card-style radio with colored indicator

**Bottom:** "登録する" primary button (amber-700, full width)

Use shadcn/ui Sheet, RadioGroup, Toggle, Button. Mobile viewport.
```

---

## 7. ルーム作成 + QR + コード入力

```
Create two mobile screens for a bluegrass jam session app using shadcn/ui and Tailwind CSS.

Theme: amber-700 primary, stone-50 background.

**Screen A: Room Created (after creation)**
- Title: "ルームを作成しました！"
- Large room code display: "JAM-A3F2" in big monospace text, with copy button
- QR code below (use a placeholder square with QR-like pattern)
- Text: "このコードまたはQRを共有してメンバーを招待しましょう"
- Button: "ルームに入る" (amber-700, full width)

**Screen B: Join Room**
- Title: "ルームに参加"
- 6-character code input (OTP-style, 6 separate boxes)
- "または" divider
- "QRコードをスキャン" button with camera icon (outline style)
- "参加する" primary button (amber-700, full width, disabled until code filled)

Show both screens side by side or stacked. Use shadcn/ui InputOTP, Button. Mobile viewport.
```

---

## 8. プロフィール

```
Create a mobile profile screen for a bluegrass jam session app using shadcn/ui and Tailwind CSS.

Theme: amber-700 primary, stone-50 background.

**Profile Header:**
- Google avatar (circular, 64px placeholder)
- Display name "田中太郎" editable (pencil icon)
- Email below in muted text

**Main Part Setting:**
- Label: "メインパート"
- Current: 🎸 Guitar (tappable to change)
- Select from: Guitar / Banjo / Mandolin / Fiddle / Bass / Dobro / Other

**Stats Section (card):**
- レパートリー: 42曲
- 参加ルーム: 3回
- Simple grid, 2 columns

**Actions:**
- "ログアウト" destructive button at bottom

Mobile viewport with bottom nav showing profile tab active.
```
