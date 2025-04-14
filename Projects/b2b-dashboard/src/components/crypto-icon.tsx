import Image from "next/image"

interface CryptoIconProps {
  symbol: string
  className?: string
}

export function CryptoIcon({ symbol, className }: CryptoIconProps) {
  const iconUrl = `/crypto-icons/${symbol.toLowerCase()}.svg`

  return (
    <div className={`relative ${className}`}>
      <Image src={iconUrl || "/placeholder.svg"} alt={`${symbol} icon`} layout="fill" objectFit="contain" />
    </div>
  )
}

