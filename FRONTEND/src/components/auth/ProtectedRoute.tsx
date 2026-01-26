import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, superAdmin, staff, student } = useAuthStore();
    const user = superAdmin || staff || student;
    const location = useLocation();

    // 1. Check basic authentication state
    if (!isAuthenticated || !user) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    // 2. Client-side Token Validation (Expiration Check)
    // Skipped: Token is now httpOnly cookie, validation happens via API intercepts
    // and initial checkAuth call.


    // 3. Role-Based Access Control (RBAC)
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.warn(`Unauthorized access: User role ${user.role} not in [${allowedRoles.join(', ')}]`);
        // Redirect to their appropriate dashboard if unauthorized for this specific route
        // or just landing page
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
