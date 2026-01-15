import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their appropriate dashboard if they try to access unauthorized routes, 
        // or just a "not authorized" page. For simplicity, redirect to home/dashboard.
        // Ideally, we'd have a localized "Access Denied" page.
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
