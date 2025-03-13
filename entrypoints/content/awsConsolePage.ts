import Account from "../popup/models/Account";

/**
 * AWSマネジメントコンソールページ
 */
const awsConsolePage = () => {
    // TODO: setIntervalを使わずに、ノードの変更を検知する方法を調査する
    const jsInitCheckTimer = setInterval(main, 1000);
    function main() {
        if (document.querySelector("#menu--account") != null) {
            clearInterval(jsInitCheckTimer);
            addAccountLabel();
        }
    }
    async function addAccountLabel() {
        let spanList: NodeListOf<HTMLSpanElement> = document.querySelectorAll(
            "#menu--account div div div span"
        );
        const displayName = Array.from(spanList).find((span) => {
            const regex = /\d{4}-\d{4}-\d{4}/;
            return regex.test(span.innerText);
        })?.innerText;
        const accountId = displayName?.replaceAll("-", "");
        const target = document.querySelector("#awsc-nav-footer-content");

        if (accountId != null && target != null) {
            const account = await findAccount(accountId);
            if (account) {
                target.appendChild(createAccountLabel(account));
            }
        }
    }

    async function findAccount(accountId: string): Promise<Account | null> {
        const STORAGE_KEY = "accounts";
    
        return new Promise((resolve) => {
            chrome.storage.local.get(STORAGE_KEY, (data) => {
                const persistedValue = data[STORAGE_KEY];
                if (!persistedValue) {
                    resolve(null);
                    return;
                }
    
                const accounts: Account[] = JSON.parse(persistedValue);
                const account = accounts.find((account) => account.id === accountId);
                resolve(account || null);
            });
        });
    }

    function createAccountLabel(account: Account): HTMLElement {
        let element = document.createElement("div");
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
};


export default awsConsolePage;
