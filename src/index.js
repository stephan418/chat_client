import React, { useState, useRef, useEffect } from 'react';
import { NavBar, NavItem, NavbarDropdown } from './navbar';
import { LoginForm, CreateForm } from './form';
import LogoIcon from './svg/logo.svg';
import EditIcon from './svg/edit.svg';
import ExitIcon from './svg/exitIcon.svg';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { User } from './client_lib/user';
import { serviceReachable } from './client_lib/util';
import { Popup } from './Popup';
import { useGlobalState, ACTIONS } from './utils/GlobalState';

function CommonNavbar(props) {
    const location = useLocation();
    const [{ loggedIn }, _] = useGlobalState();

    return (
        <NavBar logo={<LogoIcon />}>
            <AnimatePresence>
                {!loggedIn ? (
                    <NavItem icon={<EditIcon />} fKey="formSwitcher">
                        {location.pathname.startsWith('/create') ? (
                            <Link to="/login">Login</Link>
                        ) : (
                            <Link to="/create">New Account</Link>
                        )}
                    </NavItem>
                ) : (
                    <NavItem icon={<ExitIcon />} fKey="Logout">
                        hi
                    </NavItem>
                )}
            </AnimatePresence>

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
    const [offlinePopup, setOfflinePopup] = useState(true);
    const [{ popupActive, online, loggedIn }, dispatch] = useGlobalState();

    useEffect(() => {
        if (online === false) {
            setOfflinePopup(true);
            console.info('Failed to connect to host server at 127.0.0.1. Retrying to connect every 10 seconds...');
            let onlineRetryInterval = setInterval(() => {
                console.log('Retry...');
                serviceReachable().then(v => {
                    if (v) {
                        dispatch({ type: ACTIONS.SET_ONLINE });
                        clearInterval(onlineRetryInterval);
                    }
                });
            }, 10000);
        }
    }, [online]);

    return (
        <div className={'' + (popupActive ? 'popup-is-active' : '') + (online ? '' : ' offline')}>
            <CommonNavbar />
            <AnimatePresence>
                <Switch location={location} key={location.pathname}>
                    <Route path="/" exact>
                        {!loggedIn && <TestCopm></TestCopm>}
                    </Route>
                    <Route path="/login" component={LoginForm}></Route>
                    <Route path="/create">
                        <CreateForm
                            setPopupState={s => dispatch({ type: ACTIONS.SET_POPUP, payload: s })}
                            key="moin1"
                        />
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
