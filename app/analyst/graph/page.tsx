"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/context/wallet-context"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { POLLING_INTERVAL } from "@/config/constants"
import AnalystHeader from "@/components/analyst-header"

interface PortfolioDataPoint {
  date: string
  value: number
}

export default function GraphPage() {
  const { walletConnected, publicKey } = useWallet()
  const searchParams = useSearchParams()
  const walletParam = searchParams.get("wallet")
  const [chartData, setChartData] = useState<PortfolioDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [portfolioStats, setPortfolioStats] = useState({
    currentValue: 0,
    change24h: 0,
    change30d: 0,
  })

  const walletAddress = publicKey || walletParam || ""

  const fetchPortfolioData = async () => {
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

      const data = await response.json()

      if (data.portfolioHistory && data.portfolioHistory.length > 0) {
        setChartData(data.portfolioHistory)

        // Calculate stats
        const currentValue = data.portfolioHistory[data.portfolioHistory.length - 1].value
        const oneDayAgoValue = data.portfolioHistory[data.portfolioHistory.length - 2]?.value || currentValue
        const thirtyDaysAgoValue = data.portfolioHistory[0]?.value || currentValue

        const change24h = ((currentValue - oneDayAgoValue) / oneDayAgoValue) * 100
        const change30d = ((currentValue - thirtyDaysAgoValue) / thirtyDaysAgoValue) * 100

        setPortfolioStats({
          currentValue,
          change24h,
          change30d,
        })
      } else {
        // If no portfolio history, create mock data based on current holdings
        let totalValue = 0

        // Add SOL value
        if (data.balance && data.solPrice) {
          totalValue += Number.parseFloat(data.balance) * data.solPrice
        }

        // Add token values
        if (Array.isArray(data.tokens)) {
          data.tokens.forEach((token: any) => {
            if (token.usdValue) {
              totalValue += Number.parseFloat(token.usdValue)
            }
          })
        }

        // Generate mock historical data
        const mockData = []
        const now = new Date()
        for (let i = 30; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(date.getDate() - i)

          // Generate a somewhat realistic price curve
          const randomFactor = 0.95 + Math.random() * 0.1
          const value = totalValue * randomFactor * (1 - i * 0.01)

          mockData.push({
            date: date.toISOString().split("T")[0],
            value: Math.round(value * 100) / 100,
          })
        }

        setChartData(mockData)

        // Calculate stats
        const currentValue = mockData[mockData.length - 1].value
        const oneDayAgoValue = mockData[mockData.length - 2]?.value || currentValue
        const thirtyDaysAgoValue = mockData[0]?.value || currentValue

        const change24h = ((currentValue - oneDayAgoValue) / oneDayAgoValue) * 100
        const change30d = ((currentValue - thirtyDaysAgoValue) / thirtyDaysAgoValue) * 100

        setPortfolioStats({
          currentValue,
          change24h,
          change30d,
        })
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching portfolio data:", error)
      setError("Failed to fetch portfolio data. Please try again later.")
      setIsLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchPortfolioData()
  }, [walletAddress])

  // Set up polling for real-time updates
  useEffect(() => {
    if (!walletAddress) return

    const intervalId = setInterval(() => {
      fetchPortfolioData()
    }, POLLING_INTERVAL)

    return () => clearInterval(intervalId)
  }, [walletAddress])

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading portfolio data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchPortfolioData} className="bg-black text-white px-4 py-2 hover:bg-gray-800">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-32 sm:pt-36">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 py-4 z-20">
        <AnalystHeader />
      </header>

      {/* Graph Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border border-gray-100 rounded-none overflow-hidden">
            <CardHeader className="border-b border-gray-100 bg-gray-50">
              <CardTitle>Portfolio Value Over Time</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getDate()}/${date.getMonth() + 1}`
                      }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      domain={["dataMin - 10", "dataMax + 10"]}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #f0f0f0",
                        borderRadius: "2px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
                      labelFormatter={(label) => {
                        const date = new Date(label)
                        return date.toLocaleDateString()
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#000"
                      strokeWidth={2}
                      dot={{ r: 0 }}
                      activeDot={{ r: 6, fill: "#000" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-100 p-4">
                  <p className="text-sm text-gray-500 mb-1">Current Value</p>
                  <p className="text-2xl font-mono">{formatCurrency(portfolioStats.currentValue)}</p>
                </div>
                <div className="border border-gray-100 p-4">
                  <p className="text-sm text-gray-500 mb-1">24h Change</p>
                  <p
                    className={`text-2xl font-mono ${portfolioStats.change24h >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {portfolioStats.change24h >= 0 ? "+" : ""}
                    {portfolioStats.change24h.toFixed(2)}%
                  </p>
                </div>
                <div className="border border-gray-100 p-4">
                  <p className="text-sm text-gray-500 mb-1">30d Change</p>
                  <p
                    className={`text-2xl font-mono ${portfolioStats.change30d >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {portfolioStats.change30d >= 0 ? "+" : ""}
                    {portfolioStats.change30d.toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
