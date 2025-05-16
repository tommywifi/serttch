/**
 * Generates a fallback image based on text
 * @param text Text to use for generating the fallback (usually first letter)
 * @param bgColor Background color for the fallback image
 * @returns Data URL for the SVG image
 */
export function generateTextFallbackImage(text: string, bgColor = "#cccccc"): string {
  const letter = text.charAt(0).toUpperCase()

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="${bgColor}" />
      <text x="50" y="50" font-family="Arial, sans-serif" font-size="40" fill="white" text-anchor="middle" dominant-baseline="central">${letter}</text>
    </svg>
  `

  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * Checks if an image exists at the given URL
 * @param url URL to check
 * @returns Promise that resolves to true if image exists, false otherwise
 */
export function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}
