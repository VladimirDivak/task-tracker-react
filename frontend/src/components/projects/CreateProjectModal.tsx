import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Modal, Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createProject, resetProjectState } from '../../features/projects/projectSlice';
import { AppDispatch, RootState } from '../../app/store';

interface CreateProjectModalProps {
  open: boolean;
  handleClose: () => void;
}

interface IProjectFormInput {
  name: string;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ open, handleClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, formState: { errors }, reset: resetForm } = useForm<IProjectFormInput>();
  
  // Using shared state. createProject will set these.
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state: RootState) => state.projects
  );

  const onSubmit: SubmitHandler<IProjectFormInput> = (data) => {
    dispatch(resetProjectState()); // Reset state before dispatching
    dispatch(createProject(data));
  };

  useEffect(() => {
    if (isSuccess && open) { // Ensure modal was open when success happened
      handleClose(); // Close modal
      resetForm(); // Reset form fields
      dispatch(resetProjectState()); // Reset project state (isLoading, isSuccess, isError, message)
    }
    // Do not reset isError here automatically, let user see the error message.
    // The form can be submitted again, which will call resetProjectState first.
    // Or, handleClose (if called by clicking outside/X button) can dispatch reset.
  }, [isSuccess, isError, open, handleClose, dispatch, resetForm]);
  
  // Enhanced handleClose to also reset error state if modal is closed while error is showing
  const handleCloseAndReset = () => {
    if (isError) {
        dispatch(resetProjectState());
    }
    handleClose();
    resetForm(); // Also reset form on manual close
  };


  return (
    <Modal
      open={open}
      onClose={handleCloseAndReset} // Use the enhanced closer
      aria-labelledby="create-project-modal-title"
      aria-describedby="create-project-modal-description"
    >
      <Box sx={style}>
        <Typography id="create-project-modal-title" variant="h6" component="h2">
          Create New Project
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }} noValidate>
          <TextField
            autoFocus
            required
            fullWidth
            margin="normal"
            id="name"
            label="Project Name"
            {...register('name', { required: 'Project name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          {isError && message && (
            <Alert severity="error" sx={{ mt: 1, mb: 1 }}>{message}</Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Create Project'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateProjectModal;
