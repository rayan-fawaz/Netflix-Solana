"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Info, Play, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import IpfsImage from "@/components/ipfs-image"
import { formatNumber } from "@/utils/numberFormat"

interface Coin {
  id: string
  name: string
  symbol: string
  imageUrl: string
  priceChange: string
  marketCap: string
  usdMarketCap: string
  volume: string
  launchTime: string
  createdTimestamp: number
  description?: string
  twitter?: string
  telegram?: string
  website?: string
  creator?: string
  apiDescription?: string
  modifiedBy?: string
}

export default function PumpFunCoinsRow() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const [isMoved, setIsMoved] = useState(false)

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
        console.log("PumpFunCoinsRow: Fetching Pump.fun top-runners...")
        // Use our internal API route
        const response = await fetch("/api/coins/pumpfun-originals")

        if (!response.ok) {
          console.error("PumpFunCoinsRow: API response not OK:", response.status)
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()
        console.log("PumpFunCoinsRow: Pump.fun top-runners data received:", data)

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
        console.log("PumpFunCoinsRow: Extracted coins data length:", coinsData.length)

        if (coinsData.length === 0) {
          console.warn("PumpFunCoinsRow: No Pump.fun top-runners data found, using fallback data")
          setError("No coins found in API response")
          setCoins(getFallbackCoins())
          setLoading(false)
          return
        }

        // Log a sample coin to see its structure
        if (coinsData.length > 0) {
          console.log("PumpFunCoinsRow: Sample coin structure:", JSON.stringify(coinsData[0]).substring(0, 300))
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
        console.error("PumpFunCoinsRow: Error fetching Pump.fun top-runners:", error)
        console.log("PumpFunCoinsRow: Falling back to mock data")
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

          // Add more detailed logging for the first coin
          if (index === 0) {
            console.log("PumpFunCoinsRow: Transforming first coin:", {
              mint: coin.mint,
              name: coin.name,
              symbol: coin.symbol,
              image_uri: coin.image_uri,
              price_change_24h: coin.price_change_24h,
              market_cap: coin.market_cap,
              usd_market_cap: coin.usd_market_cap,
              volume_24h: coin.volume_24h,
              created_timestamp: coin.created_timestamp,
            })
          }

          const minutesSinceCreation = getMinutesSinceCreation(coin.created_timestamp || Date.now())
          const timeAgo = formatTimeAgo(minutesSinceCreation)

          return {
            id: coin.mint || coin.id || `unknown-${index}`,
            name: coin.name || `Unknown Coin ${index + 1}`,
            symbol: coin.symbol || "???",
            description: coin.description,
            creator: coin.creator,
            // Store the original image URL
            imageUrl: coin.image_uri || coin.imageUrl || "/placeholder.svg?height=400&width=600",
            priceChange:
              typeof coin.price_change_24h === "number"
                ? `${coin.price_change_24h > 0 ? "+" : ""}${coin.price_change_24h.toFixed(2)}%`
                : "",
            marketCap: typeof coin.market_cap === "number" ? `${formatNumber(coin.market_cap)}` : "",
            usdMarketCap: typeof coin.usd_market_cap === "number" ? `${formatNumber(coin.usd_market_cap)}` : "",
            volume: typeof coin.volume_24h === "number" ? `${formatNumber(coin.volume_24h)}` : "",
            launchTime: coin.created_timestamp ? timeAgo : "",
            createdTimestamp: coin.created_timestamp || Date.now() - 86400000, // Default to 1 day ago
            twitter: coin.twitter,
            telegram: coin.telegram,
            website: coin.website,
            apiDescription,
            modifiedBy,
          }
        })

        console.log("PumpFunCoinsRow: Successfully transformed coins, count:", transformedCoins.length)
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
        creator: "Anonymous",
        imageUrl: "/placeholder.svg?height=400&width=600",
        priceChange: "+67.2%",
        marketCap: "$1.2M",
        usdMarketCap: "$1.2M",
        volume: "$450K",
        launchTime: "2 hours ago",
        createdTimestamp: Date.now() - 7200000,
        twitter: "https://twitter.com/pumptoken1",
        telegram: "https://t.me/pumptoken1",
        website: "https://pump.fun",
      },
      {
        id: "pumpfun2",
        name: "Pump Token 2",
        symbol: "PUMP2",
        description: "A trending Solana meme coin on Pump.fun",
        creator: "Anonymous",
        imageUrl: "/placeholder.svg?height=400&width=600",
        priceChange: "+42.8%",
        marketCap: "$890K",
        usdMarketCap: "$890K",
        volume: "$320K",
        launchTime: "5 hours ago",
        createdTimestamp: Date.now() - 18000000,
        twitter: "https://twitter.com/pumptoken2",
        telegram: "https://t.me/pumptoken2",
        website: "https://pump.fun",
      },
      {
        id: "pumpfun3",
        name: "Pump Token 3",
        symbol: "PUMP3",
        description: "An exciting new Solana meme coin on Pump.fun",
        creator: "Anonymous",
        imageUrl: "/placeholder.svg?height=400&width=600",
        priceChange: "+103.5%",
        marketCap: "$1.5M",
        usdMarketCap: "$1.5M",
        volume: "$780K",
        launchTime: "1 hour ago",
        createdTimestamp: Date.now() - 3600000,
        twitter: "https://twitter.com/pumptoken3",
        telegram: "https://t.me/pumptoken3",
        website: "https://pump.fun",
      },
    ]
  }

  const handleClick = (direction: "left" | "right") => {
    setIsMoved(true)

    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2

      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 mb-4">
        <h3 className="text-red-500 font-medium mb-2">Error loading Pump.fun coins</h3>
        <p className="text-sm text-gray-300">{error}</p>
        <p className="text-sm text-gray-400 mt-2">Showing fallback data instead.</p>
      </div>
    )
  }

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition ${!isMoved && "hidden"}`}
        onClick={() => handleClick("left")}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <div ref={rowRef} className="flex items-center space-x-2 overflow-x-scroll scrollbar-hide md:space-x-4 md:p-2">
        {coins.map((coin) => (
          <div key={coin.id} className="min-w-[250px] md:min-w-[280px] h-[170px] relative">
            <Link href={`/coin/${coin.id}`}>
              <div className="relative h-[170px] w-full rounded-md overflow-hidden group cursor-pointer transition">
                <IpfsImage
                  src={coin.imageUrl}
                  alt={coin.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-300" />

                {/* Pump.fun badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium bg-red-600 rounded-sm">
                  PUMP.FUN
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{coin.name}</h3>
                    <span
                      className={`text-sm font-medium ${coin.priceChange.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                    >
                      {coin.priceChange}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400">{coin.symbol}</p>
                    {coin.usdMarketCap && (
                      <div className="flex items-center text-xs text-gray-300">
                        <DollarSign className="h-3 w-3 mr-0.5" />
                        <span>{coin.usdMarketCap}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Play className="h-4 w-4 mr-1" fill="white" />
                      Watch
                    </Button>
                    <Button size="sm" variant="outline" className="bg-gray-800/70 border-gray-500">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition"
        onClick={() => handleClick("right")}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  )
}
