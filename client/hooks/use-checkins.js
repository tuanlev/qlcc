"use client"

import { useState, useEffect, useCallback } from "react"
import { useSocket } from "./use-socket"
import { useCurrentUser } from "./use-current-user"
import axiosInstance from "@/lib/axiosInstance"

export function useCheckins() {
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, loading: userLoading } = useCurrentUser()

  // Socket.IO connection for real-time updates
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3002"
  const { socket, isConnected, error: socketError } = useSocket(socketUrl)

  // Filter checkins by user's device
  const filterCheckinsByDevice = useCallback(
    (checkinsData) => {
      if (!user?.device?.deviceId) {
        console.log("No user device found, showing all checkins")
        return checkinsData
      }

      const userDeviceId = user.device.deviceId
      console.log("Filtering checkins for device:", userDeviceId)

      return checkinsData.filter((checkin) => {
        // Handle both 'devide' (typo) and 'device' fields
        const checkinDeviceId = checkin.devide?.deviceId || checkin.device?.deviceId
        const matches = checkinDeviceId === userDeviceId

        if (matches) {
          console.log("Checkin matches device:", checkin)
        }

        return matches
      })
    },
    [user],
  )

  // Fetch initial checkins data
  const fetchCheckins = useCallback(async () => {
    if (userLoading) return // Wait for user data to load

    try {
      setLoading(true)
      setError(null)

      const response = await axiosInstance.get("/checkins")

      if (response.data.message === "success" && response.data.data) {
        const filteredCheckins = filterCheckinsByDevice(response.data.data)
        setCheckins(filteredCheckins)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch checkins"
      setError(errorMessage)
      console.error("Error fetching checkins:", err)
    } finally {
      setLoading(false)
    }
  }, [filterCheckinsByDevice, userLoading])

  // Handle real-time socket events
  useEffect(() => {
    if (socket && isConnected && user) {
      console.log("Setting up Socket.IO event listeners for user:", user.username || user.name)

      // Listen for new checkin events
      const handleCheckin = (data) => {
        try {
          console.log("Received checkin event:", data)

          // Check if the checkin is from user's device
          const checkinDeviceId = data.devide?.deviceId || data.device?.deviceId
          const userDeviceId = user.device?.deviceId

          if (checkinDeviceId === userDeviceId) {
            console.log("New checkin from user device:", data)

            // Add new checkin to the beginning of the list
            setCheckins((prev) => {
              // Check if this checkin already exists to avoid duplicates
              const exists = prev.some(
                (checkin) =>
                  checkin.employee?.employeeId === data.employee?.employeeId && checkin.timestamp === data.timestamp,
              )

              if (exists) {
                console.log("Checkin already exists, skipping...")
                return prev
              }

              // Add new checkin and keep max 100 checkins
              return [data, ...prev.slice(0, 99)]
            })
          } else {
            console.log("Checkin from different device, ignoring:", {
              checkinDevice: checkinDeviceId,
              userDevice: userDeviceId,
            })
          }
        } catch (err) {
          console.error("Error handling checkin event:", err)
        }
      }

      // Listen for checkin updates
      const handleCheckinUpdate = (data) => {
        try {
          console.log("Received checkin update event:", data)

          const checkinDeviceId = data.devide?.deviceId || data.device?.deviceId
          const userDeviceId = user.device?.deviceId

          if (checkinDeviceId === userDeviceId) {
            setCheckins((prev) =>
              prev.map((checkin) =>
                checkin.employee?.employeeId === data.employee?.employeeId && checkin.timestamp === data.timestamp
                  ? data
                  : checkin,
              ),
            )
          }
        } catch (err) {
          console.error("Error handling checkin update event:", err)
        }
      }

      // Listen for batch checkin updates
      const handleCheckinsBatch = (data) => {
        try {
          console.log("Received checkins batch event:", data)

          if (Array.isArray(data)) {
            const filteredCheckins = filterCheckinsByDevice(data)
            setCheckins(filteredCheckins)
          }
        } catch (err) {
          console.error("Error handling checkins batch event:", err)
        }
      }

      // Register event listeners
      socket.on("checkin", handleCheckin)
      socket.on("checkin_update", handleCheckinUpdate)
      socket.on("checkins_batch", handleCheckinsBatch)

      // Cleanup function
      return () => {
        console.log("Cleaning up Socket.IO event listeners")
        socket.off("checkin", handleCheckin)
        socket.off("checkin_update", handleCheckinUpdate)
        socket.off("checkins_batch", handleCheckinsBatch)
      }
    }
  }, [socket, isConnected, user, filterCheckinsByDevice])

  // Initial data fetch when user data is available
  useEffect(() => {
    if (!userLoading) {
      fetchCheckins()
    }
  }, [fetchCheckins, userLoading])

  // Log connection status changes
  useEffect(() => {
    if (isConnected) {
      console.log("Socket.IO connected successfully")
    } else {
      console.log("Socket.IO disconnected")
    }
  }, [isConnected])

  return {
    checkins,
    loading: loading || userLoading,
    error: error || socketError,
    isConnected,
    user,
    refetch: fetchCheckins,
  }
}
