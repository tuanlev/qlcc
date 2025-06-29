import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "http://localhost:3002/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Helper function to update token
const updateToken = (newToken) => {
  if (typeof window !== "undefined" && newToken) {
    // Update localStorage
    localStorage.setItem("token", newToken)

    // Update cookie
    document.cookie = `token=${newToken}; path=/; max-age=86400; SameSite=Lax`

    // Dispatch event to notify auth context
    window.dispatchEvent(new CustomEvent("token-updated", { detail: { token: newToken } }))
  }
}

// Helper function to clear auth data
const clearAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    // Clear cookies
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }
}

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = token
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Check for new token in response headers (token rotation)
    const newToken =
      response.headers["authorization"] ||
      response.headers["Authorization"] ||
      response.headers["new-token"] ||
      response.headers["x-new-token"]

    if (newToken) {
      updateToken(newToken)
    }

    return response
  },
  (error) => {
    // Handle 401/403 errors
    if (error.response?.status === 403 || error.response?.status === 401) {
      clearAuthData()
      // Dispatch custom event to notify auth context
      window.dispatchEvent(new CustomEvent("auth-logout"))

      // Redirect to login
      window.location.replace("/")
    } else {
      // Check for new token even in error responses (some APIs do this)
      const newToken =
        error.response?.headers["authorization"] ||
        error.response?.headers["Authorization"] ||
        error.response?.headers["new-token"] ||
        error.response?.headers["x-new-token"]

      if (newToken) {
        updateToken(newToken)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance