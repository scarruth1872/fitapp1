import React from 'react';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import { ExerciseProvider } from './contexts/ExerciseContext';

// Theme
import theme from './theme';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ConsultationBooking from './components/booking/ConsultationBooking';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Articles from './pages/Articles';
import Diagnosis from './pages/Diagnosis';
import Counseling from './pages/Counseling';
import Training from './pages/Training';
import Progress from './pages/Progress';
import UserProfile from './pages/UserProfile';
import Chat from './pages/Chat';
import Social from './pages/Social';
import Scheduling from './pages/Scheduling';
import Pricing from './pages/Pricing';
import BookingLanding from './pages/BookingLanding';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="articles" element={<Articles />} />
      <Route path="diagnosis" element={
        <ProtectedRoute>
          <Diagnosis />
        </ProtectedRoute>
      } />
      <Route path="counseling" element={
        <ProtectedRoute>
          <Counseling />
        </ProtectedRoute>
      } />
      <Route path="training" element={
        <ProtectedRoute>
          <Training />
        </ProtectedRoute>
      } />
      <Route path="progress" element={
        <ProtectedRoute>
          <Progress />
        </ProtectedRoute>
      } />
      <Route path="profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      <Route path="chat" element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      } />
      <Route path="social" element={
        <ProtectedRoute>
          <Social />
        </ProtectedRoute>
      } />
      <Route path="schedule" element={
        <ProtectedRoute>
          <Scheduling />
        </ProtectedRoute>
      } />
      <Route path="book" element={
        <ProtectedRoute>
          <BookingLanding />
        </ProtectedRoute>
      } />
      <Route path="booking" element={
        <ProtectedRoute>
          <ConsultationBooking />
        </ProtectedRoute>
      } />
      <Route path="pricing" element={<Pricing />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <WorkoutProvider>
            <ExerciseProvider>
              <RouterProvider router={router} />
            </ExerciseProvider>
          </WorkoutProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
