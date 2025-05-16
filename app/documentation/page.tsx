"use client"

import { useEffect } from "react"

export default function DocumentationPage() {
  useEffect(() => {
    window.location.href = "https://serttch.gitbook.io/serttch"
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
        <p>Redirecting to Serttch Documentation...</p>
      </div>
    </div>
  )
}
