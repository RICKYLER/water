"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle, 
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone
} from "lucide-react"
import { getAllOrders, Order } from "@/lib/storage"

export default function CustomerOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      router.push('/')
      return
    }

    const userData = JSON.parse(currentUser)
    if (userData.role !== 'customer') {
      router.push('/')
      return
    }

    // Load orders from our new ordering system
    loadOrders(userData.email || userData.username)
  }, [router])

  const loadOrders = (customerIdentifier: string) => {
    try {
      const allOrders = getAllOrders()
      const customerOrders = allOrders.filter((order: any) => 
        order.customerEmail === customerIdentifier || 
        order.customerId === customerIdentifier ||
        order.customerName === customerIdentifier
      )
      
      // Sort by order date (newest first)
      customerOrders.sort((a: Order, b: Order) => {
        const dateA = new Date(a.orderDate || '').getTime()
        const dateB = new Date(b.orderDate || '').getTime()
        return dateB - dateA
      })
      
      setOrders(customerOrders)
      setFilteredOrders(customerOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
      // Set empty arrays if there's an error
      setOrders([])
      setFilteredOrders([])
    }
  }



  useEffect(() => {
    let filtered = orders

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => {
        const searchLower = searchTerm.toLowerCase()
        const itemsText = Array.isArray(order.items) 
          ? order.items.map(item => item.productName).join(' ')
          : ''
        
        return order.id.toLowerCase().includes(searchLower) ||
               itemsText.toLowerCase().includes(searchLower) ||
               (order.customerName && order.customerName.toLowerCase().includes(searchLower))
      })
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const handleBack = () => {
    router.push('/customer-dashboard')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'In Transit':
        return <Package className="h-4 w-4" />
      case 'Confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'Pending':
        return <Clock className="h-4 w-4" />
      case 'Cancelled':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Order History</h1>
              <p className="text-muted-foreground">Track all your water refill orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order ID or items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-lg">{order.id}</span>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Order Details</p>
                        <p className="font-medium">
                          {Array.isArray(order.items) ? 
                            order.items.map(item => `${item.productName} (${item.quantity}x)`).join(', ') : 
                            'Water Order'}
                        </p>
                        <p className="text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Delivery Address</p>
                        <p className="font-medium flex items-start gap-1">
                          <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
                          {order.deliveryAddress || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Driver Info (if available) */}
                    {order.assignedDriver && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Assigned Driver</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                          <span>{order.assignedDriver}</span>
                        </div>
                      </div>
                    )}

                    {/* Scheduled Delivery */}
                    {(order.deliveryDate || order.deliveryTime) && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          Scheduled Delivery: <span className="font-medium">
                            {order.deliveryDate && new Date(order.deliveryDate).toLocaleDateString()}
                            {order.deliveryDate && order.deliveryTime && ' at '}
                            {order.deliveryTime}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-2xl font-bold">₱{order.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {Array.isArray(order.items) ? 
                        `${order.items.reduce((sum, item) => sum + item.quantity, 0)} items` : 
                        'Total amount'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredOrders.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No orders match your current filters.' 
                    : 'You haven\'t placed any orders yet.'
                  }
                </p>
                {(searchTerm || statusFilter !== 'all') && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('all')
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}