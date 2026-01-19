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
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            About <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SPMS</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
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
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-linear-to-br from-white to-slate-50">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
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
