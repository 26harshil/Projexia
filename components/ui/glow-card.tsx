// components/ui/glow-card.tsx
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
}

export function GlowCard({ children, className }: GlowCardProps) {
  return (
    <motion.div
      whileHover={{ 
        boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)" 
      }}
      transition={{ duration: 0.3 }}
      className={cn("rounded-lg", className)}
    >
      {children}
    </motion.div>
  )
}
