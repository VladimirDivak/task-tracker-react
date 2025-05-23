import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <Container maxWidth="lg"> {/* Or your preferred max-width */}
      <Box sx={{ marginTop: 4, marginBottom: 4 }}> {/* Some vertical spacing */}
        {children}
      </Box>
    </Container>
  );
};

export default MainContent;
