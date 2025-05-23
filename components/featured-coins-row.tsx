"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Info, Play, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import IpfsImage from "@/components/ipfs-image"
import { formatNumber } from "@/utils/numberFormat"

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
  twitter?: string
  telegram?: string
  website?: string
}

export default function FeaturedCoinsRow() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
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
    const fetchFeaturedCoins = async () => {
      try {
        console.log("FeaturedCoinsRow: Fetching featured coins...")
        // Use our internal API route instead of the external API directly
        const response = await fetch("/api/coins/featured")

        if (!response.ok) {
          console.error("FeaturedCoinsRow: API response not OK:", response.status)
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()
        console.log("FeaturedCoinsRow: Featured coins data received:", data)

        // Check if data is an array directly (from our mock data) or if it has a data property
        const coinsData = Array.isArray(data) ? data : data.data || []
        console.log("FeaturedCoinsRow: Extracted coins data length:", coinsData.length)

        if (coinsData.length === 0) {
          console.warn("FeaturedCoinsRow: No featured coins data found, using fallback data")
          // Instead of throwing an error, use fallback data directly
          setCoins(getFallbackCoins())
          setLoading(false)
          return
        }

        // Log a sample coin to see its structure
        if (coinsData.length > 0) {
          console.log("FeaturedCoinsRow: Sample coin structure:", JSON.stringify(coinsData[0]).substring(0, 300))
          // Debug the image URL
          debugImageUrl(coinsData[0].image_uri)
        }

        // Transform the data to match our Coin interface
        const transformedCoins = coinsData.map((coin: any, index: number) => {
          // Add more detailed logging for the first coin
          if (index === 0) {
            console.log("FeaturedCoinsRow: Transforming first coin:", {
              mint: coin.mint,
              id: coin.id,
              name: coin.name,
              symbol: coin.symbol,
              image_uri: coin.image_uri,
              imageUrl: coin.imageUrl,
              price_change_24h: coin.price_change_24h,
              market_cap: coin.market_cap,
              usd_market_cap: coin.usd_market_cap,
              volume_24h: coin.volume_24h,
              created_timestamp: coin.created_timestamp,
            })
          }

          // Use the LiveStreamResponse interface fields
          return {
            id: coin.mint || coin.id || `unknown-${index}`,
            name: coin.name || `Unknown Coin ${index + 1}`,
            symbol: coin.symbol || "???",
            // Store the original image URL
            imageUrl: coin.image_uri || coin.imageUrl || "/placeholder.svg?height=400&width=600",
            priceChange:
              typeof coin.price_change_24h === "number"
                ? `${coin.price_change_24h > 0 ? "+" : ""}${coin.price_change_24h.toFixed(2)}%`
                : "",
            // Use usd_market_cap instead of market_cap as requested
            marketCap: typeof coin.usd_market_cap === "number" ? `${formatNumber(coin.usd_market_cap)}` : "",
            usdMarketCap: typeof coin.usd_market_cap === "number" ? `${formatNumber(coin.usd_market_cap)}` : "",
            volume: typeof coin.volume_24h === "number" ? `${formatNumber(coin.volume_24h)}` : "",
            launchTime: coin.created_timestamp ? formatTimeAgo(getMinutesSinceCreation(coin.created_timestamp)) : "",
            createdTimestamp: coin.created_timestamp || Date.now() - 86400000, // Default to 1 day ago
            twitter: coin.twitter,
            telegram: coin.telegram,
            website: coin.website,
          }
        })

        console.log("FeaturedCoinsRow: Successfully transformed coins, count:", transformedCoins.length)
        setCoins(transformedCoins)
        setLoading(false)
      } catch (error) {
        console.error("FeaturedCoinsRow: Error fetching featured coins:", error)
        console.log("FeaturedCoinsRow: Falling back to mock data")

        // Fallback data in case the API fails
        setCoins(getFallbackCoins())
        setLoading(false)
      }
    }

    fetchFeaturedCoins()
  }, [])

  // Helper function to get fallback coins
  const getFallbackCoins = (): Coin[] => {
    return [
      {
        id: "featured1",
        name: "Micro Cap 1",
        symbol: "MC1",
        imageUrl: "/placeholder.svg?height=400&width=600",
        priceChange: "+42.8%",
        marketCap: "$15K",
        usdMarketCap: "$15K",
        volume: "$5K",
        launchTime: "2 hours ago",
        createdTimestamp: Date.now() - 7200000,
        twitter: "https://twitter.com/microcap1",
        telegram: "https://t.me/microcap1",
        website: "https://microcap1.io",
      },
      {
        id: "featured2",
        name: "Micro Cap 2",
        symbol: "MC2",
        imageUrl: "/placeholder.svg?height=400&width=600",
        priceChange: "+22.1%",
        marketCap: "$25K",
        usdMarketCap: "$25K",
        volume: "$8K",
        launchTime: "5 hours ago",
        createdTimestamp: Date.now() - 18000000,
        twitter: "https://twitter.com/microcap2",
        telegram: "https://t.me/microcap2",
        website: "https://microcap2.io",
      },
      {
        id: "featured3",
        name: "Micro Cap 3",
        symbol: "MC3",
        imageUrl: "/placeholder.svg?height=400&width=600",
        priceChange: "+103.5%",
        marketCap: "$35K",
        usdMarketCap: "$35K",
        volume: "$12K",
        launchTime: "1 hour ago",
        createdTimestamp: Date.now() - 3600000,
        twitter: "https://twitter.com/microcap3",
        telegram: "https://t.me/microcap3",
        website: "https://microcap3.io",
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

                {/* Top Picks badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium bg-red-600 rounded-sm">
                  MICRO CAP
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
