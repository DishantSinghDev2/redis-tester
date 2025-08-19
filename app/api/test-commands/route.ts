import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "ioredis"

const DANGEROUS_COMMANDS = [
  "FLUSHDB",
  "FLUSHALL",
  "SHUTDOWN",
  "DEBUG",
  "CONFIG",
  "EVAL",
  "EVALSHA",
  "SCRIPT",
  "CLIENT",
  "MONITOR",
  "SYNC",
  "PSYNC",
  "REPLCONF",
  "RESTORE",
  "MIGRATE",
]

function validateCommands(commands: string[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!Array.isArray(commands) || commands.length === 0) {
    errors.push("At least one command is required")
    return { isValid: false, errors }
  }

  if (commands.length > 10) {
    errors.push("Maximum 10 commands allowed per request")
  }

  // Check for dangerous commands
  const hasDangerous = commands.some((cmd) =>
    DANGEROUS_COMMANDS.some((dangerous) => cmd.trim().toUpperCase().startsWith(dangerous)),
  )

  if (hasDangerous) {
    errors.push("Dangerous commands are not allowed for security reasons")
  }

  // Check command length
  const tooLong = commands.some((cmd) => cmd.length > 1000)
  if (tooLong) {
    errors.push("Commands must be less than 1000 characters each")
  }

  return { isValid: errors.length === 0, errors }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { connectionConfig, commands } = body

    if (!connectionConfig || !commands) {
      return NextResponse.json(
        { success: false, error: "Connection config and commands are required" },
        { status: 400 },
      )
    }

    const commandValidation = validateCommands(commands)
    if (!commandValidation.isValid) {
      return NextResponse.json({ success: false, error: commandValidation.errors.join(", ") }, { status: 400 })
    }

    // Create Redis connection
    const config: any = {
      host: connectionConfig.host,
      port: Number.parseInt(connectionConfig.port),
      connectTimeout: 5000,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    }

    if (connectionConfig.password) config.password = connectionConfig.password
    if (connectionConfig.username) config.username = connectionConfig.username
    if (connectionConfig.database) config.db = Number.parseInt(connectionConfig.database) || 0
    if (connectionConfig.ssl) config.tls = {}

    const redis = new Redis(config)

    const connectWithTimeout = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Connection timeout"))
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

    const results = []

    // Execute each command with individual error handling
    for (const command of commands) {
      try {
        const start = Date.now()
        const args = command.trim().split(/\s+/)
        const cmd = args[0].toLowerCase()
        const cmdArgs = args.slice(1)

        let result
        if (cmd === "get") {
          result = await redis.get(cmdArgs[0])
        } else if (cmd === "set") {
          if (cmdArgs.length < 2) {
            throw new Error("SET requires key and value")
          }
          result = await redis.set(cmdArgs[0], cmdArgs[1])
        } else if (cmd === "del") {
          if (cmdArgs.length === 0) {
            throw new Error("DEL requires at least one key")
          }
          result = await redis.del(...cmdArgs)
        } else if (cmd === "exists") {
          if (cmdArgs.length === 0) {
            throw new Error("EXISTS requires at least one key")
          }
          result = await redis.exists(...cmdArgs)
        } else if (cmd === "keys") {
          result = await redis.keys(cmdArgs[0] || "*")
        } else if (cmd === "ping") {
          result = await redis.ping()
        } else if (cmd === "info") {
          result = await redis.info(cmdArgs[0])
        } else if (cmd === "ttl") {
          if (cmdArgs.length === 0) {
            throw new Error("TTL requires a key")
          }
          result = await redis.ttl(cmdArgs[0])
        } else if (cmd === "type") {
          if (cmdArgs.length === 0) {
            throw new Error("TYPE requires a key")
          }
          result = await redis.type(cmdArgs[0])
        } else {
          // Generic command execution with validation
          if (DANGEROUS_COMMANDS.some((dangerous) => cmd.toUpperCase().startsWith(dangerous))) {
            throw new Error(`Command ${cmd.toUpperCase()} is not allowed`)
          }
          result = await (redis as any)[cmd](...cmdArgs)
        }

        const responseTime = Date.now() - start

        results.push({
          command,
          success: true,
          result,
          responseTime: `${responseTime}ms`,
        })
      } catch (error: any) {
        results.push({
          command,
          success: false,
          error: error.message || "Command execution failed",
        })
      }
    }

    await redis.disconnect()

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error: any) {
    console.log("[v0] Command execution failed:", error.message)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to execute commands",
      },
      { status: 400 },
    )
  }
}
