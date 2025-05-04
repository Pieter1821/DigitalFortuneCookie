"use client"

import { useState, useRef, useEffect } from "react"
import { FortuneCookie } from "@/components/fortune-cookie"
import { FortuneDisplay } from "@/components/fortune-display"
import { Button } from "@/components/ui/button"
import { getFortune } from "@/lib/fortune"
import { useToast } from "@/hooks/use-toast"
import { gsap } from "gsap"
import type { FortuneData } from "@/lib/fortune"

export default function Home() {
  const [fortune, setFortune] = useState<FortuneData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const cookieRef = useRef(null)
  const { toast } = useToast()
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create initial animation for the page
    gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
  }, [])

  const createParticles = () => {
    if (!particlesRef.current) return

    const particles = particlesRef.current
    particles.innerHTML = ""

    // Create gold dust particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div")
      particle.className = "absolute rounded-full bg-amber-300 opacity-80"

      // Random size between 3-8px
      const size = Math.random() * 5 + 3
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`

      // Position around the center
      particle.style.left = `calc(50% + ${(Math.random() - 0.5) * 100}px)`
      particle.style.top = `calc(50% + ${(Math.random() - 0.5) * 100}px)`

      particles.appendChild(particle)

      // Animate each particle
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        opacity: 0,
        duration: Math.random() * 2 + 1,
        ease: "power2.out",
        onComplete: () => {
          if (particles.contains(particle)) {
            particles.removeChild(particle)
          }
        },
      })
    }
  }

  const handleGetFortune = async () => {
    if (isLoading) return

    setIsLoading(true)
    setIsOpen(false)

    try {
      // Create particle effect
      createParticles()

      // Get fortune after a slight delay for animation
      setTimeout(async () => {
        const newFortune = await getFortune()
        setFortune(newFortune)
        setIsOpen(true)
        setIsLoading(false)
      }, 800)
    } catch (error) {
      toast({
        title: "Fortune Misread",
        description: "The universe is unclear. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-red-900 to-red-950 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[radial-gradient(circle,_#f59e0b_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-32 bg-gradient-to-b from-red-600 to-red-700 rounded-full opacity-30"></div>
      <div className="absolute top-20 right-20 w-16 h-28 bg-gradient-to-b from-red-600 to-red-700 rounded-full opacity-20"></div>

      <div ref={containerRef} className="max-w-md w-full mx-auto flex flex-col items-center gap-8 z-10">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-amber-300 mb-2 font-serif tracking-wide">Fortune Cookie</h1>
          <p className="text-amber-200/80 italic">Discover your destiny</p>
        </div>

        <div className="relative w-full aspect-square">
          {/* Particles container */}
          <div ref={particlesRef} className="absolute inset-0 z-20 pointer-events-none"></div>

          {/* Glow effect */}
          <div
            className={`absolute inset-0 bg-amber-500/20 rounded-full filter blur-xl transform scale-75 transition-opacity duration-1000 ${isOpen ? "opacity-80" : "opacity-0"}`}
          ></div>

          <FortuneCookie ref={cookieRef} isOpen={isOpen} onClick={handleGetFortune} isLoading={isLoading} />
        </div>

        <FortuneDisplay fortune={fortune} isVisible={isOpen} />

        <Button
          onClick={handleGetFortune}
          disabled={isLoading}
          className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Consulting the stars..." : "Reveal Your Fortune"}
        </Button>

        <p className="text-amber-200/60 text-sm italic mt-4 text-center">
          Click the cookie or button to discover what the universe has in store for you
        </p>
      </div>
    </main>
  )
}
