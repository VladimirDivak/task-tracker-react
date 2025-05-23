import React, { useEffect } from 'react'; // Added useEffect
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Container, TextField, Button, Typography, Box, Grid, Link, CircularProgress } from '@mui/material'; // Added CircularProgress for loading
import { useDispatch, useSelector } from 'react-redux'; // Added Redux hooks
import { registerUser, reset } from '../../features/auth/authSlice'; // Added auth actions
import { AppDispatch, RootState } from '../../app/store'; // Added store types

interface IRegisterFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, formState: { errors } } = useForm<IRegisterFormInput>();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // For now, log error. A proper UI element (Alert/Snackbar) would be better.
      console.error("Registration Error:", message);
      // Optionally dispatch reset here if error is shown ephemerally
      // dispatch(reset()); 
    }

    if (isSuccess || user) {
      navigate('/'); // Redirect to dashboard
      dispatch(reset()); // Reset state after successful navigation
    }
    // Cleanup on unmount or if dependencies change before success/error
    // return () => {
    //   if(!isSuccess) dispatch(reset()); // Avoid resetting if already navigated due to success
    // };
  }, [user, isError, isSuccess, message, navigate, dispatch]);


  const onSubmit: SubmitHandler<IRegisterFormInput> = data => {
    dispatch(reset()); // Reset state before new registration attempt
    dispatch(registerUser(data));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="username"
                required
                fullWidth
                id="username"
                label="Username"
                autoFocus
                {...register('username', { required: 'Username is required' })}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
            {isLoading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }} />}
          </Button>
          {isError && message && (
            <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              {message}
            </Typography>
          )}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
