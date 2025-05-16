import { NextResponse } from "next/server"
import { OpenAI } from "openai"
import { OPENAI_API_KEY } from "@/config/constants"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages, walletData, walletAddress } = await req.json()

    // Create a system message with wallet data context
    const systemMessage = {
      role: "system",
      content: `You are an AI portfolio analyst for Serttch — an AI-powered Solana blockchain guide focused on clarity, precision, and privacy.
      
You have access to the following data for wallet ${walletAddress}:

${
  walletData
    ? `
SOL Balance: ${walletData.balance} SOL (${Number.parseFloat(walletData.balance) * walletData.solPrice} USD)
SOL Price: ${walletData.solPrice} USD

Tokens (${walletData.tokens?.length || 0}):
${
  walletData.tokens
    ?.map((token: any) => `- ${token.name || token.symbol || "Unknown"}: ${token.amount} (${token.usdValue} USD)`)
    .join("\n") || "No tokens found"
}

Recent Transactions (${walletData.transactions?.length || 0}):
${
  walletData.transactions
    ?.slice(0, 5)
    .map(
      (tx: any) =>
        `- ${tx.type || "Transaction"} of ${tx.amount || ""} ${tx.symbol || ""} (${new Date(tx.blockTime * 1000).toLocaleDateString()})`,
    )
    .join("\n") || "No recent transactions"
}
`
    : "No wallet data available. Provide general advice."
}

Analyze this data and provide insightful, accurate responses to the user's questions about their portfolio.
Focus on providing actionable insights, identifying opportunities, and highlighting risks.
Be concise but thorough, and use markdown formatting for better readability.`,
    }

    // Prepare the messages for the API call
    const apiMessages = [systemMessage, ...messages]

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 1000,
    })

    // Get the assistant's response
    const assistantMessage = completion.choices[0].message

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error("Error in chat API route:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
