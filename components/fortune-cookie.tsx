"use client"

import { forwardRef, useEffect, useRef } from "react"
import { gsap } from "gsap"

interface FortuneCookieProps {
  isOpen: boolean
  isLoading: boolean
  onClick: () => void
}

export const FortuneCookie = forwardRef<HTMLDivElement, FortuneCookieProps>(({ isOpen, isLoading, onClick }, ref) => {
  const cookieClosedRef = useRef<HTMLDivElement>(null)
  const cookieLeftRef = useRef<HTMLDivElement>(null)
  const cookieRightRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial setup
    gsap.set(cookieLeftRef.current, {
      rotateZ: 0,
      x: 0,
      opacity: 0,
      display: "none",
    })

    gsap.set(cookieRightRef.current, {
      rotateZ: 0,
      x: 0,
      opacity: 0,
      display: "none",
    })

    gsap.set(paperRef.current, {
      y: 20,
      opacity: 0,
      scale: 0.8,
    })

    gsap.set(cookieClosedRef.current, {
      scale: 1,
      opacity: 1,
      rotation: 0,
    })

    // Add hover animation
    const hoverAnimation = () => {
      if (!isLoading && !isOpen && containerRef.current) {
        gsap.to(containerRef.current, {
          y: -10,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }

    const unhoverAnimation = () => {
      if (!isLoading && !isOpen && containerRef.current) {
        gsap.to(containerRef.current, {
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
        })
      }
    }

    if (containerRef.current) {
      containerRef.current.addEventListener("mouseenter", hoverAnimation)
      containerRef.current.addEventListener("mouseleave", unhoverAnimation)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mouseenter", hoverAnimation)
        containerRef.current.removeEventListener("mouseleave", unhoverAnimation)
      }
    }
  }, [isLoading, isOpen])

  useEffect(() => {
    if (isLoading) {
      // Pulse animation while loading
      gsap.to(cookieClosedRef.current, {
        scale: 1.05,
        rotation: 5,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })
    } else {
      // Stop pulse animation
      gsap.killTweensOf(cookieClosedRef.current)
      gsap.to(cookieClosedRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
      })
    }
  }, [isLoading])

  useEffect(() => {
    const tl = gsap.timeline()

    if (isOpen) {
      // Break the cookie animation
      tl.to(cookieClosedRef.current, {
        scale: 1.2,
        rotation: 10,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
        .to(cookieClosedRef.current, {
          opacity: 0,
          duration: 0.2,
          display: "none",
        })
        .set([cookieLeftRef.current, cookieRightRef.current], {
          opacity: 1,
          display: "block",
        })
        .to(
          cookieLeftRef.current,
          {
            rotateZ: -30,
            x: -60,
            y: -20,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "<",
        )
        .to(
          cookieRightRef.current,
          {
            rotateZ: 30,
            x: 60,
            y: -20,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "<",
        )
        .to(
          paperRef.current,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.3",
        )
    } else {
      // Reset cookie animation
      tl.to(paperRef.current, {
        y: 20,
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
      })
        .to([cookieLeftRef.current, cookieRightRef.current], {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            gsap.set([cookieLeftRef.current, cookieRightRef.current], {
              display: "none",
            })
          },
        })
        .set(cookieClosedRef.current, {
          display: "block",
        })
        .to(cookieClosedRef.current, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.3,
        })
    }

    return () => {
      tl.kill()
    }
  }, [isOpen])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-pointer transition-transform duration-300 ease-out"
      onClick={!isLoading ? onClick : undefined}
    >
      {/* Shadow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/5 h-4 bg-black/30 rounded-full blur-md"></div>

      {/* Closed Cookie */}
      <div ref={cookieClosedRef} className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-48 h-48 drop-shadow-2xl">
          {/* SVG Fortune Cookie */}
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="cookieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f3d5a0" />
                <stop offset="50%" stopColor="#e6b66c" />
                <stop offset="100%" stopColor="#d4a76a" />
              </linearGradient>
              <filter id="cookieShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#00000044" />
              </filter>
            </defs>

            {/* Cookie shape */}
            <path
              d="M100,40 C130,40 160,60 170,90 C180,120 160,150 130,160 C100,170 70,160 50,130 C30,100 40,60 70,50 C80,45 90,40 100,40 Z"
              fill="url(#cookieGradient)"
              filter="url(#cookieShadow)"
            />

            {/* Cookie details */}
            <path
              d="M90,70 C100,65 110,70 115,80 C120,90 115,100 105,105 C95,110 85,105 80,95 C75,85 80,75 90,70 Z"
              fill="#d4a76a"
              opacity="0.5"
            />
            <path
              d="M130,100 C135,95 140,95 145,100 C150,105 150,110 145,115 C140,120 135,120 130,115 C125,110 125,105 130,100 Z"
              fill="#d4a76a"
              opacity="0.5"
            />
            <path
              d="M80,120 C85,115 90,115 95,120 C100,125 100,130 95,135 C90,140 85,140 80,135 C75,130 75,125 80,120 Z"
              fill="#d4a76a"
              opacity="0.5"
            />

            {/* Cookie fold line */}
            <path d="M70,50 C90,80 110,100 130,160" stroke="#d4a76a" strokeWidth="1" fill="none" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* Left Half */}
      <div ref={cookieLeftRef} className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-40 h-40 origin-right drop-shadow-xl">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="cookieGradientLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f3d5a0" />
                <stop offset="50%" stopColor="#e6b66c" />
                <stop offset="100%" stopColor="#d4a76a" />
              </linearGradient>
              <filter id="cookieShadowLeft" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#00000044" />
              </filter>
            </defs>

            {/* Left cookie half */}
            <path
              d="M100,40 C130,40 160,60 170,90 C180,120 160,150 130,160 C100,170 70,160 50,130 C30,100 40,60 70,50 C80,45 90,40 100,40 Z"
              fill="url(#cookieGradientLeft)"
              filter="url(#cookieShadowLeft)"
              clipPath="url(#leftHalf)"
            />

            <clipPath id="leftHalf">
              <rect x="0" y="0" width="100" height="200" />
            </clipPath>

            {/* Cookie details */}
            <path
              d="M90,70 C100,65 110,70 115,80 C120,90 115,100 105,105 C95,110 85,105 80,95 C75,85 80,75 90,70 Z"
              fill="#d4a76a"
              opacity="0.5"
              clipPath="url(#leftHalf)"
            />

            <path
              d="M80,120 C85,115 90,115 95,120 C100,125 100,130 95,135 C90,140 85,140 80,135 C75,130 75,125 80,120 Z"
              fill="#d4a76a"
              opacity="0.5"
            />

            {/* Inner edge highlight */}
            <path d="M100,40 L100,170" stroke="#f3d5a0" strokeWidth="2" opacity="0.8" />
          </svg>
        </div>
      </div>

      {/* Right Half */}
      <div ref={cookieRightRef} className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-40 h-40 origin-left drop-shadow-xl">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="cookieGradientRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f3d5a0" />
                <stop offset="50%" stopColor="#e6b66c" />
                <stop offset="100%" stopColor="#d4a76a" />
              </linearGradient>
              <filter id="cookieShadowRight" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#00000044" />
              </filter>
            </defs>

            {/* Right cookie half */}
            <path
              d="M100,40 C130,40 160,60 170,90 C180,120 160,150 130,160 C100,170 70,160 50,130 C30,100 40,60 70,50 C80,45 90,40 100,40 Z"
              fill="url(#cookieGradientRight)"
              filter="url(#cookieShadowRight)"
              clipPath="url(#rightHalf)"
            />

            <clipPath id="rightHalf">
              <rect x="100" y="0" width="100" height="200" />
            </clipPath>

            {/* Cookie details */}
            <path
              d="M130,100 C135,95 140,95 145,100 C150,105 150,110 145,115 C140,120 135,120 130,115 C125,110 125,105 130,100 Z"
              fill="#d4a76a"
              opacity="0.5"
            />

            {/* Inner edge highlight */}
            <path d="M100,40 L100,170" stroke="#f3d5a0" strokeWidth="2" opacity="0.8" />
          </svg>
        </div>
      </div>

      {/* Fortune Paper */}
      <div ref={paperRef} className="absolute inset-0 flex items-center justify-center">
        <div className="bg-amber-50 p-2 rounded-sm shadow-lg w-3/5 h-1/6 flex items-center justify-center transform rotate-3">
          <div className="w-full h-full border border-amber-200 rounded-sm flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100">
            <span className="text-xs text-amber-800 font-serif italic px-2">Your fortune awaits...</span>
          </div>
        </div>
      </div>
    </div>
  )
})

FortuneCookie.displayName = "FortuneCookie"
