import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { joinLang } from "../utils/join";
import { IconCheck } from "@tabler/icons-react";
import useSettings, { type ColorDefinition, type SettingsEntry } from "../hooks/useSettings";

export default function SettingsPage() {
  const { entries } = useSettings()

  const categories = useMemo(() => [...new Set(entries.map(e => e.category))], [entries])

  return (
    <div className="relative flex flex-col gap-4">
      {categories.map((cat) => (
        <SettingsCategoryCard key={cat} category={cat} />
      ))}
    </div>
  );
}

function SettingsCategoryCard({ category }: { category: string }) {
  const { t } = useTranslation();
  const { entries } = useSettings()

  const categoryEntries = useMemo(() => entries.filter(e => e.category === category), [entries])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 border-t border-t-zinc-500/20 mx-4 py-4">
      <div>
        <h1 className="md:sticky top-2 left-2 font-momo-trust text-2xl mb-12 md:mb-0">
          {t(joinLang("config.category", category))}
        </h1>
      </div>
      <div className="flex flex-col gap-4">
        {categoryEntries
          .map((cfg) => (
            <SettingEntry key={cfg.id} config={cfg} />
          ))}
      </div>
    </div>
  );
}

function SettingEntry({ config }: { config: SettingsEntry }) {
  const settings = useSettings()
  const { t } = useTranslation();

  const [value, setValue] = useState<SettingsEntry['defaultValue']>(settings.values[config.id])

  useEffect(() => {
    settings.set(config.id, value)
  }, [value]);

  // const shouldBeDisabled = false
  const shouldBeDisabled = useMemo(() => settings.disabledEntries.includes(config.id), [settings.disabledEntries])

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex w-full justify-between">
        <div>
          <h1 className="mb-2 font-bold">
            {t(joinLang("config.entry", config.id, "title"))}
          </h1>
          <p>{t(joinLang("config.entry", config.id, 'desc'))}</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          {config.type === "checkbox" ? (
            <Checkbox
              value={value as boolean}
              onChange={setValue}
              disabled={shouldBeDisabled}
            />
          ) : config.type === "input" ? (
            <TextInput
              value={value as string}
              onChange={setValue}
              disabled={shouldBeDisabled}
            />
          ) : null}
        </div>
      </div>
      {config.type === "select-color" && (
        <ColorSelect
          value={value as string}
          list={config.selectOptions}
          onChange={setValue}
        />
      )}
    </div>
  );
}

function Checkbox({
  value,
  size = 24,
  disabled,
  onChange,
}: {
  value: boolean;
  disabled?: boolean;
  size?: number;
  onChange: (state: boolean) => void;
}) {
  const padding = 4;
  return (
    <div
      className={`rounded-full transition-colors ${disabled ? "cursor-auto" : "cursor-pointer"} ${disabled ? "bg-accent/30" : value ? "bg-accent outline-accent" : "bg-zinc-800 outline-zinc-700"} outline `}
      style={{ height: size, width: size * 2 }}
      onClick={() => !disabled && onChange(!value)}
    >
      <div
        className={`h-full bg-white rounded-full transition-transform`}
        style={{
          height: size - padding * 2,
          width: size - padding * 2,
          margin: padding,
          transform: value ? `translateX(${size}px)` : undefined,
        }}
      ></div>
    </div>
  );
}

function ColorSelect({
  value,
  size = 24,
  list,
  onChange,
}: {
  value: string;
  size?: number;
  list: ColorDefinition[];
  onChange: (state: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {list.map((entry) => (
        <div
          key={entry.key}
          className="rounded-md flex flex-col justify-center items-center cursor-pointer"
          style={{
            width: size,
            height: size,
            background: entry.color,
          }}
          onClick={() => onChange(entry.key)}
        >
          {value === entry.key && <IconCheck size={size - 8} />}
        </div>
      ))}
    </div>
  );
}

function TextInput({
  value,
  size = 24,
  onChange,
  disabled,
}: {
  value: string;
  size?: number;
  onChange: (state: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      <input
        className="w-full p-2 rounded-md border-2 border-accent bg-accent/10 outline-none transition-colors disabled:bg-zinc-800/10 disabled:border-zinc-800 disabled:opacity-50"
        disabled={disabled}
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
      />
    </div>
  );
}
