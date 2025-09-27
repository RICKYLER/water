"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Droplets, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  Truck
} from "lucide-react"
import { toast } from "sonner"
import { TermsDialog } from "@/components/ui/terms-dialog"
import { 
  addOrder, 
  generateOrderId, 
  calculateDeliveryFee, 
  assignDriverToOrder,
  getCustomerData,
  saveCustomerData,
  type Order,
  type OrderItem,
  type CustomerData
} from "@/lib/storage"

interface WaterProduct {
  id: string
  name: string
  size: string
  price: number
  description: string
  available: boolean
}

export default function OrderWater() {
  const router = useRouter()
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [customerData, setCustomerData] = useState<CustomerData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  })
  const [deliveryDate, setDeliveryDate] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false)

  // Water products available for order
  const waterProducts: WaterProduct[] = [
    {
      id: "1",
      name: "5-Gallon Water Jug",
      size: "5 Gallons",
      price: 25.00,
      description: "Premium purified drinking water in reusable 5-gallon container",
      available: true
    },
    {
      id: "2",
      name: "3-Gallon Water Jug",
      size: "3 Gallons", 
      price: 18.00,
      description: "Premium purified drinking water in reusable 3-gallon container",
      available: true
    },
    {
      id: "3",
      name: "1-Gallon Water Jug",
      size: "1 Gallon",
      price: 8.00,
      description: "Premium purified drinking water in reusable 1-gallon container",
      available: true
    },
    {
      id: "4",
      name: "Water Dispenser Rental",
      size: "Monthly",
      price: 15.00,
      description: "Hot & cold water dispenser rental (monthly fee)",
      available: true
    }
  ]

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("currentUser")
    if (!userData) {
      router.push("/")
      return
    }

    const user = JSON.parse(userData)
    
    // Load customer data from shared storage
    const savedCustomerData = getCustomerData(user.email)
    if (savedCustomerData) {
      setCustomerData(savedCustomerData)
    } else {
      // Initialize with user data if available
      setCustomerData({
        fullName: user.fullName || user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      })
    }
  }, [])

  const addToOrder = (productId: string) => {
    const product = waterProducts.find(p => p.id === productId)
    if (!product) return

    setOrderItems(prev => {
      const existingItem = prev.find(item => item.productName === product.name)
      if (existingItem) {
        return prev.map(item =>
          item.productName === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prev, {
          productName: product.name,
          quantity: 1,
          price: product.price
        }]
      }
    })
  }

  const removeFromOrder = (productId: string) => {
    const product = waterProducts.find(p => p.id === productId)
    if (!product) return

    setOrderItems(prev => {
      const existingItem = prev.find(item => item.productName === product.name)
      if (!existingItem) return prev

      if (existingItem.quantity === 1) {
        return prev.filter(item => item.productName !== product.name)
      } else {
        return prev.map(item =>
          item.productName === product.name
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      }
    })
  }

  const getProductQuantity = (productId: string) => {
    const product = waterProducts.find(p => p.id === productId)
    if (!product) return 0
    const item = orderItems.find(item => item.productName === product.name)
    return item ? item.quantity : 0
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handlePlaceOrder = () => {
    // Validation
    if (orderItems.length === 0) {
      toast.error("Please add at least one item to your order")
      return
    }

    if (!customerData.fullName || !customerData.phone || !customerData.address) {
      toast.error("Please fill in all customer details")
      return
    }

    if (!deliveryDate) {
      toast.error("Please select a delivery date")
      return
    }

    if (!deliveryTime) {
      toast.error("Please select a delivery time")
      return
    }

    // Show terms and conditions dialog
    setIsTermsDialogOpen(true)
  }

  const handleConfirmOrder = async () => {
    setIsLoading(true)

    try {

      // Save customer data for future use
      saveCustomerData(customerData)

      // Calculate delivery fee
      const deliveryFee = calculateDeliveryFee(customerData.address, orderItems)
      const subtotal = calculateTotal()

      // Create order object
      const orderId = generateOrderId()
      const newOrder: Order = {
        id: orderId,
        customerName: customerData.fullName,
        customerPhone: customerData.phone,
        customerEmail: customerData.email,
        deliveryAddress: customerData.address,
        deliveryDate,
        deliveryTime,
        specialInstructions,
        items: orderItems,
        total: subtotal + deliveryFee,
        status: 'Pending',
        priority: 'Normal',
        orderDate: new Date().toISOString().split('T')[0],
        deliveryFee,
        estimatedDuration: '30 mins'
      }

      // Add order to shared storage
      addOrder(newOrder)

      // Assign driver to the order
      const assignedDriver = assignDriverToOrder(orderId)

      toast.success(`Order placed successfully! Assigned to driver: ${assignedDriver}`)
      
      // Clear form
      setOrderItems([])
      setDeliveryDate("")
      setDeliveryTime("")
      setSpecialInstructions("")

      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        router.push('/customer-dashboard/orders')
      }, 2000)

    } catch (err) {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }



  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/customer-dashboard')}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Droplets className="h-8 w-8 text-blue-500" />
            Order Water
          </h1>
          <p className="text-muted-foreground">Select your water products and schedule delivery</p>
        </div>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products */}
        <div className="lg:col-span-2 space-y-6">
          {orderItems.length === 0 && (
            <Alert className="border-blue-200 bg-blue-50">
              <ShoppingCart className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                <strong>How to place an order:</strong> Click the "+" button next to any product below to add it to your cart. Once you've added items, the "Place Order" button will become active.
              </AlertDescription>
            </Alert>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                Available Products
              </CardTitle>
              <CardDescription>
                Select the water products you'd like to order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {waterProducts.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{product.name}</h3>
                        <Badge variant="secondary">{product.size}</Badge>
                        {product.available ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">Available</Badge>
                        ) : (
                          <Badge variant="destructive">Out of Stock</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      <p className="font-bold text-lg">₱{product.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getProductQuantity(product.id) > 0 ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromOrder(product.id)}
                            disabled={!product.available}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">
                            {getProductQuantity(product.id)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addToOrder(product.id)}
                            disabled={!product.available}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => addToOrder(product.id)}
                          disabled={!product.available}
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Delivery */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {orderItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No items in order</p>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((item) => {
                    const product = waterProducts.find(p => p.name === item.productName)
                    return (
                      <div key={item.productName} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{product?.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₱{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    )
                  })}
                  <Separator />
                  <div className="flex justify-between items-center font-bold">
                    <span>Total:</span>
                    <span>₱{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <div className="flex items-center gap-2 mt-1 p-2 bg-muted rounded">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customerData.address}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={getMinDate()}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="deliveryTime">Preferred Time</Label>
                <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00-10:00">8:00 AM - 10:00 AM</SelectItem>
                    <SelectItem value="10:00-12:00">10:00 AM - 12:00 PM</SelectItem>
                    <SelectItem value="12:00-14:00">12:00 PM - 2:00 PM</SelectItem>
                    <SelectItem value="14:00-16:00">2:00 PM - 4:00 PM</SelectItem>
                    <SelectItem value="16:00-18:00">4:00 PM - 6:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  placeholder="Any special delivery instructions..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              {orderItems.length === 0 && (
                <Alert className="mb-4">
                  <AlertDescription>
                    Please add at least one item to your cart before placing an order.
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handlePlaceOrder}
                disabled={isLoading || orderItems.length === 0}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : orderItems.length === 0 ? (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add Items to Cart First
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Place Order (₱{calculateTotal().toFixed(2)})
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Terms and Conditions Dialog */}
      <TermsDialog
        open={isTermsDialogOpen}
        onOpenChange={setIsTermsDialogOpen}
        onAccept={handleConfirmOrder}
        orderTotal={calculateTotal()}
      />
    </div>
  )
}