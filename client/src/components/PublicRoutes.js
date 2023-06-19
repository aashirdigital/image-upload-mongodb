import React from 'react'
import { Navigate } from 'react-router-dom'

const PublicRoutes = () => {
    if (localStorage.getItem('token')) {
        return <Navigate to="/user-dashboard/:id" />
    } else {
        return children
    }
}

export default PublicRoutes
