import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { joinLang } from "../utils/join";
import { IconCheck } from "@tabler/icons-react";
import useSettings, { type ColorDefinition, type SettingsEntry } from "../hooks/useSettings";
import { Switch } from "@/components/ui/switch";
import { Flex } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import z from "zod"

export default function SettingsPage() {
  const { entries } = useSettings()

  const categories = useMemo(() => [...new Set(entries.filter(e => e.visibility !== 'hidden').map(e => e.category))], [entries])

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
      <Flex col gap={4}>
        {categoryEntries
          .map((cfg) => (
            <SettingEntry key={cfg.id} config={cfg} />
          ))}
      </Flex>
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
            <Switch
              value={value as boolean}
              onChange={setValue}
              disabled={shouldBeDisabled}
            />
          ) : config.type === "input" ? (
            <Input
              value={value as string}
              onChange={setValue}
              disabled={shouldBeDisabled}
              validators={[z.union([z.ipv4({ error: "validate.ip.invalid" }), z.ipv6({ error: "validate.ip.invalid" })])]}
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