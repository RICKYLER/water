"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductDialog } from "@/components/inventory/product-dialog"
import { StockMovementDialog } from "@/components/inventory/stock-movement-dialog"
import { SupplierDialog } from "@/components/inventory/supplier-dialog"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Building2,
  ArrowUpDown,
} from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  sku: string
  currentStock: number
  minStock: number
  maxStock: number
  unitPrice: number
  supplierPrice: number
  supplierId: string
  supplierName: string
  status: string
  lastRestocked: string
  location: string
}

interface Supplier {
  id: string
  name: string
  contact: string
  phone: string
  email: string
  address: string
  status: string
  productsSupplied: number
}

interface StockMovement {
  id: string
  productId: string
  productName: string
  type: string
  quantity: number
  reason: string
  date: string
  user: string
}

// Mock inventory data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "5-Gallon Water Jug",
    category: "Water Containers",
    sku: "WJ-5GAL-001",
    currentStock: 150,
    minStock: 50,
    maxStock: 300,
    unitPrice: 25,
    supplierPrice: 18,
    supplierId: "1",
    supplierName: "AquaPure Suppliers",
    status: "Active",
    lastRestocked: "2024-01-10",
    location: "Warehouse A - Section 1",
  },
  {
    id: "2",
    name: "1-Gallon Water Bottle",
    category: "Water Containers",
    sku: "WB-1GAL-001",
    currentStock: 25,
    minStock: 30,
    maxStock: 200,
    unitPrice: 15,
    supplierPrice: 10,
    supplierId: "1",
    supplierName: "AquaPure Suppliers",
    status: "Low Stock",
    lastRestocked: "2024-01-08",
    location: "Warehouse A - Section 2",
  },
  {
    id: "3",
    name: "Water Dispenser Rental",
    category: "Equipment",
    sku: "WD-RENT-001",
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    unitPrice: 200,
    supplierPrice: 150,
    supplierId: "2",
    supplierName: "Equipment Solutions Inc",
    status: "Active",
    lastRestocked: "2024-01-05",
    location: "Warehouse B - Section 1",
  },
]

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "AquaPure Suppliers",
    contact: "John Smith",
    phone: "+63 917 123 4567",
    email: "john@aquapure.com",
    address: "123 Industrial Ave, Quezon City",
    status: "Active",
    productsSupplied: 2,
  },
  {
    id: "2",
    name: "Equipment Solutions Inc",
    contact: "Maria Garcia",
    phone: "+63 912 987 6543",
    email: "maria@equipmentsolutions.com",
    address: "456 Business Park, Makati City",
    status: "Active",
    productsSupplied: 1,
  },
]

const mockStockMovements: StockMovement[] = [
  {
    id: "1",
    productId: "1",
    productName: "5-Gallon Water Jug",
    type: "Stock In",
    quantity: 50,
    reason: "Purchase Order #PO-001",
    date: "2024-01-10T09:00:00",
    user: "Admin User",
  },
  {
    id: "2",
    productId: "2",
    productName: "1-Gallon Water Bottle",
    type: "Stock Out",
    quantity: -15,
    reason: "Order #ORD-001",
    date: "2024-01-09T14:30:00",
    user: "Admin User",
  },
]

