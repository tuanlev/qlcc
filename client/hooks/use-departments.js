"use client"

import { useState, useEffect, useCallback } from "react"
import axiosInstance from "@/lib/axiosInstance"
export function useDepartments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState("")

  // Fetch departments from API with optional keyword
  const fetchDepartments = useCallback(async (keyword, abortController) => {
    try {
      setLoading(true)
      setError(null)

      const config = {}
      if (abortController) {
        config.signal = abortController.signal
      }

      const response = await axiosInstance.get("/departments" + (keyword ? `?keyword=${keyword}` : ""), config)

      // Check if request was aborted
      if (abortController && abortController.signal.aborted) {
        return
      }

      if (response.data.message === "success" && response.data.data) {
        setDepartments(response.data.data)
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
      console.error("Error fetching departments:", err)
    } finally {
      if (!abortController || !abortController.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  // Search departments with keyword
  const searchDepartments = useCallback(
    async (keyword) => {
      setSearchKeyword(keyword)
      await fetchDepartments(keyword)
    },
    [fetchDepartments],
  )

  // Clear search and fetch all departments
  const clearSearch = useCallback(async () => {
    setSearchKeyword("")
    await fetchDepartments()
  }, [fetchDepartments])

  // Add new department
  const addDepartment = async (nameDepartment) => {
    try {
      setError(null)
      const response = await axiosInstance.post("/departments", { nameDepartment })

      if (response.data.message === "success") {
        // Refresh the departments list with current search keyword
        await fetchDepartments(searchKeyword || undefined)
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to add department"
      setError(errorMessage)
      console.error("Error adding department:", err)
      throw new Error(errorMessage)
    }
  }

  // Update department
  const updateDepartment = async (departmentId, nameDepartment) => {
    try {
      setError(null)

      // Make the API call
      const response = await axiosInstance.patch(`/departments/${departmentId}`, {
        nameDepartment,
      })

      if (response.data.message === "success") {
        // Update local state optimistically
        setDepartments((prev) =>
          prev.map((dept) => (dept.departmentId === departmentId ? { ...dept, nameDepartment } : dept)),
        )
        return true // Return success indicator
      } else {
        throw new Error(response.data.message || "Update failed")
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update department"
      setError(errorMessage)
      console.error("Error updating department:", err)

      // Don't refresh data here to avoid infinite loops
      // Let the component handle the error display
      throw new Error(errorMessage)
    }
  }

  // Delete department
  const deleteDepartment = async (departmentId) => {
    try {
      setError(null)
      const response = await axiosInstance.delete(`/departments/${departmentId}`)

      if (response.data.message === "success") {
        // Remove from local state optimistically
        setDepartments((prev) => prev.filter((dept) => dept.departmentId !== departmentId))
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete department"
      setError(errorMessage)
      console.error("Error deleting department:", err)
      // Refresh data to revert optimistic update
      await fetchDepartments(searchKeyword || undefined)
      throw new Error(errorMessage)
    }
  }

  // Initialize data on mount with proper cleanup
  useEffect(() => {
    const abortController = new AbortController()

    const initializeDepartments = async () => {
      await fetchDepartments(undefined, abortController)
    }

    initializeDepartments()

    // Cleanup function
    return () => {
      abortController.abort()
    }
  }, [fetchDepartments])

  return {
    departments,
    loading,
    error,
    searchKeyword,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    searchDepartments,
    clearSearch,
    refetch: () => fetchDepartments(searchKeyword || undefined),
  }
}
