'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const AccountManagerPage = () => {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const accountInfo = {
    type: "Premium Savings",
    limit: "$20,000.00",
    status: "Active",
    verification: "Level 2",
    manager: {
      name: "Sandra M. Johnson",
      email: "sandra.johnson@banktrust.com",
      phone: "+1 (555) 678-9012"
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Account Overview</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Account Type</span>
            <span>{accountInfo.type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Account Limit</span>
            <span>{accountInfo.limit}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Status</span>
            <Badge variant="outline" className="bg-green-400">{accountInfo.status}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Verification Level</span>
            <Badge variant="secondary">{accountInfo.verification}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Account Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Name</span>
            <span>{accountInfo.manager.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Email</span>
            <div className="flex items-center gap-2">
              <span>{accountInfo.manager.email}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleCopy(accountInfo.manager.email)}
              >
                <Copy className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Phone</span>
            <div className="flex items-center gap-2">
              <span>{accountInfo.manager.phone}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleCopy(accountInfo.manager.phone)}
              >
                <Copy className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="outline" className="mt-4" onClick={() => window.location.href = "mailto:support@banktrust.com"}>
          Contact Support
        </Button>
      </div>
    </div>
  )
}

export default AccountManagerPage