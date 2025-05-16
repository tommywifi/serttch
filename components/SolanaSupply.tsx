"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SupplyInfo {
  total: number
  circulating: number
  nonCirculating: number
}

export default function SolanaSupply() {
  const [supplyInfo, setSupplyInfo] = useState<SupplyInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSupplyInfo = async () => {
      try {
        const response = await fetch("/api/solana-supply")
        if (!response.ok) {
          throw new Error("Failed to fetch Solana supply data")
        }
        const data = await response.json()
        setSupplyInfo(data)
      } catch (err) {
        setError("Error fetching Solana supply data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSupplyInfo()
  }, [])

  if (loading) return <div>Loading Solana supply data...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solana Supply</CardTitle>
      </CardHeader>
      <CardContent>
        {supplyInfo && (
          <div className="grid gap-2">
            <p>Total Supply: {(supplyInfo.total / 1e9).toLocaleString()} SOL</p>
            <p>Circulating Supply: {(supplyInfo.circulating / 1e9).toLocaleString()} SOL</p>
            <p>Non-Circulating Supply: {(supplyInfo.nonCirculating / 1e9).toLocaleString()} SOL</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
