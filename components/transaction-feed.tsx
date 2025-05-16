"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWalletData } from "@/hooks/use-wallet-data"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react"

interface TransactionFeedProps {
  walletAddress: string
}

export default function TransactionFeed({ walletAddress }: TransactionFeedProps) {
  const { data, isLoading, error, lastUpdated } = useWalletData(walletAddress)
  const [transactions, setTransactions] = useState<any[]>([])
  const [newTransactions, setNewTransactions] = useState<any[]>([])

  // Update transactions when data changes
  useEffect(() => {
    if (data?.transactions) {
      // Check for new transactions
      if (transactions.length > 0) {
        const existingIds = new Set(transactions.map((tx: any) => tx.signature))
        const newTxs = data.transactions.filter((tx: any) => !existingIds.has(tx.signature))

        if (newTxs.length > 0) {
          setNewTransactions(newTxs)

          // After a delay, merge them into the main list
          setTimeout(() => {
            setTransactions([...newTxs, ...transactions].slice(0, 20))
            setNewTransactions([])
          }, 5000)
        }
      } else {
        // Initial load
        setTransactions(data.transactions.slice(0, 20))
      }
    }
  }, [data])

  if (isLoading && !transactions.length) {
    return (
      <Card className="border border-gray-100 rounded-none">
        <CardHeader className="border-b border-gray-100 bg-gray-50">
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-500">Loading transactions...</p>
        </CardContent>
      </Card>
    )
  }

  if (error && !transactions.length) {
    return (
      <Card className="border border-gray-100 rounded-none">
        <CardHeader className="border-b border-gray-100 bg-gray-50">
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-red-500 mb-2">⚠️</p>
          <p className="text-gray-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-gray-100 rounded-none">
      <CardHeader className="border-b border-gray-100 bg-gray-50 flex flex-row justify-between items-center">
        <CardTitle>Recent Transactions</CardTitle>
        {lastUpdated && <span className="text-xs text-gray-500">Updated: {lastUpdated.toLocaleTimeString()}</span>}
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <AnimatePresence>
            {newTransactions.map((tx, index) => (
              <motion.div
                key={`new-${tx.signature}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b border-gray-100 bg-green-50"
              >
                <TransactionItem transaction={tx} isNew={true} />
              </motion.div>
            ))}
          </AnimatePresence>

          {transactions.length > 0 ? (
            transactions.map((tx, index) => (
              <div key={tx.signature} className={index < transactions.length - 1 ? "border-b border-gray-100" : ""}>
                <TransactionItem transaction={tx} />
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">No transactions found</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function TransactionItem({ transaction, isNew = false }: { transaction: any; isNew?: boolean }) {
  // Format timestamp
  const timestamp = transaction.blockTime ? new Date(transaction.blockTime * 1000).toLocaleString() : "Unknown time"

  // Determine transaction type and direction
  const isIncoming = transaction.from !== transaction.wallet

  return (
    <div className={`p-4 flex items-center justify-between ${isNew ? "animate-pulse" : ""}`}>
      <div className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
            isIncoming ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isIncoming ? (
            <ArrowDownRight size={16} className="text-green-600" />
          ) : (
            <ArrowUpRight size={16} className="text-red-600" />
          )}
        </div>
        <div>
          <p className="font-medium">
            {transaction.type || "Transaction"}
            {transaction.amount && transaction.symbol && (
              <span>
                {" "}
                of {transaction.amount} {transaction.symbol}
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500">{timestamp}</p>
        </div>
      </div>
      <a
        href={`https://solscan.io/tx/${transaction.signature}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-black transition-colors"
      >
        <ExternalLink size={16} />
      </a>
    </div>
  )
}
