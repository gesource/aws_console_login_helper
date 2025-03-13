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
    /**
     * AWSマネジメントコンソールに表示するラベルの背景色
     */
    backgroundColor: string;
    /**
     * AWSマネジメントコンソールに表示するラベルの文字色
     */
    textColor: string;

    constructor(name: string, id: string, userName: string, password: string, backgroundColor: string, textColor: string) {
        this.name = name;
        this.id = id;
        this.userName = userName;
        this.password = password;
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
    }
}

export default Account;