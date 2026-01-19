// components/ui/gradient-text.tsx
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
}

export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span className={cn("bg-clip-text text-transparent", className)}>
      {children}
    </span>
  )
}
