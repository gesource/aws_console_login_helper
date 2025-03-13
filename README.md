# AWS Console Management Login Helper

## 概要

このChrome拡張機能はAWS Management Consoleのログイン情報の入力を支援します。

毎回、アカウントID・パスワード・ユーザー名を入力する手間を省きます。

![アプリのイメージ](./docs/images/app_image.png)


## 使用技術

* [CRXJS](https://crxjs.dev/vite-plugin/)
* [Vite](https://vitejs.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [React](https://react.dev/)
* [React Router](https://reactrouter.com/)
* [MUI](https://mui.com/)

## 使い方

### アカウントの追加

アプリのアイコンをクリックしてウィンドウを表示します。

![アプリのアイコン](./docs/images/extension_icon.png)

追加ボタン（＋）を押します。

![追加ボタン](./docs/images/add_button.png)

アカウント名・アカウントID・パスワード・ユーザー名を入力し、「登録する」ボタンを押します。

* アカウント名は識別・検索用の名前です。
* アカウントID・パスワード・ユーザー名はAWSのログイン情報です。

![登録ページ](./docs/images/add_page.png)

### ログインページの表示

アプリのアイコンをクリックしてウィンドウを表示します。

![アプリのアイコン](./docs/images/extension_icon.png)

ホームボタンを押します。

![ホームボタン](./docs/images/home_button.png)

AWS Management Consoleのログイン画面が表示されます。

### ログイン

アプリのアイコンをクリックしてウィンドウを表示します。

![アプリのアイコン](./docs/images/extension_icon.png)

検索欄に検索キーワードを入力して、Enterキーを押下または検索ボタンを押し、アカウントを絞り込みます。

![検索欄](./docs/images/search_input.png)

アカウントをクリックします。

![アカウント選択](./docs/images/account_select.png)

アカウントのログイン情報が入力されます。

## ビルド

nodeモジュールをインストールします。

```shell
npm install
```

開発用にビルドします。

```shell
npm run dev
```

本番用にビルドします。

```shell
npm run build
```

## インストール

ビルドが完了したら、ChromeまたはEdgeを起動して`chrome://extensions`を開きます。

「デベロッパーモード」を有効にし、「パッケージ化されていない拡張機能を読み込む」ボタンからdistフォルダーを読み込みます。

![デベロッパーモード](./docs/images/extentions_developer_mode.png)

![拡張機能](./docs/images/extentions.png)

## その他

* AWSマネージメントコンソールのフッターにアカウント名を表示する機能は[Display AWS Account Name](https://chromewebstore.google.com/detail/display-aws-account-name/njalignmbnobepnkfolngjbclaomfjig)を参考にしました。
