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

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment?: any
  order?: any
  onSave: (paymentData: any) => void
}

// Mock order data for payment processing
const mockOrders = [
  { id: "ORD-001", customerId: "1", customerName: "Maria Santos", total: 200, balance: 200 },
  { id: "ORD-002", customerId: "2", customerName: "Juan Dela Cruz", total: 125, balance: 125 },
  { id: "ORD-003", customerId: "3", customerName: "Ana Rodriguez", total: 200, balance: 100 },
]

export function PaymentDialog({ open, onOpenChange, payment, order, onSave }: PaymentDialogProps) {
  const [formData, setFormData] = useState({
    orderId: "",
    customerId: "",
    customerName: "",
    amount: 0,
    paymentMethod: "Cash",
    paymentType: "Full Payment",
    status: "Completed",
    transactionId: "",
    dueDate: "",
    notes: "",
  })

  useEffect(() => {
    if (payment) {
      setFormData({
        orderId: payment.orderId || "",
        customerId: payment.customerId || "",
        customerName: payment.customerName || "",
        amount: payment.amount || 0,
        paymentMethod: payment.paymentMethod || "Cash",
        paymentType: payment.paymentType || "Full Payment",
        status: payment.status || "Completed",
        transactionId: payment.transactionId || "",
        dueDate: payment.dueDate ? payment.dueDate.split("T")[0] : "",
        notes: payment.notes || "",
      })
    } else if (order) {
      setFormData({
        orderId: order.id,
        customerId: order.customerId,
        customerName: order.customerName,
        amount: order.balance,
        paymentMethod: "Cash",
        paymentType: order.balance === order.total ? "Full Payment" : "Partial Payment",
        status: "Completed",
        transactionId: "",
        dueDate: order.dueDate ? order.dueDate.split("T")[0] : "",
        notes: "",
      })
    } else {
      setFormData({
        orderId: "",
        customerId: "",
        customerName: "",
        amount: 0,
        paymentMethod: "Cash",
        paymentType: "Full Payment",
        status: "Completed",
        transactionId: "",
        dueDate: "",
        notes: "",
      })
    }
  }, [payment, order, open])

  const handleOrderChange = (orderId: string) => {
    const selectedOrder = mockOrders.find((o) => o.id === orderId)
    if (selectedOrder) {
      setFormData((prev) => ({
        ...prev,
        orderId,
        customerId: selectedOrder.customerId,
        customerName: selectedOrder.customerName,
        amount: selectedOrder.balance,
        paymentType: selectedOrder.balance === selectedOrder.total ? "Full Payment" : "Partial Payment",
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    })
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const requiresTransactionId = ["GCash", "PayMaya", "Bank Transfer", "Credit Card"].includes(formData.paymentMethod)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{payment ? "Edit Payment" : "Record New Payment"}</DialogTitle>
          <DialogDescription>
            {payment ? "Update payment information and status." : "Record a new payment for a customer order."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!order && (
                <div className="space-y-2">
                  <Label htmlFor="order">Select Order *</Label>
                  <Select value={formData.orderId} onValueChange={handleOrderChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select order to process payment" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockOrders.map((orderOption) => (
                        <SelectItem key={orderOption.id} value={orderOption.id}>
                          {orderOption.id} - {orderOption.customerName} (₱{orderOption.balance} balance)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.customerName && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Order Details</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <strong>Order ID:</strong> {formData.orderId}
                    </div>
                    <div>
                      <strong>Customer:</strong> {formData.customerName}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount (₱) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", Number.parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="GCash">GCash</SelectItem>
                      <SelectItem value="PayMaya">PayMaya</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentType">Payment Type</Label>
                  <Select
                    value={formData.paymentType}
                    onValueChange={(value) => handleInputChange("paymentType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full Payment">Full Payment</SelectItem>
                      <SelectItem value="Partial Payment">Partial Payment</SelectItem>
                      <SelectItem value="Down Payment">Down Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Payment Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {requiresTransactionId && (
                <div className="space-y-2">
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input
                    id="transactionId"
                    value={formData.transactionId}
                    onChange={(e) => handleInputChange("transactionId", e.target.value)}
                    placeholder="Enter transaction/reference ID"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Payment Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes about this payment..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.orderId || formData.amount <= 0}>
              {payment ? "Update Payment" : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
