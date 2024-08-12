import { Outlet } from 'react-router-dom'
import { Header } from './Header.tsx'

export const Skeleton = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}
