// components/ui/spotlight-card.tsx
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
}

export function SpotlightCard({ children, className }: SpotlightCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className={cn("relative overflow-hidden", className)}
    >
      {children}
    </motion.div>
  )
}
