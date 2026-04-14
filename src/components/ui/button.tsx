import join from "@/utils/join";
import type { ButtonHTMLAttributes } from "react";

export function Button({
  variant = 'primary',
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps
) {
  return (
    <button
      className={join("p-2 rounded-md border font-bold cursor-pointer disabled:cursor-not-allowed disabled:bg-neutral-700/60 disabled:border-neutral-700 transition-colors", className, 
        variant === 'primary'
        ? 'bg-accent/60 hover:bg-accent/80 border-accent'
        : variant === 'success'
        ? 'bg-green-600/60 hover:bg-green-600/80 border-green-600'
        : variant === 'info'
        ? 'bg-blue-800/60 hover:bg-blue-800/80 border-blue-900'
        : variant === 'danger'
        ? 'bg-red-800/60 hover:bg-red-800/80 border-red-700'
        : ''
      )}
      {...rest}
    >

    </button>
  );
}

interface ButtonProps {
  variant?: 'primary' | 'success' | 'info' | 'warning' | 'danger'
}