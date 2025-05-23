export async function GET(request: Request, { params }: { params: { mint: string } }) {
  try {
    // Add a delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500))

    const tokenMint = params.mint

    // Fetch data from DexScreener API
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenMint}`, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store", // Don't cache to avoid stale data
    })

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded for DexScreener API")
        throw new Error("Rate limit exceeded. Please try again later.")
      }
      throw new Error(`API responded with status: ${response.status}`)
    }

    // Handle 204 No Content response
    if (response.status === 204) {
      console.log("DexScreener API returned 204 No Content, using empty data")
      return Response.json({ success: false, message: "No data found" })
    }

    // Parse the response text to JSON with error handling
    const text = await response.text()

    // Check for empty response body
    if (!text.trim()) {
      console.log("DexScreener API returned empty body, using empty data")
      return Response.json({ success: false, message: "Empty response" })
    }

    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error("Failed to parse JSON:", text.substring(0, 100))
      // Return empty data instead of re-throwing
      console.log("JSON parse error, using empty data")
      return Response.json({ success: false, message: "Failed to parse response" })
    }

    console.log("DexScreener API Response Structure:", JSON.stringify(data).substring(0, 500))

    // Extract the relevant data
    if (data && data.pairs && data.pairs.length > 0) {
      const pair = data.pairs[0]

      // Safely convert values to numbers
      const safeNumber = (value: any, defaultValue = 0): number => {
        if (value === null || value === undefined) return defaultValue
        const num = typeof value === "string" ? Number.parseFloat(value) : value
        return isNaN(num) ? defaultValue : num
      }

      const dexData = {
        volume_24h: safeNumber(pair.volume?.h24, 0),
        volume_6h: safeNumber(pair.volume?.h6, 0),
        volume_1h: safeNumber(pair.volume?.h1, 0),
        volume_5m: safeNumber(pair.volume?.m5, 0),

        price_change_24h: safeNumber(pair.priceChange?.h24, 0),
        price_change_6h: safeNumber(pair.priceChange?.h6, 0),
        price_change_1h: safeNumber(pair.priceChange?.h1, 0),
        price_change_5m: safeNumber(pair.priceChange?.m5, 0),

        ath_price: safeNumber(pair.priceUsd, 0), // Using current price as fallback
        current_price: safeNumber(pair.priceUsd, 0),

        // Additional useful data
        liquidity: safeNumber(pair.liquidity?.usd, 0),
        fdv: safeNumber(pair.fdv, 0),
        pairAddress: pair.pairAddress || "",
        dexId: pair.dexId || "",
        url: pair.url || "",
      }

      return Response.json({ success: true, data: dexData })
    }

    return Response.json({ success: false, message: "No pairs found" })
  } catch (error) {
    console.error(`Error fetching DexScreener data for ${params.mint}:`, error)

    // Return error response
    return Response.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      data: {
        volume_24h: 0,
        volume_6h: 0,
        volume_1h: 0,
        volume_5m: 0,
        price_change_24h: 0,
        price_change_6h: 0,
        price_change_1h: 0,
        price_change_5m: 0,
        ath_price: 0,
        current_price: 0,
        liquidity: 0,
        fdv: 0,
        pairAddress: "",
        dexId: "",
        url: "",
      },
    })
  }
}
