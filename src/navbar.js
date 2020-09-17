import React, { useState, useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import './navbar.scss';
import ExpandIcon from './svg/expandIcon.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalState, ACTIONS } from './utils/GlobalState';
import { withRouter, NavLink } from 'react-router-dom';

function NavItem(props) {
    let [style, setStyle] = useState({});
    let el = useRef();

    function handleMouseMove(e) {
        setStyle({
            background: `radial-gradient(circle 50px at ${e.pageX - el.current.offsetLeft}px ${
                e.pageY - el.current.offsetTop
            }px, #1F1E1F, #151415`,
        });
    }

    function handleMouseLeave(e) {
        setStyle({});
    }

    return (
        <motion.div
            onClick={props.onClick}
            ref={el}
            className={`nav-item ${props.className || '\r'}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={style}
            initial={{
                transform: 'scale(0.5)',
                opacity: 0,
            }}
            animate={{ transform: 'scale(1)', opacity: 1 }}
            exit={{
                transform: 'scale(0.5)',
                opacity: 0,
            }}
            key={props.fKey}
        >
            <span className="nav-icon">{props.icon}</span>
            <span className="nav-text">{props.children}</span>
        </motion.div>
    );
}

function NavbarDropdown(props) {
    return <div className="navbar-dropdown">{props.children}</div>;
}

function NavBar(props) {
    let [dropdownActive, setDropdownActive] = useState(false);
    let [dropdownEntered, setDropdownEntered] = useState(false);
    const [hover, setHover] = useState(false);

    function handleMouseEnter() {
        setHover(true);
    }

    function handleMouseLeave() {
        setHover(false);
    }

    function handleActiveClick() {
        setDropdownActive(prev => !prev);
    }

    function toggleEntered() {
        setDropdownEntered(true);
    }

    let children = props.children;
    let lastIsDropdown = props.children.slice(-1)[0].type === NavbarDropdown;
    let dropdown = null;

    if (lastIsDropdown) {
        dropdown = children.slice(-1)[0];
        children = children.slice(0, -1);
    }

    return (
        <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }}>
            <nav>
                <motion.div
                    id="nav-logo"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onFocus={handleMouseEnter}
                    onBlur={handleMouseLeave}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <NavLink to="/">{props.logo}</NavLink>
                </motion.div>{' '}
                <AnimatePresence>
                    {hover && (
                        <motion.h3
                            initial={{ opacity: 0, x: '-50%', scale: 0.5 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: '-50%', scale: 0.5 }}
                            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.13 }}
                        >
                            Home
                        </motion.h3>
                    )}
                </AnimatePresence>
                {children}
                {lastIsDropdown && (
                    <NavItem
                        icon={<ExpandIcon />}
                        className="dropdown-btn"
                        onClick={handleActiveClick}
                        fKey="expandBtn"
                    >
                        More
                    </NavItem>
                )}
            </nav>
            {lastIsDropdown && (
                <CSSTransition
                    in={dropdownActive}
                    timeout={500}
                    classNames="dropdown"
                    unmountOnExit
                    onEntered={toggleEntered}
                    onExited={toggleEntered}
                >
                    {dropdown}
                </CSSTransition>
            )}
        </motion.header>
    );
}

NavBar = withRouter(NavBar);

export { NavItem, NavBar, NavbarDropdown };
