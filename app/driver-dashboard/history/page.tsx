"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, MapPin, Clock, CheckCircle } from "lucide-react"
import { useState } from "react"

const deliveryHistory = [
  {
    id: "DEL-002",
    date: "2024-01-15",
    customerName: "Ana Rodriguez",
    address: "789 Pine Rd, Pasig City",
    deliveredTime: "11:45 AM",
    items: [{ productName: "1-Gallon Water Bottle", quantity: 10 }],
    deliveryFee: 50,
    status: "Delivered",
    rating: 5,
    feedback: "Great service, on time delivery!",
  },
  {
    id: "DEL-004",
    date: "2024-01-14",
    customerName: "Roberto Cruz",
    address: "321 Elm St, Mandaluyong City",
    deliveredTime: "3:30 PM",
    items: [
      { productName: "5-Gallon Water Jug", quantity: 2 },
      { productName: "1-Gallon Water Bottle", quantity: 3 },
    ],
    deliveryFee: 60,
    status: "Delivered",
    rating: 4,
    feedback: "Good service",
  },
  {
    id: "DEL-005",
    date: "2024-01-13",
    customerName: "Lisa Fernandez",
    address: "654 Maple Ave, Taguig City",
    deliveredTime: "10:15 AM",
    items: [{ productName: "5-Gallon Water Jug", quantity: 5 }],
    deliveryFee: 75,
    status: "Delivered",
    rating: 5,
    feedback: "Excellent service, very professional driver",
  },
  {
    id: "DEL-006",
    date: "2024-01-12",
    customerName: "Mark Johnson",
    address: "987 Cedar Rd, Paranaque City",
    deliveredTime: "2:20 PM",
    items: [{ productName: "1-Gallon Water Bottle", quantity: 15 }],
    deliveryFee: 65,
    status: "Delivered",
    rating: 4,
    feedback: "Timely delivery",
  },
]

const getRatingStars = (rating: number) => {
  return "★".repeat(rating) + "☆".repeat(5 - rating)
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredHistory = deliveryHistory.filter(
    (delivery) =>
      delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalDeliveries = deliveryHistory.length
  const totalEarnings = deliveryHistory.reduce((sum, delivery) => sum + delivery.deliveryFee, 0)
  const averageRating = deliveryHistory.reduce((sum, delivery) => sum + delivery.rating, 0) / deliveryHistory.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Delivery History</h1>
        <p className="text-muted-foreground">View your past delivery records and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">Completed deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{totalEarnings}</div>
            <p className="text-xs text-muted-foreground">Delivery fees earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">{getRatingStars(Math.round(averageRating))}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Records</CardTitle>
          <CardDescription>
            Search and filter your delivery history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, address, or delivery ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Filter by Date
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Delivery ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Delivered Time</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.id}</TableCell>
                  <TableCell>{delivery.date}</TableCell>
                  <TableCell>{delivery.customerName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{delivery.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {delivery.deliveredTime}
                    </div>
                  </TableCell>
                  <TableCell>₱{delivery.deliveryFee}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">{getRatingStars(delivery.rating)}</span>
                      <span className="text-sm text-muted-foreground">({delivery.rating}/5)</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {delivery.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredHistory.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No delivery records found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}