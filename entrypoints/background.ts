import { accountsStorage } from "@/utils/storage";

export default defineBackground(() => {
    // インストール・更新時に旧バージョンのストレージデータを移行する
    // （defineItem 時にも自動で移行が走るが、明示的に発火させて確実にする）
    browser.runtime.onInstalled.addListener(async () => {
        await accountsStorage.migrate();
    });
});
