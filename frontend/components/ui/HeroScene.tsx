'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/** A quiet, self-contained 3D data sculpture for the hero. */
export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      })
    } catch {
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50)
    camera.position.set(0, 0, 7.2)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 1.7))
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.1)
    keyLight.position.set(3, 4, 5)
    scene.add(keyLight)

    const sculpture = new THREE.Group()
    scene.add(sculpture)

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.84, 2),
      new THREE.MeshStandardMaterial({
        color: 0xd8d2c5,
        roughness: 0.34,
        metalness: 0.08,
        flatShading: true,
      })
    )
    sculpture.add(core)

    const network = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.34, 1),
      new THREE.MeshBasicMaterial({
        color: 0x9c452f,
        wireframe: true,
        transparent: true,
        opacity: 0.66,
      })
    )
    sculpture.add(network)

    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x9c452f,
      transparent: true,
      opacity: 0.48,
    })
    const orbitA = new THREE.Mesh(new THREE.TorusGeometry(1.78, 0.009, 6, 120), orbitMaterial)
    orbitA.rotation.set(0.94, 0.2, -0.28)
    sculpture.add(orbitA)

    const orbitB = new THREE.Mesh(
      new THREE.TorusGeometry(1.98, 0.007, 6, 120),
      orbitMaterial.clone()
    )
    orbitB.rotation.set(1.54, -0.45, 0.2)
    sculpture.add(orbitB)

    const nodeGeometry = new THREE.SphereGeometry(0.055, 12, 12)
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x9c452f,
      roughness: 0.4,
      metalness: 0.1,
    })
    const nodePositions = [
      [-1.02, 0.79, 0.15],
      [1.08, 0.55, -0.18],
      [0.92, -0.92, 0.1],
      [-0.88, -1.06, -0.2],
      [0.2, 1.3, 0.22],
    ]
    nodePositions.forEach(([x, y, z]) => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial)
      node.position.set(x, y, z)
      sculpture.add(node)
    })

    const resize = () => {
      const width = mount.clientWidth
      const height = mount.clientHeight
      if (!width || !height) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.render(scene, camera)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    resize()

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const isLowPower =
      window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
      (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4)

    let frameId = 0
    let previousFrame = 0
    const animate = (time: number) => {
      frameId = window.requestAnimationFrame(animate)
      if (time - previousFrame < 1000 / 30) return
      previousFrame = time

      sculpture.rotation.y += 0.0022
      sculpture.rotation.x = Math.sin(time * 0.00018) * 0.06
      sculpture.position.y = Math.sin(time * 0.00035) * 0.035
      renderer.render(scene, camera)
    }

    const syncMotionPreference = () => {
      window.cancelAnimationFrame(frameId)
      if (prefersReducedMotion.matches || isLowPower) {
        renderer.render(scene, camera)
      } else {
        frameId = window.requestAnimationFrame(animate)
      }
    }
    prefersReducedMotion.addEventListener('change', syncMotionPreference)
    syncMotionPreference()

    return () => {
      window.cancelAnimationFrame(frameId)
      prefersReducedMotion.removeEventListener('change', syncMotionPreference)
      resizeObserver.disconnect()
      const geometries = new Set<THREE.BufferGeometry>()
      const materials = new Set<THREE.Material>()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          geometries.add(object.geometry)
          const meshMaterials = Array.isArray(object.material) ? object.material : [object.material]
          meshMaterials.forEach((material) => materials.add(material))
        }
      })
      geometries.forEach((geometry) => geometry.dispose())
      materials.forEach((material) => material.dispose())
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="hero-scene-canvas" />
}
