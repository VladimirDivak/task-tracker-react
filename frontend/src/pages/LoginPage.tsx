import React, { useEffect } from 'react'; // Added useEffect
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Container, TextField, Button, Typography, Box, Grid, Link, CircularProgress } from '@mui/material'; // Added CircularProgress
import { useDispatch, useSelector } from 'react-redux'; // Added Redux hooks
import { loginUser, reset } from '../../features/auth/authSlice'; // Added auth actions
import { AppDispatch, RootState } from '../../app/store'; // Added store types

interface ILoginFormInput {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, formState: { errors } } = useForm<ILoginFormInput>();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // For now, log error. A proper UI element (Alert/Snackbar) would be better.
      console.error("Login Error:", message);
      // dispatch(reset()); // Consider resetting here if error is shown ephemerally
    }

    if (isSuccess || user) {
      navigate('/'); // Redirect to dashboard
      dispatch(reset()); // Reset state after successful navigation
    }
    // Optional cleanup
    // return () => {
    //  if(!isSuccess) dispatch(reset());
    // };
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit: SubmitHandler<ILoginFormInput> = data => {
    dispatch(reset()); // Reset state before new login attempt
    dispatch(loginUser(data));
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
        <Typography component="h1" variant="h5"> {/* Per example, using h5. Task desc said h4. */}
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
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
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          {/* Optional: Add a "Remember me" checkbox if desired */}
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          {isError && message && (
            <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              {message}
            </Typography>
          )}
          <Grid container>
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
