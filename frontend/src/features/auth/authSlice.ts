import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService, { IRegisterFormInput, ILoginFormInput, User } from './authService'; // Import types from authService
import axios from 'axios';

// Define AuthState
interface AuthState {
  user: User | null;
  token: string | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: AuthState = {
  user: null, // Will be populated after successful login/register or from token
  token: localStorage.getItem('token') || null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Async Thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: IRegisterFormInput, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      return response; // Contains user and token
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message as string);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData: ILoginFormInput, thunkAPI) => {
    try {
      const response = await authService.login(userData);
      return response; // Contains user and token
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message as string);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await authService.logout(); // No return value needed from service for logout
    // No specific payload needed for fulfilled logout other than clearing state
  } catch (error: any) {
    // This catch might be for unexpected errors during logout, though logout is mostly local.
    const message = error.message || error.toString();
    return thunkAPI.rejectWithValue(message as string);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      // Optionally, decide if reset should also clear user/token,
      // or if logoutUser is strictly for that. For now, keeping it simple.
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ user: User, token: string }>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        // Axios header is set in authService, but ensure it's set if not already.
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string; // Message from rejectWithValue
        state.user = null;
        state.token = null; // Clear token on registration failure
        delete axios.defaults.headers.common['Authorization'];
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User, token: string }>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        // Axios header is set in authService
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
        state.token = null; // Clear token on login failure
        delete axios.defaults.headers.common['Authorization'];
      })
      // Logout User
      .addCase(logoutUser.pending, (state) => { // Optional: handle pending for logout if any async work
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isSuccess = false; // Reset success flags
        state.isError = false;
        state.message = '';
        delete axios.defaults.headers.common['Authorization'];
      })
      .addCase(logoutUser.rejected, (state, action: PayloadAction<any>) => { // Handle potential errors during logout
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        // State for user/token should ideally still be cleared or reflect authService.logout()
        delete axios.defaults.headers.common['Authorization'];
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
