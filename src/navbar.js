import React, { useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './navbar.scss';
import ExpandIcon from './svg/expandIcon.svg';
import { motion } from 'framer-motion';

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
        <div
            onClick={props.onClick}
            ref={el}
            className={`nav-item ${props.className || '\r'}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={style}
        >
            <span className="nav-icon">{props.icon}</span>
            <span className="nav-text">{props.children}</span>
        </div>
    );
}

function NavbarDropdown(props) {
    return <div className="navbar-dropdown">{props.children}</div>;
}

function NavBar(props) {
    let [dropdownActive, setDropdownActive] = useState(false);
    let [dropdownEntered, setDropdownEntered] = useState(false);

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
        <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <nav>
                <div id="nav-logo">{props.logo}</div>
                {children}
                {lastIsDropdown && (
                    <NavItem icon={<ExpandIcon />} className="dropdown-btn" onClick={handleActiveClick}>
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

export { NavItem, NavBar, NavbarDropdown };
