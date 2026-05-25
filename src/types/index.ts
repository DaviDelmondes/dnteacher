export interface ContactFormData {
  name: string
  phone: string
  email?: string
  service: string
  message?: string
}

export interface ApiResponse {
  success: boolean
  message?: string
  id?: string
  error?: string
}
