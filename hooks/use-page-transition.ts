"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useLoading } from "@/context/loading-context"

export function usePageTransition() {
  const { setIsLoading } = useLoading()
  const pathname = usePathname()

  useEffect(() => {
    // Start loading
    setIsLoading(true)

    // End loading after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [pathname, setIsLoading])
}
