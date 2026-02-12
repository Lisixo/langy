import {
  IconEditCircle,
  IconFiles,
  IconHome,
  IconSettings,
} from "@tabler/icons-react";
import {
  isRouteErrorResponse,
  NavLink,
  Outlet,
  useRouteError,
} from "react-router";
import { CrashErrorPage, NotFoundErrorPage } from "./errors";
import useSettings, { type InputEntry, type NumericInputEntry, type SelectColorEntry } from "./hooks/useSettings";
import { useEffect, useState } from "react";
import { getDatabase } from "./modules/storage";

export default function Root() {
  const [readyState, setReadyState] = useState<'preparing' | 'ready' | 'fail'>('preparing')
  const settings = useSettings()

  useEffect(() => {
    async function asyncWrapper() {
      try {
        await getDatabase();
        
        // init settings
        await settings.register({
          id: 'general.accent',
          category: 'general',
          visibility: 'visible',
          type: 'select-color',
          selectOptions: [
            {
              key: 'violet',
              color: 'oklch(54.1% 0.281 293.009)'
            },
            {
              key: 'cyan',
              color: 'oklch(70.4% 0.14 182.503)'
            },
            {
              key: 'green',
              color: 'oklch(52.7% 0.154 150.069)'
            },
            {
              key: 'orange',
              color: 'oklch(64.6% 0.222 41.116)'
            },
            {
              key: 'rose',
              color: 'oklch(71.2% 0.194 13.428)'
            },
          ],
          defaultValue: 'violet',
          action: async (value, _prev, entry) => {
            const accent = entry.selectOptions.find(
              (e) => e.key === value,
            )!.color;
            document.documentElement.style.setProperty("--color-accent", accent);
          }
        } satisfies SelectColorEntry<'violet' | 'cyan' | 'orange' | 'green' | 'rose'>)
        await settings.register({
          id: 'ai.enabled',
          category: 'ai',
          visibility: 'visible',
          type: 'checkbox',
          defaultValue: false
        })
        await settings.register({
          id: 'ai.address',
          category: 'ai',
          visibility: 'visible',
          type: 'input',
          defaultValue: "127.0.0.1",
          dependsOn: ['ai.enabled']
        } satisfies InputEntry)
        await settings.register({
          id: 'ai.port',
          category: 'ai',
          visibility: 'visible',
          type: 'input-numeric',
          defaultValue: 11434,
          minValue: 1,
          maxValue: 65565,
          dependsOn: ['ai.enabled']
        } satisfies NumericInputEntry)

        setReadyState('ready')
      }
      catch {
        setReadyState('fail')
      } 
    }

    asyncWrapper()
  }, [])

  if(readyState === 'preparing')
    return "Loading. Please wait"

  return (
    <main className="pt-12 h-full overflow-hidden">
      <NavigationBar />
      <div className="h-[calc(100%)] overflow-y-auto">
        <Outlet />
      </div>
    </main>
  );
}

export function RootErrorBoundary() {
  let error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error))
    if (error.status === 404) return <NotFoundErrorPage />;
    else return <CrashErrorPage error={error as any} />;
}

function NavigationBar() {
  return (
    <nav className="absolute left-0 top-0 w-full h-12 bg-zinc-800 px-2 flex justify-between">
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
  );
}

function NavigationButton({ href, children }: NavigationButtonProps) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `h-full flex p-2 items-center transition-colors ${isActive ? "bg-accent" : "hover:bg-accent/30 bg-zinc-700/30"}`
      }
    >
      {children}
    </NavLink>
  );
}

interface NavigationButtonProps {
  href: string;
  children?: React.ReactNode;
}
