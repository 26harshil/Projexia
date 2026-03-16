// components/sections/TechStackSection.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "lucide-react";

const techStack = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Framework" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "shadcn/ui", category: "Components" },
  { name: "Framer Motion", category: "Animation" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Prisma", category: "ORM" },
  { name: ".NET API", category: "Backend" },
];

const categoryColors = {
  Frontend: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Framework: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Styling: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  Components: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  Animation: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  Database: "bg-blue-600/20 text-blue-200 border-blue-600/30",
  ORM: "bg-cyan-600/20 text-cyan-200 border-cyan-600/30",
  Backend: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

export function TechStackSection() {
  return (
    <section className="py-20 px-4 bg-[#050A14] relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Technology{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Stack
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Built with modern, industry-standard technologies for optimal
            performance and scalability
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="border border-blue-500/20 shadow-xl shadow-blue-900/20 bg-white/5 backdrop-blur-md">
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-4 justify-center">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.08 }}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <span
                        className={`text-sm font-semibold px-4 py-2 rounded-lg border backdrop-blur-sm ${
                          categoryColors[
                            tech.category as keyof typeof categoryColors
                          ]
                        }`}
                      >
                        {tech.name}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {tech.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
