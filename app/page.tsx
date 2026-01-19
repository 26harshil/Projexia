'use client'

import { AboutSection } from '@/components/section/AboutSection'
import { CTASection } from '@/components/section/CTASection'
import { FeaturesSection } from '@/components/section/FeaturesSection'
import { Footer } from '@/components/section/Footer'
import { HeroSection } from '@/components/section/HeroSection'
import { RolesSection } from '@/components/section/RolesSection'
import { TechStackSection } from '@/components/section/TechStackSection'
import { WorkflowSection } from '@/components/section/WorkflowSection'
import PublicNavbar from "@/components/section/PublicNavbar";

export default function HomePage() {
  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <RolesSection />
        <WorkflowSection />
        <TechStackSection />
        <CTASection />
        <Footer />
      </div>
    </>
  )
}
