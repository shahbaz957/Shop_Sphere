import React, { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { Navigate } from "react-router-dom";
function ProtectedRoute({children}) {
    const {user , loading} = useContext(AuthContext)
    if (loading) return <h1>Loading ... </h1>
    if (!user) return <Navigate to='/login' replace/>
    return children;
}

export default ProtectedRoute