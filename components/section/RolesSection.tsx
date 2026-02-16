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
    color: "from-red-500 to-orange-500",
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
    color: "from-blue-500 to-emerald-500",
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
    color: "from-green-500 to-cyan-500",
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
            Roles & <span className="bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Responsibilities</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
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
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto p-3 rounded-xl bg-linear-to-br ${role.color} mb-4`}>
                      <role.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-slate-800">
                      {role.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {role.responsibilities.map((responsibility, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-2 h-2 bg-linear-to-br from-blue-500 to-emerald-500 rounded-full mt-2 mr-3 shrink-0" />
                          <span className="text-slate-600 leading-relaxed">
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
