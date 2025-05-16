import { Suspense } from "react"
import dynamic from "next/dynamic"
import AnalystHeader from "@/components/analyst-header"

// Use dynamic import without ssr: false
const AnalystContent = dynamic(() => import("@/components/analyst-content"), {
  loading: () => <AnalystLoadingFallback />,
})

// Add token price ticker component
const TokenPriceTickerWrapper = dynamic(() => import("@/components/token-price-ticker-wrapper"), {
  loading: () => <div className="animate-pulse h-64 bg-gray-100"></div>,
})

// Add transaction feed wrapper component
const TransactionFeedWrapper = dynamic(() => import("@/components/transaction-feed-wrapper"), {
  loading: () => <div className="animate-pulse h-64 bg-gray-100"></div>,
})

export default function AnalystPage() {
  return (
    <Suspense fallback={<AnalystLoadingFallback />}>
      <div className="container mx-auto px-4 py-8 pt-32 sm:pt-36 max-w-6xl">
        <AnalystHeader />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnalystContent />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <TokenPriceTickerWrapper />
            <TransactionFeedWrapper />
          </div>
        </div>
      </div>
    </Suspense>
  )
}

function AnalystLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
        <p>Loading analyst dashboard...</p>
      </div>
    </div>
  )
}
