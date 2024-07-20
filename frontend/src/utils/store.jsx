import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error fetching ${key} from localStorage:`, error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting ${key} to localStorage:`, error);
        }
    };

    return [storedValue, setValue];
};

const PageStore = () => {
    const [page, setPage] = useLocalStorage('page', 0);
    return { page, setPage };
};

const AccessTokenStore = () => {
    const [accessToken, setAccessToken] = useLocalStorage('access_token', '');
    return { accessToken, setAccessToken };
};

const UsernameStore = () => {
    const [username, setUsername] = useLocalStorage('username', '');
    return { username, setUsername };
};

const IsLoginStore = () => {
    const [isLogin, setIsLogin] = useLocalStorage('is_login', false);
    return { isLogin, setIsLogin };
};

export { PageStore, AccessTokenStore, UsernameStore, IsLoginStore };