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
    <section className="py-20 px-4 bg-linear-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Key <span className="bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
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
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-linear-to-br from-blue-500 to-emerald-600 rounded-lg">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded-md font-medium">
                        {feature.badge}
                      </span>
                    </div>
                    <CardTitle className="text-xl text-slate-800">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">
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
