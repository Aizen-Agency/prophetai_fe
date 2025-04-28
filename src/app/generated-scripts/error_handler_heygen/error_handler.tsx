"use client"

import { useEffect, useState } from "react"
import { AlertCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type ErrorType = {
  type: "missing_attributes" | "backend_error" | "api_error" | "network_error"
  message: string
}

type ErrorHandlerProps = {
  error: ErrorType | null
  onClose: () => void
}

export const HeyGenErrorHandler = ({ error, onClose }: ErrorHandlerProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (error) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 5000) // Auto-dismiss after 5 seconds
      return () => clearTimeout(timer)
    }
  }, [error, onClose])

  if (!error) return null

  const getErrorColor = (type: ErrorType["type"]) => {
    switch (type) {
      case "missing_attributes":
        return "bg-yellow-500/20 border-yellow-500/50"
      case "backend_error":
        return "bg-red-500/20 border-red-500/50"
      case "api_error":
        return "bg-purple-500/20 border-purple-500/50"
      case "network_error":
        return "bg-blue-500/20 border-blue-500/50"
      default:
        return "bg-gray-500/20 border-gray-500/50"
    }
  }

  const getErrorIcon = (type: ErrorType["type"]) => {
    switch (type) {
      case "missing_attributes":
        return "⚠️"
      case "backend_error":
        return "🔧"
      case "api_error":
        return "🔑"
      case "network_error":
        return "🌐"
      default:
        return "❌"
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md`}
        >
          <div
            className={`${getErrorColor(
              error.type
            )} rounded-lg border p-4 shadow-lg backdrop-blur-sm`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-2xl">{getErrorIcon(error.type)}</span>
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-white">
                  {error.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => {
                    setIsVisible(false)
                    onClose()
                  }}
                  className="inline-flex text-white hover:text-white/70 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
