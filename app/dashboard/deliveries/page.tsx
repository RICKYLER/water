"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeliveryDialog } from "@/components/deliveries/delivery-dialog"
import { DeliveryDetailsDialog } from "@/components/deliveries/delivery-details-dialog"
import { DriverDialog } from "@/components/deliveries/driver-dialog"
import { Search, Plus, Eye, Edit, MapPin, Clock, CheckCircle, Truck, User, Calendar, AlertCircle } from "lucide-react"

interface DeliveryItem {
  productName: string
  quantity: number
}

interface Delivery {
  id: string
  orderId: string
  customerId: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  driverId: string
  driverName: string
  driverPhone: string
  scheduledDate: string
  actualDeliveryDate: string | null
  status: string
  priority: string
  deliveryFee: number
  items: DeliveryItem[]
  notes: string
  proofOfDelivery: string | null
  createdAt: string
}

interface Driver {
  id: string
  name: string
  phone: string
  email: string
  licenseNumber: string
  vehicleType: string
  vehiclePlate: string
  status: string
  currentDeliveries: number
}

// Mock delivery data
const mockDeliveries: Delivery[] = [
  {
    id: "DEL-001",
    orderId: "ORD-001",
    customerId: "1",
    customerName: "Maria Santos",
    customerPhone: "+63 912 345 6789",
    deliveryAddress: "123 Main St, Quezon City",
    driverId: "1",
    driverName: "Carlos Mendoza",
    driverPhone: "+63 918 765 4321",
    scheduledDate: "2024-01-16T14:00:00",
    actualDeliveryDate: null,
    status: "Scheduled",
    priority: "Normal",
    deliveryFee: 50,
    items: [
      { productName: "5-Gallon Water Jug", quantity: 3 },
      { productName: "1-Gallon Water Bottle", quantity: 5 },
    ],
    notes: "Please call before delivery",
    proofOfDelivery: null,
    createdAt: "2024-01-15T10:30:00",
  },
  {
    id: "DEL-002",
    orderId: "ORD-003",
    customerId: "3",
    customerName: "Ana Rodriguez",
    customerPhone: "+63 905 876 5432",
    deliveryAddress: "789 Pine Rd, Pasig City",
    driverId: "2",
    driverName: "Miguel Santos",
    driverPhone: "+63 917 234 5678",
    scheduledDate: "2024-01-15T11:30:00",
    actualDeliveryDate: "2024-01-15T11:45:00",
    status: "Delivered",
    priority: "Normal",
    deliveryFee: 50,
    items: [{ productName: "1-Gallon Water Bottle", quantity: 10 }],
    notes: "",
    proofOfDelivery: "Received by customer - Ana Rodriguez",
    createdAt: "2024-01-14T16:45:00",
  },
  {
    id: "DEL-003",
    orderId: "ORD-004",
    customerId: "2",
    customerName: "Juan Dela Cruz",
    customerPhone: "+63 917 234 5678",
    deliveryAddress: "456 Oak Ave, Makati City",
    driverId: "1",
    driverName: "Carlos Mendoza",
    driverPhone: "+63 918 765 4321",
    scheduledDate: "2024-01-16T09:00:00",
    actualDeliveryDate: null,
    status: "In Transit",
    priority: "High",
    deliveryFee: 75,
    items: [{ productName: "5-Gallon Water Jug", quantity: 8 }],
    notes: "Urgent delivery - customer event",
    proofOfDelivery: null,
    createdAt: "2024-01-15T08:00:00",
  },
]

