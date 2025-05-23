"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Info, Play, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Coin {
  id: string
  name: string
  symbol: string
  imageUrl: string
  thumbnailUrl: string
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

export default function LiveCoinsRow() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const rowRef = useRef<HTMLDivElement>(null)
  const [isMoved, setIsMoved] = useState(false)

  // Helper function to format numbers (e.g., 1200000 -> 1.2M)
  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + "B"
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  // Function to convert timestamp to minutes elapsed
  const getMinutesSinceCreation = (createdTimestamp: number): number => {
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

  // Update the useEffect to use our new API route instead of directly calling the external API
  useEffect(() => {
    const fetchLiveCoins = async () => {
      try {
        // Use our internal API route instead of the external API directly
        const response = await fetch("/api/coins/live")

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Live coins data structure:", data)

        // Check if data is an array directly (from our mock data) or if it has a data property
        const coinsData = Array.isArray(data) ? data : data.data || []

        if (coinsData.length === 0) {
          console.warn("No live coins data found, using fallback data")
          throw new Error("No live coins data found")
        }

        // Transform the data to match our Coin interface
        const transformedCoins = coinsData.map((coin: any) => {
          const minutesSinceCreation = getMinutesSinceCreation(coin.created_timestamp || Date.now())
          const timeAgo = formatTimeAgo(minutesSinceCreation)

          return {
            id: coin.mint,
            name: coin.name,
            symbol: coin.symbol,
            imageUrl: coin.image_uri || "/placeholder.svg?height=400&width=600",
            thumbnailUrl: coin.thumbnail || "/placeholder.svg?height=400&width=600",
            priceChange: coin.price_change_24h
              ? `${coin.price_change_24h > 0 ? "+" : ""}${coin.price_change_24h.toFixed(2)}%`
              : "",
            marketCap: coin.market_cap ? `${formatNumber(coin.market_cap)}` : "",
            usdMarketCap: coin.usd_market_cap ? `${formatNumber(coin.usd_market_cap)}` : "",
            volume: coin.volume_24h ? `${formatNumber(coin.volume_24h)}` : "",
            launchTime: timeAgo,
            createdTimestamp: coin.created_timestamp,
            twitter: coin.twitter,
            telegram: coin.telegram,
            website: coin.website,
          }
        })

        setCoins(transformedCoins)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching live coins:", error)
        console.log("Falling back to mock data")

        // Fallback data in case the API fails
        setCoins([
          {
            id: "live1",
            name: "PUMP Token",
            symbol: "PUMP",
            imageUrl: "/placeholder.svg?height=400&width=600",
            thumbnailUrl: "/placeholder.svg?height=400&width=600",
            priceChange: "+67.2%",
            marketCap: "$1.2M",
            usdMarketCap: "$1.2M",
            volume: "$450K",
            launchTime: "2 hours ago",
            createdTimestamp: Date.now() - 7200000,
            twitter: "https://twitter.com/pumptoken",
            telegram: "https://t.me/pumptoken",
            website: "https://pump.fun",
          },
          {
            id: "live2",
            name: "Solana Doge",
            symbol: "SOLDOGE",
            imageUrl: "/placeholder.svg?height=400&width=600",
            thumbnailUrl: "/placeholder.svg?height=400&width=600",
            priceChange: "+42.8%",
            marketCap: "$890K",
            usdMarketCap: "$890K",
            volume: "$320K",
            launchTime: "5 hours ago",
            createdTimestamp: Date.now() - 18000000,
            twitter: "https://twitter.com/solanadoge",
            telegram: "https://t.me/solanadoge",
            website: "https://solanadoge.com",
          },
          {
            id: "live3",
            name: "Meme Rocket",
            symbol: "MRKT",
            imageUrl: "/placeholder.svg?height=400&width=600",
            thumbnailUrl: "/placeholder.svg?height=400&width=600",
            priceChange: "+103.5%",
            marketCap: "$2.1M",
            usdMarketCap: "$2.1M",
            volume: "$780K",
            launchTime: "1 hour ago",
            createdTimestamp: Date.now() - 3600000,
            twitter: "https://twitter.com/memerocket",
            telegram: "https://t.me/memerocket",
            website: "https://memerocket.io",
          },
        ])
        setLoading(false)
      }
    }

    fetchLiveCoins()
  }, [])

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
                <Image
                  src={coin.thumbnailUrl || coin.imageUrl || "/placeholder.svg?height=400&width=600"}
                  alt={coin.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-300" />

                {/* LIVE badge */}
                <div className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium bg-red-600 rounded-sm animate-pulse">
                  LIVE
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
