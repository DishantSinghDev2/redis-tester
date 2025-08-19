import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Server, Zap } from "lucide-react"

export function ApiDocumentation() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            API Endpoints
          </CardTitle>
          <CardDescription>Technical documentation for the Redis testing API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">POST</Badge>
                <code className="text-sm font-mono">/api/test-connection</code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Test Redis server connectivity and retrieve server information
              </p>

              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-sm mb-2">Request Body:</h5>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                    {`{
  "host": "localhost",
  "port": "6379",
  "password": "optional",
  "username": "optional",
  "database": "0",
  "ssl": false
}`}
                  </pre>
                </div>

                <div>
                  <h5 className="font-medium text-sm mb-2">Success Response:</h5>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                    {`{
  "success": true,
  "message": "Connection successful!",
  "details": {
    "ping": "PONG",
    "responseTime": "15ms",
    "version": "7.0.0",
    "mode": "standalone",
    "connectedClients": "1",
    "usedMemory": "1.2M"
  }
}`}
                  </pre>
                </div>

                <div>
                  <h5 className="font-medium text-sm mb-2">Error Response:</h5>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                    {`{
  "success": false,
  "error": "Connection refused",
  "details": {
    "code": "ECONNREFUSED",
    "errno": -61,
    "syscall": "connect"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">POST</Badge>
                <code className="text-sm font-mono">/api/test-commands</code>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Execute Redis commands and return results</p>

              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-sm mb-2">Request Body:</h5>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                    {`{
  "connectionConfig": {
    "host": "localhost",
    "port": "6379",
    "password": "optional"
  },
  "commands": ["PING", "SET test hello", "GET test"]
}`}
                  </pre>
                </div>

                <div>
                  <h5 className="font-medium text-sm mb-2">Success Response:</h5>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                    {`{
  "success": true,
  "results": [
    {
      "command": "PING",
      "success": true,
      "result": "PONG",
      "responseTime": "2ms"
    },
    {
      "command": "SET test hello",
      "success": true,
      "result": "OK",
      "responseTime": "1ms"
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Integration Examples
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">JavaScript/Node.js</h4>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                {`// Test Redis connection
const response = await fetch('/api/test-connection', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    host: 'localhost',
    port: '6379',
    password: 'your-password'
  })
});

const result = await response.json();
console.log(result.success ? 'Connected!' : 'Failed:', result.error);`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-2">Python</h4>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                {`import requests

# Test Redis connection
response = requests.post('/api/test-connection', json={
    'host': 'localhost',
    'port': '6379',
    'password': 'your-password'
})

result = response.json()
print('Connected!' if result['success'] else f"Failed: {result['error']}")`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-2">cURL</h4>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                {`curl -X POST /api/test-connection \\
  -H "Content-Type: application/json" \\
  -d '{
    "host": "localhost",
    "port": "6379",
    "password": "your-password"
  }'`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Rate Limits & Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Connection Testing:</strong> No rate limits applied
            </p>
            <p className="text-sm">
              <strong>Command Execution:</strong> Limited to 10 commands per request
            </p>
            <p className="text-sm">
              <strong>Timeout:</strong> 5 seconds per connection attempt
            </p>
            <p className="text-sm">
              <strong>Concurrent Connections:</strong> 1 per request (connections are closed after testing)
            </p>
          </div>

          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Note:</strong> This tool is designed for testing and development purposes. For production
              monitoring, consider using dedicated Redis monitoring solutions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
