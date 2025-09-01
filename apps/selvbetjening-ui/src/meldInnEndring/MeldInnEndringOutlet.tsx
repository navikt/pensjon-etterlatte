import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ProvideMeldInnEndringContext } from './components/meldInnEndringContext/MeldInnEndringContext.tsx'

export const MeldInnEndringOutlet = () => {
    useEffect(() => {
        document.title = 'Meld inn endring'
    }, [])

    return (
        <ProvideMeldInnEndringContext>
            <Outlet />
        </ProvideMeldInnEndringContext>
    )
}
