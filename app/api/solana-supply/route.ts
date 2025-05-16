import { NextResponse } from "next/server"

const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com"

export async function GET() {
  try {
    const response = await fetch(SOLANA_RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getSupply",
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch Solana supply data")
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error.message)
    }

    return NextResponse.json({
      total: data.result.value.total,
      circulating: data.result.value.circulating,
      nonCirculating: data.result.value.nonCirculating,
    })
  } catch (error) {
    console.error("Error fetching Solana supply data:", error)
    return NextResponse.json({ error: "Failed to fetch Solana supply data" }, { status: 500 })
  }
}
