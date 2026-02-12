import { IconFile, IconTablePlus } from "@tabler/icons-react";
import type { KeyComboProps } from "../components/key";
import KeyCombo from "../components/key";

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center h-full gap-4">
      <h1 className="text-6xl font-momo-trust mb-8">Langy</h1>

      <div className="flex flex-col gap-4">
        <ActionButton shortcutKey={{ optionKey: true, keys: "O" }}>
          <IconFile />
          <p>Open project from file</p>
        </ActionButton>

        <ActionButton shortcutKey={{ optionKey: true, keys: "N" }}>
          <IconTablePlus />
          <p>Create project</p>
        </ActionButton>
      </div>

      <span>or</span>

      <div className="border border-zinc-600 bg-zinc-800 rounded-md p-4">
        <h2>Load project from browser memory</h2>
      </div>
    </div>
  );
}

function ActionButton({ children, shortcutKey }: ActionButtonProps) {
  return (
    <button className="flex justify-between gap-12 select-none">
      <div className="flex gap-2">{children}</div>
      {shortcutKey && <KeyCombo {...shortcutKey} />}
    </button>
  );
}

interface ActionButtonProps {
  shortcutKey?: KeyComboProps;
  children?: React.ReactNode;
}
