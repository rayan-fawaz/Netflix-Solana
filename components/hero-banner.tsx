"use client"
import { Info, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroBannerProps {
  title: string
  description: string
  imageUrl: string
  coinSymbol: string
  marketCap: string
  priceChange: string
}

export default function HeroBanner({
  title,
  description,
  imageUrl,
  coinSymbol,
  marketCap,
  priceChange,
}: HeroBannerProps) {
  return (
    <div className="relative h-[85vh] w-full">
      {/* Background Image */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="relative h-full w-full">
          {/* Use a div with background image for better reliability */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }}></div>

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-4 md:px-16 pb-20 pt-32">
        <div className="max-w-lg">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{title}</h1>

          <div className="flex items-center space-x-4 mb-4 text-sm">
            <span className="text-green-500 font-medium">{priceChange}</span>
            <span className="text-gray-400">{coinSymbol}</span>
            <span className="text-gray-400">Market Cap: {marketCap}</span>
          </div>

          <p className="text-lg text-gray-200 mb-6">{description}</p>

          <div className="flex space-x-4">
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
              <Info className="mr-2 h-5 w-5" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
