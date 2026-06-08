import type {Account} from "@/utils/account";
import {findAccountById} from "@/utils/storage";

/** 重複挿入を防ぐためラベルに付与する目印 */
const LABEL_MARKER = "data-aws-login-helper-label";
/** アカウントメニュー出現を待つタイムアウト（ms） */
const WAIT_TIMEOUT = 10_000;

/**
 * AWSマネジメントコンソールページ
 * アカウントメニューからアカウントIDを読み取り、フッターにアカウント名ラベルを表示する。
 */
const awsConsolePage = () => {
    waitForElement("#menu--account", WAIT_TIMEOUT).then((menu) => {
        if (menu) {
            addAccountLabel();
        }
    });
};

/**
 * セレクタに一致する要素が出現するまで MutationObserver で待つ。
 * すでに存在する場合は即座に解決する。タイムアウト時は null を返す。
 */
function waitForElement(selector: string, timeout: number): Promise<Element | null> {
    return new Promise((resolve) => {
        const existing = document.querySelector(selector);
        if (existing) {
            resolve(existing);
            return;
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                clearTimeout(timer);
                resolve(element);
            }
        });
        observer.observe(document.body, {childList: true, subtree: true});

        const timer = setTimeout(() => {
            observer.disconnect();
            resolve(null);
        }, timeout);
    });
}

/**
 * アカウントメニューからアカウントIDを取得し、フッターにラベルを追加する。
 */
async function addAccountLabel() {
    const accountId = extractAccountId();
    const target = document.querySelector("#awsc-nav-footer-content");
    if (accountId == null || target == null) {
        return;
    }

    // 既にラベルが挿入済みなら何もしない（重複挿入ガード）
    if (target.querySelector(`[${LABEL_MARKER}]`)) {
        return;
    }

    const account = await findAccountById(accountId);
    if (account) {
        target.appendChild(createAccountLabel(account));
    }
}

/**
 * アカウントメニュー配下の span から "XXXX-XXXX-XXXX" 形式のIDを抽出し、
 * ハイフンを除いた12桁の文字列を返す。
 */
function extractAccountId(): string | null {
    const spanList = document.querySelectorAll<HTMLSpanElement>("#menu--account span");
    const regex = /\d{4}-\d{4}-\d{4}/;
    for (const span of spanList) {
        const matched = span.innerText.match(regex);
        if (matched) {
            return matched[0].replaceAll("-", "");
        }
    }
    return null;
}

/**
 * アカウント名ラベルのDOM要素を生成する。
 */
function createAccountLabel(account: Account): HTMLElement {
    const element = document.createElement("div");
    element.setAttribute(LABEL_MARKER, "");
    element.textContent = account.name;
    element.style.padding = "4px";

    if (account.backgroundColor) {
        element.style.backgroundColor = account.backgroundColor;
    }
    if (account.textColor) {
        element.style.color = account.textColor;
    }

    return element;
}

export default awsConsolePage;
