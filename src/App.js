import React, { lazy, Suspense, useState } from 'react';
import MountCatcher from './utils/MountCatcher';
import ReactDOM from 'react-dom';
import './style.scss';
import { CSSTransition } from 'react-transition-group';
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalState } from './utils/GlobalState';

let App = lazy(() => import('./index'));

function LoadingIcon(props) {
    return (
        <>
            <CSSTransition in={props.loading} classNames="loader-container" timeout={200} unmountOnExit>
                <div className="loader-container">
                    <div className="loader loading"></div>
                </div>
            </CSSTransition>
        </>
    );
}

function AppContainer() {
    let [loading, setLoading] = useState(false);

    return (
        <>
            <GlobalState>
                <Suspense
                    fallback={<MountCatcher onMount={() => setLoading(true)} onUnmount={() => setLoading(false)} />}
                >
                    <Router>
                        <App />
                    </Router>
                </Suspense>
                <LoadingIcon loading={loading} />
            </GlobalState>
        </>
    );
}

ReactDOM.render(<AppContainer />, document.querySelector('#root'));
