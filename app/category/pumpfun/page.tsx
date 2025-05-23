"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import IpfsImage from "@/components/ipfs-image"
import { formatNumber } from "@/utils/numberFormat"

interface Coin {
  id: string
  name: string
  symbol: string
  imageUrl: string
  priceChange: string
  marketCap: string
  volume: string
  launchTime: string
  description?: string
  apiDescription?: string
  modifiedBy?: string
  usdMarketCap?: string
}

export default function PumpFunPage() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to convert timestamp to minutes elapsed
  const getMinutesSinceCreation = (createdTimestamp: number): number => {
    if (!createdTimestamp) return 0
    const createdDatetime = new Date(createdTimestamp)
    const currentTimeUtc = new Date()
    const minutesSinceCreation = (currentTimeUtc.getTime() - createdDatetime.getTime()) / (1000 * 60)
    return Math.floor(minutesSinceCreation)
  }

  // Function to format minutes to human readable time
  const formatTimeAgo = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m ago`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours < 24) {
      return `${hours}h ${mins}m ago`
    }
    const days = Math.floor(hours / 24)
    const hrs = hours % 24
    return `${days}d ${hrs}h ago`
  }

  // Dummy function for debugging image URLs
  const debugImageUrl = (url: string | undefined) => {
    console.log("Debugging image URL:", url)
  }

  useEffect(() => {
    const fetchPumpFunCoins = async () => {
      try {
        console.log("PumpFunPage: Fetching Pump.fun top-runners...")
        // Use our internal API route
        const response = await fetch("/api/coins/pumpfun-originals")

        if (!response.ok) {
          console.error("PumpFunPage: API response not OK:", response.status)
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()
        console.log("PumpFunPage: Pump.fun top-runners data received:", data)

        // Check if the API returned an error
        if (data.success === false) {
          setError(data.error || "Failed to fetch coins")
          console.error("API returned error:", data.error)

          // Still use the fallback data
          if (data.data && Array.isArray(data.data)) {
            transformAndSetCoins(data.data)
          } else {
            setCoins(getFallbackCoins())
          }
          setLoading(false)
          return
        }

        // Check if data is an array directly or if it has a data property
        const coinsData = Array.isArray(data) ? data : data.data || []
        console.log("PumpFunPage: Extracted coins data length:", coinsData.length)

        if (coinsData.length === 0) {
          console.warn("PumpFunPage: No Pump.fun top-runners data found, using fallback data")
          setError("No coins found in API response")
          setCoins(getFallbackCoins())
          setLoading(false)
          return
        }

        // Log a sample coin to see its structure
        if (coinsData.length > 0) {
          console.log("PumpFunPage: Sample coin structure:", JSON.stringify(coinsData[0]).substring(0, 300))
          // Check if the data has the expected structure
          if (coinsData[0].coin) {
            console.log("Data has the expected structure with 'coin' property")
            debugImageUrl(coinsData[0].coin.image_uri)
          } else {
            console.error("Data doesn't have the expected structure with 'coin' property")
            setError("API response format unexpected")
            setCoins(getFallbackCoins())
            setLoading(false)
            return
          }
        }

        transformAndSetCoins(coinsData)
      } catch (error) {
        console.error("PumpFunPage: Error fetching Pump.fun top-runners:", error)
        console.log("PumpFunPage: Falling back to mock data")
        setError(error instanceof Error ? error.message : "Unknown error fetching coins")

        // Fallback data in case the API fails
        setCoins(getFallbackCoins())
        setLoading(false)
      }
    }

    // Function to transform API data to our Coin interface
    const transformAndSetCoins = (coinsData: any[]) => {
      try {
        // Transform the data to match our Coin interface
        const transformedCoins = coinsData.map((item: any, index: number) => {
          // Handle both formats: direct coin object or {coin: {...}} structure
          const coin = item.coin || item
          const apiDescription = item.description
          const modifiedBy = item.modifiedBy

          const minutesSinceCreation = getMinutesSinceCreation(coin.created_timestamp || Date.now())
          const timeAgo = formatTimeAgo(minutesSinceCreation)

          return {
            id: coin.mint || coin.id || `unknown-${index}`,
            name: coin.name || `Unknown Coin ${index + 1}`,
            symbol: coin.symbol || "???",
            description: coin.description || "No description available",
            // Store the original image URL
            imageUrl: coin.image_uri || coin.imageUrl || "/placeholder.svg?height=400&width=600",
            priceChange:
              typeof coin.price_change_24h === "number"
                ? `${coin.price_change_24h > 0 ? "+" : ""}${coin.price_change_24h.toFixed(2)}%`
                : "N/A",
            // Use usd_market_cap instead of market_cap as requested
            marketCap: typeof coin.usd_market_cap === "number" ? `${formatNumber(coin.usd_market_cap)}` : "N/A",
            volume: typeof coin.volume_24h === "number" ? `${formatNumber(coin.volume_24h)}` : "N/A",
            launchTime: coin.created_timestamp ? timeAgo : "N/A",
            apiDescription,
            modifiedBy,
            usdMarketCap: typeof coin.usd_market_cap === "number" ? `${formatNumber(coin.usd_market_cap)}` : undefined,
          }
        })

        setCoins(transformedCoins)
        setLoading(false)
      } catch (transformError) {
        console.error("Error transforming coin data:", transformError)
        setError("Error processing coin data")
        setCoins(getFallbackCoins())
        setLoading(false)
      }
    }

    fetchPumpFunCoins()
  }, [])

  // Helper function to get fallback coins
  const getFallbackCoins = (): Coin[] => {
    return [
      {
        id: "pumpfun1",
        name: "Pump Token 1",
        symbol: "PUMP1",
        description: "A popular Solana meme coin on Pump.fun",
        imageUrl: "/placeholder.svg?height=400&width=600",
        priceChange: "+67.2%",
        marketCap: "$1.2M",
        volume: "$450K",
        launchTime: "2 hours ago",
      },
      {
        id: "pumpfun2",
        name: "Pump Token 2",
        symbol: "PUMP2",
        description: "A trending Solana meme coin on Pump.fun",
        imageUrl: "/placeholder.svg?height=400&width=600",
        priceChange: "+42.8%",
        marketCap: "$890K",
        volume: "$320K",
        launchTime: "5 hours ago",
      },
      {
        id: "pumpfun3",
        name: "Pump Token 3",
        symbol: "PUMP3",
        description: "An exciting new Solana meme coin on Pump.fun",
        imageUrl: "/placeholder.svg?height=400&width=600",
        priceChange: "+103.5%",
        marketCap: "$1.5M",
        volume: "$780K",
        launchTime: "1 hour ago",
      },
    ]
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-20 px-4 md:px-16">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Pump.fun Originals</h1>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 mb-4">
            <h3 className="text-red-500 font-medium mb-2">Error loading Pump.fun coins</h3>
            <p className="text-sm text-gray-300">{error}</p>
            <p className="text-sm text-gray-400 mt-2">Showing fallback data instead.</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coins.map((coin) => (
              <Link key={coin.id} href={`/coin/${coin.id}`} className="block">
                <div className="bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-600 transition-all duration-300">
                  <div className="relative h-48">
                    <IpfsImage src={coin.imageUrl} alt={coin.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium bg-red-600 rounded-sm">
                      PUMP.FUN
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">{coin.name}</h3>
                        <span
                          className={`text-sm font-medium ${coin.priceChange.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                        >
                          {coin.priceChange}
                        </span>
                      </div>
                      <p className="text-gray-400">{coin.symbol}</p>
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-4">
                    {(coin.usdMarketCap || coin.marketCap) && (
                      <div>
                        <p className="text-sm text-gray-400">Market Cap</p>
                        <p className="font-medium">{coin.usdMarketCap || coin.marketCap}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-400">24h Volume</p>
                      <p className="font-medium">{coin.volume}</p>
                    </div>
                  </div>
                  {coin.apiDescription && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-gray-300">{coin.apiDescription}</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
