"use client"

import { useState, useEffect, useCallback } from "react"
import axiosInstance from "@/lib/axiosInstance"

export function useDevices() {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState("")

  // Fetch devices from API with optional keyword
  const fetchDevices = useCallback(async (keyword, abortController) => {
    try {
      setLoading(true)
      setError(null)

      const config = {}
      if (abortController) {
        config.signal = abortController.signal
      }

      const response = await axiosInstance.get("/devices" + (keyword ? `?keyword=${keyword}` : ""), config)

      // Check if request was aborted
      if (abortController && abortController.signal.aborted) {
        return
      }

      if (response.data.message === "success" && response.data.data) {
        setDevices(response.data.data)
      } else if (Array.isArray(response.data)) {
        // Handle case where response.data is directly an array
        setDevices(response.data)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      // Don't set error if request was aborted
      if (
        err.name === "AbortError" ||
        err.code === "ERR_CANCELED" ||
        (abortController && abortController.signal.aborted)
      ) {
        return
      }

      const errorMessage = err.response?.data?.message || err.message || "An error occurred"
      setError(errorMessage)
      console.error("Error fetching devices:", err)
    } finally {
      if (!abortController || !abortController.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  // Search devices with keyword
  const searchDevices = useCallback(
    async (keyword) => {
      setSearchKeyword(keyword)
      await fetchDevices(keyword)
    },
    [fetchDevices],
  )

  // Clear search and fetch all devices
  const clearSearch = useCallback(async () => {
    setSearchKeyword("")
    await fetchDevices()
  }, [fetchDevices])

  // Add new device
  const addDevice = async (deviceData) => {
    try {
      setError(null)
      const response = await axiosInstance.post("/devices", deviceData)

      if (response.data.message === "success" || response.data.message === "Device created successfully") {
        // Refresh the devices list with current search keyword
        await fetchDevices(searchKeyword || undefined)
        return { success: true, data: response.data }
      } else {
        throw new Error(response.data.message || "Failed to create device")
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to add device"
      setError(errorMessage)
      console.error("Error adding device:", err)
      throw new Error(errorMessage)
    }
  }

  // Update device using PATCH
  const updateDevice = async (deviceId, updateData) => {
    try {
      setError(null)

      // Make the API call using PATCH
      const response = await axiosInstance.patch(`/devices/${deviceId}`, updateData)

      if (response.data.message === "success" || response.data.message === "Device updated successfully") {
        // Update local state optimistically
        setDevices((prev) =>
          prev.map((device) => {
            if (device.deviceId === deviceId) {
              return { ...device, ...updateData }
            }
            return device
          }),
        )
        return true // Return success indicator
      } else {
        throw new Error(response.data.message || "Update failed")
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update device"
      setError(errorMessage)
      console.error("Error updating device:", err)
      throw new Error(errorMessage)
    }
  }

  // Delete device
  const deleteDevice = async (deviceId) => {
    try {
      setError(null)
      const response = await axiosInstance.delete(`/devices/${deviceId}`)

      if (response.data.message === "success" || response.data.message === "Device deleted successfully") {
        // Remove from local state optimistically
        setDevices((prev) => prev.filter((device) => device.deviceId !== deviceId))
        return true
      } else {
        throw new Error(response.data.message || "Delete failed")
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete device"
      setError(errorMessage)
      console.error("Error deleting device:", err)
      // Refresh data to revert optimistic update
      await fetchDevices(searchKeyword || undefined)
      throw new Error(errorMessage)
    }
  }

  // Get device by ID
  const getDeviceById = useCallback(
    (deviceId) => {
      return devices.find((device) => device.deviceId === deviceId)
    },
    [devices],
  )

  // Initialize data on mount with proper cleanup
  useEffect(() => {
    const abortController = new AbortController()

    const initializeDevices = async () => {
      await fetchDevices(undefined, abortController)
    }

    initializeDevices()

    // Cleanup function
    return () => {
      abortController.abort()
    }
  }, [fetchDevices])

  return {
    devices,
    loading,
    error,
    searchKeyword,
    addDevice,
    updateDevice,
    deleteDevice,
    searchDevices,
    clearSearch,
    getDeviceById,
    refetch: () => fetchDevices(searchKeyword || undefined),
  }
}