export default function InventoryPage() {
  const [products, setProducts] = useState(mockProducts)
  const [suppliers, setSuppliers] = useState(mockSuppliers)
  const [stockMovements, setStockMovements] = useState(mockStockMovements)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("products")
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false)
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStockStatus = (product: Product) => {
    if (product.currentStock <= product.minStock) return "Low Stock"
    if (product.currentStock >= product.maxStock) return "Overstock"
    return "Active"
  }

  const getStockStatusVariant = (status: string) => {
    switch (status) {
      case "Low Stock":
        return "destructive"
      case "Overstock":
        return "secondary"
      default:
        return "default"
    }
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsProductDialogOpen(true)
  }

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product)
    setIsProductDialogOpen(true)
  }

  const handleStockMovement = (product: any) => {
    setSelectedProduct(product)
    setIsStockDialogOpen(true)
  }

  const handleAddSupplier = () => {
    setSelectedSupplier(null)
    setIsSupplierDialogOpen(true)
  }

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setIsSupplierDialogOpen(true)
  }

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (selectedProduct) {
      setProducts(products.map((p) => (p.id === selectedProduct.id ? { ...p, ...productData } : p)))
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productData.name || '',
        category: productData.category || '',
        sku: productData.sku || '',
        currentStock: productData.currentStock || 0,
        minStock: productData.minStock || 0,
        maxStock: productData.maxStock || 0,
        unitPrice: productData.unitPrice || 0,
        supplierPrice: productData.supplierPrice || 0,
        supplierId: productData.supplierId || '',
        supplierName: productData.supplierName || '',
        status: getStockStatus({
          currentStock: productData.currentStock || 0,
          minStock: productData.minStock || 0,
          maxStock: productData.maxStock || 0
        } as Product),
        lastRestocked: new Date().toISOString().split("T")[0],
        location: productData.location || '',
      }
      setProducts([...products, newProduct])
    }
    setIsProductDialogOpen(false)
  }

  const handleSaveSupplier = (supplierData: Partial<Supplier>) => {
    if (selectedSupplier) {
      setSuppliers(suppliers.map((s) => (s.id === selectedSupplier.id ? { ...s, ...supplierData } : s)))
    } else {
       const newSupplier: Supplier = {
         id: Date.now().toString(),
         name: supplierData.name || '',
         contact: supplierData.contact || '',
         phone: supplierData.phone || '',
         email: supplierData.email || '',
         address: supplierData.address || '',
         status: supplierData.status || 'Active',
         productsSupplied: 0,
       }
       setSuppliers([...suppliers, newSupplier])
    }
    setIsSupplierDialogOpen(false)
  }

  const handleStockUpdate = (movementData: any) => {
    // Update product stock
    setProducts(
      products.map((p) => {
        if (p.id === selectedProduct?.id) {
          const newStock = p.currentStock + movementData.quantity
          return {
            ...p,
            currentStock: Math.max(0, newStock),
            status: getStockStatus({ ...p, currentStock: newStock }),
            lastRestocked: movementData.type === "Stock In" ? new Date().toISOString().split("T")[0] : p.lastRestocked,
          }
        }
        return p
      }),
    )

    // Add stock movement record
    const newMovement = {
      id: Date.now().toString(),
      productId: selectedProduct?.id,
      productName: selectedProduct?.name,
      ...movementData,
      date: new Date().toISOString(),
      user: "Admin User",
    }
    setStockMovements([newMovement, ...stockMovements])
    setIsStockDialogOpen(false)
  }

  const inventoryStats = {
    totalProducts: products.length,
    lowStock: products.filter((p) => p.currentStock <= p.minStock).length,
    totalValue: products.reduce((sum, p) => sum + p.currentStock * p.unitPrice, 0),
    activeSuppliers: suppliers.filter((s) => s.status === "Active").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Inventory Management</h2>
          <p className="text-muted-foreground">Manage products, stock levels, and suppliers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAddSupplier} className="gap-2 bg-transparent">
            <Building2 className="h-4 w-4" />
            Add Supplier
          </Button>
          <Button onClick={handleAddProduct} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Inventory Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inventoryStats.lowStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{inventoryStats.totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.activeSuppliers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Management Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Control</CardTitle>
          <CardDescription>Manage products, suppliers, and stock movements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, suppliers, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
              <TabsTrigger value="movements">Stock Movements</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Min/Max</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.location}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{product.currentStock}</span>
                            {product.currentStock <= product.minStock && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {product.minStock} / {product.maxStock}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStockStatusVariant(getStockStatus(product))}>
                            {getStockStatus(product)}
                          </Badge>
                        </TableCell>
                        <TableCell>₱{product.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-sm">{product.supplierName}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleStockMovement(product)}>
                              <ArrowUpDown className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
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

            <TabsContent value="suppliers" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{supplier.name}</div>
                            <div className="text-sm text-muted-foreground">{supplier.address}</div>
                          </div>
                        </TableCell>
                        <TableCell>{supplier.contact}</TableCell>
                        <TableCell>{supplier.phone}</TableCell>
                        <TableCell>{supplier.email}</TableCell>
                        <TableCell>{supplier.productsSupplied}</TableCell>
                        <TableCell>
                          <Badge variant={supplier.status === "Active" ? "default" : "secondary"}>
                            {supplier.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditSupplier(supplier)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
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

            <TabsContent value="movements" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockMovements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>{new Date(movement.date).toLocaleString()}</TableCell>
                        <TableCell className="font-medium">{movement.productName}</TableCell>
                        <TableCell>
                          <Badge variant={movement.type === "Stock In" ? "default" : "secondary"} className="gap-1">
                            {movement.type === "Stock In" ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {movement.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={movement.quantity > 0 ? "text-green-600" : "text-red-600"}>
                            {movement.quantity > 0 ? "+" : ""}
                            {movement.quantity}
                          </span>
                        </TableCell>
                        <TableCell>{movement.reason}</TableCell>
                        <TableCell>{movement.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ProductDialog
        open={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        product={selectedProduct}
        suppliers={suppliers}
        onSave={handleSaveProduct}
      />

      <StockMovementDialog
        open={isStockDialogOpen}
        onOpenChange={setIsStockDialogOpen}
        product={selectedProduct}
        onSave={handleStockUpdate}
      />

      <SupplierDialog
        open={isSupplierDialogOpen}
        onOpenChange={setIsSupplierDialogOpen}
        supplier={selectedSupplier}
        onSave={handleSaveSupplier}
      />
    </div>
  )
}
