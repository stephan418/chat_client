import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popup } from './Popup';
import { User } from './client_lib/user';
import { useOnline } from './utils/OnlineContext';
import { serviceReachable } from './client_lib/util';

function Button(props) {
    let [style, setStyle] = useState({});
    let el = useRef();

    function handleMouseMove(e) {
        let bounding = el.current.getBoundingClientRect();
        setStyle({
            background: `radial-gradient(circle 50px at ${e.pageX - bounding.x}px ${
                e.pageY - bounding.y
            }px, #383838, #292829`,
        });
    }

    function handleMouseLeave(e) {
        setStyle({});
    }

    let buttonVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
    };

    return (
        <>
            <button
                onClick={props.onSubmit}
                ref={el}
                className={`form-btn ${props.className || '\r'}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ ...style, ...props.style }}
            >
                {props.children}
            </button>{' '}
            {props.loading && (
                <div className="btn-loader-point-container">
                    <motion.div
                        className="btn-loader-point point-1"
                        variants={buttonVariants}
                        initial="initial"
                        animate="animate"
                    ></motion.div>
                    <motion.div
                        className="btn-loader-point point-2"
                        variants={buttonVariants}
                        initial="initial"
                        animate="animate"
                    ></motion.div>
                    <motion.div
                        className="btn-loader-point point-3"
                        variants={buttonVariants}
                        initial="initial"
                        animate="animate"
                    ></motion.div>
                </div>
            )}
        </>
    );
}

function FormInput(props) {
    let [value, setValue] = useState('');

    useEffect(() => {
        props.setValue && props.setValue(value);
    }, [value]);

    return (
        <>
            <div className="form-container">
                <input
                    placeholder=" "
                    type={props.type || 'text'}
                    className={props.className && props.className}
                    id={`${props.title}-input`.replace(' ', '-')}
                    onChange={e => setValue(e.target.value)}
                    value={value}
                    autoComplete="off"
                    required={props.required}
                />
                <label htmlFor={`${props.title}-input`.replace(' ', '-')}>{props.title}</label>
            </div>
        </>
    );
}

function LoginForm() {
    let [loading, setLoading] = useState(false);
    let [password, setPassword] = useState('a');
    let [loginID, setLoginID] = useState('');
    let [online, setOnline] = useOnline();

    function handleSubmit(e) {
        setLoading(true);

        e.preventDefault();
    }

    return (
        <motion.div
            className="login-form login"
            initial={{ opacity: 0, marginTop: 100 }}
            animate={{ opacity: 1, marginTop: 0 }}
            exit={{ opacity: 0, marginTop: 100 }}
            transition={{ duration: 0.1, type: 'spring', mass: 0.5 }}
            key="loginForm"
        >
            <div className="form-title">Login.</div>
            <form onSubmit={handleSubmit} className="login-form-el ">
                <FormInput title="Login ID" value={loginID} setValue={v => setLoginID(v)} />
                <FormInput title="Password" type="password" value={password} setValue={v => setPassword(v)} />
                <Button loading={loading}>Sign In</Button>
            </form>
        </motion.div>
    );
}

function CreateForm() {
    let [loading, setLoading] = useState(false);
    let [password, setPassword] = useState('a');
    let [username, setUsername] = useState('');
    let [finishedPopup, setFinishedPopup] = useState(false);
    let [failedPopup, setFailedPopup] = useState(false);
    let [user, setUser] = useState({});
    let [online, setOnline] = useOnline();

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        User.create(username, password)
            .then(user => {
                setFinishedPopup(true);
                setUser(user);
                setLoading(false);
            })
            .catch(e => {
                setFailedPopup(true);
                setLoading(false);
                console.error(e);

                serviceReachable().then(v => {
                    if (!v) {
                        setOnline(false);
                    }
                });
            });
    }

    useEffect(() => {
        setFailedPopup(false);
    }, [online]);

    return (
        <motion.div
            className="login-form create-form"
            initial={{ opacity: 0, marginTop: 100 }}
            animate={{ opacity: 1, marginTop: 0 }}
            exit={{ opacity: 0, marginTop: 100 }}
            transition={{ duration: 0.1, type: 'spring', mass: 0.5 }}
            key="createForm"
            style={{ height: '60vh' }}
        >
            <div className="form-title">Create.</div>
            <form onSubmit={handleSubmit} className="login-form-el ">
                <FormInput
                    title="Name"
                    className="name-input"
                    value={username}
                    setValue={v => setUsername(v)}
                    required
                />
                <FormInput
                    title="Password"
                    type="password"
                    className="password-input"
                    value={password}
                    setValue={v => setPassword(v)}
                    required
                />
                <FormInput title="E-Mail (optional)" type="text" />
                <Button loading={loading} className={loading ? 'btn-loading' : ''}>
                    Sign Up
                </Button>
            </form>
            <AnimatePresence>
                {finishedPopup && (
                    <Popup title={'Welcome, ' + user.name} close={() => setFinishedPopup(false)}>
                        Your account has been created successfully! Your login ID is '{user.loginId}'. Please remeber
                        it. You will not be able to recover in case you forgot it! <br /> <br />
                        Do you want to log in right away?{' '}
                        <Button style={{ width: '70%', margin: '10% auto 0' }} className={loading ? 'btn-loading' : ''}>
                            Sign In ->
                        </Button>
                    </Popup>
                )}
                {failedPopup && (
                    <Popup title="Error!" close={() => setFailedPopup(false)} key="elfailedpopup">
                        {'There was an error creating your account. Are you connected to the internet?'}
                    </Popup>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export { LoginForm, Button, FormInput, CreateForm };
