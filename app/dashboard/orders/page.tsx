"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderDialog } from "@/components/orders/order-dialog"
import { OrderDetailsDialog } from "@/components/orders/order-details-dialog"
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { Search, Plus, Eye, Edit, Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react"
import { getAllOrders, updateOrder, type Order } from "@/lib/storage"

// Mock order data


export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Load orders from shared storage
  useEffect(() => {
    const loadOrders = () => {
      const allOrders = getAllOrders()
      setOrders(allOrders)
    }
    
    loadOrders()
    
    // Refresh orders every 5 seconds to catch new orders
    const interval = setInterval(loadOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm)

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && order.status === "Pending") ||
      (activeTab === "processing" && (order.status === "Confirmed" || order.status === "In Transit")) ||
      (activeTab === "delivered" && order.status === "Delivered")

    return matchesSearch && matchesTab
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Confirmed":
        return <Package className="h-4 w-4" />
      case "In Transit":
        return <Truck className="h-4 w-4" />
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />
      case "Cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Pending":
        return "secondary"
      case "Confirmed":
        return "default"
      case "In Transit":
        return "default"
      case "Delivered":
        return "default"
      case "Cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setIsDetailsDialogOpen(true)
  }

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order)
    setIsOrderDialogOpen(true)
  }

  const handleAddOrder = () => {
    setSelectedOrder(null)
    setIsOrderDialogOpen(true)
  }

  const handleSaveOrder = (orderData: Partial<Order>) => {
    if (selectedOrder) {
      // Update existing order
      const updatedOrder = { ...selectedOrder, ...orderData }
      updateOrder(selectedOrder.id, orderData)
      // Refresh orders from storage to ensure consistency
      setOrders(getAllOrders())
    } else {
      // Add new order - this would typically be handled by the customer order page
      // For now, we'll just close the dialog
    }
    setIsOrderDialogOpen(false)
  }

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    processing: orders.filter((o) => o.status === "Confirmed" || o.status === "In Transit").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Order Management</h2>
          <p className="text-muted-foreground">Track and manage customer orders and deliveries</p>
        </div>
        <Button onClick={handleAddOrder} className="gap-2">
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </div>

      {/* Order Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{orderStats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{orderStats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{orderStats.delivered}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>View and manage all customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders by ID, customer name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1">
              <TabsTrigger value="all" className="text-xs md:text-sm">All Orders</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs md:text-sm">Pending</TabsTrigger>
              <TabsTrigger value="processing" className="text-xs md:text-sm">Processing</TabsTrigger>
              <TabsTrigger value="delivered" className="text-xs md:text-sm">Delivered</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-md border">
                {/* Desktop Table (hidden on mobile) */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customerName}</div>
                              <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {order.items.length} item{order.items.length > 1 ? "s" : ""}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="gap-1">
                              {order.orderType === "Delivery" ? (
                                <Truck className="h-3 w-3" />
                              ) : (
                                <Package className="h-3 w-3" />
                              )}
                              {order.orderType}
                            </Badge>
                          </TableCell>
                          <TableCell>₱{order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(order.status)} className="gap-1">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={order.paymentStatus === "Paid" ? "default" : "secondary"}>
                              {order.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditOrder(order)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Mobile Card View */}
                <div className="md:hidden p-2">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="mb-3">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                          </div>
                          <Badge variant={getStatusVariant(order.status)} className="gap-1">
                            {getStatusIcon(order.status)}
                            {order.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <div className="text-muted-foreground">Order ID</div>
                            <div>{order.id}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Date</div>
                            <div>{new Date(order.orderDate).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Type</div>
                            <Badge variant="outline" className="gap-1">
                              {order.orderType === "Delivery" ? (
                                <Truck className="h-3 w-3" />
                              ) : (
                                <Package className="h-3 w-3" />
                              )}
                              {order.orderType}
                            </Badge>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Payment</div>
                            <Badge variant={order.paymentStatus === "Paid" ? "default" : "secondary"}>
                              {order.paymentStatus}
                            </Badge>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Items</div>
                            <div>{order.items.length} item{order.items.length > 1 ? "s" : ""}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Total</div>
                            <div className="font-medium">₱{order.total.toFixed(2)}</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditOrder(order)}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <OrderDialog
        open={isOrderDialogOpen}
        onOpenChange={setIsOrderDialogOpen}
        order={selectedOrder}
        onSave={handleSaveOrder}
      />

      <OrderDetailsDialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen} order={selectedOrder} />
    </div>
  )
}
