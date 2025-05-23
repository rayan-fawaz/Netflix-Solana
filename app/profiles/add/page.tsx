"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AddProfilePage() {
  const [name, setName] = useState("")
  const [selectedColor, setSelectedColor] = useState("bg-red-500")

  const colors = [
    { name: "Red", class: "bg-red-500" },
    { name: "Yellow", class: "bg-yellow-500" },
    { name: "Green", class: "bg-green-500" },
    { name: "Blue", class: "bg-blue-500" },
    { name: "Purple", class: "bg-purple-500" },
    { name: "Pink", class: "bg-pink-500" },
    { name: "Orange", class: "bg-orange-500" },
    { name: "Cyan", class: "bg-cyan-500" },
    { name: "Gray", class: "bg-gray-500" },
  ]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      <div className="w-full max-w-screen-lg px-4 py-8">
        <div className="flex justify-center mb-8">
          <h1 className="text-red-600 font-bold text-4xl">NETFLIX.FUN</h1>
        </div>

        <div className="flex flex-col items-center mt-8 max-w-md mx-auto">
          <div className="w-full flex items-center mb-8">
            <Link href="/profiles">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h2 className="text-3xl font-medium">Add Profile</h2>
          </div>

          <div className="w-full border-t border-b border-gray-800 py-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div
                className={`w-32 h-32 rounded-md overflow-hidden ${selectedColor} relative flex items-center justify-center`}
              >
                <div className="w-24 h-24 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="35" r="15" fill="black" />
                    <circle cx="35" cy="35" r="5" fill="white" />
                    <circle cx="65" cy="35" r="5" fill="white" />
                    <path d="M 30 60 Q 50 80 70 60" stroke="black" strokeWidth="5" fill="none" />
                  </svg>
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-6">
                  <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-800 border-none text-white"
                  />
                </div>

                <div>
                  <p className="text-gray-400 mb-2">Profile Color</p>
                  <div className="grid grid-cols-3 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.class}
                        className={`w-full h-10 rounded ${color.class} ${
                          selectedColor === color.class ? "ring-4 ring-white" : ""
                        }`}
                        onClick={() => setSelectedColor(color.class)}
                        aria-label={`Select ${color.name} color`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/profiles">
              <Button variant="outline" className="border-gray-600 text-gray-400 hover:text-white hover:border-white">
                Cancel
              </Button>
            </Link>
            <Link href="/profiles">
              <Button className="bg-red-600 hover:bg-red-700" disabled={!name.trim()}>
                Save
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
