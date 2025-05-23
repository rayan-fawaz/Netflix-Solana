"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

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

export default function LiveCoinsPage() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    const fetchLiveCoins = async () => {
      try {
        // Use our internal API route instead of the external API directly
        const response = await fetch("/api/coins/live")

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Live coins page data structure:", data)

        // Check if data is an array directly (from our mock data) or if it has a data property
        const coinsData = Array.isArray(data) ? data : data.data || []

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
              : "N/A",
            marketCap: coin.market_cap ? `${formatNumber(coin.market_cap)}` : "N/A",
            usdMarketCap: coin.usd_market_cap ? `${formatNumber(coin.usd_market_cap)}` : "N/A",
            volume: coin.volume_24h ? `${formatNumber(coin.volume_24h)}` : "N/A",
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
          <div className="flex items-center">
            <h1 className="text-3xl font-bold">Live Now</h1>
            <span className="ml-3 px-2 py-0.5 text-xs font-medium bg-red-600 rounded-sm animate-pulse">LIVE</span>
          </div>
        </div>

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
                    <Image
                      src={coin.thumbnailUrl || coin.imageUrl || "/placeholder.svg"}
                      alt={coin.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium bg-red-600 rounded-sm animate-pulse">
                      LIVE
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
                    {coin.usdMarketCap && (
                      <div>
                        <p className="text-sm text-gray-400">Market Cap (USD)</p>
                        <p className="font-medium">{coin.usdMarketCap}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-400">Created</p>
                      <p className="font-medium">{coin.launchTime}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
