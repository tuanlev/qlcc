"use client"

import { useState, useEffect, useCallback } from "react"
import axiosInstance from "@/lib/axiosInstance"

export function useEmployees() {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [positions, setPositions] = useState([])
  const [shifts, setShifts] = useState([])
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  // Fetch employees from API with optional keyword and departmentId
  const fetchEmployees = useCallback(async (keyword, departmentId, abortController) => {
    try {
      setLoading(true)
      setError(null)

      const config = {}
      if (abortController) {
        config.signal = abortController.signal
      }

      // Build query parameters
      const queryParams = new URLSearchParams()
      if (keyword) queryParams.append("keyword", keyword)
      if (departmentId && departmentId !== "all") queryParams.append("departmentId", departmentId)

      const queryString = queryParams.toString()
      const url = "/employees" + (queryString ? `?${queryString}` : "")

      const response = await axiosInstance.get(url, config)

      // Check if request was aborted
      if (abortController && abortController.signal.aborted) {
        return
      }

      if (response.data.message === "success" && response.data.data) {
        setEmployees(response.data.data)
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
      console.error("Error fetching employees:", err)
    } finally {
      if (!abortController || !abortController.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  // Fetch reference data (departments, positions, shifts, devices)
  const fetchReferenceData = useCallback(async () => {
    try {
      const [deptResponse, posResponse, shiftResponse, deviceResponse] = await Promise.all([
        axiosInstance.get("/departments"),
        axiosInstance.get("/positions"),
        axiosInstance.get("/shifts"),
        axiosInstance.get("/devices"),
      ])

      if (deptResponse.data.message === "success" && deptResponse.data.data) {
        setDepartments(deptResponse.data.data)
      }
      if (posResponse.data.message === "success" && posResponse.data.data) {
        setPositions(posResponse.data.data)
      }
      if (shiftResponse.data.message === "success" && shiftResponse.data.data) {
        setShifts(shiftResponse.data.data)
      }
      if (deviceResponse.data.message === "success" && deviceResponse.data.data) {
        setDevices(deviceResponse.data.data)
      }
    } catch (err) {
      console.error("Error fetching reference data:", err)
    }
  }, [])

  // Search employees with keyword and department filter
  const searchEmployees = useCallback(
    async (keyword, departmentId) => {
      setSearchKeyword(keyword || "")
      setDepartmentFilter(departmentId || "all")
      await fetchEmployees(keyword, departmentId)
    },
    [fetchEmployees],
  )

  // Search by department only
  const searchByDepartment = useCallback(
    async (departmentId) => {
      setDepartmentFilter(departmentId)
      await fetchEmployees(searchKeyword, departmentId)
    },
    [fetchEmployees, searchKeyword],
  )

  // Clear search and fetch all employees
  const clearSearch = useCallback(async () => {
    setSearchKeyword("")
    setDepartmentFilter("all")
    await fetchEmployees()
  }, [fetchEmployees])

  // Add new employee
  const addEmployee = async (employeeData) => {
    try {
      setError(null)
      const response = await axiosInstance.post("/employees", employeeData)

      if (response.status < 300) {
        // Refresh the employees list with current search keyword
        await fetchEmployees(searchKeyword || undefined, departmentFilter !== "all" ? departmentFilter : undefined)
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to add employee"
      setError(errorMessage)
      console.error("Error adding employee:", err)
      throw new Error(errorMessage)
    }
  }

  // Update employee - using the API response data directly
  const updateEmployee = async (employeeId, updateData) => {
    try {
      setError(null)

      // Make the API call using PATCH
      const response = await axiosInstance.patch(`/employees/${employeeId}`, updateData)

      if (response.status < 300) {
        // Use the complete updated employee data from API response
        const updatedEmployeeData = response.data.data

        // Update local state with the complete data from API
        setEmployees((prev) =>
          prev.map((emp) => {
            if (emp.employeeId === employeeId) {
              // Return the complete updated employee data from API
              return updatedEmployeeData
            }
            return emp
          }),
        )
        return true // Return success indicator
      } else {
        throw new Error(response.data.message || "Update failed")
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update employee"
      setError(errorMessage)
      console.error("Error updating employee:", err)
      throw new Error(errorMessage)
    }
  }

  // Delete employee
  const deleteEmployee = async (employeeId) => {
    try {
      setError(null)
      const response = await axiosInstance.delete(`/employees/${employeeId}`)

      if (response.status < 300) {
        // Remove from local state optimistically
        setEmployees((prev) => prev.filter((emp) => emp.employeeId !== employeeId))
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete employee"
      setError(errorMessage)
      console.error("Error deleting employee:", err)
      // Refresh data to revert optimistic update
      await fetchEmployees(searchKeyword || undefined, departmentFilter !== "all" ? departmentFilter : undefined)
      throw new Error(errorMessage)
    }
  }

  // Get employee by ID
  const getEmployeeById = useCallback(
    (employeeId) => {
      return employees.find((emp) => emp.employeeId === employeeId)
    },
    [employees],
  )

  // Initialize data on mount with proper cleanup
  useEffect(() => {
    const abortController = new AbortController()

    const initializeData = async () => {
      await Promise.all([fetchEmployees(undefined, "all", abortController), fetchReferenceData()])
    }

    initializeData()

    // Cleanup function
    return () => {
      abortController.abort()
    }
  }, [fetchEmployees, fetchReferenceData])

  return {
    employees,
    departments,
    positions,
    shifts,
    devices,
    loading,
    error,
    searchKeyword,
    departmentFilter,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
    searchByDepartment,
    clearSearch,
    getEmployeeById,
    refetch: () =>
      fetchEmployees(searchKeyword || undefined, departmentFilter !== "all" ? departmentFilter : undefined),
  }
}
