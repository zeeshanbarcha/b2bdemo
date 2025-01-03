"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import debounce from "lodash.debounce"
import { SearchIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface Suggestion {
  id: string
  name: string
  image: string
  category: string
}

export function Search() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    setQuery(searchParams.get("q") || "")
  }, [searchParams])

  const debouncedFetch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([])
        return
      }

      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        setSuggestions(data.suggestions)
      } catch (error) {
        console.error("Search error:", error)
        setSuggestions([])
      }
    }, 300),
    []
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedFetch(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    const params = new URLSearchParams(searchParams)
    if (query) {
      params.set("q", query)
    } else {
      params.delete("q")
    }
    router.push(`/products?${params.toString()}`)
    setShowSuggestions(false)
  }

  const clearSearch = () => {
    setQuery("")
    setSuggestions([])
    const params = new URLSearchParams(searchParams)
    params.delete("q")
    router.push(`/products?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search products..."
        className="w-full pl-9 pr-9"
        value={query}
        onChange={handleSearch}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-background shadow-md dark:border-border dark:bg-background">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              className="flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-muted dark:hover:bg-muted"
              onClick={() => {
                const params = new URLSearchParams(searchParams)
                params.set("q", suggestion.name)
                router.push(`/products?${params.toString()}`)
                setShowSuggestions(false)
              }}
            >
              <div className="relative h-8 w-8">
                <Image
                  src={suggestion.image}
                  alt={suggestion.name}
                  fill
                  sizes="32px"
                  className="rounded object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{suggestion.name}</p>
                <p className="text-xs text-muted-foreground">{suggestion.category}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </form>
  )
} 