import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSubscription?: boolean;
  requireNonAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false, 
  requireSubscription = false,
  requireNonAdmin = false,
}) => {
  const { isAuthenticated, isAdmin, hasSubscription, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // If route requires admin and user is not authenticated, send to admin login
  if (requireAdmin && !isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  // For non-admin protected content, do not send users to a regular login page.
  // Redirect to home so pages can open OTP flows themselves.
  if (!requireAdmin && !isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireNonAdmin && isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireSubscription && !hasSubscription) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
