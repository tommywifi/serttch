# Image Integration Instructions

## Team Member Images
The team member images have been integrated using the following URLs:
- Falko: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/falko-face-modified-removebg-preview-N06kqPYKrxaXSSaEFkXUnaRHYXDaS1.png
- Kostas: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kostas-face-modified-removebg-preview-kZ30k1ZWPhzXf6UdUaNWm9cMnidn6H.png
- Leon: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/leon-face-modified-removebg-preview-Inno3y6hn5TlTyECSm59npKtp5uYck.png

## Wallet Images
When the wallet images become available, update the `getWalletImage` function in `components/wallet-logo.tsx` with the actual URLs:

\`\`\`typescript
const getWalletImage = (name: string, colored: boolean) => {
  if (name === "Phantom") {
    return colored 
      ? "URL_TO_COLORED_PHANTOM_IMAGE" // phantom-wallet.webp
      : "URL_TO_BW_PHANTOM_IMAGE"      // phantom-wallet-modified.png
  } else if (name === "Solflare") {
    return colored 
      ? "URL_TO_COLORED_SOLFLARE_IMAGE" // solflare-wallet.jpg
      : "URL_TO_BW_SOLFLARE_IMAGE"      // solflare-wallet-modified.jpg
  }
  
  // Fallback to placeholder if no image is available
  return generatePlaceholder(name, colored)
}
\`\`\`

Replace the placeholder URLs with the actual image URLs when they become available.
