"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Phone, User, Truck, Package, Clock, CheckCircle } from "lucide-react"

interface DeliveryDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  delivery?: any
}

export function DeliveryDetailsDialog({ open, onOpenChange, delivery }: DeliveryDetailsDialogProps) {
  if (!delivery) return null

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "secondary"
      case "In Transit":
        return "default"
      case "Delivered":
        return "default"
      case "Failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Normal":
        return "secondary"
      case "Low":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Delivery Details - {delivery.id}
            <Badge variant={getStatusVariant(delivery.status)}>{delivery.status}</Badge>
          </DialogTitle>
          <DialogDescription>Complete delivery information and tracking details</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer & Order Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{delivery.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{delivery.customerPhone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{delivery.deliveryAddress}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Driver Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{delivery.driverName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{delivery.driverPhone}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Order ID</div>
                  <div className="font-medium">{delivery.orderId}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Priority</div>
                  <Badge variant={getPriorityVariant(delivery.priority)}>{delivery.priority}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Scheduled Date & Time</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(delivery.scheduledDate).toLocaleString()}</span>
                  </div>
                </div>
                {delivery.actualDeliveryDate && (
                  <div>
                    <div className="text-sm text-muted-foreground">Actual Delivery</div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{new Date(delivery.actualDeliveryDate).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Delivery Fee</div>
                  <div className="font-medium">₱{delivery.deliveryFee.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Created</div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(delivery.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {delivery.notes && (
                <div>
                  <div className="text-sm text-muted-foreground">Delivery Notes</div>
                  <div className="mt-1 p-3 bg-muted rounded-md">
                    <p className="text-sm">{delivery.notes}</p>
                  </div>
                </div>
              )}

              {delivery.proofOfDelivery && (
                <div>
                  <div className="text-sm text-muted-foreground">Proof of Delivery</div>
                  <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">{delivery.proofOfDelivery}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {delivery.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div>
                      <span className="font-medium">{item.productName}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
