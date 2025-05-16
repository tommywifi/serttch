"use client"

import { useState, useEffect } from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { POLLING_INTERVAL } from "@/config/constants"

interface CryptoPrice {
  symbol: string
  price: number
  change24h: number
}

export default function CryptoPriceTicker() {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrices = async () => {
    try {
      // Fetch SOL price
      const solResponse = await fetch("/api/solana-price")
      if (!solResponse.ok) {
        throw new Error("Failed to fetch SOL price")
      }
      const solData = await solResponse.json()

      // Set the prices
      setPrices([
        {
          symbol: "SOL",
          price: solData.price || 0,
          change24h: solData.change24h || 0,
        },
      ])

      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching crypto prices:", error)
      setError("Failed to fetch prices")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()

    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      fetchPrices()
    }, POLLING_INTERVAL)

    return () => clearInterval(intervalId)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center h-6 animate-pulse">
        <div className="w-16 h-3 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (error) {
    return null
  }

  return (
    <div className="hidden md:flex items-center space-x-4">
      {prices.map((crypto) => (
        <div key={crypto.symbol} className="flex items-center text-sm">
          <span className="font-medium mr-1">{crypto.symbol}:</span>
          <span className="font-mono">${crypto.price.toFixed(2)}</span>
          <span className={`ml-1 flex items-center ${crypto.change24h >= 0 ? "text-green-600" : "text-red-600"}`}>
            {crypto.change24h >= 0 ? (
              <ArrowUpRight size={12} className="mr-0.5" />
            ) : (
              <ArrowDownRight size={12} className="mr-0.5" />
            )}
            {Math.abs(crypto.change24h).toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  )
}
