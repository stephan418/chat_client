import React, { useState, useRef, useEffect, layz } from 'react';
import { NavBar, NavItem, NavbarDropdown } from './navbar';
import { LoginForm, CreateForm } from './form';
import LogoIcon from './svg/logo.svg';
import EditIcon from './svg/edit.svg';
import LeaveIcon from './svg/leaveIcon.svg';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink,
    Redirect,
    useLocation,
    withRouter,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { User } from './client_lib/user';
import { serviceReachable } from './client_lib/util';
import { Popup } from './Popup';
import { useGlobalState, ACTIONS } from './utils/GlobalState';
import { Sidebar } from './sidebar';

let Chat = React.lazy(() => import('./chat'));

function CommonNavbar(props) {
    const location = useLocation();
    const [{ loggedIn }, dispatch] = useGlobalState();

    let [onCooldown, setOnCooldown] = useState(false);

    // Throttle rate of click in order to prevent a bug where a second, never entered click is detected
    useEffect(() => {
        if (!onCooldown) {
            setOnCooldown(true);
            setTimeout(() => {
                setOnCooldown(false);
            }, 50);
        }
    }, [location.pathname]);

    function handleLogout() {
        dispatch({ type: ACTIONS.LOGOUT });
    }

    return (
        <NavBar logo={<LogoIcon />}>
            <AnimatePresence>
                {!loggedIn ? (
                    <NavItem icon={<EditIcon />} fKey="formSwitcher">
                        {location.pathname.startsWith('/create') ? (
                            <NavLink
                                onClick={e => {
                                    if (onCooldown) e.preventDefault();
                                }}
                                to="/login"
                                key="formSwitcherLink"
                            >
                                Login
                            </NavLink>
                        ) : (
                            <NavLink
                                to="/create"
                                onClick={e => {
                                    if (onCooldown) e.preventDefault();
                                }}
                                key="formSwitcherLink"
                            >
                                New Account
                            </NavLink>
                        )}
                    </NavItem>
                ) : (
                    <>
                        <NavItem icon={<LeaveIcon />} fKey="Logout">
                            <div
                                key="logoutLink"
                                onClick={() => handleLogout()}
                                style={{ height: '50px', width: '50px' }}
                            ></div>
                        </NavItem>
                        <NavItem icon={<LeaveIcon />} fKey="logg">
                            <NavLink to="/share-my-id">Share!</NavLink>
                        </NavItem>
                    </>
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

function MotionRedirect({ to }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.01 }}
            key={Math.random().toString()}
        >
            <Redirect to={to} />
        </motion.div>
    );
}

function LogoutComp() {
    const [{ loggedIn }, dispatch] = useGlobalState();
    useEffect(() => {
        dispatch({ type: ACTIONS.LOGOUT });
    }, []);

    return <MotionRedirect to="/login" key="motion4" />;
}

function CopyField({ children }) {
    const elem = useRef();

    function handleClick() {
        elem.current.select();
        document.execCommand('copy');
    }

    return (
        <>
            <input type="text" ref={elem} spellCheck={false} className="click-to-copy" defaultValue={children}></input>
            <button onClick={handleClick}>Copy</button>
        </>
    );
}

function ShareNameRoute({ history }) {
    const [{ userInfo }, _] = useGlobalState();

    return (
        <Popup title="Your ID" close={() => history.push('/')}>
            Your ID is:
            <CopyField>{userInfo.userId}</CopyField> <br /> <br />A friend of yours can enter it to send you a message!
        </Popup>
    );
}

function AddConversationPopup({ history }) {
    const [id, setId] = useState('');

    function handleClick() {
        User.idExists(id).then(rv => {
            if (rv) {
                history.push('/chat/' + id);
            }
        });
    }

    return (
        <Popup close={() => history.push('/')} title="Add a new conversation">
            <label htmlFor="name-of-partner">ID of your Partner: </label> <br />
            <input type="text" value={id} onChange={e => setId(e.target.value)} id="name-of-partner" />
            <button onClick={handleClick}>Go</button>
        </Popup>
    );
}

ShareNameRoute = withRouter(ShareNameRoute);
AddConversationPopup = withRouter(AddConversationPopup);

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
            <AnimatePresence>{location.pathname.startsWith('/chat') && <Sidebar />}</AnimatePresence>
            <AnimatePresence exitBeforeEnter>
                <Switch location={location} key={location.key}>
                    <Route path="/" exact>
                        {loggedIn ? (
                            <MotionRedirect to="/chat" key="motion1" />
                        ) : (
                            <MotionRedirect to="/login" key="motions" />
                        )}
                    </Route>
                    <Route path="/logout">
                        <LogoutComp />
                    </Route>
                    <Route path="/login">
                        <LoginForm />
                    </Route>
                    <Route path="/create">
                        <CreateForm
                            setPopupState={s => dispatch({ type: ACTIONS.SET_POPUP, payload: s })}
                            key="moin1"
                        />
                    </Route>
                    <Route path={['/chat/:id', '/chat']}>
                        {!loggedIn && <MotionRedirect to="/login" key="motion3" />}
                        <Chat />
                    </Route>
                    <Route path="/share-my-id">
                        <ShareNameRoute />
                    </Route>
                    <Route path="/add-conversation">
                        <AddConversationPopup />
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
