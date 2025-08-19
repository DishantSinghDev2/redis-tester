"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Database, Clock, Users, HardDrive, AlertTriangle } from "lucide-react"

interface ConnectionConfig {
  host: string
  port: string
  password: string
  username: string
  database: string
  ssl: boolean
}

interface ConnectionResult {
  success: boolean
  message?: string
  error?: string
  details?: {
    ping?: string
    responseTime?: string
    version?: string
    mode?: string
    connectedClients?: string
    usedMemory?: string
  }
}

interface CommandResult {
  command: string
  success: boolean
  result?: any
  error?: string
  responseTime?: string
}

interface ValidationErrors {
  host?: string
  port?: string
  database?: string
  commands?: string
}

export function RedisConnectionTester() {
  const [config, setConfig] = useState<ConnectionConfig>({
    host: "localhost",
    port: "6379",
    password: "",
    username: "",
    database: "0",
    ssl: false,
  })

  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionResult, setConnectionResult] = useState<ConnectionResult | null>(null)
  const [commands, setCommands] = useState("PING\nSET test:key hello\nGET test:key\nDEL test:key")
  const [isExecuting, setIsExecuting] = useState(false)
  const [commandResults, setCommandResults] = useState<CommandResult[]>([])
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [connectionError, setConnectionError] = useState<string>("")

  const validateInputs = (): boolean => {
    const errors: ValidationErrors = {}

    // Host validation
    if (!config.host.trim()) {
      errors.host = "Host is required"
    } else if (config.host.length > 255) {
      errors.host = "Host must be less than 255 characters"
    }

    // Port validation
    if (!config.port.trim()) {
      errors.port = "Port is required"
    } else {
      const portNum = Number.parseInt(config.port)
      if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        errors.port = "Port must be a number between 1 and 65535"
      }
    }

    // Database validation
    if (config.database.trim()) {
      const dbNum = Number.parseInt(config.database)
      if (isNaN(dbNum) || dbNum < 0 || dbNum > 15) {
        errors.database = "Database must be a number between 0 and 15"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateCommands = (): boolean => {
    const errors: ValidationErrors = {}

    if (!commands.trim()) {
      errors.commands = "At least one command is required"
    } else {
      const commandList = commands.split("\n").filter((cmd) => cmd.trim())
      if (commandList.length > 10) {
        errors.commands = "Maximum 10 commands allowed per request"
      }

      // Check for potentially dangerous commands
      const dangerousCommands = ["FLUSHDB", "FLUSHALL", "SHUTDOWN", "DEBUG", "CONFIG"]
      const hasDangerous = commandList.some((cmd) =>
        dangerousCommands.some((dangerous) => cmd.trim().toUpperCase().startsWith(dangerous)),
      )

      if (hasDangerous) {
        errors.commands = "Dangerous commands (FLUSHDB, FLUSHALL, SHUTDOWN, etc.) are not allowed"
      }
    }

    setValidationErrors((prev) => ({ ...prev, commands: errors.commands }))
    return !errors.commands
  }

  const handleInputChange = (field: keyof ConnectionConfig, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    // Clear connection error when inputs change
    if (connectionError) {
      setConnectionError("")
    }
  }

  const testConnection = async () => {
    if (!validateInputs()) {
      return
    }

    setIsConnecting(true)
    setConnectionResult(null)
    setConnectionError("")

    try {
      const response = await fetch("/redis-tester/api/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      const result = await response.json()
      setConnectionResult(result)

      if (!result.success) {
        setConnectionError(getConnectionErrorMessage(result.error, result.details))
      }
    } catch (error) {
      const errorMessage = "Failed to connect to server. Please check your network connection."
      setConnectionResult({
        success: false,
        error: errorMessage,
      })
      setConnectionError(errorMessage)
    } finally {
      setIsConnecting(false)
    }
  }

  const getConnectionErrorMessage = (error: string, details?: any): string => {
    if (error.includes("ECONNREFUSED")) {
      return "Connection refused. Please check if Redis server is running and accessible."
    }
    if (error.includes("ETIMEDOUT") || error.includes("timeout")) {
      return "Connection timeout. Please check your host, port, and network connectivity."
    }
    if (error.includes("WRONGPASS")) {
      return "Authentication failed. Please check your password."
    }
    if (error.includes("NOAUTH")) {
      return "Authentication required. Please provide a password."
    }
    if (error.includes("ENOTFOUND")) {
      return "Host not found. Please check the hostname or IP address."
    }
    if (error.includes("SSL") || error.includes("TLS")) {
      return "SSL/TLS connection failed. Please check your SSL settings."
    }
    return error || "An unexpected error occurred."
  }

  const executeCommands = async () => {
    if (!connectionResult?.success) {
      setConnectionError("Please test the connection first!")
      return
    }

    if (!validateCommands()) {
      return
    }

    setIsExecuting(true)
    setCommandResults([])

    try {
      const commandList = commands.split("\n").filter((cmd) => cmd.trim())

      const response = await fetch("/redis-tester/api/test-commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connectionConfig: config,
          commands: commandList,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setCommandResults(result.results)
      } else {
        setConnectionError(result.error || "Failed to execute commands")
      }
    } catch (error) {
      setConnectionError("Failed to execute commands. Please try again.")
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="space-y-6">
      {connectionError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{connectionError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Redis Connection
          </CardTitle>
          <CardDescription>Enter your Redis connection details to test the connection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">Host *</Label>
              <Input
                id="host"
                value={config.host}
                onChange={(e) => handleInputChange("host", e.target.value)}
                placeholder="localhost"
                className={validationErrors.host ? "border-destructive" : ""}
              />
              {validationErrors.host && <p className="text-sm text-destructive">{validationErrors.host}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port *</Label>
              <Input
                id="port"
                value={config.port}
                onChange={(e) => handleInputChange("port", e.target.value)}
                placeholder="6379"
                className={validationErrors.port ? "border-destructive" : ""}
              />
              {validationErrors.port && <p className="text-sm text-destructive">{validationErrors.port}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username (optional)</Label>
              <Input
                id="username"
                value={config.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="database">Database</Label>
              <Input
                id="database"
                value={config.database}
                onChange={(e) => handleInputChange("database", e.target.value)}
                placeholder="0"
                className={validationErrors.database ? "border-destructive" : ""}
              />
              {validationErrors.database && <p className="text-sm text-destructive">{validationErrors.database}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password (optional)</Label>
            <Input
              id="password"
              type="password"
              value={config.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="password"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="ssl" checked={config.ssl} onCheckedChange={(checked) => handleInputChange("ssl", checked)} />
            <Label htmlFor="ssl">Use SSL/TLS</Label>
          </div>

          <Button onClick={testConnection} disabled={isConnecting} className="w-full">
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Connection Result */}
      {connectionResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {connectionResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={connectionResult.success ? "default" : "destructive"}>
                  {connectionResult.success ? "Connected" : "Failed"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {connectionResult.message || connectionResult.error}
                </span>
              </div>

              {connectionResult.success && connectionResult.details && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Response: {connectionResult.details.responseTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Version: {connectionResult.details.version}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Clients: {connectionResult.details.connectedClients}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Memory: {connectionResult.details.usedMemory}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Command Testing */}
      {connectionResult?.success && (
        <Card>
          <CardHeader>
            <CardTitle>Test Redis Commands</CardTitle>
            <CardDescription>Execute Redis commands to test functionality (max 10 commands)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commands">Commands (one per line)</Label>
              <Textarea
                id="commands"
                value={commands}
                onChange={(e) => {
                  setCommands(e.target.value)
                  if (validationErrors.commands) {
                    setValidationErrors((prev) => ({ ...prev, commands: undefined }))
                  }
                }}
                placeholder="PING&#10;SET key value&#10;GET key"
                rows={6}
                className={validationErrors.commands ? "border-destructive" : ""}
              />
              {validationErrors.commands && <p className="text-sm text-destructive">{validationErrors.commands}</p>}
              <p className="text-xs text-muted-foreground">
                {commands.split("\n").filter((cmd) => cmd.trim()).length} / 10 commands
              </p>
            </div>

            <Button onClick={executeCommands} disabled={isExecuting} className="w-full">
              {isExecuting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Executing Commands...
                </>
              ) : (
                "Execute Commands"
              )}
            </Button>

            {commandResults.length > 0 && (
              <div className="space-y-2">
                <Separator />
                <h4 className="font-medium">Results:</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {commandResults.map((result, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono">{result.command}</code>
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          {result.responseTime && (
                            <span className="text-xs text-muted-foreground">{result.responseTime}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm">
                        {result.success ? (
                          <pre className="whitespace-pre-wrap">
                            {typeof result.result === "string" ? result.result : JSON.stringify(result.result, null, 2)}
                          </pre>
                        ) : (
                          <span className="text-destructive">{result.error}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
