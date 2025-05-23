/**
 * Converts an IPFS URL to an HTTP URL using a gateway
 * @param url The original URL which might be an IPFS URL
 * @param preferredGateway The preferred IPFS gateway to use (defaults to ipfs.io)
 * @returns A URL that can be used in an <img> tag
 */
export function convertIpfsUrl(url: string | undefined | null, preferredGateway = "ipfs.io"): string {
  if (!url) return "/placeholder.svg?height=400&width=600"

  // If it's already an HTTP URL, return it as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  // Handle ipfs:// protocol
  if (url.startsWith("ipfs://")) {
    const cid = url.replace("ipfs://", "")
    return `https://${preferredGateway}/ipfs/${cid}`
  }

  // Handle /ipfs/ paths
  if (url.startsWith("/ipfs/")) {
    return `https://${preferredGateway}${url}`
  }

  // Handle just CID (assume it's an IPFS CID)
  if (url.startsWith("Qm") || url.startsWith("bafy")) {
    return `https://${preferredGateway}/ipfs/${url}`
  }

  // If it doesn't match any known IPFS format, return as is
  return url
}

/**
 * Logs information about an image URL for debugging
 * @param url The URL to debug
 */
export function debugImageUrl(url: string | undefined | null): void {
  if (!url) {
    console.log("Image URL is null or undefined")
    return
  }

  console.log("Original image URL:", url)
  console.log("Converted image URL:", convertIpfsUrl(url))

  // Check if it's an IPFS URL
  const isIpfs = url.startsWith("ipfs://") || url.startsWith("/ipfs/") || url.startsWith("Qm") || url.startsWith("bafy")

  console.log("Is IPFS URL:", isIpfs)
}
