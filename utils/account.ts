/**
 * IAMユーザーのアカウント情報
 *
 * chrome.storage に永続化されるためプレーンオブジェクトとして扱う
 * （JSON永続化の往復でクラスインスタンスは失われるため interface で定義する）
 */
export interface Account {
    /** アカウント名 */
    name: string;
    /** アカウントIDまたはアカウントエイリアス */
    id: string;
    /** ユーザー名 */
    userName: string;
    /**
     * パスワード
     *
     * 注意: chrome.storage.local に平文で保存される。暗号化は行っていない。
     */
    password: string;
    /** AWSマネジメントコンソールに表示するラベルの背景色 */
    backgroundColor: string;
    /** AWSマネジメントコンソールに表示するラベルの文字色 */
    textColor: string;
}

/**
 * Account を生成する。未指定のフィールドは空文字で初期化する。
 * 名前付き引数で生成することで、位置引数の順序ミスを防ぐ。
 */
export function createAccount(init: Partial<Account> = {}): Account {
    return {
        name: "",
        id: "",
        userName: "",
        password: "",
        backgroundColor: "",
        textColor: "",
        ...init,
    };
}
