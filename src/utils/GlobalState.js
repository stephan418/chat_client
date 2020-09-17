import React, { useReducer, useContext, useEffect, useState } from 'react';

export const ACTIONS = {
    LOGIN_WITH: 'LOGIN_WITH',
    LOGOUT: 'LOGOUT',
    SET_OFFLINE: 'SET_OFFLINE',
    SET_ONLINE: 'SET_ONLINE',
    SET_POPUP: 'SET_POPUP',
    INCREMENT_KEY: 'INCREMENT_KEY',
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.LOGIN_WITH:
            return {
                ...state,
                loggedIn: true,
                userInfo: {
                    name: action.payload.name,
                    userId: action.payload.userId,
                    token: action.payload.token,
                    expires: action.payload.expires,
                },
            };

        case ACTIONS.LOGOUT:
            console.log({ ...state, loggedIn: false, userInfo: undefined });
            return { ...state, loggedIn: false, userInfo: undefined };
        case ACTIONS.SET_OFFLINE:
            return { ...state, online: false };
        case ACTIONS.SET_ONLINE:
            return { ...state, online: true };
        case ACTIONS.SET_POPUP:
            return { ...state, popupActive: action.payload };
        case ACTIONS.INCREMENT_KEY:
            return { ...state, currentKey: state.currentKey + 1 };
        default:
            return state;
    }
}

const GlobalStateContext = React.createContext();

export function GlobalState({ children }) {
    const [state, dispatch] = useReducer(reducer, { loggedIn: false, online: true, popupActive: false, currentKey: 0 });
    const [loadingIn, setLoadingIn] = useState(true);

    useEffect(() => {
        let loggedIn = JSON.parse(localStorage.getItem('loggedIn'));
        let userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (loggedIn === true && userInfo !== null) {
            dispatch({ type: ACTIONS.LOGIN_WITH, payload: userInfo });
        }

        setLoadingIn(false);
    }, []);

    useEffect(() => {
        if (!loadingIn) {
            if (state.loggedIn === false) {
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('userInfo');
            } else {
                localStorage.setItem('loggedIn', JSON.stringify(state.loggedIn));
                localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
            }
        }
    }, [state.loggedIn, state.userInfo]);

    return (
        <GlobalStateContext.Provider value={[state || { loggedIn: false, online: true, popupActive: false }, dispatch]}>
            {children}
        </GlobalStateContext.Provider>
    );
}

export function useGlobalState() {
    return useContext(GlobalStateContext);
}
