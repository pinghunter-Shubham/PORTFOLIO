'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * CustomCursor — replaces the OS cursor with a cyan crosshair dot + lagging ring.
 * Hidden automatically on touch/mobile devices.
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [cursorVariant, setCursorVariant] = useState<'default' | 'pointer' | 'text'>('default')
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Spring physics for the outer ring (lag)
  const springConfig = { damping: 25, stiffness: 300 }
  const ringX = useSpring(mouseX, springConfig)
  const ringY = useSpring(mouseY, springConfig)

  useEffect(() => {
    // Detect touch device — hide cursor entirely
    const isTouchDev = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    setIsTouchDevice(isTouchDev)
    if (isTouchDev) return

    const updateCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    const handleHoverStart = () => {
      const el = document.elementFromPoint(mouseX.get(), mouseY.get())
      if (!el) return

      const computed = window.getComputedStyle(el)
      const tag = el.tagName.toLowerCase()
      const role = el.getAttribute('role')

      if (
        tag === 'a' ||
        tag === 'button' ||
        computed.cursor === 'pointer' ||
        role === 'button' ||
        role === 'link'
      ) {
        setCursorVariant('pointer')
      } else if (
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'p' ||
        tag === 'span' ||
        tag === 'li' ||
        computed.cursor === 'text'
      ) {
        setCursorVariant('text')
      } else {
        setCursorVariant('default')
      }
    }

    window.addEventListener('mousemove', updateCursor)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mouseenter', handleMouseEnter)
    window.addEventListener('mouseover', handleHoverStart)

    return () => {
      window.removeEventListener('mousemove', updateCursor)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mouseenter', handleMouseEnter)
      window.removeEventListener('mouseover', handleHoverStart)
    }
  }, [mouseX, mouseY, isVisible])

  if (isTouchDevice) return null

  const dotSize = cursorVariant === 'pointer' ? 14 : 8
  const ringSize = cursorVariant === 'pointer' ? 24 : 32
  const ringOpacity = cursorVariant === 'pointer' ? 0 : 1

  return (
    <>
      {/* Inner dot */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          width: dotSize,
          height: dotSize,
          backgroundColor: 'var(--accent-primary)',
          opacity: isVisible ? 1 : 0,
          boxShadow: '0 0 8px var(--accent-primary)',
        }}
        animate={{
          width: cursorVariant === 'text' ? 2 : dotSize,
          height: cursorVariant === 'text' ? 20 : dotSize,
          borderRadius: cursorVariant === 'text' ? '1px' : '50%',
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Outer lagging ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: ringSize,
          height: ringSize,
          borderColor: 'var(--accent-primary)',
          opacity: isVisible ? ringOpacity : 0,
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: isVisible ? ringOpacity : 0,
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}
