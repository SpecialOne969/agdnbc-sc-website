import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export const api = axios.create({
  baseURL: (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/portal/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const studentLogin = (schoolId: string, password: string) =>
  api.post('/auth/student/login', { schoolId, password })

export const adminLogin = (email: string, password: string) =>
  api.post('/auth/admin/login', { email, password })

// Student Portal
export const getMyProfile = () => api.get('/students/me')
export const updateMyProfile = (data: Record<string, unknown>) => api.patch('/students/me', data)
export const getMyCourses = () => api.get('/students/me/courses')
export const getMyResults = () => api.get('/students/me/results')
export const getMyExams = () => api.get('/students/me/exams')
export const getMyPayments = () => api.get('/students/me/payments')
export const getMyAnnouncements = () => api.get('/students/me/announcements')
export const getExam = (id: string) => api.get(`/exams/${id}`)
export const submitExam = (id: string, answers: Record<string, unknown>) =>
  api.post(`/exams/${id}/submit`, { answers })

// Payments
export const initializePayment = (data: Record<string, unknown>) => api.post('/payments/initialize', data)

// Shop
export const getProducts = (params?: Record<string, unknown>) => api.get('/shop/products', { params })
export const createOrder = (data: Record<string, unknown>) => api.post('/shop/orders', data)

// Public
export const getNews = () => api.get('/content/news')
export const getEvents = () => api.get('/content/events')
export const getProgrammes = () => api.get('/content/programmes')
export const getTeam = () => api.get('/content/team')
export const submitContactForm = (data: Record<string, unknown>) => api.post('/content/contact', data)
export const submitAlumniRegistration = (data: Record<string, unknown>) => api.post('/alumni/register', data)
export const submitPartnershipForm = (data: Record<string, unknown>) => api.post('/partnerships', data)

// Admin
export const adminGetStudents = (params?: Record<string, unknown>) => api.get('/admin/students', { params })
export const adminCreateStudent = (data: Record<string, unknown>) => api.post('/admin/students', data)
export const adminUpdateStudent = (id: string, data: Record<string, unknown>) => api.patch(`/admin/students/${id}`, data)
export const adminGetPayments = () => api.get('/admin/payments')
export const adminUploadResults = (data: FormData) => api.post('/admin/results/upload', data)
export const adminCreateExam = (data: Record<string, unknown>) => api.post('/admin/exams', data)
export const adminGetExams = () => api.get('/admin/exams')
export const adminGetDashboardStats = () => api.get('/admin/dashboard')
