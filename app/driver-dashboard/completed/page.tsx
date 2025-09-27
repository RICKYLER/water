"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, MapPin, Star, TrendingUp } from "lucide-react"

const todayCompletedDeliveries = [
  {
    id: "DEL-002",
    customerName: "Ana Rodriguez",
    address: "789 Pine Rd, Pasig City",
    scheduledTime: "11:30 AM",
    deliveredTime: "11:45 AM",
    items: [{ productName: "1-Gallon Water Bottle", quantity: 10 }],
    deliveryFee: 50,
    rating: 5,
    feedback: "Great service, on time delivery!",
    completedAt: "2024-01-15T11:45:00",
  },
]

const todayStats = {
  totalCompleted: 1,
  totalEarnings: 50,
  averageRating: 5.0,
  onTimeDeliveries: 1,
  totalDeliveryTime: "15 mins",
}

const getRatingStars = (rating: number) => {
  return "★".repeat(rating) + "☆".repeat(5 - rating)
}

export default function CompletedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Today's Completed Deliveries</h1>
        <p className="text-muted-foreground">View your completed deliveries and performance for today</p>
      </div>

      {/* Today's Performance Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todayStats.totalCompleted}</div>
            <p className="text-xs text-muted-foreground">Deliveries completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₱{todayStats.totalEarnings}</div>
            <p className="text-xs text-muted-foreground">Delivery fees earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{todayStats.averageRating}/5</div>
            <p className="text-xs text-muted-foreground">{getRatingStars(Math.round(todayStats.averageRating))}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {todayStats.totalCompleted > 0 ? Math.round((todayStats.onTimeDeliveries / todayStats.totalCompleted) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Deliveries on time</p>
          </CardContent>
        </Card>
      </div>

      {/* Completed Deliveries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Deliveries</CardTitle>
          <CardDescription>
            Details of all deliveries completed today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayCompletedDeliveries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Delivery ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Delivered</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayCompletedDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.id}</TableCell>
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
                        {delivery.scheduledTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
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
                      <div className="max-w-xs">
                        <p className="text-sm text-muted-foreground truncate" title={delivery.feedback}>
                          {delivery.feedback || "No feedback"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Completed Deliveries Today</h3>
              <p className="text-muted-foreground">
                You haven't completed any deliveries today yet. Keep up the great work!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      {todayCompletedDeliveries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Performance Summary</CardTitle>
            <CardDescription>
              Overview of your delivery performance today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold">Delivery Efficiency</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>On-time deliveries:</span>
                    <span className="font-medium">{todayStats.onTimeDeliveries}/{todayStats.totalCompleted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average delivery time:</span>
                    <span className="font-medium">{todayStats.totalDeliveryTime}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Customer Satisfaction</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Average rating:</span>
                    <span className="font-medium">{todayStats.averageRating}/5.0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total earnings:</span>
                    <span className="font-medium">₱{todayStats.totalEarnings}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}