import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home as HomeIcon,
  School as SchoolIcon,
  Upload as UploadIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navigation: React.FC = () => {
  const { isAuthenticated, isAdmin, hasSubscription, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Show navigation for all users, but with different options

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 1,
          }}
        >
          <Box
            component="img"
            src="/images/Logo.png"
            alt="Company Logo"
            sx={{
              height: { xs: 32, md: 40 },
              width: 'auto',
              mr: 2,
              // filter: 'brightness(0) invert(1)',
            }}
          />
          {!isMobile && (
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Learning Platform
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={Link}
            to="/"
            color="inherit"
            startIcon={<HomeIcon />}
            sx={{ textTransform: 'none' }}
          >
            {!isMobile && 'Home'}
          </Button>
          <Button
            component={Link}
            to="/courses"
            color="inherit"
            startIcon={<SchoolIcon />}
            sx={{ textTransform: 'none' }}
          >
            {!isMobile && 'Courses'}
          </Button>
          {isAuthenticated && !isAdmin && (
            <Button
              component={Link}
              to="/my-courses"
              color="inherit"
              startIcon={<CartIcon />}
              sx={{ textTransform: 'none' }}
            >
              {!isMobile && 'My Courses'}
            </Button>
          )}
          {isAdmin && (
            <>
              <Button
                component={Link}
                to="/admin/dashboard"
                color="inherit"
                startIcon={<AdminIcon />}
                sx={{ textTransform: 'none' }}
              >
                {!isMobile && 'Admin'}
              </Button>
              <Button
                component={Link}
                to="/upload"
                color="inherit"
                startIcon={<UploadIcon />}
                sx={{ textTransform: 'none' }}
              >
                {!isMobile && 'Upload'}
              </Button>
            </>
          )}
          {/* {!isAdmin && (
            <Button
              component={Link}
              to="/admin"
              color="inherit"
              startIcon={<AdminIcon />}
              sx={{ textTransform: 'none' }}
            >
              {!isMobile && 'Admin Login'}
            </Button>
          )} */}
          {isAuthenticated && (
            <IconButton
              color="inherit"
              onClick={handleLogout}
              title="Logout"
            >
              <LogoutIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
