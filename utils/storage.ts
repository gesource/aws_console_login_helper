import { storage } from "wxt/storage";
import type { Account } from "./account";

/**
 * アカウント一覧の永続化定義（唯一の真実）。
 *
 * popup / content / background のすべてのエントリでこの定義を共有し、
 * ストレージキーやシリアライズ処理の重複を排除する。
 *
 * 移行:
 *   v1 = 旧 usePersist が `JSON.stringify` した「文字列」を保存していた
 *   v2 = ネイティブの配列として保存する（WXTが内部でシリアライズする）
 * version メタを持たない既存データは v1 とみなされるため、v1→v2 の移行で
 * 文字列を配列へパースする。移行は冪等・防御的に実装している。
 */
export const accountsStorage = storage.defineItem<Account[]>("local:accounts", {
    fallback: [],
    version: 2,
    migrations: {
        2: (old: unknown): Account[] => {
            if (typeof old === "string") {
                try {
                    return JSON.parse(old) as Account[];
                } catch {
                    return [];
                }
            }
            return Array.isArray(old) ? (old as Account[]) : [];
        },
    },
});

/**
 * アカウントIDに一致するアカウントを取得する。
 * @param id AWSアカウントID（またはエイリアス）
 */
export async function findAccountById(id: string): Promise<Account | null> {
    const accounts = await accountsStorage.getValue();
    return accounts.find((account) => account.id === id) ?? null;
}
