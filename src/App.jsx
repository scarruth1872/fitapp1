import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { WorkoutProgramProvider } from './contexts/WorkoutProgramContext';
import { ExerciseProvider } from './contexts/ExerciseContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Articles from './pages/Articles';
import Diagnosis from './pages/Diagnosis';
import Counseling from './pages/Counseling';
import Training from './pages/Training';
import Progress from './pages/Progress';
import UserProfile from './pages/UserProfile';
import Chat from './pages/Chat';
import Social from './pages/Social';
import Scheduling from './pages/Scheduling';
import AgentDashboard from './components/trainer/AgentDashboard';
import Pricing from './pages/Pricing';
import AchievementLeaderboard from './components/leaderboard/AchievementLeaderboard';
import AchievementAnalytics from './components/analytics/AchievementAnalytics';
import theme from './theme/theme';
import AIQuery from './pages/AIQuery';
import { CollaborationProvider } from './contexts/CollaborationContext';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { 
        path: '/agent-dashboard',
        element: <ProtectedRoute><AgentDashboard /></ProtectedRoute> 
      },
      { 
        index: true, 
        element: <Home />
      },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'articles', element: <Articles /> },
      { path: 'diagnosis', element: <ProtectedRoute><Diagnosis /></ProtectedRoute> },
      { path: 'counseling', element: <ProtectedRoute><Counseling /></ProtectedRoute> },
      { path: 'training', element: <ProtectedRoute><Training /></ProtectedRoute> },
      { path: 'progress', element: <ProtectedRoute><Progress /></ProtectedRoute> },
      { path: 'leaderboard', element: <ProtectedRoute><AchievementLeaderboard /></ProtectedRoute> },
      { path: 'analytics', element: <ProtectedRoute><AchievementAnalytics /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute><UserProfile /></ProtectedRoute> },
      { path: 'chat', element: <ProtectedRoute><Chat /></ProtectedRoute> },
      { path: 'social', element: <ProtectedRoute><Social /></ProtectedRoute> },
      { path: 'schedule', element: <ProtectedRoute><Scheduling /></ProtectedRoute> },
      { path: 'pricing', element: <Pricing /> },
      { path: 'ai-query', element: <ProtectedRoute><AIQuery /></ProtectedRoute> }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_normalizeFormMethod: true
  }
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CollaborationProvider>
        <AuthProvider>
          <SnackbarProvider>
            <NotificationProvider>
              <WorkoutProvider>
                <WorkoutProgramProvider>
                  <ExerciseProvider>
                    <RouterProvider router={appRouter} />
                  </ExerciseProvider>
                </WorkoutProgramProvider>
              </WorkoutProvider>
            </NotificationProvider>
          </SnackbarProvider>
        </AuthProvider>
      </CollaborationProvider>
    </ThemeProvider>
  );
};

export default App;
