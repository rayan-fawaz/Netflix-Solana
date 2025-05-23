import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import SolanaPrice from "@/components/solana-price"

const inter = Inter({ subsets: ["latin"] })

// Update the metadata title
export const metadata: Metadata = {
  title: "NETFLIX.FUN - Streaming Platform for Meme Coins",
  description: "A Netflix-style streaming platform for cryptocurrency meme coins",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        {children}
        <SolanaPrice />
      </body>
    </html>
  )
}
