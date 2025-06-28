"use client"

import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"

export function useSocket(url) {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5

  const connect = () => {
    try {
      console.log("Connecting to Socket.IO server:", url)

      const socketInstance = io(url, {
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: maxReconnectAttempts,
        autoConnect: true,
      })

      // ✅ FIXED: Use "connect" instead of "connection" for client
      socketInstance.on("connect", () => {
        console.log("Socket.IO connected:", socketInstance.id)
        setIsConnected(true)
        setError(null)
        reconnectAttemptsRef.current = 0
      })

      socketInstance.on("disconnect", (reason) => {
        console.log("Socket.IO disconnected:", reason)
        setIsConnected(false)

        // Auto reconnect for certain disconnect reasons
        if (reason === "io server disconnect") {
          // Server initiated disconnect, try to reconnect
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            const timeout = Math.pow(2, reconnectAttemptsRef.current) * 1000
            console.log(`Reconnecting in ${timeout}ms... (attempt ${reconnectAttemptsRef.current + 1})`)

            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectAttemptsRef.current++
              socketInstance.connect()
            }, timeout)
          }
        }
      })

      socketInstance.on("connect_error", (error) => {
        console.error("Socket.IO connection error:", error)
        setError(`Connection error: ${error.message}`)
        setIsConnected(false)
      })

      socketInstance.on("reconnect", (attemptNumber) => {
        console.log("Socket.IO reconnected after", attemptNumber, "attempts")
        setIsConnected(true)
        setError(null)
      })

      socketInstance.on("reconnect_error", (error) => {
        console.error("Socket.IO reconnection error:", error)
        setError(`Reconnection error: ${error.message}`)
      })

      socketInstance.on("reconnect_failed", () => {
        console.error("Socket.IO reconnection failed")
        setError("Failed to reconnect after maximum attempts")
      })

      setSocket(socketInstance)
    } catch (err) {
      console.error("Failed to create Socket.IO connection:", err)
      setError("Failed to connect")
    }
  }

  useEffect(() => {
    if (url) {
      connect()
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (socket) {
        console.log("Disconnecting Socket.IO...")
        socket.disconnect()
      }
    }
  }, [url])

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (socket) {
      socket.disconnect()
    }
  }

  return {
    socket,
    isConnected,
    error,
    connect,
    disconnect,
  }
}
