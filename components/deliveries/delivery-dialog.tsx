"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DeliveryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  delivery?: any
  drivers: any[]
  onSave: (deliveryData: any) => void
}

// Mock customer and order data
const mockCustomers = [
  { id: "1", name: "Maria Santos", phone: "+63 912 345 6789", address: "123 Main St, Quezon City" },
  { id: "2", name: "Juan Dela Cruz", phone: "+63 917 234 5678", address: "456 Oak Ave, Makati City" },
  { id: "3", name: "Ana Rodriguez", phone: "+63 905 876 5432", address: "789 Pine Rd, Pasig City" },
]

const mockOrders = [
  { id: "ORD-001", customerId: "1", customerName: "Maria Santos", total: 200 },
  { id: "ORD-002", customerId: "2", customerName: "Juan Dela Cruz", total: 125 },
  { id: "ORD-003", customerId: "3", customerName: "Ana Rodriguez", total: 200 },
]

export function DeliveryDialog({ open, onOpenChange, delivery, drivers, onSave }: DeliveryDialogProps) {
  const [formData, setFormData] = useState({
    orderId: "",
    customerId: "",
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    driverId: "",
    scheduledDate: "",
    scheduledTime: "",
    status: "Scheduled",
    priority: "Normal",
    deliveryFee: 50,
    notes: "",
    items: [] as any[],
  })

  useEffect(() => {
    if (delivery) {
      const scheduledDateTime = new Date(delivery.scheduledDate)
      setFormData({
        orderId: delivery.orderId || "",
        customerId: delivery.customerId || "",
        customerName: delivery.customerName || "",
        customerPhone: delivery.customerPhone || "",
        deliveryAddress: delivery.deliveryAddress || "",
        driverId: delivery.driverId || "",
        scheduledDate: scheduledDateTime.toISOString().split("T")[0],
        scheduledTime: scheduledDateTime.toTimeString().slice(0, 5),
        status: delivery.status || "Scheduled",
        priority: delivery.priority || "Normal",
        deliveryFee: delivery.deliveryFee || 50,
        notes: delivery.notes || "",
        items: delivery.items || [],
      })
    } else {
      setFormData({
        orderId: "",
        customerId: "",
        customerName: "",
        customerPhone: "",
        deliveryAddress: "",
        driverId: "",
        scheduledDate: "",
        scheduledTime: "",
        status: "Scheduled",
        priority: "Normal",
        deliveryFee: 50,
        notes: "",
        items: [],
      })
    }
  }, [delivery, open])

  const handleOrderChange = (orderId: string) => {
    const order = mockOrders.find((o) => o.id === orderId)
    if (order) {
      const customer = mockCustomers.find((c) => c.id === order.customerId)
      if (customer) {
        setFormData((prev) => ({
          ...prev,
          orderId,
          customerId: order.customerId,
          customerName: order.customerName,
          customerPhone: customer.phone,
          deliveryAddress: customer.address,
        }))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}:00`)
    const driverName = drivers.find((d) => d.id === formData.driverId)?.name || ""
    const driverPhone = drivers.find((d) => d.id === formData.driverId)?.phone || ""

    onSave({
      ...formData,
      scheduledDate: scheduledDateTime.toISOString(),
      driverName,
      driverPhone,
    })
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{delivery ? "Edit Delivery" : "Schedule New Delivery"}</DialogTitle>
          <DialogDescription>
            {delivery ? "Update delivery information and schedule." : "Schedule a new delivery for a customer order."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Order *</Label>
                  <Select value={formData.orderId} onValueChange={handleOrderChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select order" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockOrders.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                          {order.id} - {order.customerName} (₱{order.total})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.customerName && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Customer Details</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <strong>Name:</strong> {formData.customerName}
                    </div>
                    <div>
                      <strong>Phone:</strong> {formData.customerPhone}
                    </div>
                    <div>
                      <strong>Address:</strong> {formData.deliveryAddress}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <Textarea
                  id="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={(e) => handleInputChange("deliveryAddress", e.target.value)}
                  placeholder="Enter delivery address"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Delivery Date *</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledTime">Delivery Time *</Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryFee">Delivery Fee (₱)</Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.deliveryFee}
                    onChange={(e) => handleInputChange("deliveryFee", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driver">Assign Driver *</Label>
                  <Select value={formData.driverId} onValueChange={(value) => handleInputChange("driverId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers
                        .filter((driver) => driver.status === "Active")
                        .map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name} - {driver.vehiclePlate} ({driver.currentDeliveries} active)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Delivery Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Special instructions, customer preferences, etc."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.orderId || !formData.driverId}>
              {delivery ? "Update Delivery" : "Schedule Delivery"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
