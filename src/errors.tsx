import { IconChevronLeft } from "@tabler/icons-react";
import type { ErrorResponse } from "react-router";
import join from "./utils/join";

export function NotFoundErrorPage() {
  return (
    <main className="flex flex-col h-screen justify-center items-center gap-8">
      <h1 className="text-6xl font-bold">Sorry 😭</h1>
      <p className="text-xl">Provided URL is invalid</p>

      <button
        className="size-16 bg-accent hover:bg-accent/80 transition-colors cursor-pointer rounded-md flex justify-center items-center"
        // Go to home page with reloading entite site (to clear all states)
        onClick={() => (location.href = import.meta.env.BASE_URL)}
      >
        <IconChevronLeft size={40} />
      </button>
    </main>
  );
}

export function CrashErrorPage({ error }: { error: Error }) {
  return (
    <main className="flex flex-col min-h-full justify-center items-center gap-8">
      <h1 className="text-6xl font-bold">Opsssss...</h1>
      <p className="text-xl">App crashed</p>

      {
        error && (
          <div className="p-4 overflow-auto h-full w-full">
            <div className="rounded-md border-2 border-zinc-800 bg-zinc-950 p-4 font-mono flex flex-col gap-2 wrap-break-word overflow-auto h-full w-full">
              {
                error.stack 
                ? error.stack?.split('\n').map(el => <span className={join('text-sm', el.trim().startsWith('at ') && 'pl-8')}>{el}</span>)
                : <span>[{error.name}] {error.message}</span>
              }
            </div>
          </div>
        )
      }
    </main>
  );
}
