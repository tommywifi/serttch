"use client"

import { Button } from "@/components/ui/button"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useWallet } from "@/context/wallet-context"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { usePageTransition } from "@/hooks/use-page-transition"
import { POLLING_INTERVAL } from "@/config/constants"

// Add import for test wallets
import { TEST_WALLETS } from "@/test-wallets"

// Add import for AnalystHeader
import AnalystHeader from "@/components/analyst-header"

// Update the interface for messages
interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

// Add interface for wallet data
interface WalletData {
  balance: string
  solPrice: number
  tokens: any[]
  transactions: any[]
  portfolioHistory: any[]
}

export default function AnalystContent() {
  const { walletConnected, publicKey, disconnectWallet } = useWallet()
  const router = useRouter()
  const searchParams = useSearchParams()
  const walletParam = searchParams.get("wallet")

  // Initialize page transition
  usePageTransition()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // In the component, update the walletAddress logic:
  const walletAddress = publicKey || walletParam || TEST_WALLETS.diversified

  // Redirect if no wallet is connected
  useEffect(() => {
    if (!walletConnected && !walletParam) {
      router.push("/")
    } else {
      // Fetch wallet data and initialize chat
      fetchWalletData()
    }
  }, [walletConnected, walletParam, router])

  // Fetch wallet data
  const fetchWalletData = async () => {
    if (!walletAddress) return

    try {
      setError(null)

      const response = await fetch("/api/wallet-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setWalletData(data)

      // Initialize chat with the new data
      if (isInitializing) {
        initializeChat(data)
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error)
      setError("Failed to fetch wallet data. Please try again later.")

      // Initialize chat with empty data if we're still initializing
      if (isInitializing) {
        initializeChat(null)
      }
    }
  }

  // Set up polling for real-time updates
  useEffect(() => {
    if (!walletAddress) return

    const intervalId = setInterval(() => {
      fetchWalletData()
    }, POLLING_INTERVAL)

    return () => clearInterval(intervalId)
  }, [walletAddress])

  const initializeChat = async (data: WalletData | null) => {
    setIsInitializing(true)

    // Calculate portfolio stats
    let portfolioValue = 0
    let change24h = 0
    let tokenCount = 0
    let topTokens: string[] = []

    if (data) {
      // Calculate SOL value
      const solBalance = Number.parseFloat(data.balance || "0")
      portfolioValue += solBalance * (data.solPrice || 0)

      // Add token values and collect top tokens
      if (Array.isArray(data.tokens)) {
        tokenCount = data.tokens.length

        // Sort tokens by value
        const sortedTokens = [...data.tokens].sort(
          (a, b) => Number.parseFloat(b.usdValue) - Number.parseFloat(a.usdValue),
        )

        // Get top 3 tokens
        topTokens = sortedTokens.slice(0, 3).map((token) => token.name || token.symbol || "Unknown Token")

        // Add to portfolio value
        data.tokens.forEach((token) => {
          portfolioValue += Number.parseFloat(token.usdValue || "0")
        })
      }

      // Calculate 24h change if portfolio history exists
      if (Array.isArray(data.portfolioHistory) && data.portfolioHistory.length >= 2) {
        const currentValue = data.portfolioHistory[data.portfolioHistory.length - 1].value
        const previousValue = data.portfolioHistory[data.portfolioHistory.length - 2].value
        change24h = ((currentValue - previousValue) / previousValue) * 100
      }
    }

    // System prompt that defines the AI's behavior
    const systemPrompt: Message = {
      role: "system",
      content: `You are an AI portfolio analyst for Serttch — an AI-powered Solana blockchain guide focused on clarity, precision, and privacy. Serttch is a tech-savvy team building cutting-edge tools using Solana and integrating advanced features via X APIs. They are also exploring Monero-based anonymization for future releases.
You have real-time access to the user's crypto holdings and on-chain activity. Your role is to:
Analyze and interpret the performance and trends of the user's holdings, primarily focusing on Solana ecosystem tokens and privacy-focused assets like Monero.
Identify opportunities, risks, and actionable strategies based on market trends, project updates, or token movements.
Surface relevant insights tied to the user's holdings: yield opportunities, governance participation, DeFi integrations, NFT exposure, or privacy-enhancing mechanisms.
Prioritize concise, expert-level summaries, and provide options for further deep dives if requested.
Stay aligned with Serttch's mission: smart insights for a smarter portfolio — blending data-driven precision, Solana fluency, and privacy-forward thinking.
Start each session by briefly summarizing the portfolio status and any urgent flags or promising opportunities. Use technical fluency and suggest next steps where applicable.

The user's wallet address is: ${walletAddress}
Current portfolio value: $${portfolioValue.toFixed(2)}
24h change: ${change24h >= 0 ? "+" : ""}${change24h.toFixed(2)}%
Number of tokens: ${tokenCount}
Top tokens: ${topTokens.join(", ")}`,
    }

    // Welcome message from the assistant
    const welcomeMessage: Message = {
      role: "assistant",
      content: `# Portfolio Analysis for ${formatWalletAddress(walletAddress)}

## Portfolio Summary
Based on your current holdings, I've analyzed your Solana ecosystem assets and identified several key insights:

- **Total Portfolio Value**: ${portfolioValue.toFixed(2)} USD
- **24h Change**: ${change24h >= 0 ? "+" : ""}${change24h.toFixed(2)}%
- **Risk Profile**: ${tokenCount > 5 ? "Diversified" : "Concentrated"}, with ${tokenCount} different tokens

${topTokens.length > 0 ? `## Key Holdings\n${topTokens.map((token) => `- **${token}**`).join("\n")}` : ""}

What specific aspect of your portfolio would you like to explore further?`,
    }

    setMessages([systemPrompt, welcomeMessage])
    setIsInitializing(false)
  }

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call the OpenAI API with the user's message and wallet data context
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.filter((m) => m.role !== "system"), // Exclude system message
            userMessage,
          ],
          walletData,
          walletAddress,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      // Add the assistant's response to the messages
      setMessages((prev) => [...prev, data.message])
      setIsLoading(false)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)

      // Add a fallback response
      const fallbackMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
      }
      setMessages((prev) => [...prev, fallbackMessage])
    }
  }

  const formatWalletAddress = (address: string): string => {
    if (address.length < 10) return address
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
  }

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p>Initializing portfolio analysis...</p>
        </div>
      </div>
    )
  }

  if (error && messages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchWalletData} className="bg-black text-white px-4 py-2 hover:bg-gray-800">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Update the return statement to fix the header layout and add more spacing
  return (
    <div className="min-h-[80vh] bg-white">
      {/* Use the shared header component */}
      <AnalystHeader />

      {/* Chat Interface */}
      <Card className="border border-gray-100 rounded-none overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h1 className="text-lg font-medium">Portfolio Analyst</h1>
          <p className="text-sm text-gray-500">
            Ask questions about your portfolio, market trends, or investment opportunities
          </p>
        </div>

        {/* Messages */}
        <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
          {messages
            .filter((m) => m.role !== "system")
            .map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-sm ${
                    message.role === "user" ? "bg-black text-white ml-auto" : "bg-gray-50 border border-gray-100"
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    {message.content.split("\n").map((line, i) => (
                      <div key={i} dangerouslySetInnerHTML={{ __html: formatMarkdown(line) }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your portfolio..."
              className="flex-1 resize-none rounded-none border-gray-200 focus:border-black focus:ring-0"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-black text-white hover:bg-gray-800 rounded-none"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

// Simple markdown formatter for basic formatting
function formatMarkdown(text: string): string {
  // Headers
  text = text.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
  text = text.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')

  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // Italic
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>")

  // Lists
  text = text.replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')

  return text
}
