"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseDialog } from "@/components/expenses/expense-dialog"
import { ExpenseDetailsDialog } from "@/components/expenses/expense-details-dialog"
import { CategoryDialog } from "@/components/expenses/category-dialog"
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Receipt,
  Building2,
  Truck,
  Zap,
  Wrench,
  ShoppingCart,
  Users,
  Settings,
} from "lucide-react"

interface Expense {
  id: string
  description: string
  category: string
  amount: number
  paymentMethod: string
  supplierId: string | null
  supplierName: string | null
  employeeId: string
  employeeName: string
  expenseDate: string
  status: string
  receiptNumber: string
  notes: string
  createdAt: string
}

interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

// Mock expense data
const mockExpenses: Expense[] = [
  {
    id: "EXP-001",
    description: "Water bottles purchase from AquaPure Suppliers",
    category: "Inventory",
    amount: 5000,
    paymentMethod: "Bank Transfer",
    supplierId: "1",
    supplierName: "AquaPure Suppliers",
    employeeId: "1",
    employeeName: "Admin User",
    expenseDate: "2024-01-15T00:00:00",
    status: "Approved",
    receiptNumber: "RCP-001",
    notes: "Monthly inventory restocking",
    createdAt: "2024-01-15T10:30:00",
  },
  {
    id: "EXP-002",
    description: "Fuel for delivery vehicles",
    category: "Transportation",
    amount: 2500,
    paymentMethod: "Cash",
    supplierId: null,
    supplierName: null,
    employeeId: "2",
    employeeName: "Carlos Mendoza",
    expenseDate: "2024-01-14T00:00:00",
    status: "Approved",
    receiptNumber: "RCP-002",
    notes: "Weekly fuel allowance for delivery trucks",
    createdAt: "2024-01-14T16:45:00",
  },
  {
    id: "EXP-003",
    description: "Electricity bill for warehouse",
    category: "Utilities",
    amount: 3200,
    paymentMethod: "Online Banking",
    supplierId: null,
    supplierName: null,
    employeeId: "1",
    employeeName: "Admin User",
    expenseDate: "2024-01-13T00:00:00",
    status: "Pending",
    receiptNumber: "RCP-003",
    notes: "Monthly electricity bill",
    createdAt: "2024-01-13T09:15:00",
  },
  {
    id: "EXP-004",
    description: "Equipment maintenance and repair",
    category: "Maintenance",
    amount: 1800,
    paymentMethod: "Cash",
    supplierId: "2",
    supplierName: "Equipment Solutions Inc",
    employeeId: "1",
    employeeName: "Admin User",
    expenseDate: "2024-01-12T00:00:00",
    status: "Approved",
    receiptNumber: "RCP-004",
    notes: "Water dispenser repair and maintenance",
    createdAt: "2024-01-12T14:20:00",
  },
  {
    id: "EXP-005",
    description: "Employee salary - January 2024",
    category: "Salaries",
    amount: 25000,
    paymentMethod: "Bank Transfer",
    supplierId: null,
    supplierName: null,
    employeeId: "1",
    employeeName: "Admin User",
    expenseDate: "2024-01-10T00:00:00",
    status: "Approved",
    receiptNumber: "RCP-005",
    notes: "Monthly salary payment for all employees",
    createdAt: "2024-01-10T08:00:00",
  },
]

