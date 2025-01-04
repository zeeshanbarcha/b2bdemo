"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import { OrderSummary } from "@/components/order-summary"
import { Loader2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { processOrder } from "@/app/actions/cart"

interface CartItem {
  id: string
  product: {
    name: string
    price: number
    images: string[]
  }
  quantity: number
  createdAt: Date
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
}

interface BankPaymentDetails {
  type: 'bank'
  instructions: string
  fields: {
    bankName: string
    accountName: string
    accountNumber: string
    routingNumber: string
  }
}

interface CryptoPaymentDetails {
  type: 'crypto'
  instructions: string
  walletAddress: string
  network: string
}

type PaymentDetails = BankPaymentDetails | CryptoPaymentDetails

const PAYMENT_DETAILS: Record<string, PaymentDetails> = {
  bank: {
    type: 'bank',
    instructions: "Please get in touch with  online customer service for updated bank account information. After completing the fund transfer, please fill in the transfer amount and transaction number below, and upload a screenshot of the successful transfer.",
    fields: {
      bankName: "NO",
      accountName: "NO",
      accountNumber: "NO",
      routingNumber: "NO"
    }
  },
  usdt_trc20: {
    type: 'crypto',
    instructions: "Send USDT to the following TRC20 wallet address",
    walletAddress: "TRC20WALLETADDRESS",
    network: "TRC20"
  },
  usdt_erc20: {
    type: 'crypto',
    instructions: "Send USDT to the following ERC20 wallet address",
    walletAddress: "ERC20WALLETADDRESS",
    network: "ERC20"
  },
  eth: {
    type: 'crypto',
    instructions: "Send ETH to the following wallet address",
    walletAddress: "ETHWALLETADDRESS",
    network: "ERC20"
  },
  btc: {
    type: 'crypto',
    instructions: "Send BTC to the following wallet address",
    walletAddress: "BTCWALLETADDRESS",
    network: "Bitcoin"
  }
}

const PAYMENT_METHODS = [
  {
    id: "bank",
    name: "Bank Transfer",
    description: "Direct bank transfer",
    icon: "https://7-11inonline.com/public/uploads/all/9WSL7rzTamq5LrDz9Y8xrrFqiiNhfbg2DbIuoY9h.webp"
  },
  {
    id: "usdt_trc20",
    name: "USDT (TRC20)",
    description: "Pay with USDT on TRC20 network",
    icon: "https://7-11inonline.com/public/uploads/all/8lwYBXn5j59bcBFZNSPsGhg0Xz5foKrzVyEjA2Io.png"
  },
  {
    id: "usdt_erc20",
    name: "USDT (ERC20)",
    description: "Pay with USDT on ERC20 network",
    icon: "https://7-11inonline.com/public/uploads/all/qCavRrKZ6qH1wa2GF7fYtXEcqYAS4EXq3OJp33j4.jpeg"
  },
  {
    id: "eth",
    name: "ETH (Ethereum)",
    description: "Pay with ETH on ERC20 network",
    icon: "https://7-11inonline.com/public/uploads/all/Y4AHgzPEw3S05priRyHwJXi8NA0upbYZY07FkBid.png"
  },
  {
    id: "btc",
    name: "BTC (Bitcoin)",
    description: "Pay with Bitcoin",
    icon: "https://7-11inonline.com/public/uploads/all/f5GjYgOCAIfRERgQ5BrQPQXzC2OTLOqGJwBVptqP.png"
  }
]

export default function CheckoutPage() {
  const { user, refreshCounts } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [deliveryType, setDeliveryType] = useState<'home' | 'pickup'>('home')
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    pincode: user?.zipCode || "",
    phone: user?.phone || ""
  })
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [transactionDetails, setTransactionDetails] = useState({
    transactionId: "",
    receipt: null as File | null
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      setShippingAddress({
        street: user.address || "",
        city: user?.city || "",
        state: user?.state || "",
        pincode: user?.zipCode || "",
        phone: user.phone || ""
      })
    }
  }, [user])

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/cart')
        if (!response.ok) throw new Error('Failed to fetch cart items')
        const data = await response.json()
        setCartItems(data.filter((item: CartItem) => item.status === 'PENDING'))
      } catch (error) {
        console.error('Error fetching cart items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [])

  const handleCheckout = async () => {
    if (!paymentMethod || !transactionDetails.transactionId || !transactionDetails.receipt) {
      toast.error("Please fill in all payment details")
      return
    }

    if (deliveryType === "home" && (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode || !shippingAddress.phone)) {
      toast.error("Please fill in all shipping details")
      return
    }

    try {
      setIsProcessing(true)
      // Upload receipt image first
      const formData = new FormData()
      formData.append('file', transactionDetails.receipt)
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!uploadResponse.ok) throw new Error('Failed to upload receipt')
      const { url: receiptUrl } = await uploadResponse.json()

      // Process the order
      const result = await processOrder(
        cartItems.map(item => item.id),
        {
          method: paymentMethod,
          transactionId: transactionDetails.transactionId,
          receiptUrl
        },
        {
          type: deliveryType,
          address: deliveryType === 'home' ? shippingAddress : undefined
        },
        additionalInfo
      )

      if (result.success) {
        toast.success("Order placed successfully!")
        router.push('/dashboard/orders')
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to process order")
    } finally {
      await refreshCounts()
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          {/* Delivery Type */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Delivery Type</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={deliveryType}
                onValueChange={(value) => setDeliveryType(value as 'home' | 'pickup')}
                className="space-y-4"
              >
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value="home" id="home" />
                  <Label htmlFor="home">
                    <div className="font-medium">Home Delivery</div>
                    <div className="text-sm text-muted-foreground">
                      Deliver to your address
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup">
                    <div className="font-medium">Local Pickup</div>
                    <div className="text-sm text-muted-foreground">
                      Pick up from nearest netflixn store
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Only show shipping address for home delivery */}
          {deliveryType === "home" && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Street Address"
                  value={shippingAddress.street}
                  onChange={e => setShippingAddress(prev => ({
                    ...prev,
                    street: e.target.value
                  }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={e => setShippingAddress(prev => ({
                      ...prev,
                      city: e.target.value
                    }))}
                  />
                  <Input
                    placeholder="State"
                    value={shippingAddress.state}
                    onChange={e => setShippingAddress(prev => ({
                      ...prev,
                      state: e.target.value
                    }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="PIN Code"
                    value={shippingAddress.pincode}
                    onChange={e => setShippingAddress(prev => ({
                      ...prev,
                      pincode: e.target.value
                    }))}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={shippingAddress.phone}
                    onChange={e => setShippingAddress(prev => ({
                      ...prev,
                      phone: e.target.value
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                {PAYMENT_METHODS.map(method => (
                  <div key={method.id} className="flex items-center space-x-4">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex items-center gap-4">
                      <Image
                        src={method.icon}
                        alt={method.name}
                        width={24}
                        height={24}
                      />
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {method.description}
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {paymentMethod && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {PAYMENT_DETAILS[paymentMethod]?.instructions}
                </p>

                {PAYMENT_DETAILS[paymentMethod].type === 'bank' && (
                  <div className="grid gap-2">
                    {Object.entries(PAYMENT_DETAILS[paymentMethod].fields).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="font-medium">
                          {key
                            .replace(/([A-Z])/g, ' $1')
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {PAYMENT_DETAILS[paymentMethod].type === 'crypto' && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Wallet Address</p>
                    <code className="block bg-muted p-2 rounded text-sm">
                      {PAYMENT_DETAILS[paymentMethod].walletAddress}
                    </code>
                    <p className="text-sm text-muted-foreground">
                      Network: {PAYMENT_DETAILS[paymentMethod].network}
                    </p>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID *</Label>
                    <Input
                      id="transactionId"
                      placeholder="Enter your transaction ID"
                      value={transactionDetails.transactionId}
                      onChange={e => setTransactionDetails(prev => ({
                        ...prev,
                        transactionId: e.target.value
                      }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receipt">Payment Receipt *</Label>
                    <Input
                      id="receipt"
                      type="file"
                      accept="image/*"
                      onChange={e => setTransactionDetails(prev => ({
                        ...prev,
                        receipt: e.target.files?.[0] || null
                      }))}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Please upload a screenshot of your payment confirmation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any special instructions or notes..."
                value={additionalInfo}
                onChange={e => setAdditionalInfo(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          {/* Cart Items */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 justify-between">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Order Summary */}
          <OrderSummary 
            items={cartItems} 
            onCheckout={handleCheckout}
            showCheckoutButton={true}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  )
} 