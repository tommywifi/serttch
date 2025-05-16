import fetch from "node-fetch"

const API_KEY = "YOUR_MORALIS_API_KEY"
const PAIR_ADDRESS = "YOUR_PAIR_ADDRESS"

async function getSwapsByPairAddress() {
  const url = `https://solana-gateway.moralis.io/token/mainnet/swaps/pair/${PAIR_ADDRESS}`

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "X-API-Key": API_KEY,
    },
  })

  const data = await response.json()
  console.log(JSON.stringify(data, null, 2))
}

getSwapsByPairAddress()
