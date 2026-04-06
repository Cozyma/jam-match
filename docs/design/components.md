# コンポーネント設計

## 共通
- Header: アプリロゴ + ナビゲーション
- BottomNav: ホーム / レパートリー / プロフィール

## 画面固有
- SongCard: 曲情報カード（タイトル、キー、パートアイコン）
- RepertoireForm: レパートリー登録フォーム（パート/ボーカル/キー/習熟度）
- RoomCode: 部屋コード表示 + QRコード
- MatchList: マッチング結果リスト
- MatchToggle: Strict/Normal/Loose 切り替え
- MemberList: ルーム参加者一覧
- SongDetail: 曲詳細展開（参加者別パート表示）

## カラーテーマ

| トークン | 値 | Tailwind |
|---------|-----|----------|
| Primary | #b45309 | amber-700 |
| Primary-fg | white | white |
| Secondary | #57534e | stone-600 |
| Background | #fafaf9 | stone-50 |
| Card | white | white |
| Border | #e7e5e3 | stone-200 |
| Accent | #059669 | emerald-600 |
| Muted | #a8a29e | stone-400 |

## 習熟度カラー

| 記号 | 意味 | カラー |
|-----|------|--------|
| ◎ | ready | emerald-600 |
| ○ | with_practice | amber-500 |
| △ | learning | stone-400 |

## コンポーネント詳細一覧（shadcn/ui基盤）

| コンポーネント | shadcn基盤 | 用途 |
|--------------|-----------|------|
| BottomNav | カスタム | 3タブナビ。ルーム内で切替 |
| SongMiniCard | Card | マッチングリスト1行。曲名/キー/パートサマリー/習熟度ドット/カバー率 |
| SongDetail | Collapsible | カード展開。参加者別パート・習熟度・ボーカル・対応キー |
| MatchToggle | ToggleGroup | Strict/Normal/Loose切替 |
| SearchBar | Input | インクリメンタル曲検索 |
| FilterChips | Toggle | 歌あり/インスト/All |
| FilterDropdown | Select | Key/テンポのフィルタ |
| PartBadge | Badge | パートアイコン（🎸🪕🎻🎤等） |
| ProficiencyDot | カスタム | ◎○△の色ドット表示 |
| RoomHeader | カスタム | ルーム名+共有ボタン |
| MemberList | カスタム | 参加者一覧 |
| RepertoireForm | Form/Select | レパートリー登録（パート/ボーカル/キー/習熟度） |
| QRDisplay | カスタム(qrcode.react) | QRコード表示 |
| RoomCodeInput | InputOTP | 6桁コード入力 |
