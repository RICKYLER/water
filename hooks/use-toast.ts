"use client"

import { useState, useCallback } from "react"

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  duration?: number
}

interface ToastState {
  toasts: Toast[]
}

let toastCount = 0

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] })

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 3000, ...props }: Omit<Toast, "id">) => {
      const id = (++toastCount).toString()
      const newToast: Toast = {
        id,
        title,
        description,
        variant,
        duration,
        ...props,
      }

      setState((prevState) => ({
        toasts: [...prevState.toasts, newToast],
      }))

      // Auto-dismiss toast after duration
      if (duration > 0) {
        setTimeout(() => {
          dismiss(id)
        }, duration)
      }

      return {
        id,
        dismiss: () => dismiss(id),
        update: (props: Partial<Toast>) => update(id, props),
      }
    },
    []
  )

  const dismiss = useCallback((toastId?: string) => {
    setState((prevState) => ({
      toasts: toastId
        ? prevState.toasts.filter((toast) => toast.id !== toastId)
        : [],
    }))
  }, [])

  const update = useCallback((toastId: string, props: Partial<Toast>) => {
    setState((prevState) => ({
      toasts: prevState.toasts.map((toast) =>
        toast.id === toastId ? { ...toast, ...props } : toast
      ),
    }))
  }, [])

  return {
    toast,
    dismiss,
    toasts: state.toasts,
  }
}