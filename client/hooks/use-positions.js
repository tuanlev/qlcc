"use client"

import { useState, useEffect, useCallback } from "react"
import axiosInstance from "../lib/axiosInstance"

export function usePositions() {
  const [positions, setPositions] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState("")

  // Fetch positions from API with optional keyword
  const fetchPositions = useCallback(async (keyword, abortController) => {
    try {
      setLoading(true)
      setError(null)

      const config = {}
      if (abortController) {
        config.signal = abortController.signal
      }

      const response = await axiosInstance.get("/positions" + (keyword ? `?keyword=${keyword}` : ""), config)

      // Check if request was aborted
      if (abortController && abortController.signal.aborted) {
        return
      }

      if (response.status < 300) {
        setPositions(response.data.data)
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
      console.error("Error fetching positions:", err)
    } finally {
      if (!abortController || !abortController.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  // Fetch departments for dropdown
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/departments")
      if (response.status < 300) {
        setDepartments(response.data.data)
      }
    } catch (err) {
      console.error("Error fetching departments:", err)
    }
  }, [])

  // Search positions with keyword
  const searchPositions = useCallback(
    async (keyword) => {
      setSearchKeyword(keyword)
      await fetchPositions(keyword)
    },
    [fetchPositions],
  )

  // Clear search and fetch all positions
  const clearSearch = useCallback(async () => {
    setSearchKeyword("")
    await fetchPositions()
  }, [fetchPositions])

  // Add new position
  const addPosition = async (positionData) => {
    try {
      setError(null)
      const response = await axiosInstance.post("/positions", positionData)

      if (response.status < 300) {
        // Refresh the positions list with current search keyword
        await fetchPositions(searchKeyword || undefined)
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to add position"
      setError(errorMessage)
      console.error("Error adding position:", err)
      throw new Error(errorMessage)
    }
  }

  // Update position using PATCH
  const updatePosition = async (positionId, updateData) => {
    try {
      setError(null)

      // Make the API call using PATCH
      const response = await axiosInstance.patch(`/positions/${positionId}`, updateData)

      if (response.status < 300) {
        // Update local state optimistically
        setPositions((prev) =>
          prev.map((pos) => {
            if (pos.positionId === positionId) {
              const updatedPosition = { ...pos }
              if (updateData.positionName) {
                updatedPosition.positionName = updateData.positionName
              }
              if (updateData.departmentId) {
                // Find the department info
                const dept = departments.find((d) => d.departmentId === updateData.departmentId)
                if (dept) {
                  updatedPosition.department = dept
                }
              }
              return updatedPosition
            }
            return pos
          }),
        )
        return true // Return success indicator
      } else {
        throw new Error(response.data.message || "Update failed")
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update position"
      setError(errorMessage)
      console.error("Error updating position:", err)
      throw new Error(errorMessage)
    }
  }

  // Delete position
  const deletePosition = async (positionId) => {
    try {
      setError(null)
      const response = await axiosInstance.delete(`/positions/${positionId}`)

      if (response.status < 300) {
        // Remove from local state optimistically
        setPositions((prev) => prev.filter((pos) => pos.positionId !== positionId))
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete position"
      setError(errorMessage)
      console.error("Error deleting position:", err)
      // Refresh data to revert optimistic update
      await fetchPositions(searchKeyword || undefined)
      throw new Error(errorMessage)
    }
  }

  // Initialize data on mount with proper cleanup
  useEffect(() => {
    const abortController = new AbortController()

    const initializeData = async () => {
      await Promise.all([fetchPositions(undefined, abortController), fetchDepartments()])
    }

    initializeData()

    // Cleanup function
    return () => {
      abortController.abort()
    }
  }, [fetchPositions, fetchDepartments])

  return {
    positions,
    departments,
    loading,
    error,
    searchKeyword,
    addPosition,
    updatePosition,
    deletePosition,
    searchPositions,
    clearSearch,
    refetch: () => fetchPositions(searchKeyword || undefined),
  }
}
