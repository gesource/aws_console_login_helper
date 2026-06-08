import type { Account } from "./account";

/** popup → content script へのログイン情報入力依頼メッセージ */
export interface LoginMessage {
    type: "fillLogin";
    account: Account;
}

/** content script → popup へのログイン入力結果 */
export type LoginResult =
    | { ok: true }
    | { ok: false; reason: string };

/**
 * 指定タブの content script にログイン情報の入力を依頼する（送信側）。
 */
export function sendLogin(tabId: number, account: Account): Promise<LoginResult> {
    const message: LoginMessage = { type: "fillLogin", account };
    return chrome.tabs.sendMessage(tabId, message);
}

/**
 * ログイン入力依頼を受信して処理する（受信側 / content script）。
 * `type` ガードにより他のメッセージでは発火しない。
 */
export function onLogin(handler: (account: Account) => Promise<LoginResult>): void {
    chrome.runtime.onMessage.addListener(
        (message: LoginMessage, _sender, sendResponse) => {
            if (message?.type !== "fillLogin") {
                return; // 対象外のメッセージは無視
            }
            handler(message.account).then(sendResponse);
            return true; // 非同期に sendResponse を呼ぶため true を返す
        },
    );
}
