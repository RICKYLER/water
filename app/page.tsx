"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [isRegistering, setIsRegistering] = useState(false)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
       <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AquaFlow</h1>
          <p className="text-muted-foreground">Water Refilling Station Management System</p>
        </div>
               
        <Card className="border bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isRegistering ? "Create Account" : "Sign In"}
            </CardTitle>
            <CardDescription className="text-center">
              {isRegistering 
                ? "Create a new customer account to start ordering" 
                : "Enter your credentials to access the system"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRegistering ? (
              <RegisterForm onBackToLogin={() => setIsRegistering(false)} />
            ) : (
              <>
                <LoginForm />
                
                {/* Customer Registration Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    New customer?
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsRegistering(true)}
                    className="w-full"
                  >
                    Create Customer Account
                  </Button>
                </div>
                
                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="text-sm font-semibold mb-2">Demo Credentials:</h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div>
                      <strong>Driver Access:</strong>
                      <br />
                      Username: <code className="bg-background px-1 rounded">driver</code>
                      <br />
                      Password: <code className="bg-background px-1 rounded">driver123</code>
                    </div>
                    <div>
                      <strong>Admin Access:</strong>
                      <br />
                      Username: <code className="bg-background px-1 rounded">admin</code>
                      <br />
                      Password: <code className="bg-background px-1 rounded">admin123</code>
                    </div>
                    <div>
                      <strong>Customer Access:</strong>
                      <br />
                      Username: <code className="bg-background px-1 rounded">customer</code>
                      <br />
                      Password: <code className="bg-background px-1 rounded">customer123</code>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
