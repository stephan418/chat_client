import React, { useState, useRef, useEffect } from 'react';
import { NavBar, NavItem, NavbarDropdown } from './navbar';
import { LoginForm, CreateForm } from './form';
import LogoIcon from './svg/logo.svg';
import EditIcon from './svg/edit.svg';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { User } from './client_lib/user';
import { serviceReachable } from './client_lib/util';
import { OnlineProvider, useOnline } from './utils/OnlineContext';
import { Popup } from './Popup';
import { usePopup } from './utils/PopupContext';

function CommonNavbar(props) {
    const location = useLocation();

    return (
        <NavBar logo={<LogoIcon />}>
            <NavItem icon={<EditIcon />}>
                {location.pathname.startsWith('/create') ? (
                    <Link to="/login">Login</Link>
                ) : (
                    <Link to="/create">New Account</Link>
                )}
            </NavItem>
            <NavbarDropdown>
                <h1>About.</h1>
                <p>test</p>
            </NavbarDropdown>
        </NavBar>
    );
}

// TODO: Add loader for redirect
function TestCopm() {
    location.href = 'login';

    return <h1>Redirecting ...</h1>;
}

function App() {
    const location = useLocation();
    const [online, setOnline] = useOnline();
    const [offlinePopup, setOfflinePopup] = useState(true);
    const [popup, setPopup] = usePopup();

    useEffect(() => {
        if (online === false) {
            setOfflinePopup(true);
            console.info('Failed to connect to host server at 127.0.0.1. Retrying to connect every 10 seconds...');
            let onlineRetryInterval = setInterval(() => {
                console.log('Retry...');
                serviceReachable().then(v => {
                    if (v) {
                        setOnline(true);
                        clearInterval(onlineRetryInterval);
                    }
                });
            }, 10000);
        }
    }, [online]);

    return (
        <div className={'' + (popup ? 'popup-is-active' : '') + (online ? '' : ' offline')}>
            <CommonNavbar />
            <AnimatePresence>
                <Switch location={location} key={location.pathname}>
                    <Route path="/" exact>
                        <TestCopm></TestCopm>
                    </Route>
                    <Route path="/login" component={LoginForm}></Route>
                    <Route path="/create">
                        <CreateForm setPopupState={s => setPopupActive(s)} key="moin1" />
                    </Route>
                </Switch>
                {!online && offlinePopup && (
                    <Popup title="Connection error" close={() => setOfflinePopup(false)}>
                        We are having problems reaching our servers. Please check you internet connection or visit
                        {'{}'}
                    </Popup>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
