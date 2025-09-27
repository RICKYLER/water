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

interface StockMovementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: any
  onSave: (movementData: any) => void
}

export function StockMovementDialog({ open, onOpenChange, product, onSave }: StockMovementDialogProps) {
  const [formData, setFormData] = useState({
    type: "Stock In",
    quantity: 0,
    reason: "",
    notes: "",
  })

  useEffect(() => {
    if (open) {
      setFormData({
        type: "Stock In",
        quantity: 0,
        reason: "",
        notes: "",
      })
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const adjustedQuantity = formData.type === "Stock Out" ? -Math.abs(formData.quantity) : Math.abs(formData.quantity)
    onSave({
      ...formData,
      quantity: adjustedQuantity,
    })
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!product) return null

  const newStock = product.currentStock + (formData.type === "Stock Out" ? -formData.quantity : formData.quantity)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Stock Movement</DialogTitle>
          <DialogDescription>Update stock levels for {product.name}</DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Stock Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Product:</span>
              <span className="font-medium">{product.name}</span>
            </div>
            <div className="flex justify-between">
              <span>SKU:</span>
              <span className="font-mono text-sm">{product.sku}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Stock:</span>
              <span className="font-medium">{product.currentStock}</span>
            </div>
            <div className="flex justify-between">
              <span>Min/Max Levels:</span>
              <span className="text-sm text-muted-foreground">
                {product.minStock} / {product.maxStock}
              </span>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Movement Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Stock In">Stock In</SelectItem>
                  <SelectItem value="Stock Out">Stock Out</SelectItem>
                  <SelectItem value="Adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Select value={formData.reason} onValueChange={(value) => handleInputChange("reason", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Purchase Order">Purchase Order</SelectItem>
                <SelectItem value="Customer Order">Customer Order</SelectItem>
                <SelectItem value="Damaged Goods">Damaged Goods</SelectItem>
                <SelectItem value="Expired Items">Expired Items</SelectItem>
                <SelectItem value="Inventory Count">Inventory Count</SelectItem>
                <SelectItem value="Return from Customer">Return from Customer</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional notes about this stock movement"
              rows={3}
            />
          </div>

          {formData.quantity > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center">
                  <span>New Stock Level:</span>
                  <span className={`font-bold ${newStock < 0 ? "text-red-600" : "text-green-600"}`}>
                    {Math.max(0, newStock)}
                  </span>
                </div>
                {newStock < 0 && (
                  <p className="text-sm text-red-600 mt-2">Warning: This would result in negative stock!</p>
                )}
                {newStock <= product.minStock && newStock >= 0 && (
                  <p className="text-sm text-yellow-600 mt-2">Warning: Stock will be below minimum level!</p>
                )}
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={formData.quantity <= 0 || !formData.reason}>
              Update Stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
