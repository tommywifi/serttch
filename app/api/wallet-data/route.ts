import { NextResponse } from "next/server"
import { MORALIS_API_KEY } from "@/config/constants"

async function fetchSolPrice() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd")
    const data = await response.json()
    return data.solana.usd
  } catch (error) {
    console.error("Error fetching SOL price:", error)
    return 0
  }
}

// Fetch token price with better error handling
async function fetchTokenPrice(address: string) {
  try {
    // Try Moralis first
    const response = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${address}/price`, {
      headers: {
        Accept: "application/json",
        "X-API-Key": MORALIS_API_KEY,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (response.ok) {
      const data = await response.json()
      return data.usdPrice || 0
    }

    throw new Error("Moralis price fetch failed")
  } catch (error) {
    console.error(`Error fetching price for token ${address}:`, error)

    // Try to get SOL price from our own API if this is the SOL token
    if (address === "So11111111111111111111111111111111111111112") {
      try {
        const response = await fetch("http://localhost:3000/api/solana-price")
        if (response.ok) {
          const data = await response.json()
          return data.price || 0
        }
      } catch (solError) {
        console.error("Error fetching SOL price from local API:", solError)
      }
    }

    return 0
  }
}

async function fetchTokenMetadata(address: string) {
  try {
    const response = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${address}/metadata`, {
      headers: {
        Accept: "application/json",
        "X-API-Key": MORALIS_API_KEY,
      },
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching metadata for token ${address}:`, error)
    return null
  }
}

async function fetchHistoricalPrices(address: string) {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30) // Get data for the last 30 days

  try {
    const response = await fetch(
      `https://solana-gateway.moralis.io/token/mainnet/${address}/price/history?chain=solana&to=${endDate.toISOString()}&from=${startDate.toISOString()}`,
      {
        headers: {
          Accept: "application/json",
          "X-API-Key": MORALIS_API_KEY,
        },
      },
    )
    const data = await response.json()
    return data.map((item: any) => ({
      date: new Date(item.date).getTime(),
      price: Number.parseFloat(item.usdPrice),
    }))
  } catch (error) {
    console.error(`Error fetching historical prices for token ${address}:`, error)
    return []
  }
}

// Generate mock portfolio history data
function generatePortfolioHistory(totalValue: number) {
  const mockData = []
  const now = new Date()
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Generate a somewhat realistic price curve
    const randomFactor = 0.95 + Math.random() * 0.1
    const value = totalValue * randomFactor * (1 - i * 0.01)

    mockData.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(value * 100) / 100,
    })
  }
  return mockData
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
const getTokenLogoUrl = (mint: string): string => {
  // Check if we have a predefined logo
  if (TOKEN_LOGOS[mint]) {
    return TOKEN_LOGOS[mint]
  }

  // Try to get from Solana token list
  return `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/${mint}/logo.png`
}

export async function POST(req: Request) {
  const { walletAddress, tokenAddress } = await req.json()

  try {
    // Fetch SOL price
    const solPrice = await fetchSolPrice()

    // Fetch balance
    const balanceResponse = await fetch(`https://solana-gateway.moralis.io/account/mainnet/${walletAddress}/balance`, {
      headers: {
        Accept: "application/json",
        "X-API-Key": MORALIS_API_KEY,
      },
    })
    const balanceData = await balanceResponse.json()

    // Fetch tokens
    const tokensResponse = await fetch(`https://solana-gateway.moralis.io/account/mainnet/${walletAddress}/tokens`, {
      headers: {
        Accept: "application/json",
        "X-API-Key": MORALIS_API_KEY,
      },
    })
    const tokensData = await tokensResponse.json()

    // Fetch transactions
    const txResponse = await fetch(
      `https://solana-gateway.moralis.io/account/mainnet/${walletAddress}/transfers?limit=10`,
      {
        headers: {
          Accept: "application/json",
          "X-API-Key": MORALIS_API_KEY,
        },
      },
    )
    const txData = await txResponse.json()

    // Calculate token values and fetch metadata
    const tokens = await Promise.all(
      Array.isArray(tokensData)
        ? tokensData.map(async (token) => {
            try {
              const tokenPrice = await fetchTokenPrice(token.mint)
              const amount = Number.parseFloat(token.amount) || 0
              const usdValue = amount * tokenPrice
              const solValue = usdValue / (solPrice || 1)

              // Try to fetch token metadata for additional info
              const metadata = await fetchTokenMetadata(token.mint)

              // Get logo URL
              const logoUrl = metadata?.logo || getTokenLogoUrl(token.mint)

              return {
                ...token,
                solValue: solValue.toFixed(4),
                usdValue: usdValue.toFixed(2),
                tokenPrice: tokenPrice.toFixed(4),
                logoUrl,
                decimals: metadata?.decimals || token.decimals || 0,
                website: metadata?.website || null,
              }
            } catch (error) {
              console.error(`Error processing token ${token.mint}:`, error)
              return {
                ...token,
                solValue: "0.0000",
                usdValue: "0.00",
                tokenPrice: "0.0000",
                logoUrl: getTokenLogoUrl(token.mint),
              }
            }
          })
        : [],
    )

    // Get historical data
    let historicalPrices = null
    let portfolioHistory = null

    if (tokenAddress) {
      // Get historical prices for specific token
      historicalPrices = await fetchHistoricalPrices(tokenAddress)
    } else {
      // Calculate total portfolio value
      let totalValue = 0

      // Add SOL value
      const solBalance = Number.parseFloat(balanceData.solana || "0")
      totalValue += solBalance * solPrice

      // Add token values
      tokens.forEach((token) => {
        totalValue += Number.parseFloat(token.usdValue || "0")
      })

      // Generate mock portfolio history
      portfolioHistory = generatePortfolioHistory(totalValue)
    }

    return NextResponse.json({
      balance: balanceData.solana || "0",
      solPrice,
      tokens,
      transactions: Array.isArray(txData.result) ? txData.result : [],
      historicalPrices,
      portfolioHistory,
    })
  } catch (error) {
    console.error("Error fetching wallet data:", error)
    return NextResponse.json({ error: "Failed to fetch wallet data" }, { status: 500 })
  }
}
