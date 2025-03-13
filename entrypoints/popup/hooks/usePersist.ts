import { useEffect, useState } from "react";

export const usePersist = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
    const [state, setState] = useState<T>(initialValue);
    const [isLoaded, setIsLoaded] = useState(false); // 初回ロード判定

    useEffect(() => {
        chrome.storage.local.get(key, (data) => {
            if (data[key] !== undefined) {
                setState(JSON.parse(data[key]));
            }
            setIsLoaded(true); // データ取得完了
        });
    }, [key]);

    useEffect(() => {
        if (isLoaded) { // 初回ロード完了後のみ保存を実行
            chrome.storage.local.set({ [key]: JSON.stringify(state) });
        }
    }, [key, state, isLoaded]);

    return [state, setState];
};
