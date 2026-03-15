'use client'

import { AboutSection } from '@/components/section/AboutSection'
import { CTASection } from '@/components/section/CTASection'
import { FeaturesSection } from '@/components/section/FeaturesSection'
import { Footer } from '@/components/section/Footer'
import { RolesSection } from '@/components/section/RolesSection'
import { TechStackSection } from '@/components/section/TechStackSection'
import { WorkflowSection } from '@/components/section/WorkflowSection'
import { HeroScrollSection } from '@/components/section/HeroScrollSection'

export default function HomePage() {
  return (
    <>
      {/* Cinematic canvas-based scroll hero — replaces static HeroSection + PublicNavbar */}
      <HeroScrollSection />

      {/* Remaining landing page sections */}
      <div className="bg-[#050A14]">
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
