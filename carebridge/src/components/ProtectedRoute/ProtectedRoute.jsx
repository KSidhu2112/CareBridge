import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { token, role } = useContext(StoreContext);

    const allowGuest = allowedRoles && allowedRoles.includes('');

    if (!token && !allowGuest) {
        toast.error("Please login to access this page", { toastId: "auth-error" });
        return <Navigate to="/" replace />;
    }

    if (token && allowedRoles && !allowedRoles.includes(role)) {
        toast.error("You are not authorized to view this page", { toastId: "role-error" });
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
