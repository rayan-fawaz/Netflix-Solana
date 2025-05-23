import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Navbar from "@/components/navbar"
import HeroBanner from "@/components/hero-banner"
import LiveCoinsRow from "@/components/live-coins-row"
import FeaturedCoinsRow from "@/components/featured-coins-row"
import PumpFunCoinsRow from "@/components/pump-fun-coins-row"
import { formatNumber } from "@/utils/numberFormat"

// Make the component async to fetch data
export default async function HomePage() {
  // Fetch the specific coin data
  let specificCoin = null
  try {
    // Use a relative URL for internal API routes
    const response = await fetch("http://localhost:3000/api/coins/specific", {
      cache: "no-store",
    })

    if (response.ok) {
      specificCoin = await response.json()
      console.log("Specific coin data fetched:", specificCoin)
    } else {
      console.error("Failed to fetch specific coin data:", response.status, response.statusText)
    }
  } catch (error) {
    console.error("Error fetching specific coin:", error)
  }

  // Use hardcoded data if the API call fails
  if (!specificCoin) {
    specificCoin = {
      mint: "2M2bJXedS3kpk9LabvJ7C4mcmgjZzUJMrK1J9QQCpump",
      name: "Netflix.Fun",
      symbol: "Netflix",
      description: "",
      image_uri: "https://ipfs.io/ipfs/QmU7VdkieJN5gVmaTNbxLZffkDHhok39bU5S3Mmkj2SCcy",
      market_cap: 49.072545157,
      usd_market_cap: 7330.45679555266,
      price_change_24h: 12.4,
      volume_24h: 3500000,
    }
  }

  // Prepare hero banner props with fallback values
  const heroProps = {
    title: specificCoin?.name || "Netflix.Fun",
    description: specificCoin?.description || "The ultimate destination for Solana meme coins.",
    imageUrl: "https://ipfs.io/ipfs/QmU7VdkieJN5gVmaTNbxLZffkDHhok39bU5S3Mmkj2SCcy", // Use the exact IPFS URL
    coinSymbol: specificCoin?.symbol || "Netflix",
    marketCap: specificCoin?.usd_market_cap ? `$${formatNumber(specificCoin.usd_market_cap)}` : "$7.3K",
    priceChange: specificCoin?.price_change_24h
      ? `${specificCoin.price_change_24h > 0 ? "+" : ""}${specificCoin.price_change_24h.toFixed(2)}%`
      : "+12.4%",
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <HeroBanner
          title={heroProps.title}
          description={heroProps.description}
          imageUrl={heroProps.imageUrl}
          coinSymbol={heroProps.coinSymbol}
          marketCap={heroProps.marketCap}
          priceChange={heroProps.priceChange}
        />

        <div className="px-4 md:px-16 pb-20 -mt-32 relative z-10">
          {/* Live Coins Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h2 className="text-xl font-medium">Live Now</h2>
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-600 rounded-sm animate-pulse">LIVE</span>
              </div>
              <Link href="/category/live" className="flex items-center text-sm text-gray-400 hover:text-white">
                See all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <LiveCoinsRow />
          </section>

          {/* Featured Coins Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Featured For You</h2>
              <Link href="/category/featured" className="flex items-center text-sm text-gray-400 hover:text-white">
                See all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <FeaturedCoinsRow />
          </section>

          {/* Pump.fun Coins Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Pump.fun Originals</h2>
              <Link href="/category/pumpfun" className="flex items-center text-sm text-gray-400 hover:text-white">
                See all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <PumpFunCoinsRow />
          </section>
        </div>
      </main>
    </div>
  )
}
