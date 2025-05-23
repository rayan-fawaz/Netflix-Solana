"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"

interface IpfsImageProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined
  fallbackSrc?: string
}

export default function IpfsImage({
  src,
  fallbackSrc = "/placeholder.svg?height=400&width=600",
  alt,
  ...props
}: IpfsImageProps) {
  const [imageUrl, setImageUrl] = useState<string>(fallbackSrc)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!src) {
      setImageUrl(fallbackSrc)
      setLoading(false)
      return
    }

    // If it's already a regular HTTP URL, use it directly
    if (src.startsWith("http://") || src.startsWith("https://")) {
      setImageUrl(src)
      setLoading(false)
      return
    }

    // For IPFS URLs, just use the fallback to avoid CORS issues
    setImageUrl(fallbackSrc)
    setLoading(false)
  }, [src, fallbackSrc])

  const handleImageError = () => {
    console.error("Image failed to load:", imageUrl)
    setError(true)
    setImageUrl(fallbackSrc)
  }

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full bg-gray-900">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <Image src={imageUrl || "/placeholder.svg"} alt={alt || "Image"} {...props} onError={handleImageError} />
      )}
    </>
  )
}
