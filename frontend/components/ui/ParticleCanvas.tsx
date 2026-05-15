'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * ParticleCanvas — Three.js neural network particle system.
 * Renders floating nodes connected by edges, responding to mouse parallax.
 */
export default function ParticleCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Scene setup ──────────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 80

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Skip on mobile / low-power devices — Three.js is heavy
    const isLowPower =
      window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
      navigator.hardwareConcurrency <= 4

    // ── Nodes ─────────────────────────────────────────────────────
    const NODE_COUNT = isLowPower ? 40 : 80
    const LINK_DISTANCE = 28

    const positions = Array.from({ length: NODE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 140,
      y: (Math.random() - 0.5) * 100,
      z: (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 0.04,
      vy: (Math.random() - 0.5) * 0.04,
      vz: (Math.random() - 0.5) * 0.02,
    }))

    const nodeGeo = new THREE.SphereGeometry(0.4, 8, 8)
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff })
    const nodeMeshes = positions.map((pos) => {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat.clone())
      mesh.position.set(pos.x, pos.y, pos.z)
      ;(mesh.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.random() * 0.5
      ;(mesh.material as THREE.MeshBasicMaterial).transparent = true
      scene.add(mesh)
      return mesh
    })

    // ── Edges (Lines) ─────────────────────────────────────────────
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.08,
    })

    const lineGroup = new THREE.Group()
    scene.add(lineGroup)

    const updateLines = () => {
      // Free GPU memory of previous lines before recreating
      lineGroup.children.forEach((child) => {
        if (child instanceof THREE.Line) {
          child.geometry.dispose()
          ;(child.material as THREE.Material).dispose()
        }
      })
      lineGroup.clear()

      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = positions[i].x - positions[j].x
          const dy = positions[i].y - positions[j].y
          const dz = positions[i].z - positions[j].z
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (dist < LINK_DISTANCE) {
            const geo = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(positions[i].x, positions[i].y, positions[i].z),
              new THREE.Vector3(positions[j].x, positions[j].y, positions[j].z),
            ])
            const mat = lineMat.clone()
            mat.opacity = (1 - dist / LINK_DISTANCE) * 0.18
            lineGroup.add(new THREE.Line(geo, mat))
          }
        }
      }
    }

    // ── Mouse parallax ────────────────────────────────────────────
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)

    // ── Resize handler ────────────────────────────────────────────
    const handleResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // ── Animation loop ────────────────────────────────────────────
    let frameId: number
    let tick = 0

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      tick++

      // Move nodes
      positions.forEach((pos, i) => {
        pos.x += pos.vx
        pos.y += pos.vy
        pos.z += pos.vz

        // Boundary bounce
        if (Math.abs(pos.x) > 72) pos.vx *= -1
        if (Math.abs(pos.y) > 52) pos.vy *= -1
        if (Math.abs(pos.z) > 32) pos.vz *= -1

        nodeMeshes[i].position.set(pos.x, pos.y, pos.z)
      })

      // Rebuild edges every 3 frames for perf
      if (tick % 3 === 0) updateLines()

      // Parallax camera
      camera.position.x += (mouseX * 8 - camera.position.x) * 0.03
      camera.position.y += (mouseY * 5 - camera.position.y) * 0.03
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    updateLines()
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)

      // Dispose all GPU resources
      lineGroup.children.forEach((child) => {
        if (child instanceof THREE.Line) {
          child.geometry.dispose()
          ;(child.material as THREE.Material).dispose()
        }
      })
      nodeMeshes.forEach((mesh) => {
        ;(mesh.material as THREE.Material).dispose()
      })
      nodeGeo.dispose()
      nodeMat.dispose()
      lineMat.dispose()
      renderer.dispose()

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />
}
