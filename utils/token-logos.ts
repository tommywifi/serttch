// Token logo mapping for common tokens
export const TOKEN_LOGOS: Record<string, string> = {
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
  // Marinade staked SOL (mSOL)
  mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
  // Serum (SRM)
  SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt/logo.png",
  // Raydium (RAY)
  "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R":
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png",
  // Star Atlas (ATLAS)
  ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx/logo.png",
  // Star Atlas DAO (POLIS)
  poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk/logo.png",
}

/**
 * Get the logo URL for a token by its mint address
 * @param mint The token mint address
 * @param symbol Optional token symbol for fallback
 * @returns The URL to the token logo
 */
export function getTokenLogoUrl(mint: string, symbol?: string): string {
  // Check if we have a predefined logo
  if (TOKEN_LOGOS[mint]) {
    return TOKEN_LOGOS[mint]
  }

  // Try to get from Solana token list
  return `https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/${mint}/logo.png`
}

/**
 * Get a fallback logo based on the token symbol
 * @param symbol The token symbol
 * @returns A data URL for a generated logo
 */
export function getFallbackTokenLogo(symbol: string): string {
  // Generate a color based on the symbol
  const hash = symbol.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  const h = hash % 360
  const s = 70 + (hash % 30)
  const l = 45 + (hash % 10)

  const bgColor = `hsl(${h}, ${s}%, ${l}%)`
  const textColor = l > 50 ? "#000" : "#fff"

  // Create an SVG with the first letter of the symbol
  const letter = symbol.charAt(0).toUpperCase()
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="16" fill="${bgColor}" />
      <text x="16" y="16" font-family="Arial, sans-serif" font-size="16" fill="${textColor}" text-anchor="middle" dominant-baseline="central">${letter}</text>
    </svg>
  `

  return `data:image/svg+xml;base64,${btoa(svg)}`
}
