# Memotea

## インストール

- VSCode - エディター\
  各OSの最新バージョンを以下のサイトからダウンロードしてインストール
  [https://code.visualstudio.com/download](https://code.visualstudio.com/download)

- Node.js - JS実行環境\
  LTSの最新バージョンを選択（.nvmrcファイルに正確な値を記載）\
  ※ Node.jsを直接使用するよりNode.jsのバージョン管理を使用することを推奨\
  windowsの場合fnmがお勧め（.nvmrcファイルで切り替え可能）

- pnpm - パッケージ管理\
  以下のコマンドでインストール

  ```
  npm install -g pnpm
  ```

- Git - バージョン管理\
  最新バージョンをサイトからダウンロードしてインストール\
  [https://git-scm.com/downloads](https://git-scm.com/downloads)

## プラグイン

1. VSCodeの拡張機能の検索で「@recommended」と入力
2. お勧めの拡張機能が表示されるので必要も応じてインストール

## ソースコード

- 以下リポジトリをクローン\
  HTTPS\
  https://github.com/hosotani422/nuxt3.git\
  SSH\
  git@github.com:hosotani422/nuxt3.git

## 設定

- .vscode/settings.jsonファイルから自動で反映（何もしなくて良い）

## パッケージ

- 以下のコマンドでインストール

  ```
  pnpm i
  ```

## ビルド

- 以下のコマンドで開発環境実行

  ```
  pnpm run dev
  ```

- 以下のコマンドで本番資材生成

  ```
  pnpm run build
  ```
