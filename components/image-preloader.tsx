"use client"

import { useEffect } from "react"

// List of critical images to preload
const criticalImages = [
  // Team member images
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/falko-face-modified-removebg-preview-N06kqPYKrxaXSSaEFkXUnaRHYXDaS1.png", // Falko
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kostas-face-modified-removebg-preview-kZ30k1ZWPhzXf6UdUaNWm9cMnidn6H.png", // Kostas
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/leon-face-modified-removebg-preview-Inno3y6hn5TlTyECSm59npKtp5uYck.png", // Leon

  // Wallet images
  "/images/wallets/phantom-wallet-modified.png",
  "/images/wallets/solflare-wallet-modified.jpeg",
]

export default function ImagePreloader() {
  useEffect(() => {
    // Preload critical images
    criticalImages.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  return null
}
