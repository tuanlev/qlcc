"use client"

import { useState, useEffect, useCallback } from "react"
import axiosInstance from "@/lib/axiosInstance"

export function useShifts() {
  const [shifts, setShifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState("")

  // Fetch shifts from API with optional keyword
  const fetchShifts = useCallback(async (keyword, abortController) => {
    try {
      setLoading(true)
      setError(null)

      const config = {}
      if (abortController) {
        config.signal = abortController.signal
      }

      const response = await axiosInstance.get("/shifts" + (keyword ? `?keyword=${keyword}` : ""), config)

      // Check if request was aborted
      if (abortController && abortController.signal.aborted) {
        return
      }

      if (response.status < 300) {
        setShifts(response.data.data)
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
      console.error("Error fetching shifts:", err)
    } finally {
      if (!abortController || !abortController.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  // Search shifts with keyword
  const searchShifts = useCallback(
    async (keyword) => {
      setSearchKeyword(keyword)
      await fetchShifts(keyword)
    },
    [fetchShifts],
  )

  // Clear search and fetch all shifts
  const clearSearch = useCallback(async () => {
    setSearchKeyword("")
    await fetchShifts()
  }, [fetchShifts])

  // Add new shift
  const addShift = async (shiftData) => {
    try {
      setError(null)
      const response = await axiosInstance.post("/shifts", shiftData)

      if (response.data.message === "success") {
        // Refresh the shifts list with current search keyword
        await fetchShifts(searchKeyword || undefined)
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to add shift"
      setError(errorMessage)
      console.error("Error adding shift:", err)
      throw new Error(errorMessage)
    }
  }

  // Update shift
  const updateShift = async (shiftId, shiftData) => {
    try {
      setError(null)

      // Make the API call
      const response = await axiosInstance.patch(`/shifts/${shiftId}`, shiftData)

      if (response.data.message === "success") {
        // Update local state optimistically
        setShifts((prev) => prev.map((shift) => (shift.shiftId === shiftId ? { ...shift, ...shiftData } : shift)))
        return true // Return success indicator
      } else {
        throw new Error(response.data.message || "Update failed")
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update shift"
      setError(errorMessage)
      console.error("Error updating shift:", err)
      throw new Error(errorMessage)
    }
  }

  // Delete shift
  const deleteShift = async (shiftId) => {
    try {
      setError(null)
      const response = await axiosInstance.delete(`/shifts/${shiftId}`)

      if (response.status < 300) {
        // Remove from local state optimistically
        setShifts((prev) => prev.filter((shift) => shift.shiftId !== shiftId))
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete shift"
      setError(errorMessage)
      console.error("Error deleting shift:", err)
      // Refresh data to revert optimistic update
      await fetchShifts(searchKeyword || undefined)
      throw new Error(errorMessage)
    }
  }

  // Initialize data on mount with proper cleanup
  useEffect(() => {
    const abortController = new AbortController()

    const initializeShifts = async () => {
      await fetchShifts(undefined, abortController)
    }

    initializeShifts()

    // Cleanup function
    return () => {
      abortController.abort()
    }
  }, [fetchShifts])

  return {
    shifts,
    loading,
    error,
    searchKeyword,
    addShift,
    updateShift,
    deleteShift,
    searchShifts,
    clearSearch,
    refetch: () => fetchShifts(searchKeyword || undefined),
  }
}
