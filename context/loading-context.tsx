"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"

interface LoadingContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  isInitialLoad: boolean
  isTransitioning: boolean
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  setIsLoading: () => {},
  isInitialLoad: true,
  isTransitioning: false,
})

export const useLoading = () => useContext(LoadingContext)

interface LoadingProviderProps {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Check if this is the initial load
    const hasVisited = localStorage.getItem("hasVisitedBefore")

    if (!hasVisited) {
      // First visit - set the flag for future visits
      localStorage.setItem("hasVisitedBefore", "true")
      setIsInitialLoad(true)
    } else {
      setIsInitialLoad(false)
    }

    // Simulate initial content loading
    const timer = setTimeout(
      () => {
        setIsLoading(false)
      },
      isInitialLoad ? 3000 : 1000,
    ) // Longer for initial load, shorter for subsequent loads

    return () => clearTimeout(timer)
  }, [isInitialLoad])

  // Track page transitions
  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 800) // Match this with your transition duration

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, isInitialLoad, isTransitioning }}>
      {children}
    </LoadingContext.Provider>
  )
}
