"use client"

import { useState } from "react"
import Image from "next/image"

interface WalletLogoProps {
  walletName: string
  isHovered: boolean
  width?: number
  height?: number
  className?: string
}

export default function WalletLogo({
  walletName,
  isHovered,
  width = 24,
  height = 24,
  className = "",
}: WalletLogoProps) {
  const [imageError, setImageError] = useState(false)

  // Generate SVG placeholder for fallback
  const generatePlaceholder = (name: string, isColored: boolean) => {
    const color = isColored ? (name === "Phantom" ? "#AB9FF2" : "#FF762D") : "#333333"

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="${width}" height="${height}" rx="${width / 2}" fill="${color}" />
        <text x="${width / 2}" y="${height / 2}" fontFamily="Arial, sans-serif" fontSize="${
          width / 2
        }" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="central">${name.charAt(0)}</text>
      </svg>
    `

    return `data:image/svg+xml;base64,${btoa(svg)}`
  }

  // Get the appropriate wallet image based on wallet name and hover state
  const getWalletImage = (name: string, colored: boolean) => {
    if (name === "Phantom") {
      // Use the actual Phantom wallet image
      return "/images/wallets/phantom-wallet-modified.png"
    } else if (name === "Solflare") {
      // Use the actual Solflare wallet image
      return "/images/wallets/solflare-wallet-modified.jpeg"
    }

    // Fallback to placeholder if no image is available
    return generatePlaceholder(name, colored)
  }

  return (
    <div className={`relative w-6 h-6 flex-shrink-0 ${className}`}>
      {/* Default logo */}
      <div className={`absolute inset-0 transition-opacity duration-200 ${isHovered ? "opacity-0" : "opacity-100"}`}>
        <Image
          src={getWalletImage(walletName, false) || "/placeholder.svg"}
          alt={`${walletName} logo`}
          width={width}
          height={height}
          className="w-full h-full object-contain"
          onError={() => setImageError(true)}
        />
      </div>

      {/* Hover state logo with slight scale effect */}
      <div
        className={`absolute inset-0 transition-all duration-200 ${
          isHovered ? "opacity-100 scale-110" : "opacity-0 scale-100"
        }`}
      >
        <Image
          src={getWalletImage(walletName, true) || "/placeholder.svg"}
          alt={`${walletName} logo colored`}
          width={width}
          height={height}
          className="w-full h-full object-contain"
          onError={() => setImageError(true)}
        />
      </div>
    </div>
  )
}
