export async function GET() {
  try {
    // Add a delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log("Fetching Pump.fun top-runners from API...")

    // Use the top-runners API endpoint
    const response = await fetch("https://frontend-api-v3.pump.fun/coins/top-runners", {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store", // Don't cache to avoid stale data
    })

    console.log("Pump.fun top-runners API response status:", response.status)

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded for Pump.fun top-runners API")
        throw new Error("Rate limit exceeded. Please try again later.")
      }
      throw new Error(`API responded with status: ${response.status}`)
    }

    // Handle 204 No Content response
    if (response.status === 204) {
      console.log("Pump.fun top-runners API returned 204 No Content, using mock data")
      return Response.json({ data: getMockPumpFunCoins() })
    }

    // Parse the response text to JSON with error handling
    const text = await response.text()
    console.log("Pump.fun top-runners API response text (first 200 chars):", text.substring(0, 200))

    // Check for empty response body
    if (!text.trim()) {
      console.log("Pump.fun top-runners API returned empty body, using mock data")
      return Response.json({ data: getMockPumpFunCoins() })
    }

    let data
    try {
      data = JSON.parse(text)
      console.log("Pump.fun top-runners API parsed data type:", typeof data)

      // Log the structure of the first item to understand the format
      if (Array.isArray(data) && data.length > 0) {
        console.log("First item structure:", JSON.stringify(data[0]).substring(0, 300))
        console.log("Has coin property:", data[0].hasOwnProperty("coin"))
      }
    } catch (e) {
      console.error("Failed to parse JSON:", e)
      console.log("JSON parse error, using mock data")
      return Response.json({ data: getMockPumpFunCoins() })
    }

    // Check if we have data in the expected format (array of objects with 'coin' property)
    if (!Array.isArray(data)) {
      console.error("API response is not an array:", typeof data)
      return Response.json({
        success: false,
        error: "API response format unexpected - not an array",
        data: getMockPumpFunCoins(),
      })
    }

    // If the data is in the expected format (array of objects with 'coin' property)
    if (data.length > 0 && data[0].hasOwnProperty("coin")) {
      console.log("Data is in the expected format with 'coin' property")
      return Response.json({ success: true, data: data })
    } else {
      console.error("API response items don't have 'coin' property")
      return Response.json({
        success: false,
        error: "API response items don't have 'coin' property",
        data: getMockPumpFunCoins(),
      })
    }
  } catch (error) {
    console.error("Error fetching Pump.fun top-runners:", error)
    console.log("Using mock data due to error")

    // Return mock data if the API call fails
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: getMockPumpFunCoins(),
    })
  }
}

// Helper function to get mock Pump.fun coins - updated to match the expected format
function getMockPumpFunCoins() {
  return [
    {
      coin: {
        mint: "pumpfun1",
        name: "Pump Token 1",
        symbol: "PUMP1",
        description: "A popular Solana meme coin on Pump.fun",
        image_uri: "/placeholder.svg?height=400&width=600",
        created_timestamp: Date.now() - 7200000, // 2 hours ago
        twitter: "https://twitter.com/pumptoken1",
        telegram: "https://t.me/pumptoken1",
        website: "https://pump.fun",
        creator: "Anonymous",
        market_cap: 1200000,
        usd_market_cap: 1200000,
        price_change_24h: 67.2,
        volume_24h: 450000,
      },
      description: "A popular Solana meme coin on Pump.fun",
      modifiedBy: "Anonymous",
    },
    {
      coin: {
        mint: "pumpfun2",
        name: "Pump Token 2",
        symbol: "PUMP2",
        description: "A trending Solana meme coin on Pump.fun",
        image_uri: "/placeholder.svg?height=400&width=600",
        created_timestamp: Date.now() - 18000000, // 5 hours ago
        twitter: "https://twitter.com/pumptoken2",
        telegram: "https://t.me/pumptoken2",
        website: "https://pump.fun",
        creator: "Anonymous",
        market_cap: 890000,
        usd_market_cap: 890000,
        price_change_24h: 42.8,
        volume_24h: 320000,
      },
      description: "A trending Solana meme coin on Pump.fun",
      modifiedBy: "Anonymous",
    },
    {
      coin: {
        mint: "pumpfun3",
        name: "Pump Token 3",
        symbol: "PUMP3",
        description: "An exciting new Solana meme coin on Pump.fun",
        image_uri: "/placeholder.svg?height=400&width=600",
        created_timestamp: Date.now() - 3600000, // 1 hour ago
        twitter: "https://twitter.com/pumptoken3",
        telegram: "https://t.me/pumptoken3",
        website: "https://pump.fun",
        creator: "Anonymous",
        market_cap: 1500000,
        usd_market_cap: 1500000,
        price_change_24h: 103.5,
        volume_24h: 780000,
      },
      description: "An exciting new Solana meme coin on Pump.fun",
      modifiedBy: "Anonymous",
    },
  ]
}
