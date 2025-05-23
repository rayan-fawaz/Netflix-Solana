export async function GET() {
  try {
    // Add a delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500))

    const response = await fetch("https://frontend-api-v3.pump.fun/coins/for-you?offset=0&limit=48&includeNsfw=false", {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store", // Don't cache to avoid stale data
    })

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded for trending coins API")
        throw new Error("Rate limit exceeded. Please try again later.")
      }
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Trending API Response Structure:", JSON.stringify(data).substring(0, 500))

    // Filter coins by market cap (10k to 50k)
    const filteredCoins = data.data.filter((coin: any) => {
      const marketCap = coin.usd_market_cap || 0
      return marketCap >= 10000 && marketCap <= 50000
    })

    return Response.json({ data: filteredCoins })
  } catch (error) {
    console.error("Error fetching trending coins:", error)

    // Return mock data if the API call fails
    return Response.json({
      data: [
        {
          mint: "trending1",
          name: "Micro Cap 1",
          symbol: "MC1",
          image_uri: "/placeholder.svg?height=400&width=600",
          price_change_24h: 42.8,
          market_cap: 15000,
          usd_market_cap: 15000,
          volume_24h: 5000,
          created_timestamp: Date.now() - 7200000,
          twitter: "https://twitter.com/microcap1",
          telegram: "https://t.me/microcap1",
          website: "https://microcap1.io",
        },
        {
          mint: "trending2",
          name: "Micro Cap 2",
          symbol: "MC2",
          image_uri: "/placeholder.svg?height=400&width=600",
          price_change_24h: 22.1,
          market_cap: 25000,
          usd_market_cap: 25000,
          volume_24h: 8000,
          created_timestamp: Date.now() - 18000000,
          twitter: "https://twitter.com/microcap2",
          telegram: "https://t.me/microcap2",
          website: "https://microcap2.io",
        },
        {
          mint: "trending3",
          name: "Micro Cap 3",
          symbol: "MC3",
          image_uri: "/placeholder.svg?height=400&width=600",
          price_change_24h: 103.5,
          market_cap: 35000,
          usd_market_cap: 35000,
          volume_24h: 12000,
          created_timestamp: Date.now() - 3600000,
          twitter: "https://twitter.com/microcap3",
          telegram: "https://t.me/microcap3",
          website: "https://microcap3.io",
        },
        {
          mint: "trending4",
          name: "Micro Cap 4",
          symbol: "MC4",
          image_uri: "/placeholder.svg?height=400&width=600",
          price_change_24h: 67.2,
          market_cap: 45000,
          usd_market_cap: 45000,
          volume_24h: 15000,
          created_timestamp: Date.now() - 10800000,
          twitter: "https://twitter.com/microcap4",
          telegram: "https://t.me/microcap4",
          website: "https://microcap4.io",
        },
        {
          mint: "trending5",
          name: "Micro Cap 5",
          symbol: "MC5",
          image_uri: "/placeholder.svg?height=400&width=600",
          price_change_24h: 33.9,
          market_cap: 18000,
          usd_market_cap: 18000,
          volume_24h: 6000,
          created_timestamp: Date.now() - 14400000,
          twitter: "https://twitter.com/microcap5",
          telegram: "https://t.me/microcap5",
          website: "https://microcap5.io",
        },
      ],
    })
  }
}
