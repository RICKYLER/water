"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Package, MapPin } from "lucide-react"

export default function OrderHistoryPage() {
  // Sample order history data
  const orderHistory = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "Delivered",
      items: "5 Gallons Water Refill",
      price: "₱250",
      address: "123 Main Street, City, State 12345",
    },
    {
      id: "ORD-002",
      date: "2024-01-20",
      status: "Delivered",
      items: "3 Gallons Water Refill",
      price: "₱150",
      address: "456 Oak Avenue, City, State 12345",
    },
    {
      id: "ORD-003",
      date: "2024-01-27",
      status: "Delivered",
      items: "10 Gallons Water Refill",
      price: "₱500",
      address: "789 Pine Road, City, State 12345",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
        <p className="text-gray-500">View your past orders and delivery details</p>
      </div>

      <div className="grid gap-4">
        {orderHistory.map((order) => (
          <Card key={order.id} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-primary text-lg">{order.id}</CardTitle>
                <Badge 
                  variant="outline" 
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {order.status}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-gray-500" />
                  <span>{order.date}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{order.items}</span>
                  <span className="ml-auto font-semibold">{order.price}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <span className="text-sm">{order.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}