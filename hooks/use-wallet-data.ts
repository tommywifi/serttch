"use client"

import { useState, useEffect } from "react"
import { POLLING_INTERVAL } from "@/config/constants"

interface UseWalletDataOptions {
  pollingInterval?: number
  initialFetch?: boolean
}

export function useWalletData(walletAddress: string | null, options: UseWalletDataOptions = {}) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(!!options.initialFetch)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const pollingInterval = options.pollingInterval || POLLING_INTERVAL
  const initialFetch = options.initialFetch !== false

  const fetchData = async () => {
    if (!walletAddress) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/wallet-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching wallet data:", error)
      setError("Failed to fetch wallet data. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (initialFetch) {
      fetchData()
    }
  }, [walletAddress])

  // Set up polling
  useEffect(() => {
    if (!walletAddress) return

    const intervalId = setInterval(() => {
      fetchData()
    }, pollingInterval)

    return () => clearInterval(intervalId)
  }, [walletAddress, pollingInterval])

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refetch: fetchData,
  }
}
