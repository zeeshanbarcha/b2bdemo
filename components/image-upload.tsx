"use client"

import { useState } from "react"
import { ImagePlus, Trash, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"

interface ImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  maxImages?: number
}

export function ImageUpload({ value, onChange, maxImages = 5 }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    e.target.value = ''

    // Check if adding these files would exceed the limit
    if (value.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images`)
      return
    }

    // Validate each file
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`)
        return false
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`)
        return false
      }
      return true
    })

    if (!validFiles.length) return

    try {
      setLoading(true)
      const uploadPromises = validFiles.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData
          })

          if (!response.ok) {
            throw new Error(await response.text())
          }

          const data = await response.json()
          if (!data.url) {
            throw new Error("No URL returned from upload")
          }

          return data.url
        } catch (error) {
          toast.error(`Failed to upload ${file.name}`)
          return null
        }
      })

      const urls = (await Promise.all(uploadPromises)).filter(Boolean) as string[]
      if (urls.length) {
        onChange([...value, ...urls])
        toast.success(`Successfully uploaded ${urls.length} image${urls.length > 1 ? 's' : ''}`)
      }
    } catch (error) {
      toast.error("Failed to upload images")
    } finally {
      setLoading(false)
      setUploadProgress({})
    }
  }

  const onRemove = (url: string) => {
    onChange(value.filter((current) => current !== url))
    toast.success("Image removed")
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {value.map((url) => (
          <div key={url} className="relative aspect-square">
            <Image
              fill
              src={url}
              alt="Product image"
              className="rounded-lg object-cover"
            />
            <Button
              type="button"
              onClick={() => onRemove(url)}
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      {value.length < maxImages && (
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={() => document.getElementById('imageUpload')?.click()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <ImagePlus className="mr-2 h-4 w-4" />
                Upload Images ({value.length}/{maxImages})
              </>
            )}
          </Button>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
} 