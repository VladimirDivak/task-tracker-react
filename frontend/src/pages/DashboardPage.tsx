import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom'; // Import RouterLink
import { Button, List, ListItem, ListItemText, Typography, Container, Box, CircularProgress, Alert, ListItemButton } from '@mui/material'; // Added ListItemButton for clickable items
import { getProjects, resetProjectState } from '../../features/projects/projectSlice';
import { AppDispatch, RootState } from '../../app/store';
import CreateProjectModal from '../../components/projects/CreateProjectModal';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, isLoading, isError, message } = useSelector(
    (state: RootState) => state.projects
  );
  const [openCreateModal, setOpenCreateModal] = useState(false);

  useEffect(() => {
    dispatch(getProjects());
    // Optional: Cleanup on unmount if needed, though getProjects errors are usually one-time.
    // return () => {
    //   dispatch(resetProjectState());
    // };
  }, [dispatch]);

  // This useEffect handles errors from getProjects.
  // Errors from createProject are handled within the modal or by shared state.
  useEffect(() => {
    if (isError && message) { // Only show alert if there's a message
      // The alert will be shown. Consider a timeout or manual dismiss to reset.
      // For now, error is reset if user attempts another action (like opening create modal)
      // or if component unmounts (if cleanup is added above).
      console.error("Error fetching projects:", message);
    }
  }, [isError, message, dispatch]);

  const handleOpenCreateModal = () => {
    dispatch(resetProjectState()); // Reset any previous create/fetch errors before opening modal
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    // The modal's internal useEffect (on isSuccess) or its enhanced handleClose will also dispatch resetProjectState.
    // If modal is closed manually while an error was shown from createProject,
    // the modal's handleCloseAndReset should have cleared it.
  };

  if (isLoading && projects.length === 0) { // Show main loader only if no projects yet
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard - My Projects
        </Typography>
        <Button variant="contained" onClick={handleOpenCreateModal} sx={{ mb: 2 }}>
          Create New Project
        </Button>

        {isError && message && ( // Display error from getProjects if it occurred
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(resetProjectState())}> 
            Error fetching projects: {message}
          </Alert>
        )}

        {projects.length === 0 && !isLoading && !isError && (
          <Typography>No projects found. Create one!</Typography>
        )}

        {projects.length > 0 && (
          <List>
            {projects.map((project) => (
              // Wrap ListItem with RouterLink or use component prop on ListItem/ListItemButton
              <ListItemButton 
                key={project._id} 
                component={RouterLink} 
                to={`/projects/${project._id}`}
                divider
              >
                <ListItemText 
                  primary={project.name} 
                  secondary={`Created on: ${new Date(project.createdAt).toLocaleDateString()}`} 
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
      <CreateProjectModal
        open={openCreateModal}
        handleClose={handleCloseCreateModal}
      />
    </Container>
  );
};

export default DashboardPage;
