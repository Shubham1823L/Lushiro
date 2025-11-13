import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const ProtectedRoutes = () => {
  const { user } = useAuth()  
  const location = useLocation()
  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location.pathname }} />
}

export default ProtectedRoutes
