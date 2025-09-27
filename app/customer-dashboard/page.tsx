"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Package, 
  Clock, 
  CheckCircle,
  LogOut,
  Edit,
  Droplets,
  ShoppingCart,
  Settings
} from "lucide-react"

interface CustomerData {
  fullName: string
  email: string
  phone: string
  address: string
  username: string
}

interface Order {
  id: string
  date: string
  status: 'pending' | 'in-transit' | 'delivered'
  items: string
  total: number
}

export default function CustomerDashboard() {
  const router = useRouter()
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    try {
      // Check if user is logged in
      const currentUser = localStorage.getItem('currentUser')
      if (!currentUser) {
        router.push('/')
        return
      }

      const userData = JSON.parse(currentUser)
      setCustomerData(userData)
    } catch (error) {
      console.error('Error loading customer data:', error)
      router.push('/')
      return
    }

    // Load mock orders for demo
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        date: '2024-01-15',
        status: 'delivered',
        items: '5 Gallons Water Refill',
        total: 250
      },
      {
        id: 'ORD-002',
        date: '2024-01-20',
        status: 'in-transit',
        items: '3 Gallons Water Refill',
        total: 150
      },
      {
        id: 'ORD-003',
        date: '2024-01-22',
        status: 'pending',
        items: '10 Gallons Water Refill',
        total: 500
      }
    ]
    setOrders(mockOrders)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/')
  }

  const handleEditProfile = () => {
    router.push('/customer-dashboard/profile')
  }

  const handleViewOrders = () => {
    router.push('/customer-dashboard/orders')
  }

  const handleOrderWater = () => {
    router.push('/customer-dashboard/order')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'in-transit':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'in-transit':
        return <Package className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (!customerData) {
    return <div>Loading...</div>
  }

  return (
    <>
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">AquaFlow Customer Portal</h1>
              <p className="text-muted-foreground">Welcome back, {customerData.fullName}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">
                    {customerData.fullName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Customer Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEditProfile}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{customerData.fullName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customerData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customerData.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{customerData.address}</span>
                </div>
              </div>
              <Separator />
              <Button onClick={handleEditProfile} className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Orders Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Track your water refill orders and delivery status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{order.id}</span>
                        <Badge className={getStatusColor(order.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{order.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{order.items}</span>
                      <span className="font-medium">₱{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {orders.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No orders yet</p>
                  <p className="text-sm">Your order history will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your account and place new orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="h-20 flex-col bg-blue-600 hover:bg-blue-700 text-white" 
                  onClick={handleOrderWater}
                >
                  <Droplets className="h-6 w-6 mb-2" />
                  Order Water Now
                </Button>
                <Button variant="outline" className="h-20 flex-col" onClick={handleEditProfile}>
                  <Edit className="h-6 w-6 mb-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="h-20 flex-col" onClick={handleViewOrders}>
                  <Clock className="h-6 w-6 mb-2" />
                  Order History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}