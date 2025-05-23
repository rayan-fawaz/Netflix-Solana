"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Info, Play, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"

interface Coin {
  id: string
  name: string
  symbol: string
  imageUrl: string
  priceChange: string
  usdMarketCap?: string
}

interface CoinRowProps {
  coins: Coin[]
}

export default function CoinRow({ coins }: CoinRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [isMoved, setIsMoved] = useState(false)

  const handleClick = (direction: "left" | "right") => {
    setIsMoved(true)

    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2

      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
    }
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
                  src={coin.imageUrl || "/placeholder.svg"}
                  alt={coin.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-300" />

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
