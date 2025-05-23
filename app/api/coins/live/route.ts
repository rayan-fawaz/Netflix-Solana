export async function GET() {
  try {
    // Add a delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500))

    const response = await fetch(
      "https://frontend-api-v3.pump.fun/coins/currently-live?offset=0&limit=48&sort=currently_live&order=DESC&includeNsfw=false",
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store", // Don't cache to avoid stale data
      },
    )

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded for live coins API")
        throw new Error("Rate limit exceeded. Please try again later.")
      }
      throw new Error(`API responded with status: ${response.status}`)
    }

    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error("Failed to parse JSON:", text.substring(0, 100))
      throw new Error(`Failed to parse JSON: ${e.message}`)
    }

    console.log("API Response Structure:", JSON.stringify(data).substring(0, 500)) // Log the first 500 chars to see structure
    return Response.json(data)
  } catch (error) {
    console.error("Error fetching live coins:", error)

    // Return mock data if the API call fails
    return Response.json({
      data: [
        {
          mint: "live1",
          name: "PUMP Token",
          symbol: "PUMP",
          image_uri: "/placeholder.svg?height=400&width=600",
          price_change_24h: 67.2,
          market_cap: 1200000,
          usd_market_cap: 1200000,
          volume_24h: 450000,
          created_timestamp: Date.now() - 7200000, // 2 hours ago
          twitter: "https://twitter.com/pumptoken",
          telegram: "https://t.me/pumptoken",
          website: "https://pump.fun",
          thumbnail: "/placeholder.svg?height=400&width=600",
        },
        {
          mint: "live2",
          name: "Solana Doge",
          symbol: "SOLDOGE",
          image_uri: "/placeholder.svg?height=400&width=600",
          price_change_24h: 42.8,
          market_cap: 890000,
          usd_market_cap: 890000,
          volume_24h: 320000,
          created_timestamp: Date.now() - 18000000, // 5 hours ago
          twitter: "https://twitter.com/solanadoge",
          telegram: "https://t.me/solanadoge",
          website: "https://solanadoge.com",
          thumbnail: "/placeholder.svg?height=400&width=600",
        },
        {
          mint: "live3",
          name: "Meme Rocket",
          symbol: "MRKT",
          image_uri: "/placeholder.svg?height=400&width=600",
          price_change_24h: 103.5,
          market_cap: 2100000,
          usd_market_cap: 2100000,
          volume_24h: 780000,
          created_timestamp: Date.now() - 3600000, // 1 hour ago
          twitter: "https://twitter.com/memerocket",
          telegram: "https://t.me/memerocket",
          website: "https://memerocket.io",
          thumbnail: "/placeholder.svg?height=400&width=600",
        },
      ],
    })
  }
}
