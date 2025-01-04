"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(0)

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-[4/3] max-h-[400px] overflow-hidden rounded-lg">
        <Image
          src={images[activeImage]}
          alt={`${productName} main view`}
          width={400}
          height={300}
          className="h-full w-full object-contain transition-all duration-300"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={cn(
              "aspect-square h-20 w-20 overflow-hidden rounded-lg border-2 transition-all",
              activeImage === idx 
                ? "border-primary ring-2 ring-primary ring-offset-2" 
                : "border-transparent hover:border-gray-200"
            )}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${idx + 1}`}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}