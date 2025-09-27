"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  User,
  CreditCard,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Banknote,
  Smartphone,
} from "lucide-react"

interface PaymentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment?: any
}

export function PaymentDetailsDialog({ open, onOpenChange, payment }: PaymentDetailsDialogProps) {
  if (!payment) return null

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "Pending":
        return "secondary"
      case "Failed":
        return "destructive"
      case "Overdue":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Failed":
      case "Overdue":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Cash":
        return <Banknote className="h-5 w-5" />
      case "GCash":
      case "PayMaya":
        return <Smartphone className="h-5 w-5" />
      case "Bank Transfer":
      case "Credit Card":
        return <CreditCard className="h-5 w-5" />
      default:
        return <DollarSign className="h-5 w-5" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Payment Details - {payment.id}
            <Badge variant={getStatusVariant(payment.status)} className="gap-1">
              {getStatusIcon(payment.status)}
              {payment.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>Complete payment transaction information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Payment Amount</div>
                  <div className="text-2xl font-bold">₱{payment.amount.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Payment Type</div>
                  <Badge variant={payment.paymentType === "Full Payment" ? "default" : "secondary"}>
                    {payment.paymentType}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Payment Method</div>
                  <div className="flex items-center gap-2 mt-1">
                    {getPaymentMethodIcon(payment.paymentMethod)}
                    <span className="font-medium">{payment.paymentMethod}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Order ID</div>
                  <div className="font-medium">{payment.orderId}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
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
                <span className="font-medium">{payment.customerName}</span>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Payment Date</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : "Not completed"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Due Date</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(payment.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {payment.transactionId && (
                <div>
                  <div className="text-sm text-muted-foreground">Transaction ID</div>
                  <div className="font-mono text-sm bg-muted p-2 rounded">{payment.transactionId}</div>
                </div>
              )}

              {payment.receivedBy && (
                <div>
                  <div className="text-sm text-muted-foreground">Received By</div>
                  <div className="font-medium">{payment.receivedBy}</div>
                </div>
              )}

              {payment.notes && (
                <div>
                  <div className="text-sm text-muted-foreground">Payment Notes</div>
                  <div className="mt-1 p-3 bg-muted rounded-md">
                    <p className="text-sm">{payment.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Payment Amount:</span>
                  <span>₱{payment.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>{payment.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Type:</span>
                  <span>{payment.paymentType}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Status:</span>
                  <Badge variant={getStatusVariant(payment.status)} className="gap-1">
                    {getStatusIcon(payment.status)}
                    {payment.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
