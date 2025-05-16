import { Suspense } from "react"
import HomeContent from "@/components/home-content"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={<HomeLoadingFallback />}>
        <HomeContent />
      </Suspense>
    </main>
  )
}

// Simple loading fallback component
function HomeLoadingFallback() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  )
}
