import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface Props {
  children: React.ReactNode
  role: 'student' | 'admin'
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated()) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/portal/login'} replace />
  }

  if (role === 'admin' && user?.role !== 'admin' && user?.role !== 'super_admin') {
    return <Navigate to="/" replace />
  }

  if (role === 'student' && user?.role !== 'student') {
    return <Navigate to="/portal/login" replace />
  }

  return <>{children}</>
}
