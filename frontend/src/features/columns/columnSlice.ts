import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import columnService, { IColumnCreateData, IColumnUpdateData } from './columnService';

export interface IColumn {
  _id: string;
  name: string;
  project: string; // Project ID
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface IColumnState {
  // columns: IColumn[]; // General store of all columns, maybe not needed
  currentProjectColumns: IColumn[]; // Columns for the currently viewed project
  isLoading: boolean;
  isError: boolean;
  message: string;
  operationSuccess: boolean; // Flag for successful CUD operations
}

const initialState: IColumnState = {
  // columns: [],
  currentProjectColumns: [],
  isLoading: false,
  isError: false,
  message: '',
  operationSuccess: false,
};

// Async Thunks
export const createColumnThunk = createAsyncThunk(
  'columns/create',
  async (data: { projectId: string; name: string }, thunkAPI) => {
    try {
      const columnData: IColumnCreateData = { name: data.name };
      return await columnService.createColumn(data.projectId, columnData);
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message as string);
    }
  }
);

export const getColumnsForProjectThunk = createAsyncThunk(
  'columns/getForProject',
  async (projectId: string, thunkAPI) => {
    try {
      return await columnService.getColumnsForProject(projectId);
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message as string);
    }
  }
);

export const updateColumnThunk = createAsyncThunk(
  'columns/update',
  async (data: { projectId: string; columnId: string; name: string }, thunkAPI) => {
    try {
      const columnData: IColumnUpdateData = { name: data.name };
      return await columnService.updateColumn(data.projectId, data.columnId, columnData);
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message as string);
    }
  }
);

export const deleteColumnThunk = createAsyncThunk(
  'columns/delete',
  async (data: { projectId: string; columnId: string }, thunkAPI) => {
    try {
      await columnService.deleteColumn(data.projectId, data.columnId);
      return data.columnId; // Return columnId to identify which column was deleted
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message as string);
    }
  }
);

export const columnSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    resetColumnState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
      state.operationSuccess = false;
    },
    clearCurrentProjectColumns: (state) => {
      state.currentProjectColumns = [];
      // Optionally reset other flags if needed when changing projects
      state.isLoading = false;
      state.isError = false;
      state.message = '';
      state.operationSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Column
      .addCase(createColumnThunk.pending, (state) => {
        state.isLoading = true;
        state.operationSuccess = false;
      })
      .addCase(createColumnThunk.fulfilled, (state, action: PayloadAction<IColumn>) => {
        state.isLoading = false;
        state.operationSuccess = true;
        state.currentProjectColumns.push(action.payload);
        state.message = 'Column created successfully.';
      })
      .addCase(createColumnThunk.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Get Columns for Project
      .addCase(getColumnsForProjectThunk.pending, (state) => {
        state.isLoading = true;
        state.operationSuccess = false; // Reset for this operation type
      })
      .addCase(getColumnsForProjectThunk.fulfilled, (state, action: PayloadAction<IColumn[]>) => {
        state.isLoading = false;
        state.currentProjectColumns = action.payload;
        // No specific success message needed for get, operationSuccess is for CUD
      })
      .addCase(getColumnsForProjectThunk.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Update Column
      .addCase(updateColumnThunk.pending, (state) => {
        state.isLoading = true;
        state.operationSuccess = false;
      })
      .addCase(updateColumnThunk.fulfilled, (state, action: PayloadAction<IColumn>) => {
        state.isLoading = false;
        state.operationSuccess = true;
        const index = state.currentProjectColumns.findIndex(col => col._id === action.payload._id);
        if (index !== -1) {
          state.currentProjectColumns[index] = action.payload;
        }
        state.message = 'Column updated successfully.';
      })
      .addCase(updateColumnThunk.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Delete Column
      .addCase(deleteColumnThunk.pending, (state) => {
        state.isLoading = true;
        state.operationSuccess = false;
      })
      .addCase(deleteColumnThunk.fulfilled, (state, action: PayloadAction<string>) => { // action.payload is columnId
        state.isLoading = false;
        state.operationSuccess = true;
        state.currentProjectColumns = state.currentProjectColumns.filter(col => col._id !== action.payload);
        state.message = 'Column deleted successfully.';
      })
      .addCase(deleteColumnThunk.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetColumnState, clearCurrentProjectColumns } = columnSlice.actions;
export default columnSlice.reducer;
