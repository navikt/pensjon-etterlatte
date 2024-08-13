import { Outlet } from 'react-router-dom'
import { Header } from './common/Header.tsx'

export const AppOutlet = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}
