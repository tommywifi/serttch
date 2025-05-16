"use client"

import { useSearchParams } from "next/navigation"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import ConnectedNav from "@/components/connected-nav"
import CryptoPriceTicker from "@/components/crypto-price-ticker"
import Link from "next/link"

export default function AnalystHeader() {
  const { publicKey, disconnectWallet } = useWallet()
  const searchParams = useSearchParams()
  const walletParam = searchParams.get("wallet")

  const walletAddress = publicKey || walletParam || ""

  const formatWalletAddress = (address: string): string => {
    if (!address || address.length < 10) return address || ""
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 py-4 z-20">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-xl tracking-tighter">
          Serttch
        </Link>

        <div className="flex items-center space-x-4">
          <CryptoPriceTicker />
          <ConnectedNav />
          <div className="flex items-center gap-2">
            <div className="bg-gray-50 px-3 py-1 rounded-sm text-sm font-mono">
              {formatWalletAddress(walletAddress)}
            </div>
            <Button onClick={disconnectWallet} variant="outline" size="sm" className="rounded-none whitespace-nowrap">
              Disconnect
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
