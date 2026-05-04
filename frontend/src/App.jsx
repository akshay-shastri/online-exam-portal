import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import useTheme from "./hooks/useTheme";

function App() {
  // Ensure theme class is initialized globally so Tailwind `dark:` variants work across pages
  useTheme();

  return (

    <BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontWeight: "500",
            fontSize: "14px",
          },
        }}
      />

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam/:examId"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <ExamPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/result"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <ResultPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <HistoryPage />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
