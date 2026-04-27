'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { skills, type Skill } from '@/lib/data'

const GROUP_COLORS: Record<Skill['group'], string> = {
  'AI / ML':   '#00D4FF',
  'Frontend':  '#7B61FF',
  'Backend':   '#00D48C',
  'Tools':     '#8892A4',
}

interface NodeData extends Skill {
  x: number
  y: number
  radius: number
}

/**
 * SkillGraph — canvas-based skill constellation. Nodes are grouped by cluster,
 * hovering reveals proficiency and description via tooltip.
 */
export default function SkillGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<NodeData[]>([])
  const [tooltip, setTooltip] = useState<{ skill: Skill; x: number; y: number } | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
      buildLayout(rect.width, rect.height)
    }

    const buildLayout = (w: number, h: number) => {
      const cx = w / 2
      const cy = h / 2

      // Group cluster centers
      const clusterCenters: Record<Skill['group'], { x: number; y: number }> = {
        'AI / ML':   { x: cx - w * 0.22, y: cy - h * 0.15 },
        'Frontend':  { x: cx + w * 0.22, y: cy - h * 0.15 },
        'Backend':   { x: cx - w * 0.22, y: cy + h * 0.20 },
        'Tools':     { x: cx + w * 0.22, y: cy + h * 0.20 },
      }

      const byGroup: Record<string, Skill[]> = {}
      skills.forEach((s) => {
        if (!byGroup[s.group]) byGroup[s.group] = []
        byGroup[s.group].push(s)
      })

      nodesRef.current = skills.map((skill) => {
        const center = clusterCenters[skill.group]
        const groupSkills = byGroup[skill.group]
        const idx = groupSkills.findIndex((s) => s.id === skill.id)
        const count = groupSkills.length
        const angle = (idx / count) * Math.PI * 2 - Math.PI / 2
        const radius = (w < 600 ? 55 : 75) + Math.random() * 18
        const nodeRadius = 5 + (skill.level / 100) * 9

        return {
          ...skill,
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius,
          radius: nodeRadius,
        }
      })
    }

    const draw = () => {
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)

      const nodes = nodesRef.current
      const color = (group: Skill['group']) => GROUP_COLORS[group]

      // Draw edges between same-group nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[i].group !== nodes[j].group) continue
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > 130) continue

          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          const alpha = (1 - dist / 130) * 0.18
          ctx.strokeStyle = color(nodes[i].group)
            .replace('#', '')
            .match(/.{2}/g)!
            .map((v) => parseInt(v, 16))
            .reduce(
              (acc, v, k) => (k === 0 ? `rgba(${v},` : k === 1 ? `${acc}${v},` : `${acc}${v},${alpha})`),
              ''
            )
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        const isHovered = hoveredId === node.id
        const col = color(node.group)
        const r = isHovered ? node.radius * 1.5 : node.radius

        // Glow
        if (isHovered) {
          ctx.beginPath()
          const grd = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 3)
          grd.addColorStop(0, col + '55')
          grd.addColorStop(1, col + '00')
          ctx.fillStyle = grd
          ctx.arc(node.x, node.y, r * 3, 0, Math.PI * 2)
          ctx.fill()
        }

        // Circle
        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fillStyle = isHovered ? col : col + '99'
        ctx.fill()
        ctx.strokeStyle = col
        ctx.lineWidth = 1
        ctx.stroke()

        // Label for larger nodes or hovered
        if (isHovered || node.level >= 88) {
          ctx.font = `${isHovered ? 600 : 400} ${isHovered ? 12 : 10}px 'JetBrains Mono', monospace`
          ctx.fillStyle = isHovered ? '#F0F4FF' : col
          ctx.textAlign = 'center'
          ctx.fillText(node.name, node.x, node.y - r - 5)
        }
      })

      animFrameRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    animFrameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [hoveredId])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    let hit: NodeData | null = null
    for (const node of nodesRef.current) {
      const dx = mx - node.x
      const dy = my - node.y
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 6) {
        hit = node
        break
      }
    }

    if (hit) {
      setHoveredId(hit.id)
      setTooltip({ skill: hit, x: e.clientX, y: e.clientY })
    } else {
      setHoveredId(null)
      setTooltip(null)
    }
  }

  const handleMouseLeave = () => {
    setHoveredId(null)
    setTooltip(null)
  }

  return (
    <div className="relative w-full" style={{ height: '420px' }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ cursor: hoveredId ? 'pointer' : 'default' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Legend */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {(Object.entries(GROUP_COLORS) as [Skill['group'], string][]).map(([group, col]) => (
          <div key={group} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: col }} />
            <span
              className="text-xs"
              style={{
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-jetbrains-mono, monospace)',
              }}
            >
              {group}
            </span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            className="fixed z-50 pointer-events-none px-4 py-3 rounded-xl text-sm"
            style={{
              left: tooltip.x + 16,
              top: tooltip.y - 60,
              background: 'var(--bg-secondary)',
              border: `1px solid ${GROUP_COLORS[tooltip.skill.group]}55`,
              boxShadow: `0 0 20px ${GROUP_COLORS[tooltip.skill.group]}22`,
              minWidth: 200,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <p
              className="font-bold mb-1"
              style={{
                fontFamily: 'var(--font-syne, sans-serif)',
                color: GROUP_COLORS[tooltip.skill.group],
              }}
            >
              {tooltip.skill.name}
            </p>
            {/* Proficiency bar */}
            <div
              className="w-full h-1 rounded-full mb-2"
              style={{ background: 'var(--bg-tertiary)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: GROUP_COLORS[tooltip.skill.group] }}
                initial={{ width: 0 }}
                animate={{ width: `${tooltip.skill.level}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {tooltip.skill.description}
            </p>
            <p
              className="text-xs mt-1"
              style={{
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-jetbrains-mono, monospace)',
              }}
            >
              proficiency: {tooltip.skill.level}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
