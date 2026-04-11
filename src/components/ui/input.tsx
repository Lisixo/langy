import join from "@/utils/join";
import type { InputHTMLAttributes } from "react";

// export function Input({
//   onChange,
//   disabled,
//   className,
//   label,
//   ...rest
// }: InputHTMLAttributes<HTMLInputElement> & InputProps
// ) {
//   return (
//     <div className={join(`flex flex-col flex-wrap`, label && `bg-accent-light/5 rounded-md p-2`)}>
//       { label && (
//         <p className="mb-1 ml-1 select-none font-bold text-sm">{label}</p>
//       ) }
//       <input
//         className={join("w-full p-2 rounded-md border-2 border-accent bg-accent/5 outline-none transition-colors disabled:bg-zinc-800/10 disabled:border-zinc-800 disabled:opacity-50", className)}
//         onChange={(ev) => onChange && !disabled && onChange(ev.target.value)}
//         disabled={disabled}
//         {...rest}
//       />
//     </div>
//   );
// }

export function Input({
  onChange,
  disabled,
  className,
  placeholder: label,
  name,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & InputProps
) {
  return (
    <div className={join(`relative flex flex-col flex-wrap`, label && `bg-accent-light/5 rounded-md p-2`)}>
      {label && (
        <label htmlFor={name} className="text-sm mb-1 ml-1">{label}</label>
      )}
      <input
        className={join("peer w-full p-2 rounded-md border-2 border-accent/50 focus:border-accent focus:placeholder:text-gray-300/50 placeholder:text-gray-300 placeholder:font-bold placeholder:transition-colors bg-accent/5 outline-none transition-colors", className)}
        onChange={(ev) => onChange && !disabled && onChange(ev.target.value)}
        disabled={disabled}
        // placeholder={label}
        name={name}
        {...rest}
      />
    </div>
  );
}

interface InputProps {
  onChange?: (state: string) => void
}