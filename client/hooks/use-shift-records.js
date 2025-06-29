"use client"

import { useState, useEffect, useCallback } from "react"
import axiosInstance from "@/lib/axiosInstance"

export function useShiftRecords() {
  const [shiftRecords, setShiftRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentQuery, setCurrentQuery] = useState({})

  // Build query parameters based on date filters
  const buildQueryParams = useCallback((day, month, year) => {
    const params = new URLSearchParams()

    if (day && month && year) {
      // Query specific date
      params.append("day", day)
      params.append("month", month)
      params.append("year", year)
    } else if (month && year) {
      // Query by month
      params.append("month", month)
      params.append("year", year)
    } else if (year) {
      // Query by year
      params.append("year", year)
    }
    // If no params, API will return today's records by default

    return params.toString()
  }, [])

  // Fetch shift records from API
  const fetchShiftRecords = useCallback(
    async (day, month, year, abortController) => {
      try {
        setLoading(true)
        setError(null)

        const config = {}
        if (abortController) {
          config.signal = abortController.signal
        }

        const queryString = buildQueryParams(day, month, year)
        const url = "/shiftrecords" + (queryString ? `?${queryString}` : "")

        console.log("Fetching shift records with URL:", url)

        const response = await axiosInstance.get(url, config)

        // Check if request was aborted
        if (abortController && abortController.signal.aborted) {
          return
        }

        if (response.data.message === "success" && response.data.data) {
          setShiftRecords(response.data.data)
          setCurrentQuery({ day, month, year })
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
        console.error("Error fetching shift records:", err)
      } finally {
        if (!abortController || !abortController.signal.aborted) {
          setLoading(false)
        }
      }
    },
    [buildQueryParams],
  )

  // Search by date range
  const searchByDate = useCallback(
    async (day, month, year) => {
      await fetchShiftRecords(day, month, year)
    },
    [fetchShiftRecords],
  )

  // Get today's records
  const getTodayRecords = useCallback(async () => {
    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    await fetchShiftRecords(day, month, year)
  }, [fetchShiftRecords])

  // Get current month records
  const getCurrentMonthRecords = useCallback(async () => {
    const today = new Date()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    await fetchShiftRecords(null, month, year)
  }, [fetchShiftRecords])

  // Get current year records
  const getCurrentYearRecords = useCallback(async () => {
    const today = new Date()
    const year = today.getFullYear()
    await fetchShiftRecords(null, null, year)
  }, [fetchShiftRecords])

  // Initialize data on mount - get today's records by default
  useEffect(() => {
    const abortController = new AbortController()

    const initializeShiftRecords = async () => {
      // Default to today's records
      await getTodayRecords()
    }

    initializeShiftRecords()

    // Cleanup function
    return () => {
      abortController.abort()
    }
  }, [getTodayRecords])

  return {
    shiftRecords,
    loading,
    error,
    currentQuery,
    searchByDate,
    getTodayRecords,
    getCurrentMonthRecords,
    getCurrentYearRecords,
    refetch: () => fetchShiftRecords(currentQuery.day, currentQuery.month, currentQuery.year),
  }
}
