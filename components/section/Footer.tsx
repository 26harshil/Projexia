// components/sections/Footer.tsx
'use client'

export function Footer() {
  return (
    <footer className="bg-[#050A14] border-t border-blue-500/15 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Projexia
          </h3>

          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            This system is developed for academic purposes to demonstrate modern web development
            practices and project management solutions for educational institutions.
          </p>

          <div className="border-t border-blue-500/15 pt-6">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Projexia.
              Developed for academic evaluation and learning purposes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
