"use client"

import { useState, useEffect, useCallback } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { useDevices } from "./use-devices"

export function useUsers() {
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState("")

  // Use devices hook instead of managing devices state separately
  const { devices, loading: devicesLoading, error: devicesError } = useDevices()

  const loading = usersLoading || devicesLoading
  const error = usersError || devicesError

  // Fetch users from API with optional keyword
  const fetchUsers = useCallback(async (keyword, abortController) => {
    try {
      setUsersLoading(true)
      setUsersError(null)

      const config = {}
      if (abortController) {
        config.signal = abortController.signal
      }

      const response = await axiosInstance.get("/users" + (keyword ? `?keyword=${keyword}` : ""), config)

      // Check if request was aborted
      if (abortController && abortController.signal.aborted) {
        return
      }

      // Check for success message variations and data existence
      if ((response.status < 300) && response.data.data) {
        setUsers(response.data.data)
      } else if (Array.isArray(response.data)) {
        // Handle case where response.data is directly an array
        setUsers(response.data)
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
      setUsersError(errorMessage)
      console.error("Error fetching users:", err)
    } finally {
      if (!abortController || !abortController.signal.aborted) {
        setUsersLoading(false)
      }
    }
  }, [])

  // Search users with keyword
  const searchUsers = useCallback(
    async (keyword) => {
      setSearchKeyword(keyword)
      await fetchUsers(keyword)
    },
    [fetchUsers],
  )

  // Clear search and fetch all users
  const clearSearch = useCallback(async () => {
    setSearchKeyword("")
    await fetchUsers()
  }, [fetchUsers])

  // Add new user
  const addUser = async (userData) => {
    try {
      setUsersError(null)
      const response = await axiosInstance.post("/auth/register", userData)

      if (response.status<300) {
        // Refresh the users list with current search keyword
        await fetchUsers(searchKeyword || undefined)
        return { success: true, data: response.data }
      } else {
        throw new Error(response.data.message || "Failed to create user")
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to add user"
      setUsersError(errorMessage)
      console.error("Error adding user:", err)
      throw new Error(errorMessage)
    }
  }

  // Update user using PATCH
  const updateUser = async (userId, updateData) => {
    try {
      setUsersError(null)

      // Make the API call using PATCH
      const response = await axiosInstance.patch(`/users/${userId}`, updateData)

      if (response.data.message === "success" || response.data.message === "User updated successfully") {
        // Update local state optimistically
        setUsers((prev) =>
          prev.map((user) => {
            if (user.userId === userId) {
              return { ...user, ...updateData }
            }
            return user
          }),
        )
        return true // Return success indicator
      } else {
        throw new Error(response.data.message || "Update failed")
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update user"
      setUsersError(errorMessage)
      console.error("Error updating user:", err)
      throw new Error(errorMessage)
    }
  }

  // Delete user
  const deleteUser = async (userId) => {
    try {
      setUsersError(null)
      const response = await axiosInstance.delete(`/users/${userId}`)

      if (response.data.message === "success" || response.data.message === "User deleted successfully") {
        // Remove from local state optimistically
        setUsers((prev) => prev.filter((user) => user.userId !== userId))
        return true
      } else {
        throw new Error(response.data.message || "Delete failed")
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete user"
      setUsersError(errorMessage)
      console.error("Error deleting user:", err)
      // Refresh data to revert optimistic update
      await fetchUsers(searchKeyword || undefined)
      throw new Error(errorMessage)
    }
  }

  // Reset user password
  const resetPassword = async (userId) => {
    try {
      setUsersError(null)
      const response = await axiosInstance.get(`/users/reset/${userId}`)

      if (response.status<=300) {
        return { success: true, data: response.data }
      } else {
        throw new Error(response.data.message || "Password reset failed")
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to reset password"
      setUsersError(errorMessage)
      console.error("Error resetting password:", err)
      throw new Error(errorMessage)
    }
  }

  // Get user by ID
  const getUserById = useCallback(
    (userId) => {
      return users.find((user) => user.userId === userId)
    },
    [users],
  )

  // Initialize data on mount with proper cleanup
  useEffect(() => {
    const abortController = new AbortController()

    const initializeData = async () => {
      await fetchUsers(undefined, abortController)
    }

    initializeData()

    // Cleanup function
    return () => {
      abortController.abort()
    }
  }, [fetchUsers])

  return {
    users,
    devices,
    loading,
    error,
    searchKeyword,
    addUser,
    updateUser,
    deleteUser,
    resetPassword,
    searchUsers,
    clearSearch,
    getUserById,
    refetch: () => fetchUsers(searchKeyword || undefined),
  }
}
