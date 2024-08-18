import Account from "./models/Account.ts";

/**
 * 入力欄に値を設定し変更イベントを送信する
 * @param input 入力欄
 * @param value 値
 */
const inputCode = async (input: HTMLInputElement, value: string) => {
    input.value = value;

    // 入力した値を反映するためにイベントを発火する
    input.dispatchEvent(new Event('input', {bubbles: true, cancelable: true,}));
    input.dispatchEvent(new Event('change', {bubbles: true, cancelable: true,}));
};

/**
 * "サインイン"ページ
 * "IAMユーザー"を選択しアカウントIDを入力する
 * @param account
 */
const signInPage = async (account: Account) => {
    // "IAMユーザー"を選択
    const iamInput = document.getElementById("iam_user_radio_button") as HTMLInputElement;
    if (iamInput) {
        iamInput.checked = true;
        iamInput.dispatchEvent(new Event('change', {bubbles: true, cancelable: true,}));
    }
    // アカウントIDを入力
    const resolvingInput = document.getElementById("resolving_input") as HTMLInputElement;
    if (resolvingInput) {
        await inputCode(resolvingInput, account.id);
    }
};

/**
 * "IAMユーザーとしてサインイン"ページ
 * アカウントID・ユーザー名：パスワードを入力する
 * @param account
 */
const loginOAuthPage = async (account: Account) => {
    // アカウントIDを入力
    const accountInput = document.getElementById('account') as HTMLInputElement | null;
    if (accountInput) {
        await inputCode(accountInput, account.id);
    }
    // ユーザー名を入力
    const usernameInput = document.getElementById('username') as HTMLInputElement | null;
    if (usernameInput) {
        await inputCode(usernameInput, account.userName);
    }
    // パスワードを入力
    const passwordInput = document.getElementsByName('password')[0] as HTMLInputElement | null;
    if (passwordInput) {
        await inputCode(passwordInput, account.password);
    }
}

chrome.runtime.onMessage.addListener(
    async (message: { account: Account }) => {
        const url = window.location.href;

        const signInUrl = "https://signin.aws.amazon.com/signin";
        const oauthUrl = "signin.aws.amazon.com/oauth";

        // URLから"サインイン"ページか"IAMユーザーとしてサインイン"ページか判定する
        if (url.startsWith(signInUrl)) {
            await signInPage(message.account);
        } else if (url.includes(oauthUrl)) {
            await loginOAuthPage(message.account);
        } else {
            alert("[不具合]URLにマッチしませんでした。URLを開発者にお知らせください。")
        }

        return true;
    }
);
