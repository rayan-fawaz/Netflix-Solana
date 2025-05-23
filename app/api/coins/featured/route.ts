// Import the LiveStreamResponse interface
interface LiveStreamResponse {
  mint: string
  name: string
  symbol: string
  description: string
  image_uri: string
  metadata_uri: string
  twitter: string | null
  telegram: string | null
  bonding_curve: string
  associated_bonding_curve: string
  creator: string
  created_timestamp: number
  raydium_pool: string | null
  complete: boolean
  virtual_sol_reserves: number
  virtual_token_reserves: number
  hidden: boolean | null
  total_supply: number
  website: string | null
  show_name: boolean
  last_trade_timestamp: number
  king_of_the_hill_timestamp: number | null
  market_cap: number
  reply_count: number
  last_reply: number
  nsfw: boolean
  market_id: string | null
  inverted: boolean | null
  is_currently_live: boolean
  username: string | null
  profile_image: string | null
  usd_market_cap: number
}

export async function GET() {
  try {
    // Add a delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log("Fetching featured coins from API...")

    // Try a different endpoint - the "for-you" endpoint instead of "trending"
    const response = await fetch("https://frontend-api-v3.pump.fun/coins/for-you?offset=0&limit=48&includeNsfw=false", {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store", // Don't cache to avoid stale data
    })

    console.log("Featured API response status:", response.status)

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded for featured coins API")
        throw new Error("Rate limit exceeded. Please try again later.")
      }
      throw new Error(`API responded with status: ${response.status}`)
    }

    // Handle 204 No Content response
    if (response.status === 204) {
      console.log("Featured API returned 204 No Content, using mock data")
      return Response.json({ data: getMockFeaturedCoins() })
    }

    // Parse the response text to JSON with error handling
    const text = await response.text()
    console.log("Featured API response text (first 200 chars):", text.substring(0, 200))

    // Check for empty response body
    if (!text.trim()) {
      console.log("Featured API returned empty body, using mock data")
      return Response.json({ data: getMockFeaturedCoins() })
    }

    let data
    try {
      data = JSON.parse(text)
      console.log("Featured API parsed data type:", typeof data)
      if (Array.isArray(data)) {
        console.log("Featured API data is an array of length:", data.length)
      } else if (data && typeof data === "object") {
        console.log("Featured API data keys:", Object.keys(data))
        if (data.data && Array.isArray(data.data)) {
          console.log("Featured API data.data is an array of length:", data.data.length)
        }
      }
    } catch (e) {
      console.error("Failed to parse JSON:", e)
      console.log("JSON parse error, using mock data")
      return Response.json({ data: getMockFeaturedCoins() })
    }

    // Extract the data array, with multiple fallback options
    let coinsData = []
    if (Array.isArray(data)) {
      coinsData = data
    } else if (data && data.data && Array.isArray(data.data)) {
      coinsData = data.data
    } else if (data && data.coins && Array.isArray(data.coins)) {
      coinsData = data.coins
    } else if (data && data.results && Array.isArray(data.results)) {
      coinsData = data.results
    }

    // Filter coins by market cap (10k to 50k)
    const filteredCoins = coinsData.filter((coin: any) => {
      const marketCap = coin.usd_market_cap || 0
      return marketCap >= 10000 && marketCap <= 50000
    })

    // Log the filtering results
    console.log(`Filtered coins by market cap (10k-50k): ${filteredCoins.length} out of ${coinsData.length}`)

    // Use the filtered coins instead of all coins
    coinsData = filteredCoins

    console.log("Extracted coins data length:", coinsData.length)

    // If we have no data, use mock data
    if (coinsData.length === 0) {
      console.log("No coins found in API response, using mock data")
      return Response.json({ data: getMockFeaturedCoins() })
    }

    // Log a sample coin to see its structure
    if (coinsData.length > 0) {
      console.log("Sample coin structure:", JSON.stringify(coinsData[0]).substring(0, 300))
      console.log("Sample coin image_uri:", coinsData[0].image_uri)
    }

    return Response.json({ data: coinsData })
  } catch (error) {
    console.error("Error fetching featured coins:", error)
    console.log("Using mock data due to error")

    // Return mock data if the API call fails
    return Response.json({
      data: getMockFeaturedCoins(),
    })
  }
}

