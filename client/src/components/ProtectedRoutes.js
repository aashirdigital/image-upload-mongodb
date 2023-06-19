import { Navigate } from 'react-router-dom'

const ProtectedRoutes = ({ children }) => {
    if (localStorage.getItem('token')) {
        return children
    } else {
        return <Navigate to="/" />
    }
}
export default ProtectedRoutes
