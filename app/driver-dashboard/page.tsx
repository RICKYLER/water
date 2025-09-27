"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Phone, CheckCircle, AlertCircle, Navigation } from "lucide-react"
import { getDriverDeliveries, updateOrder, type Order } from "@/lib/storage"



const getStatusBadge = (status: string) => {
  switch (status) {
    case "Confirmed":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Scheduled</Badge>
    case "In Transit":
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">In Transit</Badge>
    case "Delivered":
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Delivered</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "High":
      return <Badge variant="destructive">High</Badge>
    case "Normal":
      return <Badge variant="secondary">Normal</Badge>
    case "Low":
      return <Badge variant="outline">Low</Badge>
    default:
      return <Badge variant="secondary">{priority}</Badge>
  }
}

export default function DriverDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [deliveries, setDeliveries] = useState<Order[]>([])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      // Load deliveries from shared storage
      const loadDeliveries = () => {
        const driverDeliveries = getDriverDeliveries(parsedUser.username)
        setDeliveries(driverDeliveries)
      }
      
      loadDeliveries()
      
      // Refresh deliveries every 10 seconds to catch new assignments
      const interval = setInterval(loadDeliveries, 10000)
      return () => clearInterval(interval)
    }
  }, [])

  const todayDeliveries = deliveries.filter(d => d.status !== "Delivered")
  const completedToday = deliveries.filter(d => d.status === "Delivered").length
  const inTransit = deliveries.filter(d => d.status === "In Transit").length
  const scheduled = deliveries.filter(d => d.status === "Confirmed").length

  const handleStartDelivery = (deliveryId: string) => {
    const delivery = deliveries.find(d => d.id === deliveryId)
    if (delivery) {
      try {
        const updatedDelivery = { 
          ...delivery, 
          status: "In Transit" as const,
          // Update the delivery date to current time when starting delivery
          deliveryDate: delivery.deliveryDate || new Date().toISOString()
        }
        updateOrder(delivery.id, {
          status: "In Transit" as const,
          deliveryDate: delivery.deliveryDate || new Date().toISOString()
        })
        setDeliveries(prev => 
          prev.map(d => 
            d.id === deliveryId ? updatedDelivery : d
          )
        )
      } catch (error) {
        console.error('Failed to start delivery:', error)
      }
    }
  }

  const handleCompleteDelivery = (deliveryId: string) => {
    const delivery = deliveries.find(d => d.id === deliveryId)
    if (delivery) {
      try {
        const updatedDelivery = { 
          ...delivery, 
          status: "Delivered" as const,
          // Set actual delivery completion time
          deliveryDate: new Date().toISOString(),
          paymentStatus: "Paid" as const // Mark as paid when delivered
        }
        updateOrder(delivery.id, {
          status: "Delivered" as const,
          deliveryDate: new Date().toISOString(),
          paymentStatus: "Paid" as const
        })
        setDeliveries(prev => 
          prev.map(d => 
            d.id === deliveryId ? updatedDelivery : d
          )
        )
      } catch (error) {
        console.error('Failed to complete delivery:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.username}!</h1>
        <p className="text-muted-foreground">Here are your delivery assignments for today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayDeliveries.length}</div>
            <p className="text-xs text-muted-foreground">Pending deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inTransit}</div>
            <p className="text-xs text-muted-foreground">Currently delivering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scheduled}</div>
            <p className="text-xs text-muted-foreground">Upcoming deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedToday}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Your Delivery Assignments</CardTitle>
          <CardDescription>
            Manage your assigned deliveries and update their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Delivery ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Scheduled Time</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{delivery.customerName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {delivery.customerPhone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{delivery.deliveryAddress}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {delivery.deliveryDate ? new Date(delivery.deliveryDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBD'}
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge("Normal")}</TableCell>
                  <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {delivery.status === "Confirmed" && (
                        <Button
                          size="sm"
                          onClick={() => handleStartDelivery(delivery.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Start Delivery
                        </Button>
                      )}
                      {delivery.status === "In Transit" && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteDelivery(delivery.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark Complete
                        </Button>
                      )}
                      {delivery.status === "Delivered" && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}