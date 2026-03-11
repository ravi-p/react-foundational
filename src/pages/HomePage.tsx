import React from 'react';

import { Box, Container, Typography, Button, Stack } from '@mui/material';

/**
 * Home Page
 *
 * This is an example page component demonstrating the template patterns.
 * Replace this with your actual home page content.
 */
const HomePage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          React Vibe Coding Template
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
          A foundational React 19 template configured for AI-assisted development with GitHub
          Copilot, Replit Agent, and Cursor.
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            href="https://github.com"
            aria-label="Get started with the template"
          >
            Get Started
          </Button>
          <Button variant="outlined" size="large" href="/docs" aria-label="View documentation">
            Documentation
          </Button>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          React 19 • Vite • TypeScript • MUI • Redux Toolkit • React Router v6
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
