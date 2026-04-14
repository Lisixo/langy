import {
  IconFolders,
  IconHome,
  IconRobotFace,
  IconSettings,
  IconTools,
} from "@tabler/icons-react";
import {
  isRouteErrorResponse,
  Link,
  Outlet,
  useLocation,
  useRouteError,
} from "react-router";
import { CrashErrorPage, NotFoundErrorPage } from "@/errors";
import useSettings, { type InputEntry, type NumericInputEntry, type SelectColorEntry } from "@/hooks/useSettings";
import { useEffect, useState } from "react";
import { getDatabase } from "@/modules/storage";
import { loaderManager } from "./modules/loader/manager";
import CSVImporter from "./modules/importers/csv";
import join from "./utils/join";
import useProject from "./hooks/useProject";
import { FloatingPortal, offset, shift, useFloating, useHover, useInteractions } from '@floating-ui/react';
import { Card, Flex } from "./components/ui/container";
import { Button } from "./components/ui/button";

export default function Root() {
  const [readyState, setReadyState] = useState<'preparing' | 'ready' | 'fail'>('preparing')
  const settingsIsLocked = useSettings((state) => state.locked)
  const project = useProject()

  useEffect(() => {
    async function asyncWrapper() {
      try {
        await getDatabase();
        const settings = useSettings.getState()

        // init settings
        if(!settingsIsLocked){
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
                color: 'oklch(60.9% 0.126 221.723)'
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
                color: 'oklch(58.6% 0.253 17.585)'
              },
              {
                key: 'fushia',
                color: 'oklch(51.8% 0.253 323.949)'
              },
            ],
            defaultValue: 'violet',
            action: async (value, _prev, entry) => {
              const accent = entry.selectOptions.find(
                (e) => e.key === value,
              )!.color;
              document.documentElement.style.setProperty("--color-accent", accent);
            }
          } satisfies SelectColorEntry<'violet' | 'cyan' | 'orange' | 'green' | 'rose' | 'fushia'>)
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

          settings.lock()
        }

        await project.fetchProjectList()

        // init
        loaderManager.registerImporter(new CSVImporter())

      }
      catch(e) {
        if(import.meta.env.DEV && ((e as Error).message.includes("already registered") || (e as Error).message.includes("Settings are locked"))) {
          console.warn("Error below was captured and ignored in development mode (propably false posivite from StrictMode)")
          console.warn(e)
          return
        }

        console.error(e)
        setReadyState('fail')
      } 
    }

    asyncWrapper()
  }, [])

  useEffect(() => {
    if(!settingsIsLocked) return

    setReadyState('ready')
  }, [settingsIsLocked])

  if(readyState === 'preparing')
    return "Loading. Please wait"

  if(readyState === 'fail') {
    throw new Error("Init app failed")
  }

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
  else return <CrashErrorPage error={error as any} />;
}

function NavigationBar() {
  const isNotLoaded = useProject(s => !s.projectId)
  const aiEnabled = useSettings(s => s.values["ai.enabled"] as boolean)

  const [AIWindowIsOpen, setAIWindowIsOpen] = useState(false)
  const {refs, floatingStyles, context} = useFloating({
    open: AIWindowIsOpen,
    onOpenChange: setAIWindowIsOpen,
    middleware: [shift(), offset({ mainAxis: 10, crossAxis: -20 })],
  });

  const hover = useHover(context, { enabled: aiEnabled, delay: { open: 0, close: 100 }})
  const {getReferenceProps, getFloatingProps} = useInteractions([hover])


  return (
    <>
      <nav className="absolute left-0 top-0 w-full h-12 /bg-zinc-800 bg-accent-bg-light px-2 flex justify-between border-b border-b-zinc-500/20">
        <div className="flex">
          <NavigationButton href="/">
            <IconHome />
          </NavigationButton>
          <NavigationButton href="/editor" disabled={isNotLoaded}>
            <IconTools />
          </NavigationButton>
          <NavigationButton href="/files" disabled={isNotLoaded}>
            <IconFolders />
          </NavigationButton>
        </div>
        <div className="flex">
          <NavigationContainer disabled={!aiEnabled} ref={refs.setReference} {...getReferenceProps()}>
            <IconRobotFace />
            {
              (AIWindowIsOpen && aiEnabled) && (
                <FloatingPortal>
                  <div style={floatingStyles} ref={refs.setFloating} {...getFloatingProps()}>
                    <Flex col>
                      <Card solid>
                        <Flex col>
                          <p>AI Status: Disconnected</p>
                          <p>AI Queue: 0</p>
                          <Button>
                            Abort AI Tasks
                          </Button>
                        </Flex>
                      </Card>
                    </Flex>
                  </div>
                </FloatingPortal>
              )
            }
          </NavigationContainer>
          <NavigationButton href="/settings">
            <IconSettings />
          </NavigationButton>
        </div>
      </nav>
    </>
  );
}

function NavigationButton({ href, ...rest }: NavigationButtonProps) {  
  function handleAnchorClick(ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if(rest.disabled) 
      ev.preventDefault()
  }

  const { pathname } = useLocation()

  const endSlashPosition = href !== "/" && href.endsWith("/") ? href.length - 1 : href.length;
  const isActive = pathname === href || pathname.startsWith(href) && pathname.charAt(endSlashPosition) === "/";

  return (
    <Link
      to={href}
      onClick={handleAnchorClick}
    >
      <NavigationContainer {...rest} isActive={isActive} />
    </Link>
  );
}

interface NavigationButtonProps extends Omit<NavigationContainerProps, "isActive"> {
  href: string;
}

interface NavigationContainerProps {
  children?: React.ReactNode;
  disabled?: boolean
  isActive?: boolean
}

function NavigationContainer({ children, isActive = false, disabled, ...rest }: NavigationContainerProps & React.HTMLAttributes<HTMLDivElement> & React.ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={
        join(
          `h-full flex p-2 items-center transition-colors`,
          isActive ? "bg-accent" : disabled ? 'cursor-default opacity-30' : "hover:bg-accent/20"
        )
      }
      {...rest}
    >
      {children}
    </div>
  )
}
