import React, { useContext, useState } from 'react';

const OnlineContext = React.createContext();
const OnlineUpdateContext = React.createContext();

export function useOnline() {
    return [useContext(OnlineContext), useContext(OnlineUpdateContext)];
}

export function OnlineProvider({ children }) {
    const [online, setOnline] = useState(true);

    return (
        <OnlineContext.Provider value={online}>
            <OnlineUpdateContext.Provider value={v => setOnline(v)}>{children}</OnlineUpdateContext.Provider>
        </OnlineContext.Provider>
    );
}
