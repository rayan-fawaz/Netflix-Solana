"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Play,
  Plus,
  ThumbsUp,
  ExternalLink,
  TrendingUp,
  BarChart3,
  Twitter,
  MessageCircle,
  Clock,
  Globe,
  Copy,
  Check,
  Award,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import CoinRow from "@/components/coin-row"
import IpfsImage from "@/components/ipfs-image"
import { debugImageUrl } from "@/utils/imageUtils"
import { formatNumber, safeNumberFormat } from "@/utils/numberFormat"

interface PageProps {
  params: {
    id: string
  }
}

interface CoinData {
  id: string
  name: string
  symbol: string
  description: string
  marketCap: string
  usdMarketCap: string
  priceChange: string
  imageUrl: string
  thumbnailUrl: string
  creator: string
  createdTimestamp: number
  launchTime: string
  category: string
  rating: string
  price: string
  volume: {
    h24: string
    h6: string
    h1: string
    m5: string
  }
  priceChanges: {
    h24: string
    h6: string
    h1: string
    m5: string
  }
  athPrice?: string
  twitter?: string
  telegram?: string
  website?: string
  discord?: string
}

interface DexData {
  volume_24h: number
  volume_6h: number
  volume_1h: number
  volume_5m: number
  price_change_24h: number
  price_change_6h: number
  price_change_1h: number
  price_change_5m: number
  ath_price: number | string
  current_price: number | string
  liquidity: number
  fdv: number
  pairAddress: string
  dexId: string
  url: string
}

