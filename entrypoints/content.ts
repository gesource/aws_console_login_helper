import Account from './popup/models/Account';

/**
 * 入力欄に値を設定し変更イベントを送信する
 * @param input 入力欄
 * @param value 値
 */
const inputCode = async (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
};

/**
 * "サインイン"ページ
 * "IAMユーザー"を選択しアカウントIDを入力する
 * @param account
 */
const signInPage = async (account: Account) => {
    const iamInput = document.getElementById("iam_user_radio_button") as HTMLInputElement;
    if (iamInput) {
        iamInput.checked = true;
        iamInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    }

    const resolvingInput = document.getElementById("resolving_input") as HTMLInputElement;
    if (resolvingInput) {
        await inputCode(resolvingInput, account.id);
    }
};

/**
 * "IAMユーザーとしてサインイン"ページ
 * アカウントID・ユーザー名・パスワードを入力する
 * @param account
 */
const loginOAuthPage = async (account: Account) => {
    const accountInput = document.getElementById('account') as HTMLInputElement | null;
    if (accountInput) await inputCode(accountInput, account.id);

    const usernameInput = document.getElementById('username') as HTMLInputElement | null;
    if (usernameInput) await inputCode(usernameInput, account.userName);

    const passwordInput = document.getElementsByName('password')[0] as HTMLInputElement | null;
    if (passwordInput) await inputCode(passwordInput, account.password);
};

// コンテンツスクリプトとして定義
export default defineContentScript({
    matches: [
      'https://*.signin.aws.amazon.com/oauth?*',
      'https://signin.aws.amazon.com/signin*'
    ],
    runAt: "document_idle",
    main() {
        chrome.runtime.onMessage.addListener(async (message: { account: Account }) => {
            const url = window.location.href;
            const signInUrl = "https://signin.aws.amazon.com/signin";
            const oauthUrl = "signin.aws.amazon.com/oauth";

            if (url.startsWith(signInUrl)) {
                await signInPage(message.account);
            } else if (url.includes(oauthUrl)) {
                await loginOAuthPage(message.account);
            } else {
                alert("[不具合] URLにマッチしませんでした。URLを開発者にお知らせください。");
            }

            return true;
        });
    },
});
