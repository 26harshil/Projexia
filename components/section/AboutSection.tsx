// components/sections/AboutSection.tsx
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Users, UserCheck, Calendar, TrendingUp } from 'lucide-react'
import { HoverCard } from '../ui/hover-card'

const aboutFeatures = [
  {
    icon: Users,
    title: "Project Group Formation",
    description: "Smart algorithms to form balanced project teams based on skills and preferences"
  },
  {
    icon: UserCheck,
    title: "Guide Allocation",
    description: "Automated faculty guide assignment based on expertise and availability"
  },
  {
    icon: Calendar,
    title: "Meeting Tracking",
    description: "Schedule, track, and manage project meetings with attendance monitoring"
  },
  {
    icon: TrendingUp,
    title: "Progress Monitoring",
    description: "Real-time project progress tracking with milestone management"
  }
]

export function AboutSection() {
  return (
    <section className="py-20 px-4 bg-[#050A14] relative overflow-hidden">
      {/* subtle grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%233B9EFF%22%20stroke-opacity%3D%220.04%22%3E%3Cpath%20d%3D%22M0%200h40v40H0z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-60 pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">SPMS</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A comprehensive digital solution designed to revolutionize academic project management,
            fostering collaboration between students, faculty, and administrators.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aboutFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <HoverCard className="h-full">
                <Card className="h-full border border-blue-500/20 shadow-lg hover:shadow-blue-500/20 hover:shadow-xl transition-all duration-300 bg-white/5 backdrop-blur-md hover:border-cyan-400/40">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/30">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </HoverCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
