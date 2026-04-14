import join from "@/utils/join";
import { useEffect, useMemo, useState, type InputHTMLAttributes } from "react";
import z from "zod"
import _ from 'lodash'
import { Card, Flex } from "./container";
import { t } from "i18next";

export function Input({
  onChange,
  disabled,
  className,
  placeholder: label,
  name,
  validators,
  value, 
  ...rest
}: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & InputProps
) {
  const [innerValue, setInnerValue] = useState(value ?? "")
  const errors = useMemo(() => (
    _.uniq(
      (validators ?? [])
        .map(v => v.safeParse(innerValue).error)
        .filter(e => !!e)
        .map(e => z.treeifyError(e).errors)
        .flat()
    )
  ), [validators, innerValue])
  const isValid = useMemo(() => errors.length == 0, [errors])

  useEffect(() => {
    if(isValid) onChange && onChange(innerValue)
  }, [isValid])

  return (
    <div className={join(`relative flex flex-col flex-wrap`, label && `bg-accent-light/5 rounded-md p-2`)}>
      {label && (
        <label htmlFor={name} className="text-sm mb-1 ml-1">{label}</label>
      )}
      <input
        className={join("peer w-full p-2 rounded-md border-2 border-accent/50 focus:border-accent focus:placeholder:text-gray-300/50 placeholder:text-gray-300 placeholder:font-bold placeholder:transition-colors bg-accent/5 outline-none transition-colors", className)}
        onChange={(ev) => !disabled && setInnerValue(ev.target.value)}
        value={innerValue}
        disabled={disabled}
        // placeholder={label}
        name={name}
        {...rest}
      />
      {
        !isValid && (
          <Card>
            <Flex col>
              {
                errors.map((e, idx) => <p key={idx}>{t(e)}</p>)
              }
            </Flex>
          </Card>
        )
      }
    </div>
  );
}

interface InputProps {
  value?: string
  onChange?: (state: string) => void
  validators?: z.ZodTypeAny[]
}