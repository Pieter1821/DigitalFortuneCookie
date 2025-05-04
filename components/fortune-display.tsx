"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent } from "@/components/ui/card"
import type { FortuneData } from "@/lib/fortune"

interface FortuneDisplayProps {
  fortune: FortuneData | null
  isVisible: boolean
}

export function FortuneDisplay({ fortune, isVisible }: FortuneDisplayProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && fortune) {
      gsap.fromTo(
        cardRef.current,
        {
          y: 20,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 0.3,
        },
      )

      // Animate the fortune elements sequentially
      const elements = cardRef.current?.querySelectorAll(".fortune-element")
      if (elements) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.4,
            delay: 0.6,
            ease: "power2.out",
          },
        )
      }
    } else {
      gsap.to(cardRef.current, {
        y: 20,
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
      })
    }
  }, [isVisible, fortune])

  // If no fortune yet, show placeholder
  if (!fortune) {
    return (
      <Card
        ref={cardRef}
        className={`w-full bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 shadow-xl rounded-lg transform rotate-1 ${!isVisible && "opacity-0"}`}
      >
        <CardContent className="p-6 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-8xl text-red-800 font-serif">福</span>
          </div>
          <p className="text-center text-amber-900 font-serif text-lg italic">Your fortune will appear here...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      ref={cardRef}
      className={`w-full bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 shadow-xl rounded-lg transform rotate-1 ${!isVisible && "opacity-0"}`}
    >
      <CardContent className="p-6 relative">
        {/* Chinese character watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-8xl text-red-800 font-serif">福</span>
        </div>

        <div className="relative z-10 space-y-4">
          {/* Main fortune message */}
          <div className="fortune-element">
            <p className="text-center text-amber-900 font-serif text-xl italic leading-relaxed font-medium">
              "{fortune.message}"
            </p>
          </div>

          <div className="h-px w-full bg-amber-200 fortune-element"></div>

          {/* Interpretation */}
          <div className="fortune-element">
            <p className="text-center text-amber-800 font-serif text-sm leading-relaxed">{fortune.interpretation}</p>
          </div>

          {/* Lucky elements */}
          <div className="grid grid-cols-2 gap-3 mt-4 fortune-element">
            <div className="bg-amber-100/50 p-3 rounded-md border border-amber-200">
              <h4 className="text-amber-800 font-medium text-sm">Lucky Numbers</h4>
              <p className="text-amber-900 font-bold">{fortune.luckyNumbers}</p>
            </div>

            <div className="bg-amber-100/50 p-3 rounded-md border border-amber-200">
              <h4 className="text-amber-800 font-medium text-sm">Lucky Color</h4>
              <p className="text-amber-900 font-bold">{fortune.luckyColor}</p>
            </div>

            <div className="bg-amber-100/50 p-3 rounded-md border border-amber-200">
              <h4 className="text-amber-800 font-medium text-sm">Element</h4>
              <p className="text-amber-900 font-bold">{fortune.luckyElement}</p>
            </div>

            <div className="bg-amber-100/50 p-3 rounded-md border border-amber-200">
              <h4 className="text-amber-800 font-medium text-sm">Timeframe</h4>
              <p className="text-amber-900 font-bold">{fortune.timeframe}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center items-center mt-2 fortune-element">
            <div className="flex items-center">
              <div className="h-px w-8 bg-amber-300"></div>
              <div className="mx-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-600" fill="currentColor">
                  <path d="M12 2L9.5 8.5H2L7.5 12.5L5 19L12 15L19 19L16.5 12.5L22 8.5H14.5L12 2Z" />
                </svg>
              </div>
              <div className="h-px w-8 bg-amber-300"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
