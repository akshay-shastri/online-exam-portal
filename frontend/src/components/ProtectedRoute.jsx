import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {

    const role = localStorage.getItem("role");

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && role !== allowedRole) {
        if (role === "ADMIN") {
            return <Navigate to="/admin-dashboard" replace />;
        }
        return <Navigate to="/student-dashboard" replace />;
    }

    return children;
}

export default ProtectedRoute;
