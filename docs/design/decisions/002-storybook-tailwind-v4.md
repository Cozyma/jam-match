---
title: "ADR-002: Storybook + Tailwind CSS v4 の互換性対応"
description: "Storybook webpack環境でTailwind v4を動作させるためのPostCSS設定"
tags: [adr]
date: 2026-04-06
status: accepted
---

# ADR-002: Storybook + Tailwind CSS v4 の互換性対応

## 背景

- Storybook 10.3.4 + Tailwind CSS v4 + @tailwindcss/postcss を組み合わせて使用
- Storybookはwebpackベースだが、Tailwind v4の`@import "tailwindcss"`構文をデフォルトでは正しく処理できない
- StorybookのiframeでCSSが無限再コンパイルされ、画面がブリンク（点滅）する現象が発生

## 決定内容

- `.storybook/main.ts` の `webpackFinal` でPostCSS loaderの設定を上書きし、`@tailwindcss/postcss` プラグインを明示的に指定
- `.storybook/preview.ts` で `globals.css` をインポートしてテーマ変数を適用

## 代替案

| 案 | 却下理由 |
|---|---------|
| Storybook用の別CSSファイルを作成 | Tailwind v4のimport構文を避けてプレーンCSSで変数定義する方法だが、メンテナンスの二重管理が発生する |
| @storybook/experimental-addon-test等のViteベースに移行 | Tailwind v4はViteと親和性が高いが、@storybook/nextjsフレームワークがwebpack前提のため移行コストが大きい |
| Tailwind v3にダウングレード | 問題は解消するがv4のメリット（パフォーマンス、新構文）を失う |

## 結果

- webpackFinalでのPostCSS設定上書きで問題解決
- globals.cssを共有することでNext.js本体とStorybookのスタイルが完全一致
- 将来StorybookがViteベースに移行すれば、この設定は不要になる可能性あり
