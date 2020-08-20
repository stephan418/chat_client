import React, { useEffect } from 'react';

function MountCatcher(props) {
    useEffect(() => {
        props.onMount();

        return () => props.onUnmount();
    }, []);

    return <div className="mount-catcher mount-catcher-active"></div>;
}

export default MountCatcher;
