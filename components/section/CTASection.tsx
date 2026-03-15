// components/sections/CTASection.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, LogIn } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-[#07111F] relative overflow-hidden">
      {/* Glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20stroke=%22%233B9EFF%22%20stroke-opacity=%220.06%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] pointer-events-none" />

      {/* Glass card container */}
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="border border-blue-500/20 rounded-3xl bg-white/5 backdrop-blur-md p-12 shadow-2xl shadow-blue-900/30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Digitize Your Academic
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Project Management
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform the way your institution handles student projects with our comprehensive management solution.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-cyan-500/40 transition-all duration-300 border-0"
                >
                  Start Managing Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border border-blue-500/40 text-white bg-white/5 hover:bg-blue-500/10 hover:border-cyan-400/60 px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Login to Dashboard
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating blobs */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none"
      />

      <motion.div
        animate={{
          y: [0, 15, 0],
          x: [0, -15, 0],
          rotate: [0, -3, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-20 left-20 w-20 h-20 bg-cyan-400/10 rounded-full blur-lg pointer-events-none"
      />
    </section>
  )
}
