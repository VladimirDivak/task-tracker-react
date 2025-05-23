import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../app/store'; // Adjust path if necessary

interface ProtectedRouteProps {
  // No specific props needed if just using Outlet and Navigate
  // children?: React.ReactNode; // Not typically used with Outlet approach
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  if (!token) {
    // Not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
