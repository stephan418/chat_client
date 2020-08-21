import React, { useEffect } from 'react';
import './popup.scss';
import CloseIcon from './svg/close.svg';
import { motion } from 'framer-motion';
import { useGlobalState, ACTIONS } from './utils/GlobalState';

function Popup(props) {
    let [{ popupActive }, dispatch] = useGlobalState();

    function setPopup(v) {
        dispatch({ type: ACTIONS.SET_POPUP, payload: v });
    }

    useEffect(() => {
        setPopup(true);

        return () => {
            setPopup(false);
        };
    }, [popupActive]);

    return (
        <div className="popup-pos">
            <motion.div
                className="popup active"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                key={props.title}
            >
                <div className="popup-close" onClick={() => props.close()}>
                    <CloseIcon />
                </div>
                <div className="popup-content">
                    <h1 className="popup-title">{props.title}</h1>
                    {props.children && <p className="popup-elements">{props.children}</p>}
                </div>
            </motion.div>
        </div>
    );
}

export { Popup };
