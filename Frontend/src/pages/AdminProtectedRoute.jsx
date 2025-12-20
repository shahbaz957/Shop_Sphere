import React from 'react'
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

function AdminProtectedRoute({children}) {
    const {user , loading } = useContext(AuthContext)
    if (loading) return <h1>Loading ... </h1>;
    if (!user && !user.isAdmin) return <Navigate to="/login" replace />;
    return children;
}

export default AdminProtectedRoute