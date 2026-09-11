import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import PortalLayout from './components/layout/PortalLayout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Public pages
import Home from './pages/public/Home'
import About from './pages/public/About'
import Admissions from './pages/public/Admissions'
import Programmes from './pages/public/Programmes'
import Contact from './pages/public/Contact'
import Team from './pages/public/Team'
import Alumni from './pages/public/Alumni'
import NewsEvents from './pages/public/NewsEvents'
import Partnership from './pages/public/Partnership'
import Shop from './pages/public/Shop'
import Gallery from './pages/public/Gallery'

// Portal pages
import StudentLogin from './pages/portal/StudentLogin'
import StudentDashboard from './pages/portal/StudentDashboard'
import StudentProfile from './pages/portal/StudentProfile'
import StudentCourses from './pages/portal/StudentCourses'
import StudentResults from './pages/portal/StudentResults'
import StudentExams from './pages/portal/StudentExams'
import StudentPayments from './pages/portal/StudentPayments'
import TakeExam from './pages/portal/TakeExam'

// Admin pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminStudents from './pages/admin/AdminStudents'
import AdminCourses from './pages/admin/AdminCourses'
import AdminResults from './pages/admin/AdminResults'
import AdminExams from './pages/admin/AdminExams'
import AdminPayments from './pages/admin/AdminPayments'
import AdminShop from './pages/admin/AdminShop'
import AdminContent from './pages/admin/AdminContent'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/programmes" element={<Programmes />} />
          <Route path="/team" element={<Team />} />
          <Route path="/news-events" element={<NewsEvents />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/partnership" element={<Partnership />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
        </Route>

        {/* Student Portal */}
        <Route path="/portal/login" element={<StudentLogin />} />
        <Route path="/portal" element={<ProtectedRoute role="student"><PortalLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/portal/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="exams" element={<StudentExams />} />
          <Route path="exams/:examId/take" element={<TakeExam />} />
          <Route path="payments" element={<StudentPayments />} />
        </Route>

        {/* Admin Panel */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="results" element={<AdminResults />} />
          <Route path="exams" element={<AdminExams />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="shop" element={<AdminShop />} />
          <Route path="content" element={<AdminContent />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
