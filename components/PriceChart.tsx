"use client"

import { useEffect, useRef } from "react"

const PRICE_CHART_ID = "price-chart-widget-container"

interface PriceChartProps {
  tokenAddress: string
}

declare global {
  interface Window {
    createMyWidget: (containerId: string, options: any) => void
  }
}

export default function PriceChart({ tokenAddress }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const loadWidget = () => {
      if (typeof window.createMyWidget === "function") {
        window.createMyWidget(PRICE_CHART_ID, {
          width: "100%",
          height: "800px", // Increased height
          chainId: "solana",
          tokenAddress: tokenAddress,
          defaultInterval: "1",
          timeZone: "America/New_York",
          theme: "moralis",
          locale: "en",
          backgroundColor: "#ffffff",
          gridColor: "#ffffff",
          textColor: "#68738D",
          candleUpColor: "#6958ff",
          candleDownColor: "#f55757",
          hideLeftToolbar: false,
          hideTopToolbar: false,
          hideBottomToolbar: false,
        })
      } else {
        console.error("createMyWidget function is not defined.")
      }
    }

    if (!document.getElementById("moralis-chart-widget")) {
      const script = document.createElement("script")
      script.id = "moralis-chart-widget"
      script.src = "https://moralis.com/static/embed/chart.js"
      script.type = "text/javascript"
      script.async = true
      script.onload = loadWidget
      script.onerror = () => {
        console.error("Failed to load the chart widget script.")
      }
      document.body.appendChild(script)
    } else {
      loadWidget()
    }

    return () => {
      const script = document.getElementById("moralis-chart-widget")
      if (script) {
        document.body.removeChild(script)
      }
    }
  }, [tokenAddress])

  return (
    <div style={{ width: "100%", height: "800px" }}>
      {" "}
      {/* Increased height */}
      <div id={PRICE_CHART_ID} ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
