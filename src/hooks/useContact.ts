import { useState } from "react"
import api from "@/lib/api"
import type { ContactFormData } from "@/types"

export function useContact() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(data: ContactFormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await api.post("/api/contact", data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        ?? "Erro ao enviar. Tente novamente."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return { loading, success, error, submit }
}
