import { configureStore } from '@reduxjs/toolkit';
// import { createSlice } from '@reduxjs/toolkit';

// Example for a placeholder reducer slice (optional)
// const placeholderSlice = createSlice({
//   name: 'placeholder',
//   initialState: {},
//   reducers: {},
// });
import authReducer from '../features/auth/authSlice';
import projectReducer from '../features/projects/projectSlice';
import columnReducer from '../features/columns/columnSlice'; // Import column reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    columns: columnReducer, // Add column reducer
    // placeholder: placeholderSlice.reducer, 
  },
  // Middleware and devTools are configured by default, which is fine for now.
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
