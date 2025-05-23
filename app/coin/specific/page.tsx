"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Play, Plus, ThumbsUp, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { formatNumber } from "@/utils/numberFormat"

interface CoinData {
  mint: string
  name: string
  symbol: string
  description: string
  image_uri: string
  market_cap: number
  usd_market_cap: number
  price_change_24h: number
  volume_24h: number
  created_timestamp: number
  twitter: string | null
  telegram: string | null
  website: string | null
}

export default function SpecificCoinPage() {
  const [coinData, setCoinData] = useState<CoinData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSpecificCoin = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/coins/specific")

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Specific coin data:", data)

        if (!data || !data.mint) {
          throw new Error("Invalid data received from API")
        }

        setCoinData(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching specific coin:", error)
        setError(error instanceof Error ? error.message : "Failed to load coin data")

        // Use fallback data
        const fallbackData = {
          mint: "2M2bJXedS3kpk9LabvJ7C4mcmgjZzUJMrK1J9QQCpump",
          name: "Netflix.Fun",
          symbol: "Netflix",
          description: "",
          image_uri: "https://ipfs.io/ipfs/QmU7VdkieJN5gVmaTNbxLZffkDHhok39bU5S3Mmkj2SCcy",
          creator: "3JgLppCZVHK3diAQTHZcNptWQwLLS3ZhDzTJTcZYiPk7",
          created_timestamp: Date.now() - 7776000000, // 90 days ago
          market_cap: 49.072545157,
          usd_market_cap: 7330.45679555266,
          price_change_24h: 12.4,
          volume_24h: 3500000,
          twitter: null,
          telegram: "https://t.me/ThreeStoogesLounge",
          website: "https://netflixsolana.com/",
        }
        setCoinData(fallbackData)
      } finally {
        setLoading(false)
      }
    }

    fetchSpecificCoin()
  }, [])

  // Function to format time ago
  const formatTimeAgo = (timestamp: number) => {
    const now = new Date()
    const created = new Date(timestamp)
    const diffMs = now.getTime() - created.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h ago`
    } else {
      return `${diffHours}h ago`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!coinData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="pt-20 px-4 md:px-16 flex flex-col items-center justify-center h-[70vh]">
          <h1 className="text-3xl font-bold mb-4">Coin Not Found</h1>
          <p className="text-gray-400 mb-6">The requested coin information could not be loaded.</p>
          {error && <p className="text-red-400 mb-6">{error}</p>}
          <Link href="/home">
            <Button className="bg-red-600 hover:bg-red-700">Return Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="relative pt-16">
        {/* Hero Section */}
        <div className="relative h-[70vh] w-full">
          {/* Use a div with background image instead of Image component */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${coinData.image_uri})` }}
          ></div>

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

          <Link href="/home" className="absolute top-6 left-6 z-10">
            <Button variant="ghost" size="icon" className="rounded-full bg-black/50 hover:bg-black/70">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <div className="absolute bottom-0 left-0 p-6 md:p-16 max-w-2xl">
            <div className="text-sm text-green-500 font-medium mb-2">Featured Coin</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{coinData.name}</h1>

            <div className="flex items-center space-x-4 mb-4 text-sm">
              <span className="text-green-500 font-medium">
                {coinData.price_change_24h > 0 ? "+" : ""}
                {coinData.price_change_24h.toFixed(2)}%
              </span>
              <span className="text-gray-400">{coinData.symbol}</span>
              <span className="text-gray-400">
                Market Cap: ${formatNumber(coinData.usd_market_cap || coinData.market_cap)}
              </span>
              {coinData.created_timestamp && (
                <span className="text-gray-400">Created: {formatTimeAgo(coinData.created_timestamp)}</span>
              )}
            </div>

            <div className="flex space-x-4 mb-6">
              <a
                href="https://pump.fun/coin/2M2bJXedS3kpk9LabvJ7C4mcmgjZzUJMrK1J9QQCpump"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                <Play className="mr-2 h-5 w-5" fill="white" />
                Trade Now
              </a>
              <Button variant="outline" className="bg-gray-600/30 text-white border-gray-500 hover:bg-gray-700/50">
                <Plus className="mr-2 h-5 w-5" />
                My List
              </Button>
              <Button
                variant="outline"
                className="bg-gray-600/30 text-white border-gray-500 hover:bg-gray-700/50 rounded-full"
              >
                <ThumbsUp className="h-5 w-5" />
              </Button>
            </div>

            <p className="text-lg text-gray-200">
              {coinData.description || "Netflix.Fun - The ultimate Solana meme coin."}
            </p>

            {error && (
              <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-600/40 rounded-md">
                <p className="text-yellow-400">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="px-6 md:px-16 py-8 bg-gray-900/50">
          <div className="flex flex-wrap gap-3">
            {coinData.website && (
              <a
                href={coinData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white bg-gray-800/50 px-4 py-2 rounded-md"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Website
              </a>
            )}
            {coinData.twitter && (
              <a
                href={coinData.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white bg-gray-800/50 px-4 py-2 rounded-md"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                Twitter
              </a>
            )}
            {coinData.telegram && (
              <a
                href={coinData.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white bg-gray-800/50 px-4 py-2 rounded-md"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.269c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.196-2.783 5.056-4.564c.223-.198-.054-.308-.335-.116l-6.243 3.926-2.694-.918c-.585-.187-.594-.585.122-.866l10.5-4.043c.485-.18.911.108 1.084.866z" />
                </svg>
                Telegram
              </a>
            )}
            <a
              href={`https://solscan.io/token/${coinData.mint}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-300 hover:text-white bg-gray-800/50 px-4 py-2 rounded-md"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Solscan
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-6 md:px-16 py-8">
          <h2 className="text-xl font-medium mb-6">Token Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-gray-400 mb-2">Market Cap (USD)</h3>
              <p className="text-xl font-bold">${formatNumber(coinData.usd_market_cap || coinData.market_cap)}</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-gray-400 mb-2">24h Change</h3>
              <p className={`text-xl font-bold ${coinData.price_change_24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                {coinData.price_change_24h > 0 ? "+" : ""}
                {coinData.price_change_24h.toFixed(2)}%
              </p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-gray-400 mb-2">24h Volume</h3>
              <p className="text-xl font-bold">${formatNumber(coinData.volume_24h)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
