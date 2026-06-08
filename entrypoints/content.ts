import type {Account} from '@/utils/account';
import {type LoginResult, onLogin} from '@/utils/messaging';
import awsConsolePage from './content/awsConsolePage';

/**
 * 入力欄に値を設定し変更イベントを送信する
 * @param input 入力欄
 * @param value 値
 */
const inputCode = (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
};

/**
 * "サインイン"ページ
 * "IAMユーザー"を選択しアカウントIDを入力する
 * @param account
 */
const signInPage = (account: Account) => {
    const iamInput = document.getElementById("iam_user_radio_button") as HTMLInputElement | null;
    if (iamInput) {
        iamInput.checked = true;
        iamInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    }

    const resolvingInput = document.getElementById("resolving_input") as HTMLInputElement | null;
    if (resolvingInput) {
        inputCode(resolvingInput, account.id);
    }
};

/**
 * "IAMユーザーとしてサインイン"ページ
 * アカウントID・ユーザー名・パスワードを入力する
 * @param account
 */
const loginOAuthPage = (account: Account) => {
    const accountInput = document.getElementById('account') as HTMLInputElement | null;
    if (accountInput) inputCode(accountInput, account.id);

    const usernameInput = document.getElementById('username') as HTMLInputElement | null;
    if (usernameInput) inputCode(usernameInput, account.userName);

    const passwordInput = document.getElementsByName('password')[0] as HTMLInputElement | null;
    if (passwordInput) inputCode(passwordInput, account.password);
};

// コンテンツスクリプトとして定義
export default defineContentScript({
    matches: [
        'https://*.signin.aws.amazon.com/oauth?*',
        'https://signin.aws.amazon.com/signin*',
        // AWSマネジメントコンソール
        'https://*.console.aws.amazon.com/*',
    ],
    runAt: "document_idle",
    main() {
        const consoleUrl = ".console.aws.amazon.com";
        if (window.location.href.includes(consoleUrl)) {
            awsConsolePage();
        }

        onLogin(async (account): Promise<LoginResult> => {
            const url = window.location.href;
            const signInUrl = "https://signin.aws.amazon.com/signin";
            const oauthUrl = "signin.aws.amazon.com/oauth";

            if (url.startsWith(signInUrl)) {
                signInPage(account);
                return { ok: true };
            } else if (url.includes(oauthUrl)) {
                loginOAuthPage(account);
                return { ok: true };
            }
            console.warn("[AWS Console Login Helper] URLにマッチしませんでした:", url);
            return { ok: false, reason: "サインインページではありません" };
        });
    },
});
