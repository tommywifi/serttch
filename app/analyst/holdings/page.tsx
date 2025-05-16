"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/context/wallet-context"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react"
import { POLLING_INTERVAL } from "@/config/constants"
import AnalystHeader from "@/components/analyst-header"

interface TokenHolding {
  name: string
  symbol: string
  amount: number
  value: number
  price: number
  change24h: number
  mint: string
  logoUrl?: string
}

// Token logo mapping for common tokens
const TOKEN_LOGOS: Record<string, string> = {
  // SOL token
  So11111111111111111111111111111111111111112:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  // USDC
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  // USDT
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png",
  // BONK
  DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png",
  // RAY
  "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R":
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png",
  // ORCA
  orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE/logo.png",
  // MSOL
  mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
  // JitoSOL
  J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn/logo.png",
}

// Function to get token logo URL
const getTokenLogoUrl = (mint: string, symbol: string): string => {
  // Check if we have a predefined logo
  if (TOKEN_LOGOS[mint]) {
    return TOKEN_LOGOS[mint]
  }

  // Try to get from Solana token list
  return `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/${mint}/logo.png`
}

export default function HoldingsPage() {
  const { walletConnected, publicKey } = useWallet()
  const searchParams = useSearchParams()
  const walletParam = searchParams.get("wallet")
  const [holdings, setHoldings] = useState<TokenHolding[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [solPrice, setSolPrice] = useState(0)
  const [totalValue, setTotalValue] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({})

  const walletAddress = publicKey || walletParam || ""

  const fetchWalletData = async () => {
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

      // Process tokens data
      const processedHoldings: TokenHolding[] = []

      // Add SOL as the first token
      processedHoldings.push({
        name: "Solana",
        symbol: "SOL",
        amount: Number.parseFloat(data.balance),
        value: Number.parseFloat(data.balance) * data.solPrice,
        price: data.solPrice,
        change24h: data.solPrice?.change24h || 0,
        mint: "So11111111111111111111111111111111111111112",
        logoUrl: getTokenLogoUrl("So11111111111111111111111111111111111111112", "SOL"),
      })

      // Add other tokens
      if (Array.isArray(data.tokens)) {
        data.tokens.forEach((token: any) => {
          if (token.mint !== "So11111111111111111111111111111111111111112") {
            // Skip SOL as we already added it
            processedHoldings.push({
              name: token.name || token.symbol || "Unknown Token",
              symbol: token.symbol || "???",
              amount: Number.parseFloat(token.amount) || 0,
              value: Number.parseFloat(token.usdValue) || 0,
              price: Number.parseFloat(token.tokenPrice) || 0,
              change24h: 0, // Moralis doesn't provide 24h change for tokens
              mint: token.mint,
              logoUrl: token.logoUrl || getTokenLogoUrl(token.mint, token.symbol || ""),
            })
          }
        })
      }

      // Sort by value (descending)
      processedHoldings.sort((a, b) => b.value - a.value)

      setHoldings(processedHoldings)
      setSolPrice(data.solPrice)
      setTotalValue(processedHoldings.reduce((acc, token) => acc + token.value, 0))
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching wallet data:", error)
      setError("Failed to fetch wallet data. Please try again later.")
      setIsLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchWalletData()
  }, [walletAddress])

  // Set up polling for real-time updates
  useEffect(() => {
    if (!walletAddress) return

    const intervalId = setInterval(() => {
      fetchWalletData()
    }, POLLING_INTERVAL)

    return () => clearInterval(intervalId)
  }, [walletAddress])

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 4,
    }).format(value)
  }

  // Handle logo loading errors
  const handleLogoError = (mint: string) => {
    setLogoErrors((prev) => ({ ...prev, [mint]: true }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading holdings data...</p>
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
          <button onClick={fetchWalletData} className="bg-black text-white px-4 py-2 hover:bg-gray-800">
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

      {/* Holdings Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border border-gray-100 rounded-none">
              <CardContent className="p-6">
                <p className="text-sm text-gray-500 mb-1">Total Portfolio Value</p>
                <p className="text-3xl font-mono">{formatCurrency(totalValue)}</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 rounded-none">
              <CardContent className="p-6">
                <p className="text-sm text-gray-500 mb-1">SOL Price</p>
                <p className="text-3xl font-mono">{formatCurrency(solPrice)}</p>
                <p className="text-xs text-gray-500 mt-1">Live price from API</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 rounded-none">
              <CardContent className="p-6">
                <p className="text-sm text-gray-500 mb-1">Number of Assets</p>
                <p className="text-3xl font-mono">{holdings.length}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-gray-100 rounded-none overflow-hidden">
            <CardHeader className="border-b border-gray-100 bg-gray-50">
              <CardTitle>Token Holdings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left p-4 font-medium text-sm">Asset</th>
                      <th className="text-right p-4 font-medium text-sm">Balance</th>
                      <th className="text-right p-4 font-medium text-sm">Price</th>
                      <th className="text-right p-4 font-medium text-sm">Value</th>
                      <th className="text-right p-4 font-medium text-sm">24h</th>
                      <th className="text-right p-4 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.length > 0 ? (
                      holdings.map((token, index) => (
                        <tr key={token.mint} className={index < holdings.length - 1 ? "border-b border-gray-100" : ""}>
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-100 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                                {!logoErrors[token.mint] && token.logoUrl ? (
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full h-full"
                                  >
                                    <img
                                      src={token.logoUrl || "/placeholder.svg"}
                                      alt={`${token.symbol} logo`}
                                      width={32}
                                      height={32}
                                      className="w-full h-full object-contain"
                                      onError={() => handleLogoError(token.mint)}
                                    />
                                  </motion.div>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
                                    <span className="text-gray-500">{token.symbol.substring(0, 1)}</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{token.name}</p>
                                <p className="text-xs text-gray-500">{token.symbol}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right font-mono">{formatNumber(token.amount)}</td>
                          <td className="p-4 text-right font-mono">{formatCurrency(token.price)}</td>
                          <td className="p-4 text-right font-mono">{formatCurrency(token.value)}</td>
                          <td className="p-4 text-right">
                            <div
                              className={`flex items-center justify-end ${
                                token.change24h >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {token.change24h >= 0 ? (
                                <ArrowUpRight size={16} className="mr-1" />
                              ) : (
                                <ArrowDownRight size={16} className="mr-1" />
                              )}
                              <span className="font-mono">{Math.abs(token.change24h || 0).toFixed(2)}%</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <a
                              href={`https://solscan.io/token/${token.mint}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-gray-500 hover:text-black transition-colors"
                            >
                              <ExternalLink size={16} />
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">
                          No tokens found in this wallet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
