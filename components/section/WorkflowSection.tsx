// components/sections/WorkflowSection.tsx
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
  UserPlus,
  Users,
  UserCheck,
  CheckCircle,
  Calendar,
  Award,
} from 'lucide-react'

const workflowSteps = [
  {
    icon: UserPlus,
    title: "Student Registration",
    description: "Students register and create their profiles in the system",
    step: "01"
  },
  {
    icon: Users,
    title: "Group Creation",
    description: "Form project teams with classmates or get matched automatically",
    step: "02"
  },
  {
    icon: UserCheck,
    title: "Guide Allocation",
    description: "Faculty guides are assigned based on expertise and availability",
    step: "03"
  },
  {
    icon: CheckCircle,
    title: "Proposal Approval",
    description: "Submit project proposals for review and approval by faculty",
    step: "04"
  },
  {
    icon: Calendar,
    title: "Progress Tracking",
    description: "Regular meetings and milestone tracking throughout the project",
    step: "05"
  },
  {
    icon: Award,
    title: "Final Evaluation",
    description: "Project evaluation, grading, and comprehensive report generation",
    step: "06"
  }
]

export function WorkflowSection() {
  return (
    <section className="py-20 px-4 bg-[#07111F] relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Project <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Workflow</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            A streamlined step-by-step process from registration to project completion
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="h-full border border-blue-500/20 shadow-lg hover:shadow-cyan-500/20 hover:shadow-xl transition-all duration-300 bg-white/5 backdrop-blur-md hover:border-cyan-400/40 group hover:scale-105">
                <CardContent className="p-6 text-center relative">
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-md text-sm font-bold shadow-lg shadow-blue-500/30">
                    {step.step}
                  </span>

                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {/* Connection line for desktop */}
              {index < workflowSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-400/50 to-cyan-400/50 transform -translate-y-1/2 z-10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
