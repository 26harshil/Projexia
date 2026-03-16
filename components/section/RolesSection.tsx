// components/sections/RolesSection.tsx
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GlowCard } from '@/components/ui/glow-card'
import { Shield, GraduationCap, Users } from 'lucide-react'

const roles = [
  {
    icon: Shield,
    title: "Admin",
    color: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/25",
    responsibilities: [
      "Manage project types and categories",
      "Configure academic staff and departments",
      "Generate comprehensive reports",
      "System monitoring and maintenance"
    ]
  },
  {
    icon: GraduationCap,
    title: "Faculty",
    color: "from-cyan-500 to-blue-500",
    glow: "shadow-cyan-500/25",
    responsibilities: [
      "Guide allocation and management",
      "Schedule and conduct meetings",
      "Evaluate student progress",
      "Provide project feedback and grades"
    ]
  },
  {
    icon: Users,
    title: "Student",
    color: "from-teal-400 to-cyan-500",
    glow: "shadow-teal-500/25",
    responsibilities: [
      "Create and join project groups",
      "Submit project proposals",
      "Participate in scheduled meetings",
      "Upload documents and track progress"
    ]
  }
]

export function RolesSection() {
  return (
    <section className="py-20 px-4 bg-[#050A14] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Roles & <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Responsibilities</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Tailored experiences for each user type with specific permissions and functionalities
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <GlowCard className="h-full">
                <Card className={`h-full border border-blue-500/20 shadow-xl ${role.glow} transition-all duration-300 bg-white/5 backdrop-blur-md hover:border-cyan-400/40 hover:shadow-2xl`}>
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto p-3 rounded-xl bg-gradient-to-br ${role.color} mb-4 shadow-lg inline-flex`}>
                      <role.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white">
                      {role.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {role.responsibilities.map((responsibility, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-2 h-2 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full mt-2 mr-3 shrink-0 shadow-sm shadow-blue-400/50" />
                          <span className="text-slate-300 leading-relaxed">
                            {responsibility}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
