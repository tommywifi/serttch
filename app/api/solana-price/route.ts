import { NextResponse } from "next/server"
import { MORALIS_API_KEY } from "@/config/constants"

export async function GET() {
  try {
    // First try to fetch from CoinGecko (free, no API key needed)
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true",
        { next: { revalidate: 60 } }, // Cache for 60 seconds
      )

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({
          price: data.solana.usd,
          change24h: data.solana.usd_24h_change,
        })
      }
    } catch (error) {
      console.warn("CoinGecko API failed, falling back to Moralis:", error)
    }

    // Fallback to Moralis if CoinGecko fails
    if (MORALIS_API_KEY) {
      try {
        const response = await fetch(
          "https://solana-gateway.moralis.io/token/mainnet/So11111111111111111111111111111111111111112/price",
          {
            headers: {
              Accept: "application/json",
              "X-API-Key": MORALIS_API_KEY,
            },
            next: { revalidate: 60 }, // Cache for 60 seconds
          },
        )

        if (response.ok) {
          const data = await response.json()
          return NextResponse.json({
            price: data.usdPrice,
            change24h: 0, // Moralis doesn't provide 24h change
          })
        }
      } catch (moralisError) {
        console.warn("Moralis API failed:", moralisError)
      }
    }

    // Try another fallback - Binance API
    try {
      const response = await fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=SOLUSDT", {
        next: { revalidate: 60 }, // Cache for 60 seconds
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({
          price: Number.parseFloat(data.lastPrice),
          change24h: Number.parseFloat(data.priceChangePercent),
        })
      }
    } catch (binanceError) {
      console.warn("Binance API failed:", binanceError)
    }

    // If all APIs fail, return a fallback price
    return NextResponse.json({
      price: 80.0,
      change24h: 0,
    })
  } catch (error) {
    console.error("Error fetching Solana price:", error)
    return NextResponse.json({ error: "Failed to fetch Solana price" }, { status: 500 })
  }
}
