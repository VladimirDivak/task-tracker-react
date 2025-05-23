import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import projectService from './projectService'; // Assuming projectService.ts is in the same folder

// Define your Project interface based on backend model
export interface IProject {
  _id: string; // MongoDB typically uses _id
  name: string;
  createdBy: string; // Or a User object if populated
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  // Add other fields like members if applicable later
}

interface IProjectState {
  projects: IProject[];
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean; // For individual operations like create, update, delete
  message: string;
}

const initialState: IProjectState = {
  projects: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Async Thunks
// Create new project
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData: { name: string }, thunkAPI) => {
    try {
      return await projectService.createProject(projectData);
    } catch (error: any) {
      const message =
        (error.response?.data?.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message as string);
    }
  }
);

// Get user projects
export const getProjects = createAsyncThunk(
  'projects/getAll',
  async (_, thunkAPI) => { // No argument needed for getting all user's projects
    try {
      return await projectService.getProjects();
    } catch (error: any) {
      const message =
        (error.response?.data?.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message as string);
    }
  }
);

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    resetProjectState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false; // Reset success flag for specific operations
      state.message = '';
      // Optionally, if you want to clear projects on a general reset:
      // state.projects = []; 
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false; // Reset success for new operation
        state.isError = false;
        state.message = '';
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<IProject>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects.push(action.payload); // Add the new project
        state.message = 'Project created successfully!'; // Optional success message
      })
      .addCase(createProject.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string; // Error message from rejectWithValue
      })
      // Get Projects
      .addCase(getProjects.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false; // Reset success for new operation
        state.isError = false;
        state.message = '';
      })
      .addCase(getProjects.fulfilled, (state, action: PayloadAction<IProject[]>) => {
        state.isLoading = false;
        // isSuccess for getAll might not be as critical as for create/update/delete
        // but can be set if needed.
        state.projects = action.payload; // Replace projects with fetched ones
      })
      .addCase(getProjects.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetProjectState } = projectSlice.actions;
export default projectSlice.reducer;
