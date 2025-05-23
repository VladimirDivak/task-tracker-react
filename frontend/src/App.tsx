import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProjectBoardPage from './pages/ProjectBoardPage'; // Import ProjectBoardPage
import Navbar from './components/Layout/Navbar';
import MainContent from './components/Layout/MainContent';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <MainContent>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<DashboardPage />} />
            <Route path="/projects/:projectId" element={<ProjectBoardPage />} /> {/* New Route */}
            {/* Add other protected routes here, e.g., */}
            {/* <Route path="profile" element={<ProfilePage />} /> */}
          </Route>
          
          {/* Catch-all for not found (optional) */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </MainContent>
    </BrowserRouter>
  );
}

export default App;
