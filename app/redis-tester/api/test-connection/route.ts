import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "ioredis"

interface ConnectionRequest {
  host: string
  port: string
  password?: string
  username?: string
  database?: string
  ssl?: boolean
}

function validateConnectionRequest(body: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!body.host || typeof body.host !== "string" || body.host.trim().length === 0) {
    errors.push("Host is required")
  } else if (body.host.length > 255) {
    errors.push("Host must be less than 255 characters")
  }

  if (!body.port || typeof body.port !== "string") {
    errors.push("Port is required")
  } else {
    const port = Number.parseInt(body.port)
    if (isNaN(port) || port < 1 || port > 65535) {
      errors.push("Port must be a valid number between 1 and 65535")
    }
  }

  if (body.database && typeof body.database === "string") {
    const db = Number.parseInt(body.database)
    if (isNaN(db) || db < 0 || db > 15) {
      errors.push("Database must be a number between 0 and 15")
    }
  }

  if (body.password && typeof body.password !== "string") {
    errors.push("Password must be a string")
  }

  if (body.username && typeof body.username !== "string") {
    errors.push("Username must be a string")
  }

  return { isValid: errors.length === 0, errors }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = validateConnectionRequest(body)
    if (!validation.isValid) {
      return NextResponse.json({ success: false, error: validation.errors.join(", ") }, { status: 400 })
    }

    const { host, port, password, username, database, ssl } = body as ConnectionRequest

    // Create Redis connection configuration
    const config: any = {
      host: host.trim(),
      port: Number.parseInt(port),
      connectTimeout: 5000,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
    }

    if (password && password.trim()) config.password = password.trim()
    if (username && username.trim()) config.username = username.trim()
    if (database && database.trim()) config.db = Number.parseInt(database) || 0
    if (ssl) config.tls = {}

    console.log("DITools Attempting Redis connection with config:", {
      ...config,
      password: password ? "[REDACTED]" : undefined,
    })

    const redis = new Redis(config)

    // Test the connection with timeout
    const start = Date.now()

    const connectWithTimeout = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Connection timeout after 5 seconds"))
      }, 5000)

      redis
        .connect()
        .then(() => {
          clearTimeout(timeout)
          resolve(true)
        })
        .catch((error) => {
          clearTimeout(timeout)
          reject(error)
        })
    })

    await connectWithTimeout

    // Test basic operations with error handling
    const pingResult = await redis.ping()
    const testKey = `test:connection:${Date.now()}`
    const setResult = await redis.set(testKey, "success", "EX", 10)
    const getResult = await redis.get(testKey)
    await redis.del(testKey)

    const responseTime = Date.now() - start

    // Get server info with error handling
    let serverInfo: any = {}
    try {
      const info = await redis.info("server")
      serverInfo = info.split("\r\n").reduce((acc: any, line: string) => {
        if (line.includes(":")) {
          const [key, value] = line.split(":")
          acc[key] = value
        }
        return acc
      }, {})
    } catch (infoError) {
      console.log("DITools Could not retrieve server info:", infoError)
    }

    await redis.disconnect()

    console.log("DITools Redis connection successful")

    return NextResponse.json({
      success: true,
      message: "Connection successful!",
      details: {
        ping: pingResult,
        responseTime: `${responseTime}ms`,
        version: serverInfo.redis_version || "Unknown",
        mode: serverInfo.redis_mode || "Unknown",
        connectedClients: serverInfo.connected_clients || "Unknown",
        usedMemory: serverInfo.used_memory_human || "Unknown",
      },
    })
  } catch (error: any) {
    console.log("DITools Redis connection failed:", error.message)

    let errorMessage = error.message || "Connection failed"
    let errorCode = "UNKNOWN_ERROR"

    if (error.code) {
      errorCode = error.code
    }

    // Provide more specific error messages
    if (error.message?.includes("ECONNREFUSED")) {
      errorMessage = "Connection refused - Redis server may not be running or accessible"
    } else if (error.message?.includes("ETIMEDOUT") || error.message?.includes("timeout")) {
      errorMessage = "Connection timeout - Please check host, port, and network connectivity"
    } else if (error.message?.includes("ENOTFOUND")) {
      errorMessage = "Host not found - Please verify the hostname or IP address"
    } else if (error.message?.includes("WRONGPASS")) {
      errorMessage = "Authentication failed - Invalid password"
    } else if (error.message?.includes("NOAUTH")) {
      errorMessage = "Authentication required - Please provide a password"
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: {
          code: errorCode,
          errno: error.errno,
          syscall: error.syscall,
        },
      },
      { status: 400 },
    )
  }
}
