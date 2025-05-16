"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { ImageProps } from "next/image"
import { generateTextFallbackImage } from "@/utils/image-fallback"

interface OptimizedImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
  fallbackAlt?: string
  onError?: () => void
}

export default function OptimizedImage({ src, alt, fallbackSrc, fallbackAlt, onError, ...props }: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(typeof src === "string" ? src : "")
  const [imgAlt, setImgAlt] = useState<string>(alt)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Reset state when src changes
    setImgSrc(typeof src === "string" ? src : "")
    setImgAlt(alt)
    setIsLoading(true)
    setHasError(false)
  }, [src, alt])

  const handleError = () => {
    setHasError(true)

    // Use provided fallback or generate one
    const fallback = fallbackSrc || generateTextFallbackImage(alt)
    setImgSrc(fallback)

    if (fallbackAlt) {
      setImgAlt(fallbackAlt)
    }

    if (onError) {
      onError()
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="relative" style={{ width: props.width, height: props.height }}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <span className="sr-only">Loading...</span>
        </div>
      )}

      <Image
        {...props}
        src={imgSrc || "/placeholder.svg"}
        alt={imgAlt}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          ...props.style,
          opacity: isLoading ? 0 : 1,
        }}
      />
    </div>
  )
}
