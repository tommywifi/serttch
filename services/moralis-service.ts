import { MORALIS_API_KEY } from "@/config/constants"

// Base URL for Moralis Solana API
const MORALIS_BASE_URL = "https://solana-gateway.moralis.io"

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API Error (${response.status}): ${errorText}`)
  }
  return response.json()
}

// Fetch wallet balance
export async function fetchWalletBalance(walletAddress: string) {
  const response = await fetch(`${MORALIS_BASE_URL}/account/mainnet/${walletAddress}/balance`, {
    headers: {
      Accept: "application/json",
      "X-API-Key": MORALIS_API_KEY,
    },
  })
  return handleResponse(response)
}

// Fetch wallet tokens
export async function fetchWalletTokens(walletAddress: string) {
  const response = await fetch(`${MORALIS_BASE_URL}/account/mainnet/${walletAddress}/tokens`, {
    headers: {
      Accept: "application/json",
      "X-API-Key": MORALIS_API_KEY,
    },
  })
  return handleResponse(response)
}

// Fetch wallet NFTs
export async function fetchWalletNFTs(walletAddress: string, limit = 100) {
  const response = await fetch(`${MORALIS_BASE_URL}/account/mainnet/${walletAddress}/nft?limit=${limit}`, {
    headers: {
      Accept: "application/json",
      "X-API-Key": MORALIS_API_KEY,
    },
  })
  return handleResponse(response)
}

// Fetch wallet transactions
export async function fetchWalletTransactions(walletAddress: string, limit = 100) {
  const response = await fetch(`${MORALIS_BASE_URL}/account/mainnet/${walletAddress}/transfers?limit=${limit}`, {
    headers: {
      Accept: "application/json",
      "X-API-Key": MORALIS_API_KEY,
    },
  })
  return handleResponse(response)
}

// Fetch token price
export async function fetchTokenPrice(tokenAddress: string) {
  try {
    const response = await fetch(`${MORALIS_BASE_URL}/token/mainnet/${tokenAddress}/price`, {
      headers: {
        Accept: "application/json",
        "X-API-Key": MORALIS_API_KEY,
      },
    })
    return handleResponse(response)
  } catch (error) {
    console.warn(`Error fetching price for token ${tokenAddress}:`, error)
    return { usdPrice: 0 }
  }
}

// Fetch token metadata
export async function fetchTokenMetadata(tokenAddress: string) {
  const response = await fetch(`${MORALIS_BASE_URL}/token/mainnet/${tokenAddress}/metadata`, {
    headers: {
      Accept: "application/json",
      "X-API-Key": MORALIS_API_KEY,
    },
  })
  return handleResponse(response)
}

// Fetch historical token prices
export async function fetchHistoricalTokenPrices(tokenAddress: string, days = 30) {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const response = await fetch(
    `${MORALIS_BASE_URL}/token/mainnet/${tokenAddress}/price/history?chain=solana&to=${endDate.toISOString()}&from=${startDate.toISOString()}`,
    {
      headers: {
        Accept: "application/json",
        "X-API-Key": MORALIS_API_KEY,
      },
    },
  )
  return handleResponse(response)
}

// Fetch SOL price from CoinGecko (as a fallback)
export async function fetchSolPrice() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true",
    )

    if (response.ok) {
      const data = await response.json()
      return {
        usdPrice: data.solana.usd,
        change24h: data.solana.usd_24h_change,
      }
    }
    throw new Error("Failed to fetch SOL price from CoinGecko")
  } catch (error) {
    console.warn("Error fetching SOL price from CoinGecko:", error)

    // Fallback to Moralis for SOL price
    try {
      // SOL token address on Solana
      const solAddress = "So11111111111111111111111111111111111111112"
      const data = await fetchTokenPrice(solAddress)
      return {
        usdPrice: data.usdPrice || 0,
        change24h: 0, // Moralis doesn't provide 24h change
      }
    } catch (fallbackError) {
      console.error("Error fetching SOL price from fallback:", fallbackError)
      return { usdPrice: 0, change24h: 0 }
    }
  }
}

// Generate mock portfolio value history
export async function getPortfolioValueHistory(walletAddress: string, days = 30) {
  try {
    // Get current tokens
    const tokens = await fetchWalletTokens(walletAddress)

    // Get SOL price
    const solPrice = await fetchSolPrice()

    // Calculate current portfolio value
    let currentValue = 0

    // Add SOL balance
    const balanceData = await fetchWalletBalance(walletAddress)
    const solBalance = Number.parseFloat(balanceData.solana || "0")
    currentValue += solBalance * solPrice.usdPrice

    // Add token values
    for (const token of tokens) {
      try {
        const tokenPrice = await fetchTokenPrice(token.mint)
        const amount = Number.parseFloat(token.amount) || 0
        currentValue += amount * (tokenPrice.usdPrice || 0)
      } catch (error) {
        console.warn(`Error processing token ${token.mint}:`, error)
      }
    }

    // Generate historical data points
    const dailyValues = []
    const endDate = new Date()

    for (let i = 0; i <= days; i++) {
      const date = new Date(endDate)
      date.setDate(date.getDate() - i)

      // Apply a random factor to simulate historical values
      const randomFactor = 0.95 + Math.random() * 0.1
      const value = currentValue * randomFactor * (1 - i * 0.01)

      dailyValues.unshift({
        date: date.toISOString().split("T")[0],
        value: Math.round(value * 100) / 100,
      })
    }

    return dailyValues
  } catch (error) {
    console.error("Error generating portfolio history:", error)
    return []
  }
}
