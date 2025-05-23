import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// import Box from '@mui/material/Box'; // Box is not used in the final example, can be removed if not needed

import { RootState, AppDispatch } from '../../app/store'; // Adjust path as necessary
import { logoutUser } from '../../features/auth/authSlice'; // Adjust path as necessary

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // Selecting token; user object can also be selected if username needs to be displayed
  const { token, user } = useSelector((state: RootState) => state.auth); 

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
    // dispatch(reset()); // Optional: if other slices need UI reset not handled by logoutUser or if auth slice needs more immediate reset.
                       // For auth slice, logoutUser.fulfilled should handle state clearing.
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button component={RouterLink} to="/" color="inherit" sx={{ textTransform: 'none', fontSize: '1.25rem' }}>
            TaskTracker
          </Button>
        </Typography>
        {token ? (
          <>
            {user && <Typography sx={{ mr: 2 }}>Hi, {user.username}!</Typography>} {/* Optional: Display username */}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
