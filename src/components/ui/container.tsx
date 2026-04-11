import join from "@/utils/join"

interface FlexProps {
  children?: React.ReactNode
  direction?: 'row' | 'col'
  className?: string
}

export function Flex({ children, direction = 'row', className }: FlexProps) {
  return (
    <div className={join('flex gap-2', direction === 'col' && 'flex-col', className)}>
      {
        children
      }
    </div>
  )
}