const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    phone: "+63 918 765 4321",
    email: "carlos@aquaflow.com",
    licenseNumber: "N01-12-345678",
    vehicleType: "Delivery Truck",
    vehiclePlate: "ABC-1234",
    status: "Active",
    currentDeliveries: 2,
  },
  {
    id: "2",
    name: "Miguel Santos",
    phone: "+63 917 234 5678",
    email: "miguel@aquaflow.com",
    licenseNumber: "N01-98-765432",
    vehicleType: "Van",
    vehiclePlate: "XYZ-5678",
    status: "Active",
    currentDeliveries: 1,
  },
]

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState(mockDeliveries)
  const [drivers, setDrivers] = useState(mockDrivers)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("deliveries")
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Calendar className="h-4 w-4" />
      case "In Transit":
        return <Truck className="h-4 w-4" />
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />
      case "Failed":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

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

  const handleViewDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setIsDetailsDialogOpen(true)
  }

  const handleEditDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setIsDeliveryDialogOpen(true)
  }

  const handleAddDelivery = () => {
    setSelectedDelivery(null)
    setIsDeliveryDialogOpen(true)
  }

  const handleAddDriver = () => {
    setSelectedDriver(null)
    setIsDriverDialogOpen(true)
  }

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver)
    setIsDriverDialogOpen(true)
  }

  const handleSaveDelivery = (deliveryData: Partial<Delivery>) => {
    if (selectedDelivery) {
      setDeliveries(deliveries.map((d) => (d.id === selectedDelivery.id ? { ...d, ...deliveryData } : d)))
    } else {
      const newDelivery: Delivery = {
        id: `DEL-${String(deliveries.length + 1).padStart(3, "0")}`,
        orderId: deliveryData.orderId || '',
        customerId: deliveryData.customerId || '',
        customerName: deliveryData.customerName || '',
        customerPhone: deliveryData.customerPhone || '',
        deliveryAddress: deliveryData.deliveryAddress || '',
        driverId: deliveryData.driverId || '',
        driverName: deliveryData.driverName || '',
        driverPhone: deliveryData.driverPhone || '',
        scheduledDate: deliveryData.scheduledDate || '',
        actualDeliveryDate: deliveryData.actualDeliveryDate || null,
        status: deliveryData.status || 'Scheduled',
        priority: deliveryData.priority || 'Normal',
        deliveryFee: deliveryData.deliveryFee || 0,
        items: deliveryData.items || [],
        notes: deliveryData.notes || '',
        proofOfDelivery: deliveryData.proofOfDelivery || null,
        createdAt: new Date().toISOString(),
      }
      setDeliveries([...deliveries, newDelivery])
    }
    setIsDeliveryDialogOpen(false)
  }

  const handleSaveDriver = (driverData: Partial<Driver>) => {
    if (selectedDriver) {
      setDrivers(drivers.map((d) => (d.id === selectedDriver.id ? { ...d, ...driverData } : d)))
    } else {
      const newDriver: Driver = {
        id: Date.now().toString(),
        name: driverData.name || "",
        phone: driverData.phone || "",
        email: driverData.email || "",
        licenseNumber: driverData.licenseNumber || "",
        vehicleType: driverData.vehicleType || "",
        vehiclePlate: driverData.vehiclePlate || "",
        status: driverData.status || "Active",
        currentDeliveries: 0,
      }
      setDrivers([...drivers, newDriver])
    }
    setIsDriverDialogOpen(false)
  }

  const deliveryStats = {
    total: deliveries.length,
    scheduled: deliveries.filter((d) => d.status === "Scheduled").length,
    inTransit: deliveries.filter((d) => d.status === "In Transit").length,
    delivered: deliveries.filter((d) => d.status === "Delivered").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Delivery Management</h2>
          <p className="text-muted-foreground">Track deliveries, manage drivers, and optimize routes</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleAddDriver} 
            className="gap-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 font-medium shadow-sm"
          >
            <User className="h-4 w-4" />
            Add Driver
          </Button>
          <Button 
            onClick={handleAddDelivery} 
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 hover:border-blue-700 font-medium shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Schedule Delivery
          </Button>
        </div>
      </div>

      {/* Delivery Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{deliveryStats.scheduled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{deliveryStats.inTransit}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{deliveryStats.delivered}</div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Management Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Operations</CardTitle>
          <CardDescription>Manage deliveries, drivers, and track delivery status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search deliveries, customers, or drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
            </TabsList>

            <TabsContent value="deliveries" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Delivery ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Scheduled</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-medium">{delivery.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{delivery.customerName}</div>
                            <div className="text-sm text-muted-foreground">{delivery.customerPhone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-1 max-w-[200px]">
                            <MapPin className="h-3 w-3 mt-1 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm truncate">{delivery.deliveryAddress}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{delivery.driverName}</div>
                            <div className="text-sm text-muted-foreground">{delivery.driverPhone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(delivery.scheduledDate).toLocaleDateString()}
                            <br />
                            <span className="text-muted-foreground">
                              {new Date(delivery.scheduledDate).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityVariant(delivery.priority)}>{delivery.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(delivery.status)} className="gap-1">
                            {getStatusIcon(delivery.status)}
                            {delivery.status}
                          </Badge>
                        </TableCell>
                        <TableCell>₱{delivery.deliveryFee.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleViewDelivery(delivery)}
                              className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent hover:border-blue-300 dark:hover:border-blue-700"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditDelivery(delivery)}
                              className="h-8 w-8 hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-600 dark:hover:text-green-400 border border-transparent hover:border-green-300 dark:hover:border-green-700"
                            >
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

            <TabsContent value="drivers" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>License</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Current Deliveries</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{driver.name}</div>
                            <div className="text-sm text-muted-foreground">{driver.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell className="font-mono text-sm">{driver.licenseNumber}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{driver.vehicleType}</div>
                            <div className="text-sm text-muted-foreground">{driver.vehiclePlate}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{driver.currentDeliveries}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={driver.status === "Active" ? "default" : "secondary"}>{driver.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditDriver(driver)}
                              className="h-8 w-8 hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-600 dark:hover:text-green-400 border border-transparent hover:border-green-300 dark:hover:border-green-700"
                            >
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
          </Tabs>
        </CardContent>
      </Card>

      <DeliveryDialog
        open={isDeliveryDialogOpen}
        onOpenChange={setIsDeliveryDialogOpen}
        delivery={selectedDelivery}
        drivers={drivers}
        onSave={handleSaveDelivery}
      />

      <DeliveryDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        delivery={selectedDelivery}
      />

      <DriverDialog
        open={isDriverDialogOpen}
        onOpenChange={setIsDriverDialogOpen}
        driver={selectedDriver}
        onSave={handleSaveDriver}
      />
    </div>
  )
}
