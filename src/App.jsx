import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import ScoreEntry from './pages/ScoreEntry';
import AchievementUpload from './pages/AchievementUpload';
import EmployeeDashboard from './pages/EmployeeDashboard';
import TournamentCreate from './pages/TournamentCreate';
import ManagerDashboard from './pages/ManagerDashboard';
import Leaderboard from './pages/Leaderboard';
import Tournaments from './pages/Tournaments';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute allowedRoles={['user', 'employee', 'manager']} />}>
            {/* All verified users get the App Layout shell */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/score-entry" element={<ScoreEntry />} />
              <Route path="/upload-achievement" element={<AchievementUpload />} />

              <Route path="/employee" element={<EmployeeDashboard />} />
              <Route path="/create-tournament" element={<TournamentCreate />} />

              <Route path="/manager" element={<ManagerDashboard />} />

              {/* Default redirect based on likely role logic or landing page */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
