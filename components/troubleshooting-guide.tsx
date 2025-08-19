import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Wifi, Lock, Clock, Database, HelpCircle } from "lucide-react"

export function TroubleshootingGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Common Connection Issues
          </CardTitle>
          <CardDescription>Solutions for the most frequent Redis connection problems</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="border-l-4 border-destructive pl-4">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="h-4 w-4 text-destructive" />
                <h4 className="font-medium">Connection Refused / Timeout</h4>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Symptoms:</strong> "ECONNREFUSED" or "Connection timeout" errors
                </p>
                <p>
                  <strong>Solutions:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Verify the host and port are correct</li>
                  <li>Check if Redis server is running</li>
                  <li>Ensure firewall allows connections on the Redis port</li>
                  <li>For cloud services, check security groups/network ACLs</li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-amber-500 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-amber-600" />
                <h4 className="font-medium">Authentication Failed</h4>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Symptoms:</strong> "WRONGPASS" or "NOAUTH" errors
                </p>
                <p>
                  <strong>Solutions:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Double-check your password</li>
                  <li>Ensure username is provided if required (Redis 6+)</li>
                  <li>Verify ACL permissions for your user</li>
                  <li>Check if AUTH is required in redis.conf</li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">SSL/TLS Issues</h4>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Symptoms:</strong> SSL handshake failures or certificate errors
                </p>
                <p>
                  <strong>Solutions:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Enable SSL toggle if your Redis server uses TLS</li>
                  <li>Verify the server supports SSL on the specified port</li>
                  <li>Check if certificate is valid and not expired</li>
                  <li>For self-signed certificates, ensure proper configuration</li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-green-600" />
                <h4 className="font-medium">Database Selection Issues</h4>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Symptoms:</strong> Commands work but data seems missing
                </p>
                <p>
                  <strong>Solutions:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Verify you're connecting to the correct database number (0-15)</li>
                  <li>Use SELECT command to switch databases if needed</li>
                  <li>Check if your Redis instance supports multiple databases</li>
                  <li>Some cloud providers only support database 0</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Performance Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-2">Connection Optimization</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use connection pooling for production applications</li>
                <li>• Keep connections alive with periodic PING commands</li>
                <li>• Set appropriate timeout values for your use case</li>
                <li>• Use SSL only when necessary (adds latency)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Command Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Avoid KEYS * in production (use SCAN instead)</li>
                <li>• Use pipelining for multiple commands</li>
                <li>• Set expiration times on keys to prevent memory leaks</li>
                <li>• Monitor memory usage with INFO memory</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Redis Cloud Providers</CardTitle>
          <CardDescription>Connection details for popular Redis hosting services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Redis Cloud (Redis Labs)</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Host: Usually ends with .redislabs.com</p>
                <p>• Port: Custom port (not 6379)</p>
                <p>• SSL: Required for most plans</p>
                <p>• Auth: Username + password required</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">AWS ElastiCache</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Host: Cluster endpoint from AWS console</p>
                <p>• Port: 6379 (default) or custom</p>
                <p>• SSL: Optional but recommended</p>
                <p>• Auth: Optional, depends on configuration</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Google Cloud Memorystore</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Host: Internal IP from GCP console</p>
                <p>• Port: 6379 (default)</p>
                <p>• SSL: Available with AUTH enabled</p>
                <p>• Auth: Optional AUTH string</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Upstash</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Host: Provided in dashboard</p>
                <p>• Port: Custom port</p>
                <p>• SSL: Always required</p>
                <p>• Auth: Password required</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
