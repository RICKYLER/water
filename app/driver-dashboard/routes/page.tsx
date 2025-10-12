"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Navigation, Route } from "lucide-react"

const activeRoutes = [
  {
    id: "ROUTE-001",
    name: "Quezon City - Makati Route",
    deliveries: [
      {
        id: "DEL-001",
        customerName: "Maria Santos",
        address: "123 Main St, Quezon City",
        scheduledTime: "2:00 PM",
        status: "Scheduled",
        estimatedDuration: "30 mins",
      },
      {
        id: "DEL-003",
        customerName: "Juan Dela Cruz",
        address: "456 Oak Ave, Makati City",
        scheduledTime: "3:00 PM",
        status: "Scheduled",
        estimatedDuration: "45 mins",
      },
    ],
    totalDistance: "25.3 km",
    estimatedTime: "1 hour 15 mins",
    status: "Active",
  },
]

export default function RoutesPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Active Routes</h1>
        <p className="text-muted-foreground mt-1">View and manage your delivery routes</p>
      </div>

      <div className="grid gap-6">
        {activeRoutes.map((route) => (
          <Card key={route.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Route className="h-5 w-5" />
                    {route.name}
                  </CardTitle>
                  <CardDescription>Route ID: {route.id}</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {route.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Distance: {route.totalDistance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Est. Time: {route.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Deliveries: {route.deliveries.length}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Delivery Stops</h4>
                {route.deliveries.map((delivery, index) => (
                  <div
                    key={delivery.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{delivery.customerName}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {delivery.address}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{delivery.scheduledTime}</div>
                      <div className="text-xs text-muted-foreground">{delivery.estimatedDuration}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-6">
                <Button className="flex-1">
                  <Navigation className="h-4 w-4 mr-2" />
                  Start Navigation
                </Button>
                <Button variant="outline">
                  View Map
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeRoutes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Route className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Routes</h3>
            <p className="text-muted-foreground text-center">
              You don't have any active delivery routes at the moment.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Embedded Map for Panabo City, Davao Region, Philippines */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Map</CardTitle>
          <CardDescription>Panabo City, Davao Region, Philippines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[420px] rounded-lg overflow-hidden border">
            <iframe
              title="Panabo City Map"
              src="https://www.bing.com/maps/embed?h=420&w=1200&cp=7.338430~125.547010&lvl=11.9&typ=d&sty=r&src=SHELL&FORM=MBEDV8&q=Panabo%20City%2C%20Davao%20Region%2C%20Philippines"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}