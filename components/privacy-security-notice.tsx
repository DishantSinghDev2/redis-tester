"use client"

import { Shield, Eye, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function PrivacySecurityNotice() {
  const clearBrowserData = () => {
    // Clear localStorage
    localStorage.clear()

    // Clear sessionStorage
    sessionStorage.clear()

    // Clear any cookies for this domain
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=")
      const name = eqPos > -1 ? c.substr(0, eqPos) : c
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
    })

    // Clear any cached data
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name)
        })
      })
    }

    alert("All browser data has been cleared. You may want to refresh the page.")
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Shield className="h-5 w-5" />
          Privacy & Security Notice
        </CardTitle>
        <CardDescription className="text-orange-700">
          Important information about how this tool works and your data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-green-200 bg-green-50">
          <Eye className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>100% Client-Side Processing:</strong> All Redis connections are made directly from your browser. No
            data passes through our servers - everything stays between you and your Redis instance.
          </AlertDescription>
        </Alert>

        <div className="space-y-3 text-sm text-orange-800">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>
              <strong>Your connection details never leave your browser</strong> - they're only stored locally for
              convenience
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>
              <strong>No server-side logging</strong> - we don't see, store, or track your Redis credentials
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>
              <strong>Use at your own risk</strong> - always use test credentials, never production passwords
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
            <p>
              <strong>HTTPS recommended</strong> - ensure you're using a secure connection when testing
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-orange-200">
          <Button
            onClick={clearBrowserData}
            variant="outline"
            size="sm"
            className="w-full border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Browser Data & Traces
          </Button>
          <p className="text-xs text-orange-600 mt-2 text-center">
            This will remove all stored connection details and cached data from your browser
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
