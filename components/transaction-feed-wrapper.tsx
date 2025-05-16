"use client"

import { useSearchParams } from "next/navigation"
import { useWallet } from "@/context/wallet-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TEST_WALLETS } from "@/test-wallets"
import { useState, useEffect } from "react"
import { ExternalLink } from "lucide-react"

export default function TransactionFeedWrapper() {
  const { publicKey } = useWallet()
  const searchParams = useSearchParams()
  const walletParam = searchParams.get("wallet")
  const [showTransactions, setShowTransactions] = useState(false)

  const walletAddress = publicKey || walletParam || TEST_WALLETS.diversified

  // Check if we should show transactions (disabled by default)
  useEffect(() => {
    // You can enable this if transactions are working correctly
    setShowTransactions(false)
  }, [])

  if (!walletAddress) {
    return (
      <div className="p-8 text-center border border-gray-100">
        <p className="text-gray-500">No wallet connected</p>
      </div>
    )
  }

  // Return a simplified card instead of the transaction feed
  return (
    <Card className="border border-gray-100 rounded-none">
      <CardHeader className="border-b border-gray-100 bg-gray-50 flex flex-row justify-between items-center">
        <CardTitle>Wallet Explorer</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center">
          <p className="mb-4">View your wallet details on Solana explorers:</p>
          <div className="flex flex-col space-y-3">
            <a
              href={`https://solscan.io/account/${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 p-2 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <span>View on Solscan</span>
              <ExternalLink size={16} />
            </a>
            <a
              href={`https://explorer.solana.com/address/${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 p-2 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <span>View on Solana Explorer</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
