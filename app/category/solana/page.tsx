import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

export default function SolanaPage() {
  const solanaCoins = [
    {
      id: "dbhzjrkg5jfunupn4cxuzidt2kmsewmdjnzgrmgipnwn",
      name: "PUMP Token",
      symbol: "PUMP",
      imageUrl: "/placeholder.svg?height=400&width=600",
      priceChange: "+67.2%",
      marketCap: "$1.2M",
      volume24h: "$450K",
    },
    {
      id: "8oosbx7jJrZxm5m4ThKhBpvwwG4QpoAe6i4GiG19pump",
      name: "GiG19 PUMP",
      symbol: "GIG19",
      imageUrl: "/placeholder.svg?height=400&width=600",
      priceChange: "+42.8%",
      marketCap: "$890K",
      volume24h: "$320K",
    },
    {
      id: "B91Nyc6SnWqr5DRR34eEMKuZrWh4zBhW9VhX4UNLpump",
      name: "UNL PUMP",
      symbol: "UNLP",
      imageUrl: "/placeholder.svg?height=400&width=600",
      priceChange: "+103.5%",
      marketCap: "$2.1M",
      volume24h: "$780K",
    },
    {
      id: "5HV956n7UQT1XdJzv43fHPocest5YAmi9ipsuiJx7zt7",
      name: "Solana X",
      symbol: "SOLX",
      imageUrl: "/placeholder.svg?height=400&width=600",
      priceChange: "+89.4%",
      marketCap: "$1.8M",
      volume24h: "$650K",
    },
    {
      id: "8BtoThi2ZoXnF7QQK1Wjmh2JuBw9FjVvhnGMVZ2vpump",
      name: "MV2V PUMP",
      symbol: "MV2V",
      imageUrl: "/placeholder.svg?height=400&width=600",
      priceChange: "+54.3%",
      marketCap: "$1.5M",
      volume24h: "$420K",
    },
    {
      id: "DitHyRMQiSDhn5cnKMJV2CDDt6sVct96YrECiM49pump",
      name: "CiM49 PUMP",
      symbol: "CIM49",
      imageUrl: "/placeholder.svg?height=400&width=600",
      priceChange: "+76.1%",
      marketCap: "$1.3M",
      volume24h: "$510K",
    },
    {
      id: "FtUEW73K6vEYHfbkfpdBZfWpxgQar2HipGdbutEhpump",
      name: "butEh PUMP",
      symbol: "BUTEH",
      imageUrl: "/placeholder.svg?height=400&width=600",
      priceChange: "+38.7%",
      marketCap: "$950K",
      volume24h: "$280K",
    },
    {
      id: "C3DwDjT17gDvvCYC2nsdGHxDHVmQRdhKfpAdqQ29pump",
      name: "Q29 PUMP",
      symbol: "Q29P",
      imageUrl: "/placeholder.svg?height=400&width=600",
      priceChange: "+92.5%",
      marketCap: "$1.7M",
      volume24h: "$630K",
    },
    {
      id: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump",
      name: "Qbg PUMP",
      symbol: "QBGP",
      imageUrl: "/placeholder.svg?height=400&width=600",
      priceChange: "+61.8%",
      marketCap: "$1.1M",
      volume24h: "$390K",
    },
  ]

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
          <h1 className="text-3xl font-bold">Solana Pumps 🚀</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solanaCoins.map((coin) => (
            <Link key={coin.id} href={`/coin/${coin.id}`} className="block">
              <div className="bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-600 transition-all duration-300">
                <div className="relative h-48">
                  <Image src={coin.imageUrl || "/placeholder.svg"} alt={coin.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{coin.name}</h3>
                      <span className="text-green-500 font-medium">{coin.priceChange}</span>
                    </div>
                    <p className="text-gray-400">{coin.symbol}</p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Market Cap</p>
                    <p className="font-medium">{coin.marketCap}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">24h Volume</p>
                    <p className="font-medium">{coin.volume24h}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
