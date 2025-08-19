import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Server, Shield, Zap, AlertCircle, CheckCircle } from "lucide-react"

export function UserGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>Get started with Redis connection testing in just a few steps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">
                1
              </Badge>
              <div>
                <h4 className="font-medium">Enter Connection Details</h4>
                <p className="text-sm text-muted-foreground">
                  Fill in your Redis server host, port, and authentication details
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">
                2
              </Badge>
              <div>
                <h4 className="font-medium">Test Connection</h4>
                <p className="text-sm text-muted-foreground">
                  Click "Test Connection" to verify your Redis server is accessible
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">
                3
              </Badge>
              <div>
                <h4 className="font-medium">Execute Commands</h4>
                <p className="text-sm text-muted-foreground">
                  Once connected, test Redis commands to verify functionality
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Connection Examples
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Local Redis</h4>
              <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                Host: localhost
                <br />
                Port: 6379
                <br />
                Password: (leave empty)
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Redis Cloud</h4>
              <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                Host: redis-12345.c1.us-east-1-1.ec2.cloud.redislabs.com
                <br />
                Port: 12345
                <br />
                Password: your-password
                <br />
                SSL: ✓ Enabled
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">AWS ElastiCache</h4>
              <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                Host: your-cluster.cache.amazonaws.com
                <br />
                Port: 6379
                <br />
                SSL: ✓ Enabled (recommended)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Common Redis Commands
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">PING</code>
              <p className="text-sm text-muted-foreground mt-1">Test server connectivity</p>
            </div>

            <div>
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">SET key value</code>
              <p className="text-sm text-muted-foreground mt-1">Store a key-value pair</p>
            </div>

            <div>
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">GET key</code>
              <p className="text-sm text-muted-foreground mt-1">Retrieve a value by key</p>
            </div>

            <div>
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">KEYS pattern</code>
              <p className="text-sm text-muted-foreground mt-1">List keys matching pattern</p>
            </div>

            <div>
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">INFO</code>
              <p className="text-sm text-muted-foreground mt-1">Get server information</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            <p className="text-sm">All connections are made directly from your browser</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            <p className="text-sm">No credentials are stored on our servers</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            <p className="text-sm">SSL/TLS encryption supported for secure connections</p>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
            <p className="text-sm">Only use with trusted Redis instances</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
