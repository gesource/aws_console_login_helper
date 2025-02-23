/**
 * IAMユーザーのアカウント情報
 */
class Account {
    /**
     * アカウント名
     */
    name: string;
    /**
     * アカウントIDまたはアカウントエイリアス
     */
    id: string;
    /**
     * ユーザー名
     */
    userName: string;
    /**
     * パスワード
     */
    password: string;

    constructor(name: string, id: string, userName: string, password: string) {
        this.name = name;
        this.id = id;
        this.userName = userName;
        this.password = password;
    }
}

export default Account;