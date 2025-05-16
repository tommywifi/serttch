"use client"

import { useSearchParams } from "next/navigation"
import { useWallet } from "@/context/wallet-context"
import TokenPriceTicker from "@/components/token-price-ticker"
import { TEST_WALLETS } from "@/test-wallets"

export default function TokenPriceTickerWrapper() {
  const { publicKey } = useWallet()
  const searchParams = useSearchParams()
  const walletParam = searchParams.get("wallet")

  const walletAddress = publicKey || walletParam || TEST_WALLETS.diversified

  if (!walletAddress) {
    return (
      <div className="p-8 text-center border border-gray-100">
        <p className="text-gray-500">No wallet connected</p>
      </div>
    )
  }

  return <TokenPriceTicker walletAddress={walletAddress} />
}
