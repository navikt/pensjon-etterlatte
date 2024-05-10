import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './app.css'
import '@navikt/ds-css'
import App from './App'
import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import ContextProviders from './context/ContextProviders'

const ScrollToTop = () => {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Router basename={process.env.PUBLIC_URL}>
        <ScrollToTop />

        <div className={'app'}>
            <ContextProviders>
                <App />
            </ContextProviders>
        </div>
    </Router>
)