// Helper function to get mock featured coins
function getMockFeaturedCoins(): LiveStreamResponse[] {
  return [
    {
      mint: "featured1",
      name: "Micro Cap 1",
      symbol: "MC1",
      description: "A featured micro cap coin",
      image_uri: "https://frontend-api-v3.pump.fun/images/coins/featured1.png",
      metadata_uri: "",
      twitter: "https://twitter.com/microcap1",
      telegram: "https://t.me/microcap1",
      bonding_curve: "",
      associated_bonding_curve: "",
      creator: "Anonymous",
      created_timestamp: Date.now() - 7200000,
      raydium_pool: null,
      complete: true,
      virtual_sol_reserves: 0,
      virtual_token_reserves: 0,
      hidden: false,
      total_supply: 1000000,
      website: "https://microcap1.io",
      show_name: true,
      last_trade_timestamp: Date.now() - 3600000,
      king_of_the_hill_timestamp: null,
      market_cap: 15000,
      reply_count: 0,
      last_reply: 0,
      nsfw: false,
      market_id: null,
      inverted: null,
      is_currently_live: false,
      username: null,
      profile_image: null,
      usd_market_cap: 15000,
      price_change_24h: 42.8,
      volume_24h: 5000,
    },
    {
      mint: "featured2",
      name: "Micro Cap 2",
      symbol: "MC2",
      description: "Another featured micro cap coin",
      image_uri: "https://frontend-api-v3.pump.fun/images/coins/featured2.png",
      metadata_uri: "",
      twitter: "https://twitter.com/microcap2",
      telegram: "https://t.me/microcap2",
      bonding_curve: "",
      associated_bonding_curve: "",
      creator: "Anonymous",
      created_timestamp: Date.now() - 18000000,
      raydium_pool: null,
      complete: true,
      virtual_sol_reserves: 0,
      virtual_token_reserves: 0,
      hidden: false,
      total_supply: 2000000,
      website: "https://microcap2.io",
      show_name: true,
      last_trade_timestamp: Date.now() - 7200000,
      king_of_the_hill_timestamp: null,
      market_cap: 25000,
      reply_count: 0,
      last_reply: 0,
      nsfw: false,
      market_id: null,
      inverted: null,
      is_currently_live: false,
      username: null,
      profile_image: null,
      usd_market_cap: 25000,
      price_change_24h: 22.1,
      volume_24h: 8000,
    },
    {
      mint: "featured3",
      name: "Micro Cap 3",
      symbol: "MC3",
      description: "A third featured micro cap coin",
      image_uri: "https://frontend-api-v3.pump.fun/images/coins/featured3.png",
      metadata_uri: "",
      twitter: "https://twitter.com/microcap3",
      telegram: "https://t.me/microcap3",
      bonding_curve: "",
      associated_bonding_curve: "",
      creator: "Anonymous",
      created_timestamp: Date.now() - 3600000,
      raydium_pool: null,
      complete: true,
      virtual_sol_reserves: 0,
      virtual_token_reserves: 0,
      hidden: false,
      total_supply: 3000000,
      website: "https://microcap3.io",
      show_name: true,
      last_trade_timestamp: Date.now() - 1800000,
      king_of_the_hill_timestamp: null,
      market_cap: 35000,
      reply_count: 0,
      last_reply: 0,
      nsfw: false,
      market_id: null,
      inverted: null,
      is_currently_live: false,
      username: null,
      profile_image: null,
      usd_market_cap: 35000,
      price_change_24h: 103.5,
      volume_24h: 12000,
    },
  ] as LiveStreamResponse[]
}
