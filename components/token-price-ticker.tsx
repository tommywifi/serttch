"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWalletData } from "@/hooks/use-wallet-data"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { getTokenLogoUrl } from "@/utils/token-logos"

interface TokenPriceTickerProps {
  walletAddress: string
}

export default function TokenPriceTicker({ walletAddress }: TokenPriceTickerProps) {
  const { data, isLoading, error } = useWalletData(walletAddress)
  const [tokens, setTokens] = useState<any[]>([])
  const [priceChanges, setPriceChanges] = useState<Record<string, { previous: number; current: number }>>({})
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({})

  // Update tokens when data changes
  useEffect(() => {
    if (data?.tokens) {
      // Track price changes
      const newPriceChanges = { ...priceChanges }

      data.tokens.forEach((token: any) => {
        const tokenPrice = Number.parseFloat(token.tokenPrice || "0")
        const tokenId = token.mint

        if (tokenId && !newPriceChanges[tokenId]) {
          newPriceChanges[tokenId] = { previous: tokenPrice, current: tokenPrice }
        } else if (tokenId && newPriceChanges[tokenId].current !== tokenPrice) {
          newPriceChanges[tokenId] = {
            previous: newPriceChanges[tokenId].current,
            current: tokenPrice,
          }
        }
      })

      setPriceChanges(newPriceChanges)

      // Sort tokens by value
      const sortedTokens = [...data.tokens].sort(
        (a, b) => Number.parseFloat(b.usdValue || "0") - Number.parseFloat(a.usdValue || "0"),
      )

      // Add SOL as the first token if it exists in the data
      if (data.balance && data.solPrice) {
        const solToken = {
          name: "Solana",
          symbol: "SOL",
          mint: "So11111111111111111111111111111111111111112",
          amount: data.balance,
          tokenPrice: data.solPrice.toString(),
          usdValue: (Number.parseFloat(data.balance) * data.solPrice).toString(),
          logoUrl: getTokenLogoUrl("So11111111111111111111111111111111111111112", "SOL"),
        }

        // Update SOL price change
        if (!newPriceChanges[solToken.mint]) {
          newPriceChanges[solToken.mint] = { previous: data.solPrice, current: data.solPrice }
        } else if (newPriceChanges[solToken.mint].current !== data.solPrice) {
          newPriceChanges[solToken.mint] = {
            previous: newPriceChanges[solToken.mint].current,
            current: data.solPrice,
          }
        }

        // Add SOL to the beginning of the array
        setTokens([solToken, ...sortedTokens.filter((t) => t.mint !== solToken.mint)])
      } else {
        setTokens(sortedTokens)
      }
    }
  }, [data])

  // Handle logo loading errors
  const handleLogoError = (mint: string) => {
    setLogoErrors((prev) => ({ ...prev, [mint]: true }))
  }

  if (isLoading && tokens.length === 0) {
    return (
      <Card className="border border-gray-100 rounded-none">
        <CardHeader className="border-b border-gray-100 bg-gray-50">
          <CardTitle>Token Prices</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-500">Loading token prices...</p>
        </CardContent>
      </Card>
    )
  }

  if (error && tokens.length === 0) {
    return (
      <Card className="border border-gray-100 rounded-none">
        <CardHeader className="border-b border-gray-100 bg-gray-50">
          <CardTitle>Token Prices</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-red-500 mb-2">⚠️</p>
          <p className="text-gray-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-gray-100 rounded-none">
      <CardHeader className="border-b border-gray-100 bg-gray-50">
        <CardTitle>Token Prices</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          {tokens.length > 0 ? (
            tokens.slice(0, 5).map((token, index) => {
              const tokenPrice = Number.parseFloat(token.tokenPrice || "0")
              const priceChange = priceChanges[token.mint]
              const hasChanged = priceChange && priceChange.previous !== priceChange.current
              const isIncrease = hasChanged && priceChange.current > priceChange.previous
              const logoUrl = token.logoUrl || getTokenLogoUrl(token.mint, token.symbol)
              const hasLogoError = logoErrors[token.mint]

              return (
                <div
                  key={token.mint}
                  className={`p-4 flex items-center justify-between ${
                    index < tokens.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full mr-3 flex items-center justify-center overflow-hidden">
                      {!hasLogoError ? (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                          className="w-full h-full"
                        >
                          <img
                            src={logoUrl || "/placeholder.svg"}
                            alt={`${token.symbol} logo`}
                            width={32}
                            height={32}
                            className="w-full h-full object-contain"
                            onError={() => handleLogoError(token.mint)}
                          />
                        </motion.div>
                      ) : (
                        <span className="text-gray-500">{token.symbol?.substring(0, 1) || "?"}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{token.name || token.symbol || "Unknown Token"}</p>
                      <p className="text-xs text-gray-500">{token.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <motion.p
                      className="font-mono"
                      animate={{
                        color: hasChanged ? (isIncrease ? "#10b981" : "#ef4444") : "#000000",
                      }}
                      transition={{ duration: 2 }}
                    >
                      ${tokenPrice.toFixed(4)}
                    </motion.p>
                    <div className="flex items-center justify-end text-xs">
                      {hasChanged ? (
                        <>
                          {isIncrease ? (
                            <ArrowUpRight size={12} className="text-green-500 mr-1" />
                          ) : (
                            <ArrowDownRight size={12} className="text-red-500 mr-1" />
                          )}
                          <span className={isIncrease ? "text-green-500" : "text-red-500"}>
                            {Math.abs(
                              ((priceChange.current - priceChange.previous) / priceChange.previous) * 100,
                            ).toFixed(2)}
                            %
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500">0.00%</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-6 text-center text-gray-500">No tokens found</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
