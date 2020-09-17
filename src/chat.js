import React, { useEffect, useState } from 'react';
import { Message } from './client_lib/message';
import { GlobalState, ACTIONS, useGlobalState } from './utils/GlobalState';
import ThreeDots from './svg/threeDots.svg';
import MoreIcon from './svg/moreIcon.svg';
import SendIcon from './svg/sendIcon.svg';
import { motion } from 'framer-motion';
import { Sidebar } from './sidebar';
import { withRouter } from 'react-router-dom';
import { User } from './client_lib/user';
import io from 'socket.io-client';

const item = {
    hidden: { opacity: 0, x: '-30px', transition: { type: 'tween', delay: 0 } },
    show: { opacity: 1, x: 0 },
};

function ProfileImage() {
    return (
        <motion.div
            className="chat-contact-img"
            variants={item}
            initial="hidden"
            animate="show"
            exit="hidden"
            transition={{ type: 'tween', delay: 0.15 }}
        ></motion.div>
    );
}

function ChatOptions() {
    return (
        <motion.div
            className="chat-options"
            variants={item}
            initial="hidden"
            animate="show"
            exit="hidden"
            transition={{ type: 'tween', delay: 0.05 }}
        >
            <ThreeDots />
        </motion.div>
    );
}

function UserMessage({ date, wasSent, children }) {
    let formattedDate = 'Jun 1 2020';

    return (
        <motion.div
            className={'message' + (wasSent ? ' sender' : ' receiver')}
            variants={item}
            animate="show"
            initial="hidden"
            exit="hidden"
        >
            <div className="message-inner">
                <div className="message-date">{formattedDate}</div>
                <div className="message-content">{children}</div>
            </div>
        </motion.div>
    );
}

function MessageContainer({ messages }) {
    return (
        <motion.div
            className="message-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ staggerChildren: 0.2 }}
        >
            {messages.map(m => (
                <UserMessage key={m.id} wasSent={m.wasSent}>
                    {m.textContent}
                </UserMessage>
            ))}
        </motion.div>
    );
}

function MessageInput({ partner, appendToMessages }) {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    let [{ userInfo }, dispatch] = useGlobalState();

    function handleSubmit() {
        setSending(true);

        Message.create({ token: userInfo.token }, partner, message)
            .then(message => appendToMessages(message))
            .then(() => setSending(false));

        setMessage('');
    }

    return (
        <motion.div
            className="message-input"
            initial={{ opacity: 0, y: '50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'tween' }}
        >
            <motion.input
                type="text"
                placeholder="Type a new message"
                value={message}
                onKeyDown={({ key }) => {
                    if (key == 'Enter') {
                        handleSubmit();
                    }
                }}
                onChange={e => setMessage(e.target.value)}
                animate={sending ? { x: 100, opacity: 0 } : { opacity: 1, x: 0, y: 0 }}
            />
            <button className="send-btn" onClick={() => handleSubmit}>
                <SendIcon />
            </button>
            <div className="more">
                <MoreIcon />
            </div>
        </motion.div>
    );
}

function Chat({ partner }) {
    let [messages, setMessages] = useState([]);
    const [otherUser, setOtherUser] = useState(null);
    let [{ userInfo }, dispatch] = useGlobalState();
    const [iv, setIv] = useState(false);

    useEffect(() => {
        if (userInfo) {
            User.getFromServer(partner).then(setOtherUser);
            Message.getAllWithUser({ token: userInfo.token }, partner).then(m => setMessages(m));

            if (!iv) {
                console.log('setting invertval');
                let inter = setInterval(() => {
                    Message.getAllWithUser({ token: userInfo.token }, partner).then(m => setMessages(m));
                }, 2000);

                return () => {
                    console.log('clearning interval', iv);
                    clearInterval(inter);
                };
            }
        }
    }, []);

    console.log(messages);

    return (
        <div className="chat">
            {otherUser && (
                <motion.div
                    className="chat-header"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <ProfileImage />
                    <motion.div
                        className="chat-name"
                        variants={item}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        transition={{ type: 'tween', delay: 0.1 }}
                    >
                        {otherUser.name}
                    </motion.div>
                    <ChatOptions />
                </motion.div>
            )}
            <MessageContainer messages={messages} />
            <MessageInput partner={partner} appendToMessages={m => setMessages([...messages, m])} />
        </div>
    );
}

function ChatPlaceholder() {
    return (
        <motion.div
            className="chat-placeholder"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
        ></motion.div>
    );
}

function ChatViewContaier({ match: { params } }) {
    const [socket, setSocket] = useState();

    useEffect(() => {
        setSocket(io.connect('http://localhost:5000/ws'));
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('connected', data => console.log(data));
        }
    }, [socket]);

    return <>{params.id !== undefined ? <Chat partner={params.id} /> : <ChatPlaceholder />}</>;
}

export default withRouter(ChatViewContaier);
