import { IconChevronLeft } from "@tabler/icons-react"
import type { ErrorResponse } from "react-router"

export function NotFoundErrorPage() {
    return <main className="flex flex-col h-screen justify-center items-center gap-8">
        <h1 className="text-6xl font-bold">Sorry 😭</h1>
        <p className="text-xl">Provided URL is invalid</p>
        
        <button 
            className="size-16 bg-violet-600 hover:bg-violet-500 transition-colors cursor-pointer rounded-md flex justify-center items-center"
            // Go to home page with reloading entite site (to clear all states)
            onClick={() => location.href = import.meta.env.BASE_URL }
        >
            <IconChevronLeft size={40} />
        </button>
    </main>
}

export function CrashErrorPage({ error }: { error: ErrorResponse }) {
    return <main className="flex flex-col h-screen justify-center items-center gap-8">
        <h1 className="text-6xl font-bold">Opsssss...</h1>
        <p className="text-xl">App crashed</p>
    </main>
}