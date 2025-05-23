"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, User, Copy, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText("2M2bJXedS3kpk9LabvJ7C4mcmgjZzUJMrK1J9QQCpump")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"}`}
    >
      <div className="flex items-center justify-between px-4 md:px-16 py-4">
        <div className="flex items-center space-x-8">
          <Link href="/home" className="flex items-center">
            <h1 className="text-red-600 font-bold text-3xl">NETFLIX.FUN</h1>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link href="/home" className="text-sm font-medium text-white hover:text-gray-300">
              Home
            </Link>
            <Link href="/category/live" className="text-sm font-medium text-gray-300 hover:text-white">
              Live Now
            </Link>
            <Link href="/category/featured" className="text-sm font-medium text-gray-300 hover:text-white">
              Featured
            </Link>
            <Link href="/coin/specific" className="text-sm font-medium text-red-500 hover:text-red-400">
              Featured Coin
            </Link>
            <Link href="/category/trending" className="text-sm font-medium text-gray-300 hover:text-white">
              Trending
            </Link>
            <Link href="/watchlist" className="text-sm font-medium text-gray-300 hover:text-white">
              My Watchlist
            </Link>
            <div className="flex items-center text-sm text-gray-300 hover:text-white">
              <span className="mr-1">CA:</span>
              <button
                onClick={copyToClipboard}
                className="flex items-center text-xs bg-gray-800 rounded px-2 py-1 hover:bg-gray-700 transition-colors"
              >
                <span className="truncate max-w-[100px]">2M2bJXedS3kpk9LabvJ7C4mcmgjZzUJMrK1J9QQCpump</span>
                {copied ? <Check className="h-3 w-3 ml-1 text-green-500" /> : <Copy className="h-3 w-3 ml-1" />}
              </button>
            </div>
          </nav>
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-transparent">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/images/elon.png" />
                  <AvatarFallback>E</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white text-black border-gray-200">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              <Link href="/profiles">
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Switch Profiles
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="hover:bg-gray-100">Profile</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-100">Watchlist</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-100">Account Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem className="hover:bg-gray-100">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
