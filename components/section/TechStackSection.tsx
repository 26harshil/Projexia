// components/sections/TechStackSection.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card"; // Assuming Badge is a custom component, not from lucide-react
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
  Frontend: "bg-blue-100 text-blue-800",
  Framework: "bg-purple-100 text-purple-800",
  Styling: "bg-green-100 text-green-800",
  Components: "bg-orange-100 text-orange-800",
  Animation: "bg-pink-100 text-pink-800",
  Database: "bg-red-100 text-red-800",
  ORM: "bg-cyan-100 text-cyan-800",
  Backend: "bg-indigo-100 text-indigo-800",
};

export function TechStackSection() {
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
            Technology{" "}
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Stack
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
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
          <Card className="border-0 shadow-lg bg-linear-to-br from-slate-50 to-white">
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-4 justify-center">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Badge
                        className={`text-sm font-semibold px-4 py-2 ${
                          categoryColors[
                            tech.category as keyof typeof categoryColors
                          ]
                        }`}
                      >
                        {tech.name}
                      </Badge>
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
