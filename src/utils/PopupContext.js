import React, { useContext, useState } from 'react';

let PopupContext = React.createContext();
let PopupUpdateContext = React.createContext();

export function usePopup() {
    return [useContext(PopupContext), useContext(PopupUpdateContext)];
}

export function PopupProvider({ children }) {
    const [popup, setPopup] = useState(false);

    return (
        <PopupContext.Provider value={popup}>
            <PopupUpdateContext.Provider value={v => setPopup(v)}>{children}</PopupUpdateContext.Provider>
        </PopupContext.Provider>
    );
}
