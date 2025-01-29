import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Articles from '../pages/Articles';
import Diagnosis from '../pages/Diagnosis';
import Counseling from '../pages/Counseling';
import Training from '../pages/Training';
import Progress from '../pages/Progress';
import UserProfile from '../pages/UserProfile';
import Chat from '../pages/Chat';
import Social from '../pages/Social';
import Scheduling from '../pages/Scheduling';
import Pricing from '../pages/Pricing';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'articles', element: <Articles /> },
      { path: 'diagnosis', element: <ProtectedRoute><Diagnosis /></ProtectedRoute> },
      { path: 'counseling', element: <ProtectedRoute><Counseling /></ProtectedRoute> },
      { path: 'training', element: <ProtectedRoute><Training /></ProtectedRoute> },
      { path: 'progress', element: <ProtectedRoute><Progress /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute><UserProfile /></ProtectedRoute> },
      { path: 'chat', element: <ProtectedRoute><Chat /></ProtectedRoute> },
      { path: 'social', element: <ProtectedRoute><Social /></ProtectedRoute> },
      { path: 'schedule', element: <ProtectedRoute><Scheduling /></ProtectedRoute> },
      { path: 'pricing', element: <Pricing /> }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});
