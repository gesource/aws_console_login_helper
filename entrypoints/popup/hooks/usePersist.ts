import {useEffect, useState} from "react";

export const usePersist = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
    const [state, setState] = useState<T>(() => {
        const persistedValue = localStorage.getItem(key);
        return persistedValue ? JSON.parse(persistedValue) : initialValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}