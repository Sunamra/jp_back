import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import JobDetails from './components/admin/JobDetails'
import ProtectedRoute from './components/admin/ProtectedRoute'
import BookmarkedJobs from './components/BookmarkedJobs'
// Super-Admin
import SuperAdminRoute from './components/superadmin/SuperAdminRoute'
import SuperAdminCompanies from './components/superadmin/SuperAdminCompanies'
import SuperAdminJobs from './components/superadmin/SuperAdminJobs'
import CompanyEdit from './components/superadmin/CompanyEdit'
import JobEdit from './components/superadmin/JobEdit'
import SuperAdminApplicants from './components/superadmin/SuperAdminApplicants'
import SuperAdminUsers from './components/superadmin/SuperAdminUsers'


const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/bookmarks",
    element: <BookmarkedJobs />
  },


  // admin routes
  {
    path: "/admin/companies",
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: "/admin/jobs",
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id",
    element: <ProtectedRoute><JobDetails /></ProtectedRoute>,
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },


  // Superadmin routes
  {
    path: '/superadmin/companies',
    element: <SuperAdminRoute><SuperAdminCompanies /></SuperAdminRoute>
  },
  {
    path: "/superadmin/companies/:id",
    element: <SuperAdminRoute><CompanyEdit /></SuperAdminRoute>
  },
  {
    path: '/superadmin/jobs',
    element: <SuperAdminRoute><SuperAdminJobs /></SuperAdminRoute>,
  },
  {
    path: "/superadmin/jobs/:id",
    element: <SuperAdminRoute><JobEdit /></SuperAdminRoute>
  },
  {
    path: "/superadmin/jobs/:id/applicants",
    element: <SuperAdminRoute><SuperAdminApplicants /></SuperAdminRoute>
  },
  {
    path: "/superadmin/users",
    element: <SuperAdminRoute><SuperAdminUsers /></SuperAdminRoute>
  },
])
function App() {

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
