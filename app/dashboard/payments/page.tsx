"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentDialog } from "@/components/payments/payment-dialog"
import { PaymentDetailsDialog } from "@/components/payments/payment-details-dialog"
import {
  Search,
  Plus,
  Eye,
  Edit,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
} from "lucide-react"

interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  paymentType: string;
  status: string;
  transactionId: string | null;
  paymentDate: string | null;
  dueDate: string;
  notes: string;
  receivedBy: string | null;
}

interface OutstandingOrder {
  id: string;
  customerId: string;
  customerName: string;
  total: number;
  paid: number;
  balance: number;
  dueDate: string;
}

// Mock payment data
const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    orderId: "ORD-001",
    customerId: "1",
    customerName: "Maria Santos",
    amount: 200,
    paymentMethod: "Cash",
    paymentType: "Full Payment",
    status: "Completed",
    transactionId: null,
    paymentDate: "2024-01-15T14:30:00",
    dueDate: "2024-01-15T00:00:00",
    notes: "Payment received upon delivery",
    receivedBy: "Carlos Mendoza",
  },
  {
    id: "PAY-002",
    orderId: "ORD-002",
    customerId: "2",
    customerName: "Juan Dela Cruz",
    amount: 125,
    paymentMethod: "GCash",
    paymentType: "Full Payment",
    status: "Completed",
    transactionId: "GC-2024011501234",
    paymentDate: "2024-01-15T09:45:00",
    dueDate: "2024-01-15T00:00:00",
    notes: "Mobile payment confirmed",
    receivedBy: "Admin User",
  },
  {
    id: "PAY-003",
    orderId: "ORD-004",
    customerId: "3",
    customerName: "Ana Rodriguez",
    amount: 100,
    paymentMethod: "Bank Transfer",
    paymentType: "Partial Payment",
    status: "Pending",
    transactionId: "BT-2024011512345",
    paymentDate: null,
    dueDate: "2024-01-16T00:00:00",
    notes: "Awaiting bank confirmation",
    receivedBy: null,
  },
  {
    id: "PAY-004",
    orderId: "ORD-005",
    customerId: "1",
    customerName: "Maria Santos",
    amount: 75,
    paymentMethod: "Cash",
    paymentType: "Partial Payment",
    status: "Overdue",
    transactionId: null,
    paymentDate: null,
    dueDate: "2024-01-10T00:00:00",
    notes: "Customer requested payment extension",
    receivedBy: null,
  },
]

// Mock outstanding orders for payment processing
const mockOutstandingOrders: OutstandingOrder[] = [
  {
    id: "ORD-006",
    customerId: "2",
    customerName: "Juan Dela Cruz",
    total: 300,
    paid: 0,
    balance: 300,
    dueDate: "2024-01-20T00:00:00",
  },
  {
    id: "ORD-007",
    customerId: "3",
    customerName: "Ana Rodriguez",
    total: 150,
    paid: 50,
    balance: 100,
    dueDate: "2024-01-18T00:00:00",
  },
]

export default function PaymentsPage() {
  const [payments, setPayments] = useState(mockPayments)
  const [outstandingOrders, setOutstandingOrders] = useState(mockOutstandingOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("payments")
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<OutstandingOrder | null>(null)

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const filteredOutstandingOrders = outstandingOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Failed":
        return <XCircle className="h-4 w-4" />
      case "Overdue":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

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

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Cash":
        return <Banknote className="h-4 w-4" />
      case "GCash":
      case "PayMaya":
        return <Smartphone className="h-4 w-4" />
      case "Bank Transfer":
      case "Credit Card":
        return <CreditCard className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment)
    setIsDetailsDialogOpen(true)
  }

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsPaymentDialogOpen(true)
  }

  const handleAddPayment = (order?: OutstandingOrder) => {
    setSelectedPayment(null)
    setSelectedOrder(order || null)
    setIsPaymentDialogOpen(true)
  }

  const handleSavePayment = (paymentData: Partial<Payment>) => {
    if (selectedPayment) {
      // Update existing payment
      setPayments(payments.map((p) => (p.id === selectedPayment.id ? { ...p, ...paymentData } : p)))
    } else {
      // Add new payment
      const newPayment = {
        id: `PAY-${String(payments.length + 1).padStart(3, "0")}`,
        ...paymentData,
        paymentDate: paymentData.status === "Completed" ? new Date().toISOString() : null,
        receivedBy: paymentData.status === "Completed" ? "Admin User" : null,
      }
      setPayments([...payments, newPayment])

      // Update outstanding orders if payment is for an outstanding order
      if (selectedOrder) {
        setOutstandingOrders(
          outstandingOrders.map((order) => {
            if (order.id === selectedOrder.id) {
              const newPaid = order.paid + paymentData.amount
              return {
                ...order,
                paid: newPaid,
                balance: order.total - newPaid,
              }
            }
            return order
          }),
        )
      }
    }
    setIsPaymentDialogOpen(false)
  }

  const paymentStats = {
    totalPayments: payments.length,
    completedPayments: payments.filter((p) => p.status === "Completed").length,
    pendingPayments: payments.filter((p) => p.status === "Pending").length,
    totalAmount: payments.filter((p) => p.status === "Completed").reduce((sum, p) => sum + p.amount, 0),
    outstandingAmount: outstandingOrders.reduce((sum, o) => sum + o.balance, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Payment Processing</h2>
          <p className="text-muted-foreground">Manage payments, track transactions, and handle billing</p>
        </div>
        <Button onClick={() => handleAddPayment()} className="gap-2">
          <Plus className="h-4 w-4" />
          Record Payment
        </Button>
      </div>

      {/* Payment Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentStats.totalPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paymentStats.completedPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{paymentStats.pendingPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{paymentStats.totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₱{paymentStats.outstandingAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Management Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Management</CardTitle>
          <CardDescription>Track payments, process transactions, and manage outstanding balances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments, orders, or customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payments">Payment History</TabsTrigger>
              <TabsTrigger value="outstanding">Outstanding Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="payments" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.orderId}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{payment.customerName}</div>
                          </div>
                        </TableCell>
                        <TableCell>₱{payment.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getPaymentMethodIcon(payment.paymentMethod)}
                            <span>{payment.paymentMethod}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={payment.paymentType === "Full Payment" ? "default" : "secondary"}>
                            {payment.paymentType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(payment.status)} className="gap-1">
                            {getStatusIcon(payment.status)}
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "Pending"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewPayment(payment)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditPayment(payment)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="outstanding" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOutstandingOrders.map((order) => {
                      const isOverdue = new Date(order.dueDate) < new Date()
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>₱{order.total.toFixed(2)}</TableCell>
                          <TableCell>₱{order.paid.toFixed(2)}</TableCell>
                          <TableCell className="font-medium text-red-600">₱{order.balance.toFixed(2)}</TableCell>
                          <TableCell>{new Date(order.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={isOverdue ? "destructive" : "secondary"}>
                              {isOverdue ? "Overdue" : "Outstanding"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddPayment(order)}
                              className="gap-2"
                            >
                              <Plus className="h-3 w-3" />
                              Record Payment
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <PaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        payment={selectedPayment}
        order={selectedOrder}
        onSave={handleSavePayment}
      />

      <PaymentDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        payment={selectedPayment}
      />
    </div>
  )
}