export default function CoinPage({ params }: PageProps) {
  const [coinData, setCoinData] = useState<CoinData | null>(null)
  const [dexData, setDexData] = useState<DexData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [notFound, setNotFound] = useState(false)

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

  // Function to copy mint address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Fetch DexScreener data
  const fetchDexData = async (mintAddress: string) => {
    try {
      const response = await fetch(`/api/coins/dexscreener/${mintAddress}`)
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success && data.data) {
        console.log("DexScreener data:", data.data)
        setDexData(data.data)

        // Update coin data with DexScreener information
        setCoinData((prevData) => {
          if (!prevData) return prevData

          return {
            ...prevData,
            price: data.data.current_price ? safeNumberFormat(data.data.current_price) : prevData.price,
            athPrice: data.data.ath_price ? safeNumberFormat(data.data.ath_price) : undefined,
            priceChanges: {
              h24:
                data.data.price_change_24h !== undefined
                  ? `${data.data.price_change_24h > 0 ? "+" : ""}${safeNumberFormat(data.data.price_change_24h, 2)}%`
                  : prevData.priceChanges.h24,
              h6:
                data.data.price_change_6h !== undefined
                  ? `${data.data.price_change_6h > 0 ? "+" : ""}${safeNumberFormat(data.data.price_change_6h, 2)}%`
                  : prevData.priceChanges.h6,
              h1:
                data.data.price_change_1h !== undefined
                  ? `${data.data.price_change_1h > 0 ? "+" : ""}${safeNumberFormat(data.data.price_change_1h, 2)}%`
                  : prevData.priceChanges.h1,
              m5:
                data.data.price_change_5m !== undefined
                  ? `${data.data.price_change_5m > 0 ? "+" : ""}${safeNumberFormat(data.data.price_change_5m, 2)}%`
                  : prevData.priceChanges.m5,
            },
            volume: {
              h24: data.data.volume_24h !== undefined ? `${formatNumber(data.data.volume_24h)}` : prevData.volume.h24,
              h6: data.data.volume_6h !== undefined ? `${formatNumber(data.data.volume_6h)}` : prevData.volume.h6,
              h1: data.data.volume_1h !== undefined ? `${formatNumber(data.data.volume_1h)}` : prevData.volume.h1,
              m5: data.data.volume_5m !== undefined ? `${formatNumber(data.data.volume_5m)}` : prevData.volume.m5,
            },
          }
        })
      }
    } catch (error) {
      console.error("Error fetching DexScreener data:", error)
    }
  }

  // Create a function to set fallback data
  const setFallbackData = () => {
    console.log("Setting fallback data for coin:", params.id)

    // Create a display name from the ID
    let displayName = params.id
    if (displayName.length > 12) {
      displayName = displayName.substring(0, 8) + "..." + displayName.substring(displayName.length - 4)
    }

    setCoinData({
      id: params.id,
      name: displayName,
      symbol: params.id.substring(0, 4).toUpperCase(),
      description:
        "Information about this coin is currently unavailable. This Solana token may be new or not yet widely tracked.",
      marketCap: "",
      usdMarketCap: "",
      priceChange: "0%",
      imageUrl: "/placeholder.svg?height=600&width=1200",
      thumbnailUrl: "/placeholder.svg?height=600&width=1200",
      creator: "Unknown",
      createdTimestamp: Date.now() - 86400000, // 1 day ago
      launchTime: "Unknown",
      category: "Unknown",
      rating: "Unrated",
      price: "",
      volume: {
        h24: "",
        h6: "",
        h1: "",
        m5: "",
      },
      priceChanges: {
        h24: "0%",
        h6: "0%",
        h1: "0%",
        m5: "0%",
      },
      twitter: undefined,
      telegram: undefined,
      website: undefined,
      discord: undefined,
    })

    setNotFound(true)
    setLoading(false)
  }

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        // Check if the ID starts with "unknown-" and handle it specially
        if (params.id.startsWith("unknown-")) {
          console.log("Unknown coin ID detected:", params.id)
          setFallbackData()
          return
        }

        // Try to fetch from the Pump.fun top-runners API first
        let foundCoin = false
        console.log("Fetching from Pump.fun top-runners API...")

        try {
          const pumpFunResponse = await fetch("/api/coins/pumpfun-originals")

          if (pumpFunResponse.ok) {
            const pumpFunData = await pumpFunResponse.json()
            const pumpFunCoinsData = Array.isArray(pumpFunData) ? pumpFunData : pumpFunData.data || []
            const pumpFunCoin = pumpFunCoinsData.find((c: any) => {
              // Check if the coin is directly in the object or nested in a 'coin' property
              const coinData = c.coin || c
              return coinData.mint === params.id
            })

            if (pumpFunCoin) {
              console.log("Found coin in Pump.fun top-runners:", pumpFunCoin)
              // Extract the coin data, handling both direct and nested structures
              const coinData = pumpFunCoin.coin || pumpFunCoin
              const minutesSinceCreation = getMinutesSinceCreation(coinData.created_timestamp || Date.now())
              const timeAgo = formatTimeAgo(minutesSinceCreation)

              // Debug the image URL
              debugImageUrl(coinData.image_uri)

              setCoinData({
                id: coinData.mint,
                name: coinData.name,
                symbol: coinData.symbol,
                description:
                  coinData.description || pumpFunCoin.description || "A popular Solana meme coin on Pump.fun",
                marketCap: coinData.market_cap ? `${formatNumber(coinData.market_cap)}` : "N/A",
                usdMarketCap: coinData.usd_market_cap ? `${formatNumber(coinData.usd_market_cap)}` : "N/A",
                priceChange: coinData.price_change_24h
                  ? `${coinData.price_change_24h > 0 ? "+" : ""}${safeNumberFormat(coinData.price_change_24h, 2)}%`
                  : "N/A",
                // Store the original image URL
                imageUrl: coinData.image_uri || "/placeholder.svg?height=600&width=1200",
                thumbnailUrl: coinData.image_uri || "/placeholder.svg?height=600&width=1200",
                creator: coinData.creator || "Anonymous",
                createdTimestamp: coinData.created_timestamp,
                launchTime: timeAgo,
                category: "Pump.fun Top Runner",
                rating: "98% Match",
                price: coinData.price ? safeNumberFormat(coinData.price) : "N/A",
                volume: {
                  h24: coinData.volume_24h ? `${formatNumber(coinData.volume_24h)}` : "N/A",
                  h6: coinData.volume?.h6 ? `${formatNumber(coinData.volume.h6)}` : "N/A",
                  h1: coinData.volume?.h1 ? `${formatNumber(coinData.volume.h1)}` : "N/A",
                  m5: coinData.volume?.m5 ? `${formatNumber(coinData.volume.m5)}` : "N/A",
                },
                priceChanges: {
                  h24: coinData.price_change_24h
                    ? `${coinData.price_change_24h > 0 ? "+" : ""}${safeNumberFormat(coinData.price_change_24h, 2)}%`
                    : "N/A",
                  h6: coinData.price_change?.h6
                    ? `${coinData.price_change.h6 > 0 ? "+" : ""}${safeNumberFormat(coinData.price_change.h6, 2)}%`
                    : "N/A",
                  h1: coinData.price_change?.h1
                    ? `${coinData.price_change.h1 > 0 ? "+" : ""}${safeNumberFormat(coinData.price_change.h1, 2)}%`
                    : "N/A",
                  m5: coinData.price_change?.m5
                    ? `${coinData.price_change.m5 > 0 ? "+" : ""}${safeNumberFormat(coinData.price_change.m5, 2)}%`
                    : "N/A",
                },
                website: coinData.website,
                twitter: coinData.twitter,
                telegram: coinData.telegram,
                discord: coinData.discord,
              })

              // After setting initial coin data, fetch DexScreener data
              await fetchDexData(coinData.mint)
              foundCoin = true
              setLoading(false)
              return
            }
          }
        } catch (error) {
          console.error("Error fetching from Pump.fun top-runners API:", error)
        }

        // If not found in Pump.fun top-runners, try to fetch from the live coins API
        if (!foundCoin) {
          console.log("Fetching from Live coins API...")

          try {
            const liveResponse = await fetch("/api/coins/live")

            if (liveResponse.ok) {
              const liveData = await liveResponse.json()
              const liveCoinsData = Array.isArray(liveData) ? liveData : liveData.data || []
              const liveCoin = liveCoinsData.find((c: any) => c.mint === params.id)

              if (liveCoin) {
                console.log("Found coin in live coins:", liveCoin)
                const minutesSinceCreation = getMinutesSinceCreation(liveCoin.created_timestamp || Date.now())
                const timeAgo = formatTimeAgo(minutesSinceCreation)

                // Debug the image URL
                debugImageUrl(liveCoin.image_uri)

                setCoinData({
                  id: liveCoin.mint,
                  name: liveCoin.name,
                  symbol: liveCoin.symbol,
                  description:
                    liveCoin.description ||
                    "This popular Solana meme coin has taken the crypto world by storm with its community-driven approach and viral appeal.",
                  marketCap: liveCoin.market_cap ? `${formatNumber(liveCoin.market_cap)}` : "N/A",
                  usdMarketCap: liveCoin.usd_market_cap ? `${formatNumber(liveCoin.usd_market_cap)}` : "N/A",
                  priceChange: liveCoin.price_change_24h
                    ? `${liveCoin.price_change_24h > 0 ? "+" : ""}${safeNumberFormat(liveCoin.price_change_24h, 2)}%`
                    : "N/A",
                  // Store the original image URL
                  imageUrl: liveCoin.image_uri || "/placeholder.svg?height=600&width=1200",
                  thumbnailUrl: liveCoin.image_uri || liveCoin.thumbnail || "/placeholder.svg?height=600&width=1200",
                  creator: liveCoin.creator || "Anonymous",
                  createdTimestamp: liveCoin.created_timestamp,
                  launchTime: timeAgo,
                  category: "Live Coin",
                  rating: "98% Match",
                  price: liveCoin.price ? safeNumberFormat(liveCoin.price) : "N/A",
                  volume: {
                    h24: liveCoin.volume_24h ? `${formatNumber(liveCoin.volume_24h)}` : "N/A",
                    h6: "N/A",
                    h1: "N/A",
                    m5: "N/A",
                  },
                  priceChanges: {
                    h24: liveCoin.price_change_24h
                      ? `${liveCoin.price_change_24h > 0 ? "+" : ""}${safeNumberFormat(liveCoin.price_change_24h, 2)}%`
                      : "N/A",
                    h6: "N/A",
                    h1: "N/A",
                    m5: "N/A",
                  },
                  website: liveCoin.website,
                  twitter: liveCoin.twitter,
                  telegram: liveCoin.telegram,
                  discord: liveCoin.discord,
                })

                // After setting initial coin data, fetch DexScreener data
                await fetchDexData(liveCoin.mint)
                foundCoin = true
                setLoading(false)
                return
              }
            }
          } catch (error) {
            console.error("Error fetching from Live coins API:", error)
          }
        }

        // If not found in either API, try to fetch from the featured coins API
        if (!foundCoin) {
          console.log("Fetching from Featured coins API...")

          try {
            const featuredResponse = await fetch("/api/coins/featured")

            if (featuredResponse.ok) {
              const featuredData = await featuredResponse.json()
              const featuredCoinsData = Array.isArray(featuredData) ? featuredData : featuredData.data || []
              const featuredCoin = featuredCoinsData.find((c: any) => c.mint === params.id)

              if (featuredCoin) {
                console.log("Found coin in featured coins:", featuredCoin)
                const minutesSinceCreation = getMinutesSinceCreation(featuredCoin.created_timestamp || Date.now())
                const timeAgo = formatTimeAgo(minutesSinceCreation)

                // Debug the image URL
                debugImageUrl(featuredCoin.image_uri)

                setCoinData({
                  id: featuredCoin.mint,
                  name: featuredCoin.name,
                  symbol: featuredCoin.symbol,
                  description:
                    featuredCoin.description ||
                    "This featured Solana meme coin has been selected for its potential and community engagement.",
                  marketCap: featuredCoin.market_cap ? `${formatNumber(featuredCoin.market_cap)}` : "N/A",
                  usdMarketCap: featuredCoin.usd_market_cap ? `${formatNumber(featuredCoin.usd_market_cap)}` : "N/A",
                  priceChange: featuredCoin.price_change_24h
                    ? `${featuredCoin.price_change_24h > 0 ? "+" : ""}${safeNumberFormat(featuredCoin.price_change_24h, 2)}%`
                    : "N/A",
                  // Store the original image URL
                  imageUrl: featuredCoin.image_uri || "/placeholder.svg?height=600&width=1200",
                  thumbnailUrl:
                    featuredCoin.image_uri || featuredCoin.thumbnail || "/placeholder.svg?height=600&width=1200",
                  creator: featuredCoin.creator || "Anonymous",
                  createdTimestamp: featuredCoin.created_timestamp,
                  launchTime: timeAgo,
                  category: "Featured Coin",
                  rating: "95% Match",
                  price: featuredCoin.price ? safeNumberFormat(featuredCoin.price) : "N/A",
                  volume: {
                    h24: featuredCoin.volume_24h ? `${formatNumber(featuredCoin.volume_24h)}` : "N/A",
                    h6: "N/A",
                    h1: "N/A",
                    m5: "N/A",
                  },
                  priceChanges: {
                    h24: featuredCoin.price_change_24h
                      ? `${featuredCoin.price_change_24h > 0 ? "+" : ""}${safeNumberFormat(featuredCoin.price_change_24h, 2)}%`
                      : "N/A",
                    h6: "N/A",
                    h1: "N/A",
                    m5: "N/A",
                  },
                  website: featuredCoin.website,
                  twitter: featuredCoin.twitter,
                  telegram: featuredCoin.telegram,
                  discord: featuredCoin.discord,
                })

                // After setting initial coin data, fetch DexScreener data
                await fetchDexData(featuredCoin.mint)
                foundCoin = true
                setLoading(false)
                return
              }
            }
          } catch (error) {
            console.error("Error fetching from Featured coins API:", error)
          }
        }

        // If not found in any API, use fallback data
        if (!foundCoin) {
          console.log("Coin not found in any data source, using fallback data")
          setFallbackData()
        }
      } catch (error) {
        console.error("Error fetching coin data:", error)
        // Use fallback data in case of any error
        setFallbackData()
      }
    }

    fetchCoinData()
  }, [params.id])

  const similarCoins = [
    {
      id: "shib",
      name: "Shiba Inu",
      symbol: "SHIB",
      imageUrl: "/placeholder.svg?height=400&width=600",
      priceChange: "+12.5%",
    },
    {
      id: "pepe",
      name: "Pepe",
      symbol: "PEPE",
      imageUrl: "/placeholder.svg?height=400&width=600",
      priceChange: "+8.3%",
    },
    {
      id: "floki",
      name: "Floki Inu",
      symbol: "FLOKI",
      imageUrl: "/placeholder.svg?height=400&width=600",
      priceChange: "+15.7%",
    },
    {
      id: "bonk",
      name: "Bonk",
      symbol: "BONK",
      imageUrl: "/placeholder.svg?height=400&width=600",
      priceChange: "+22.1%",
    },
    {
      id: "wojak",
      name: "Wojak",
      symbol: "WOJAK",
      imageUrl: "/placeholder.svg?height=400&width=600",
      priceChange: "+15.8%",
    },
  ]

  if (loading || !coinData) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="relative pt-16">
        {/* Hero Section */}
        <div className="relative h-[70vh] w-full">
          <IpfsImage
            src={coinData.thumbnailUrl || coinData.imageUrl}
            alt={coinData.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

          <Link href="/" className="absolute top-6 left-6 z-10">
            <Button variant="ghost" size="icon" className="rounded-full bg-black/50 hover:bg-black/70">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <div className="absolute bottom-0 left-0 p-6 md:p-16 max-w-2xl">
            <div className="text-sm text-green-500 font-medium mb-2">{coinData.rating}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{coinData.name}</h1>

            <div className="flex items-center space-x-4 mb-4 text-sm">
              <span className="text-green-500 font-medium">{coinData.priceChanges?.h24 || coinData.priceChange}</span>
              <span className="text-gray-400">{coinData.symbol}</span>
              <span className="text-gray-400">Market Cap: {coinData.usdMarketCap}</span>
              <span className="text-gray-400">Created: {coinData.launchTime}</span>
            </div>

            <div className="flex space-x-4 mb-6">
              <a
                href={`https://pump.fun/coin/${coinData.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                onClick={(e) => {
                  // Prevent default only if needed for debugging
                  // e.preventDefault();
                  console.log("Opening trade URL:", `https://pump.fun/coin/${coinData.id}`)
                }}
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

            <p className="text-lg text-gray-200">{coinData.description}</p>

            {notFound && (
              <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-600/40 rounded-md">
                <p className="text-yellow-400">
                  This token was not found in our database. The information shown may be limited.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mint Address Section */}
        <div className="px-6 md:px-16 py-8 bg-gray-900/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-gray-400 mb-1">Mint Address</h3>
              <div className="flex items-center">
                <p className="break-all mr-2">{coinData.id}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => copyToClipboard(coinData.id)}
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {coinData.website && (
                <a
                  href={coinData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white bg-gray-800/50 px-4 py-2 rounded-md"
                >
                  <Globe className="h-4 w-4 mr-2" />
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
                  <Twitter className="h-4 w-4 mr-2" />
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
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Telegram
                </a>
              )}
              {coinData.discord && (
                <a
                  href={coinData.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white bg-gray-800/50 px-4 py-2 rounded-md"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Discord
                </a>
              )}
              <a
                href={`https://solscan.io/token/${coinData.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white bg-gray-800/50 px-4 py-2 rounded-md"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Solscan
              </a>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="px-6 md:px-16 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-gray-400 mb-1">Creator</h3>
            <p className="break-all">{coinData.creator}</p>
          </div>
          <div>
            <h3 className="text-gray-400 mb-1">Created</h3>
            <p>{coinData.launchTime}</p>
          </div>
          <div>
            <h3 className="text-gray-400 mb-1">Category</h3>
            <p>{coinData.category}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-6 md:px-16 py-8 bg-gray-900/50">
          <h2 className="text-xl font-medium mb-6">Token Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <BarChart3 className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-gray-400">Market Cap (USD)</h3>
              </div>
              <p className="text-xl font-bold">
                {coinData.usdMarketCap !== "N/A" ? coinData.usdMarketCap : coinData.marketCap}
              </p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-gray-400">24h Change</h3>
              </div>
              <p className="text-xl font-bold text-green-500">{coinData.priceChanges?.h24 || coinData.priceChange}</p>
            </div>
            {coinData.volume?.h24 && coinData.volume.h24 !== "N/A" && (
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <BarChart3 className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="text-gray-400">24h Volume</h3>
                </div>
                <p className="text-xl font-bold">{coinData.volume.h24}</p>
              </div>
            )}
          </div>
        </div>

        {/* All-Time High Section */}
        {coinData.usdMarketCap && coinData.usdMarketCap !== "N/A" && (
          <div className="px-6 md:px-16 py-8">
            <div className="bg-gray-800/30 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Award className="h-6 w-6 text-yellow-500 mr-2" />
                <h2 className="text-xl font-medium">Market Cap</h2>
              </div>
              <p className="text-2xl font-bold text-yellow-500">
                {coinData.usdMarketCap !== "N/A" ? coinData.usdMarketCap : coinData.marketCap}
              </p>
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="px-6 md:px-16 py-8">
          <h2 className="text-xl font-medium mb-4">About {coinData.name}</h2>
          <div className="bg-gray-800/30 p-6 rounded-lg">
            <p className="text-gray-200 leading-relaxed">{coinData.description}</p>
          </div>
        </div>

        {/* Price Change Timeframes */}
        {coinData.priceChanges && !notFound && (
          <div className="px-6 md:px-16 py-8">
            <h2 className="text-xl font-medium mb-6">Price Changes</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {coinData.priceChanges.m5 && coinData.priceChanges.m5 !== "N/A" && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="text-gray-400">5 Minutes</h3>
                  </div>
                  <p
                    className={`text-xl font-bold ${
                      coinData.priceChanges.m5.startsWith("+") ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {coinData.priceChanges.m5}
                  </p>
                </div>
              )}
              {coinData.priceChanges.h1 && coinData.priceChanges.h1 !== "N/A" && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="text-gray-400">1 Hour</h3>
                  </div>
                  <p
                    className={`text-xl font-bold ${
                      coinData.priceChanges.h1.startsWith("+") ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {coinData.priceChanges.h1}
                  </p>
                </div>
              )}
              {coinData.priceChanges.h6 && coinData.priceChanges.h6 !== "N/A" && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="text-gray-400">6 Hours</h3>
                  </div>
                  <p
                    className={`text-xl font-bold ${
                      coinData.priceChanges.h6.startsWith("+") ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {coinData.priceChanges.h6}
                  </p>
                </div>
              )}
              {coinData.priceChanges.h24 && coinData.priceChanges.h24 !== "N/A" && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="text-gray-400">24 Hours</h3>
                  </div>
                  <p
                    className={`text-xl font-bold ${
                      coinData.priceChanges.h24.startsWith("+") ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {coinData.priceChanges.h24}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Similar Coins */}
        <div className="px-6 md:px-16 py-8">
          <h2 className="text-xl font-medium mb-4">More Like This</h2>
          <CoinRow coins={similarCoins} />
        </div>
      </div>
    </div>
  )
}
