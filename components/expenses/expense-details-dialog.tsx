"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, Receipt, Building2, CreditCard, FileText, CheckCircle, Clock, XCircle } from "lucide-react"

interface ExpenseDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expense?: any
}

export function ExpenseDetailsDialog({ open, onOpenChange, expense }: ExpenseDetailsDialogProps) {
  if (!expense) return null

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "default"
      case "Pending":
        return "secondary"
      case "Rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4" />
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Expense Details - {expense.id}
            <Badge variant={getStatusVariant(expense.status)} className="gap-1">
              {getStatusIcon(expense.status)}
              {expense.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>Complete expense information and transaction details</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Expense Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Expense Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Description</div>
                <div className="font-medium text-lg">{expense.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="text-2xl font-bold">₱{expense.amount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Category</div>
                  <Badge variant="outline" className="mt-1">
                    {expense.category}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Payment Method</div>
                  <div className="flex items-center gap-2 mt-1">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{expense.paymentMethod}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Expense Date</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(expense.expenseDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee & Supplier Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Employee Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{expense.employeeName}</span>
                </div>
              </CardContent>
            </Card>

            {expense.supplierName && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Supplier Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{expense.supplierName}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

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
                  <div className="text-sm text-muted-foreground">Created Date</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(expense.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                {expense.receiptNumber && (
                  <div>
                    <div className="text-sm text-muted-foreground">Receipt Number</div>
                    <div className="font-mono text-sm bg-muted p-2 rounded">{expense.receiptNumber}</div>
                  </div>
                )}
              </div>

              {expense.notes && (
                <div>
                  <div className="text-sm text-muted-foreground">Notes</div>
                  <div className="mt-1 p-3 bg-muted rounded-md">
                    <p className="text-sm">{expense.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Expense Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Expense Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Expense Amount:</span>
                  <span>₱{expense.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span>{expense.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>{expense.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Employee:</span>
                  <span>{expense.employeeName}</span>
                </div>
                {expense.supplierName && (
                  <div className="flex justify-between">
                    <span>Supplier:</span>
                    <span>{expense.supplierName}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Status:</span>
                  <Badge variant={getStatusVariant(expense.status)} className="gap-1">
                    {getStatusIcon(expense.status)}
                    {expense.status}
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