const mockCategories: Category[] = [
  { id: "1", name: "Inventory", description: "Product purchases and stock", icon: "ShoppingCart", color: "blue" },
  { id: "2", name: "Transportation", description: "Fuel, vehicle maintenance", icon: "Truck", color: "green" },
  { id: "3", name: "Utilities", description: "Electricity, water, internet", icon: "Zap", color: "yellow" },
  { id: "4", name: "Maintenance", description: "Equipment repairs and upkeep", icon: "Wrench", color: "orange" },
  { id: "5", name: "Salaries", description: "Employee compensation", icon: "Users", color: "purple" },
  { id: "6", name: "Office Supplies", description: "Stationery, office equipment", icon: "Building2", color: "gray" },
]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(mockExpenses)
  const [categories, setCategories] = useState(mockCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("expenses")
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.employeeName.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getCategoryIcon = (iconName: string) => {
    const icons = {
      ShoppingCart: <ShoppingCart className="h-4 w-4" />,
      Truck: <Truck className="h-4 w-4" />,
      Zap: <Zap className="h-4 w-4" />,
      Wrench: <Wrench className="h-4 w-4" />,
      Users: <Users className="h-4 w-4" />,
      Building2: <Building2 className="h-4 w-4" />,
    }
    return icons[iconName as keyof typeof icons] || <Receipt className="h-4 w-4" />
  }

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

  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsDetailsDialogOpen(true)
  }

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsExpenseDialogOpen(true)
  }

  const handleAddExpense = () => {
    setSelectedExpense(null)
    setIsExpenseDialogOpen(true)
  }

  const handleAddCategory = () => {
    setSelectedCategory(null)
    setIsCategoryDialogOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsCategoryDialogOpen(true)
  }

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(expenses.filter((e) => e.id !== expenseId))
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((c) => c.id !== categoryId))
  }

  const handleSaveExpense = (expenseData: Partial<Expense>) => {
    if (selectedExpense) {
      setExpenses(expenses.map((e) => (e.id === selectedExpense.id ? { ...e, ...expenseData } : e)))
    } else {
      const newExpense: Expense = {
        id: `EXP-${String(expenses.length + 1).padStart(3, "0")}`,
        description: expenseData.description || '',
        category: expenseData.category || '',
        amount: expenseData.amount || 0,
        paymentMethod: expenseData.paymentMethod || '',
        supplierId: expenseData.supplierId || null,
        supplierName: expenseData.supplierName || null,
        employeeId: expenseData.employeeId || '',
        employeeName: expenseData.employeeName || '',
        expenseDate: expenseData.expenseDate || '',
        status: expenseData.status || 'Pending',
        receiptNumber: expenseData.receiptNumber || '',
        notes: expenseData.notes || '',
        createdAt: new Date().toISOString(),
      }
      setExpenses([...expenses, newExpense])
    }
    setIsExpenseDialogOpen(false)
  }

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (selectedCategory) {
      setCategories(categories.map((c) => (c.id === selectedCategory.id ? { ...c, ...categoryData } : c)))
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryData.name || "",
        description: categoryData.description || "",
        icon: categoryData.icon || "Settings",
        color: categoryData.color || "gray",
      }
      setCategories([...categories, newCategory])
    }
    setIsCategoryDialogOpen(false)
  }

  const expenseStats = {
    totalExpenses: expenses.length,
    totalAmount: expenses.filter((e) => e.status === "Approved").reduce((sum, e) => sum + e.amount, 0),
    pendingExpenses: expenses.filter((e) => e.status === "Pending").length,
    thisMonthAmount: expenses
      .filter((e) => {
        const expenseDate = new Date(e.expenseDate)
        const now = new Date()
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear() &&
          e.status === "Approved"
        )
      })
      .reduce((sum, e) => sum + e.amount, 0),
  }

  const categoryExpenses = categories.map((category) => {
    const categoryTotal = expenses
      .filter((e) => e.category === category.name && e.status === "Approved")
      .reduce((sum, e) => sum + e.amount, 0)
    const categoryCount = expenses.filter((e) => e.category === category.name).length
    return {
      ...category,
      totalAmount: categoryTotal,
      expenseCount: categoryCount,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Expense Management</h2>
          <p className="text-muted-foreground">Track business expenses, manage categories, and monitor spending</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAddCategory} className="gap-2 bg-transparent">
            <Settings className="h-4 w-4" />
            Manage Categories
          </Button>
          <Button onClick={handleAddExpense} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Expense Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenseStats.totalExpenses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{expenseStats.totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{expenseStats.pendingExpenses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₱{expenseStats.thisMonthAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Expense Management Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Tracking</CardTitle>
          <CardDescription>Monitor business expenses and manage spending categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses, categories, or suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expenses">Expense Records</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Expense ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.id}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px]">
                            <div className="font-medium truncate">{expense.description}</div>
                            {expense.supplierName && (
                              <div className="text-sm text-muted-foreground">from {expense.supplierName}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(categories.find((c) => c.name === expense.category)?.icon || "Receipt")}
                            <span>{expense.category}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">₱{expense.amount.toLocaleString()}</TableCell>
                        <TableCell>{expense.paymentMethod}</TableCell>
                        <TableCell>{expense.employeeName}</TableCell>
                        <TableCell>{new Date(expense.expenseDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(expense.status)}>{expense.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewExpense(expense)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditExpense(expense)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(expense.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryExpenses.map((category) => (
                  <Card key={category.id} className="hover:bg-accent/50 transition-colors">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category.icon)}
                          <span>{category.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Total Spent:</span>
                          <span className="font-bold">₱{category.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Expenses:</span>
                          <Badge variant="outline">{category.expenseCount}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add Category Card */}
                <Card
                  className="border-dashed border-2 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={handleAddCategory}
                >
                  <CardContent className="flex flex-col items-center justify-center h-full py-8">
                    <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Add New Category</span>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ExpenseDialog
        open={isExpenseDialogOpen}
        onOpenChange={setIsExpenseDialogOpen}
        expense={selectedExpense}
        categories={categories}
        onSave={handleSaveExpense}
      />

      <ExpenseDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        expense={selectedExpense}
      />

      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />
    </div>
  )
}
