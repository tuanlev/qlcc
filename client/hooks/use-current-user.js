"use client"

import { useState, useEffect } from "react"

export function useCurrentUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserData = () => {
      try {
        // Try to get user from localStorage first
        const userDataFromStorage = localStorage.getItem("user")
        if (userDataFromStorage) {
          const userData = JSON.parse(userDataFromStorage)
          setUser(userData)
          setLoading(false)
          return
        }

        // Fallback to cookie if localStorage is empty
        const cookies = document.cookie.split(";")
        const userCookie = cookies.find((cookie) => cookie.trim().startsWith("user="))

        if (userCookie) {
          const userDataFromCookie = userCookie.split("=")[1]
          const userData = JSON.parse(decodeURIComponent(userDataFromCookie))
          setUser(userData)
          setLoading(false)
          return
        }

        // No user data found
        setUser(null)
        setLoading(false)
      } catch (error) {
        console.error("Error parsing user data:", error)
        setUser(null)
        setLoading(false)
      }
    }

    getUserData()

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        getUserData()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return { user, loading }
}
