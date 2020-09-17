import React, { useState, useEffect } from 'react';
import AccountIcon from './svg/accountIcon.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { Conversation } from './client_lib/conversation';
import { useGlobalState, ACTIONS } from './utils/GlobalState';
import { User } from './client_lib/user';
import './sidebar.scss';
import { Link, NavLink } from 'react-router-dom';

const colors = ['#93FF96', '#86E7B8', '#5CC8FF', '#7D70BA', '#3F826D', '#094D92', '#20BF55', '#F28123', '#9381FF'];

function selectRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function ContactImage({ src }) {
    const [color, _] = useState(selectRandom(colors));

    return (
        <div className="contact-image image data-no-img" style={{ background: color }} tabIndex="0">
            <AccountIcon />
        </div>
    );
}

function AddImage({ src }) {
    return (
        <div className="contact-image image data-no-img" style={{ background: colors[0] }} tabIndex="0">
            <AccountIcon />
        </div>
    );
}

function Contact(props) {
    let [hover, setHover] = useState(false);
    let [{ name }, setPartnerUser] = useState({});

    useEffect(() => {
        if (!props.isAdd) {
            User.getFromServer(props.partner).then(setPartnerUser);
        } else {
            setPartnerUser({ name: 'Add new Contact!' });
        }
    }, []);

    function handleMouseEnter() {
        setHover(true);
    }

    function handleMouseLeave() {
        setHover(false);
    }

    return (
        <>
            {name && (
                <motion.div
                    className="contact"
                    onClick={props.onClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onFocus={handleMouseEnter}
                    onBlur={handleMouseLeave}
                    initial={{ x: '-10%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <NavLink to={props.to === undefined ? `/chat/${props.partner}` : props.to}>
                        {props.isAdd === undefined ? <ContactImage /> : <AddImage />}
                    </NavLink>

                    <AnimatePresence>
                        {hover && (
                            <motion.h3
                                initial={{ opacity: 0, x: '-50%', scale: 0.5 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: '-50%', scale: 0.5 }}
                                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.13 }}
                            >
                                {name}
                            </motion.h3>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </>
    );
}

export function Sidebar() {
    const [contacts, setContacts] = useState([]);
    const [{ userInfo }, dispatch] = useGlobalState();
    console.log(contacts);

    useEffect(() => {
        document.title = 'Chats | WebChat Controller';
    }, []);

    useEffect(() => {
        if (userInfo) {
            Conversation.getAllWithSession({ token: userInfo.token }, userInfo.userId).then(setContacts);
        }
    }, []);

    return (
        <motion.aside
            className="sidebar"
            key="sidebar"
            initial={{ opacity: 0, x: '-50%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'tween', ease: 'easeInOut' }}
        >
            <Contact to="/add-conversation" isAdd="true" />
            {contacts.map(contact => (
                <Contact partner={contact.other} key={contact.participants.join('')} />
            ))}
        </motion.aside>
    );
}
