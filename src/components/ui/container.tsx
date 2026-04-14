import join from "@/utils/join"

interface FlexProps {
  children?: React.ReactNode
  col?: boolean
  className?: string
  gap?: number
}

export function Flex({ children, col = false, className, gap = 2 }: FlexProps) {
  return (
    <div className={join('flex gap-2', col && 'flex-col', className)} style={{ gap: `calc(var(--spacing) * ${gap})`}}>
      {
        children
      }
    </div>
  )
}

interface CardProps {
  children?: React.ReactNode
  className?: string
  solid?: boolean
}

export function Card({ children, className, solid = false }: CardProps) {
  return (
    <div className={join("rounded-md border border-accent/50 p-2", solid ? 'bg-[color-mix(in_srgb,var(--color-accent)_30%,black)]' : 'bg-accent/15', className)}>
      {children}
    </div>
  )
}