"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Lock } from "lucide-react"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    console.log("Login attempt with:", credentials.username)

    try {
      // Simulate authentication process
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Authentication simulation completed")

      // Check for specific driver credentials
      if (credentials.username === "driver" && credentials.password === "driver123") {
        // Driver authentication
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: "driver",
            role: "driver",
            name: "Driver User",
            loginTime: new Date().toISOString(),
          }),
        )
        router.push("/driver-dashboard")
        return
      }

      // Check for admin credentials (demo purposes)
      if (credentials.username === "admin" && credentials.password === "admin123") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: "admin",
            role: "admin",
            name: "Admin User",
            loginTime: new Date().toISOString(),
          }),
        )
        router.push("/dashboard")
        return
      }

      // Check for demo customer credentials
      if (credentials.username === "customer" && credentials.password === "customer123") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "demo-customer-1",
            username: "customer",
            role: "customer",
            fullName: "John Doe",
            email: "john.doe@example.com",
            phone: "+1234567890",
            address: "123 Main Street, City, State 12345",
            loginTime: new Date().toISOString(),
          }),
        )
        router.push("/customer-dashboard")
        return
      }

      // Check for registered customers
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const customer = registeredUsers.find((user: any) => 
        user.username === credentials.username && user.password === credentials.password && user.role === "customer"
      )

      if (customer) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: customer.id,
            username: customer.username,
            role: "customer",
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            loginTime: new Date().toISOString(),
          }),
        )
        router.push("/customer-dashboard")
        return
      }

      // For demo purposes, accept other credentials as admin
      if (credentials.username && credentials.password) {
        console.log("Login successful, redirecting user")
        // Determine user role based on username pattern
        let userRole = "admin"
        let redirectPath = "/dashboard"
        
        // Check if username indicates a driver account (legacy support)
        if (credentials.username.toLowerCase().includes("driver") || 
            credentials.username.toLowerCase().startsWith("drv") ||
            credentials.username.toLowerCase() === "carlos" ||
            credentials.username.toLowerCase() === "miguel") {
          userRole = "driver"
          redirectPath = "/driver-dashboard"
        }

        // Store user session (in real app, this would be handled by proper auth)
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: credentials.username,
            role: userRole,
            name: credentials.username,
            loginTime: new Date().toISOString(),
          }),
        )

        router.push(redirectPath)
      } else {
        setError("Please enter both username and password")
      }
    } catch (err) {
      setError("Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            className="pl-10"
            value={credentials.username}
            onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="pl-10"
            value={credentials.password}
            onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
            disabled={isLoading}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  )
}
