import { IconEditCircle, IconFiles, IconHome, IconSettings } from "@tabler/icons-react"
import { isRouteErrorResponse, NavLink, Outlet, useRouteError } from "react-router"
import { CrashErrorPage, NotFoundErrorPage } from "./errors";

export default function Root() {
    return (
        <main className="pt-12 h-full">
            <NavigationBar />
            <Outlet />
        </main>
    )
}

export function RootErrorBoundary() {
    let error = useRouteError();
    console.error(error)
    
    if(isRouteErrorResponse(error))
        if(error.status === 404) return <NotFoundErrorPage />
    else
        return <CrashErrorPage error={error as any} />
}

function NavigationBar() {
    return <nav className="absolute left-0 top-0 w-full h-12 bg-zinc-800 px-2 flex justify-between">
        <div className="flex">
            <NavigationButton href="/">
                <IconHome />
            </NavigationButton>
            <NavigationButton href="/editor">
                <IconEditCircle />
            </NavigationButton>
            <NavigationButton href="/files">
                <IconFiles />
            </NavigationButton>
            
        </div>
        <div className="flex">
            <NavigationButton href="/settings">
                <IconSettings />
            </NavigationButton>
        </div>
    </nav>
}

function NavigationButton({href, children}: NavigationButtonProps) {
    return (
        <NavLink 
            to={href}
            className={({ isActive }) => `h-full flex p-2 items-center transition-colors ${isActive ? 'bg-violet-600' : 'hover:bg-violet-600/30 bg-zinc-700/30'}`}
        >
            { children }
        </NavLink>
    )
}

interface NavigationButtonProps {
    href: string
    children?: React.ReactNode
}