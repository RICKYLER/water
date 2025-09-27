"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, User, Mail, Phone, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CustomerData {
  fullName: string
  email: string
  phone: string
  address: string
  username: string
}

export default function CustomerProfile() {
  const router = useRouter()
  const { toast } = useToast()
  const [customerData, setCustomerData] = useState<CustomerData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    username: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      router.push('/')
      return
    }

    const userData = JSON.parse(currentUser)
    setCustomerData(userData)
  }, [router])

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      // Validate required fields
      if (!customerData.fullName || !customerData.email || !customerData.phone || !customerData.address) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        })
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(customerData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive"
        })
        return
      }

      // Validate phone format (simple validation)
      const phoneRegex = /^[0-9+\-\s()]+$/
      if (!phoneRegex.test(customerData.phone)) {
        toast({
          title: "Invalid Phone",
          description: "Please enter a valid phone number.",
          variant: "destructive"
        })
        return
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update localStorage
      localStorage.setItem('currentUser', JSON.stringify(customerData))

      // Update registered users list if exists
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      const updatedUsers = registeredUsers.map((user: CustomerData) => 
        user.username === customerData.username ? customerData : user
      )
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers))

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })

      // Navigate back to dashboard
      router.push('/customer-dashboard')
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/customer-dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Profile</h1>
              <p className="text-muted-foreground">Update your personal information and delivery address</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your profile details and delivery address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={customerData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  value={customerData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Delivery Address *
                </Label>
                <Textarea
                  id="address"
                  value={customerData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your complete delivery address including street, barangay, city, and postal code"
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Please provide a complete address for accurate delivery. Include landmarks if necessary.
                </p>
              </div>

              {/* Username (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={customerData.username}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Username cannot be changed
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Address Tips */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Address Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Include your complete street address with house/building number</p>
                <p>• Specify barangay, city, and postal code</p>
                <p>• Add nearby landmarks for easier location</p>
                <p>• Ensure the address is accessible for delivery vehicles</p>
                <p>• Double-check spelling and accuracy to avoid delivery delays</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}