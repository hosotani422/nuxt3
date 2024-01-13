# Memotea

## インストール

- Node.js - 18系の最新バージョン（.nvmrcファイルに記載）
- VSCode - 各OSの最新バージョン
  <br><br>

## Nodeバージョン管理

- windowsの場合fnmがお勧め（.nvmrcファイルに対応）

## プラグイン

1. VSCodeの拡張機能の検索で「@recommended」と入力
2. お勧めの拡張機能が表示されるので全てインストール
   <br><br>

## 設定

- .vscode/settings.jsonファイルが自動で反映（何もしなくて良い）
  <br><br>

## Cordova

- JDK8をインストール
- AndroidStudioをインストール
- gradleをインストール（C:\Program Files\Android\Android Studio\gradleにコピー）
- cordovaをインストール（pnpm install -g cordova）
- 環境変数の設定

1. JAVA_HOME - C:\Program Files\Java\jdk1.8.0_301
2. ANDROID_HOME - C:\Users\user\AppData\Local\Android\Sdk
3. GRADLE_HOME - C:\Program Files\Android\Android Studio\gradle
4. Path - %JAVA_HOME%\bin
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\build-tools\31.0.0
   %GRADLE_HOME%\gradle-7.2\bin

- AndroidStudioの設定

1. Tools ⇒ SDK Manager ⇒ Android SDK
   SDK Platformsタブ
   Hide Obsolete Packages：チェック無
   Show Package Details：チェック有
   Android 12.0 - Android SDK Platform 31：チェック有
   Android 12.0 - Sources for Android 31：チェック有
   SDK Toolsタブ
   Hide Obsolete Packages：チェック無
   Show Package Details：チェック有
   Android SDK Build-Tools 32rc1 - 31.0.0：チェック有
   Android SDK Tools(Obsolete)：チェック有
2. API31の不具合を調整（ファイル名変更）
   C:\Users\user\AppData\Local\Android\Sdk\build-tools\31.0.0\d8.bat ⇒ dx.bat
   C:\Users\user\AppData\Local\Android\Sdk\build-tools\31.0.0\lib\d8.jar ⇒ dx.jar

## Firebase

- firebase-cliをインストール（pnpm install -g firebase-tools）
- ログイン（firebase login）

## パッケージ

```
pnpm i
```

## ビルド

### 開発環境構築

```
pnpm run dev
```

### 本番資材生成

```
pnpm run build
```

### アプリ資材生成

```
pnpm run app
```

### クラウドデプロイ

```
pnpm run web
```
