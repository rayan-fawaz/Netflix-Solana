"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { debugImageUrl } from "@/utils/imageUtils"
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
  volume: string
}

export default function FeaturedCoinsPage() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)

  // Update the useEffect function to handle raw data from the API
  useEffect(() => {
    const fetchFeaturedCoins = async () => {
      try {
        console.log("FeaturedCoinsPage: Fetching featured coins...")
        // Use our internal API route instead of the external API directly
        const response = await fetch("/api/coins/featured")

        if (!response.ok) {
          console.error("FeaturedCoinsPage: API response not OK:", response.status)
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()
        console.log("FeaturedCoinsPage: Featured coins data received:", data)

        // Check if data is an array directly (from our mock data) or if it has a data property
        const coinsData = Array.isArray(data) ? data : data.data || []
        console.log("FeaturedCoinsPage: Extracted coins data length:", coinsData.length)

        if (coinsData.length === 0) {
          console.warn("FeaturedCoinsPage: No featured coins data found, using fallback data")
          // Instead of throwing an error, use fallback data directly
          setCoins(getFallbackCoins())
          setLoading(false)
          return
        }

        // Log a sample coin's image URL
        if (coinsData.length > 0) {
          debugImageUrl(coinsData[0].image_uri)
        }

        // Transform the data to match our Coin interface
        const transformedCoins = coinsData.map((coin: any, index: number) => {
          // Just use the raw data fields directly
          return {
            id: coin.mint || coin.id || `unknown-${index}`,
            name: coin.name || `Unknown Coin ${index + 1}`,
            symbol: coin.symbol || "???",
            // Store the original image URL
            imageUrl: coin.image_uri || coin.imageUrl || "/placeholder.svg?height=400&width=600",
            priceChange:
              typeof coin.price_change_24h === "number"
                ? `${coin.price_change_24h > 0 ? "+" : ""}${coin.price_change_24h.toFixed(2)}%`
                : "N/A",
            // Use usd_market_cap instead of market_cap as requested
            marketCap: typeof coin.usd_market_cap === "number" ? `${formatNumber(coin.usd_market_cap)}` : "N/A",
            volume: typeof coin.volume_24h === "number" ? `${formatNumber(coin.volume_24h)}` : "N/A",
          }
        })

        setCoins(transformedCoins)
        setLoading(false)
      } catch (error) {
        console.error("FeaturedCoinsPage: Error fetching featured coins:", error)
        console.log("FeaturedCoinsPage: Falling back to mock data")

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
        volume: "$5K",
      },
      {
        id: "featured2",
        name: "Micro Cap 2",
        symbol: "MC2",
        imageUrl: "/placeholder.svg?height=400&width=600",
        priceChange: "+22.1%",
        marketCap: "$25K",
        volume: "$8K",
      },
      {
        id: "featured3",
        name: "Micro Cap 3",
        symbol: "MC3",
        imageUrl: "/placeholder.svg?height=400&width=600",
        priceChange: "+103.5%",
        marketCap: "$35K",
        volume: "$12K",
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
          <h1 className="text-3xl font-bold">Featured For You</h1>
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
                    <IpfsImage src={coin.imageUrl} alt={coin.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium bg-red-600 rounded-sm">
                      MICRO CAP
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
                    {coin.marketCap && (
                      <div>
                        <p className="text-sm text-gray-400">Market Cap (USD)</p>
                        <p className="font-medium">{coin.marketCap}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-400">24h Volume</p>
                      <p className="font-medium">{coin.volume}</p>
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
