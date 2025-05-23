import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getColumnsForProjectThunk,
  createColumnThunk,
  resetColumnState,
  clearCurrentProjectColumns,
} from '../../features/columns/columnSlice';
import { AppDispatch, RootState } from '../../app/store';
import {
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  TextField,
} from '@mui/material';

const ProjectBoardPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { currentProjectColumns, isLoading, isError, message, operationSuccess } =
    useSelector((state: RootState) => state.columns);
  const [newColumnName, setNewColumnName] = useState('');
  
  // For create operation specific loading/error, separate from global isLoading/isError for getColumns
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [createColumnError, setCreateColumnError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      dispatch(getColumnsForProjectThunk(projectId));
    }
    return () => {
      dispatch(clearCurrentProjectColumns());
      dispatch(resetColumnState()); // Reset all flags and messages
    };
  }, [dispatch, projectId]);

  useEffect(() => {
    if (operationSuccess) {
      setNewColumnName(''); // Clear input on successful creation
      setIsCreatingColumn(false); // Reset creating loading state
      setCreateColumnError(null); // Clear creation error
      dispatch(resetColumnState()); // Reset operationSuccess and other flags
      // No need to manually re-fetch columns, slice should optimistically update or add the new column
    }
  }, [operationSuccess, dispatch]);

  // This effect is for errors coming from the createColumnThunk
  useEffect(() => {
      if (isError && message && isCreatingColumn) { // Only show if error happened during creation
          setCreateColumnError(message);
          setIsCreatingColumn(false); // Reset loading state for creation
          // Do not reset global isError/message here, as it might be from getColumns
      }
  }, [isError, message, isCreatingColumn ]);


  const handleCreateColumn = async () => {
    if (newColumnName.trim() && projectId) {
      setIsCreatingColumn(true);
      setCreateColumnError(null); // Clear previous create errors
      dispatch(resetColumnState()); // Reset state flags before new operation

      // Dispatch and handle the result for specific feedback
      const resultAction = await dispatch(createColumnThunk({ projectId, name: newColumnName.trim() }));
      if (createColumnThunk.rejected.match(resultAction)) {
        // Error handled by the useEffect listening to isError & message from slice,
        // specifically when isCreatingColumn is true.
      } else {
        // Success is handled by the useEffect listening to operationSuccess
      }
    } else {
      setCreateColumnError('Column name cannot be empty.');
    }
  };
  
  // Loading state for fetching initial columns
  if (isLoading && currentProjectColumns.length === 0) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Project Board {projectId ? `(ID: ${projectId.substring(0,6)}...)` : ''}
      </Typography>

      {/* Inline form for creating a new column */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start' }}>
        <TextField
          label="New Column Name"
          variant="outlined"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          size="small"
          sx={{ mr: 1, flexGrow: 1 }}
          error={!!createColumnError} // Show error on text field
        />
        <Button
          variant="contained"
          onClick={handleCreateColumn}
          disabled={isCreatingColumn}
          startIcon={isCreatingColumn ? <CircularProgress size={20} color="inherit" /> : null}
        >
          Add Column
        </Button>
      </Box>
      {createColumnError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setCreateColumnError(null)}>
          {createColumnError}
        </Alert>
      )}
      {/* Display error from getColumns if it occurred and not specific to create */}
      {isError && message && !isCreatingColumn && !createColumnError && (
         <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(resetColumnState())}>
            {message}
          </Alert>
      )}


      {/* Display Columns */}
      {currentProjectColumns.length === 0 && !isLoading && !isError && (
        <Typography>No columns yet. Add one!</Typography>
      )}
      <Grid container spacing={3}>
        {currentProjectColumns.map((column) => (
          <Grid item key={column._id} xs={12} sm={6} md={4} lg={3}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" component="h2" gutterBottom>
                {column.name}
              </Typography>
              {/* TODO: Add tasks for this column here */}
              {/* Placeholder for tasks or other column actions */}
              <Box sx={{ mt: 2, p:1, border: '1px dashed grey', minHeight: '50px'}}>
                <Typography variant="caption">Tasks will go here</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProjectBoardPage;
