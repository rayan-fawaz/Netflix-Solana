"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DebugImage({ url }: { url: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  const checkImage = () => {
    setIsVisible(true)
    setStatus("loading")

    const img = new Image()
    img.onload = () => setStatus("success")
    img.onerror = () => setStatus("error")
    img.src = url
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 p-4 rounded-lg shadow-lg">
      <Button onClick={checkImage} variant="outline" size="sm">
        Debug Image
      </Button>

      {isVisible && (
        <div className="mt-2">
          <p className="text-xs break-all mb-1">URL: {url}</p>
          <p className="text-xs">
            Status:
            {status === "loading" && <span className="text-yellow-500"> Loading...</span>}
            {status === "success" && <span className="text-green-500"> Valid</span>}
            {status === "error" && <span className="text-red-500"> Invalid</span>}
          </p>
        </div>
      )}
    </div>
  )
}
