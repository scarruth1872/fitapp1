import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import { ExerciseProvider } from './contexts/ExerciseContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Articles from './pages/Articles';
import Diagnosis from './pages/Diagnosis';
import Counseling from './pages/Counseling';
import Training from './pages/Training';
import Chat from './pages/Chat';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Progress from './pages/Progress'; 
import UserProfile from './pages/UserProfile'; 
import Social from './pages/Social';
import SchedulingPage from './components/SchedulingPage';
import { Navigate } from 'react-router-dom'; 
import Scheduling from './pages/Scheduling';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WorkoutProvider>
          <ExerciseProvider>
            <Router>
              <div className="App">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route 
                    path="/diagnosis" 
                    element={
                      <ProtectedRoute>
                        <Diagnosis />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/counseling" 
                    element={
                      <ProtectedRoute>
                        <Counseling />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/training" 
                    element={
                      <ProtectedRoute>
                        <Training />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/progress" 
                    element={
                      <ProtectedRoute>
                        <Progress />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/chat" 
                    element={
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/social" 
                    element={
                      <ProtectedRoute>
                        <Social />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/schedule" 
                    element={
                      <ProtectedRoute>
                        <Scheduling />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </Router>
          </ExerciseProvider>
        </WorkoutProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
