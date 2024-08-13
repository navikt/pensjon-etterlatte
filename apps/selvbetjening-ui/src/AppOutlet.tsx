import { Outlet } from 'react-router-dom'
import { Header } from './common/Header.tsx'
import { SWRConfig } from 'swr'
import { fetcher } from './fetcher.ts'

export const AppOutlet = () => {
    return (
        <SWRConfig value={{ fetcher: fetcher }}>
            <Header />
            <Outlet />
        </SWRConfig>
    )
}
