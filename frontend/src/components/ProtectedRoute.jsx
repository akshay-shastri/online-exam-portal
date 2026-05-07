import { Navigate } from "react-router-dom";

function ProtectedRoute({
    children,
    allowedRole
}) {

    const token = localStorage.getItem("token");

    const role = localStorage.getItem("role");

    // Not logged in
    if (!token || !role) {

        return <Navigate to="/login" replace />;
    }

    // Wrong role trying to access route
    if (
        allowedRole &&
        role !== allowedRole
    ) {

        // Admin trying student route
        if (role === "ADMIN") {

            return (
                <Navigate
                    to="/admin-dashboard"
                    replace
                />
            );
        }

        // Student trying admin route
        if (role === "STUDENT") {

            return (
                <Navigate
                    to="/student-dashboard"
                    replace
                />
            );
        }

        // Unknown role
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;