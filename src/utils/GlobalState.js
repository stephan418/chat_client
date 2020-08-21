import React, { useReducer, useContext } from 'react';

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

    return (
        <GlobalStateContext.Provider value={[state || { loggedIn: false, online: true, popupActive: false }, dispatch]}>
            {children}
        </GlobalStateContext.Provider>
    );
}

export function useGlobalState() {
    return useContext(GlobalStateContext);
}
