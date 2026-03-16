// components/sections/FeaturesSection.tsx
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import {
  Shield,
  FileText,
  Users,
  Calendar,
  Upload,
  BarChart3
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: "Role-Based Login",
    description: "Secure authentication system with distinct access levels for Admin, Faculty, and Students",
    badge: "Security"
  },
  {
    icon: FileText,
    title: "Project Proposal & Approval",
    description: "Streamlined proposal submission workflow with automated approval processes",
    badge: "Workflow"
  },
  {
    icon: Users,
    title: "Group & Guide Allocation",
    description: "Intelligent matching system for optimal team formation and faculty assignment",
    badge: "AI-Powered"
  },
  {
    icon: Calendar,
    title: "Meeting Scheduling",
    description: "Integrated calendar system with attendance tracking and meeting management",
    badge: "Productivity"
  },
  {
    icon: Upload,
    title: "Document Management",
    description: "Version-controlled document upload with collaborative editing capabilities",
    badge: "Collaboration"
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "Comprehensive reporting with Excel and PDF export functionality",
    badge: "Analytics"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-[#07111F] relative overflow-hidden">
      {/* Glowing orb effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Key <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Powerful tools designed to enhance academic project management and collaboration
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <SpotlightCard className="h-full">
                <Card className="h-full border border-blue-500/20 shadow-lg hover:shadow-cyan-500/20 hover:shadow-xl transition-all duration-300 bg-white/5 backdrop-blur-md hover:border-cyan-400/40">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg shadow-blue-500/30">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-cyan-300 border border-cyan-500/30 rounded-md font-medium backdrop-blur-sm">
                        {feature.badge}
                      </span>
                    </div>
                    <CardTitle className="text-xl text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
