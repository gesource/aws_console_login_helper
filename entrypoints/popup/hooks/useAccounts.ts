import { useCallback, useEffect, useState } from "react";
import type { Account } from "@/utils/account";
import { accountsStorage } from "@/utils/storage";

/**
 * アカウント一覧を WXT storage に直結して読み書きするフック。
 *
 * 状態の出所を storage に一本化し、popup内のコピー状態や prop drilling を排除する。
 * `accountsStorage.watch` で購読しているため、他のページや content script からの
 * 変更も即座に反映される。
 *
 * @returns accounts 一覧 / loading 初回読み込み中フラグ / setAccounts 保存関数
 */
export function useAccounts() {
    const [accounts, setState] = useState<Account[] | null>(null);

    useEffect(() => {
        accountsStorage.getValue().then(setState);
        const unwatch = accountsStorage.watch(setState);
        return unwatch;
    }, []);

    const setAccounts = useCallback((next: Account[]) => {
        // 楽観的に即時反映しつつ storage へ保存する（watch でも反映される）
        setState(next);
        return accountsStorage.setValue(next);
    }, []);

    return {
        accounts: accounts ?? [],
        loading: accounts === null,
        setAccounts,
    };
}
