import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateExam from "./pages/CreateExam";
import ExamDetails from "./pages/ExamDetails";
import ExamQuestions from "./pages/ExamQuestions";
import ExamActivity from "./pages/ExamActivity";
import ExamFaceLogs from "./pages/ExamFaceLogs";
import ExamLeaderboard from "./pages/ExamLeaderboard";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import useTheme from "./hooks/useTheme";
import VerifyOtp from "./pages/VerifyOtp";
import ReviewAnswersPage from "./pages/ReviewAnswersPage";
import LiveMonitoringPage
from "./pages/LiveMonitoringPage";


function App() {
  // Ensure theme class is initialized globally so Tailwind `dark:` variants work across pages
  useTheme();

  return (

    <BrowserRouter>

      <Toaster position="top-right" toastOptions={{ duration: 3000,
          style: { borderRadius: "12px", fontWeight: "500", fontSize: "14px",},}} />

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/leaderboard" element={ <ProtectedRoute allowedRole="STUDENT"> <Leaderboard /></ProtectedRoute>}/>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route          path="/student-dashboard"          element={        <ProtectedRoute allowedRole="STUDENT">             <StudentDashboard />            </ProtectedRoute>}/>

        <Route    path="/admin-dashboard"         element={ <ProtectedRoute allowedRole="ADMIN">           <AdminDashboard />      </ProtectedRoute>  }   />

        <Route
          path="/admin/create-exam"
          element={
            <ProtectedRoute allowedRole="ADMIN">  <CreateExam /> </ProtectedRoute> } />

        <Route
          path="/admin/exam/:id"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ExamDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/exam/:id/questions"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ExamQuestions />
            </ProtectedRoute>
          }
        />

        <Route          
        path="/admin/exam/:id/activity"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ExamActivity />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/exam/:id/face-logs"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ExamFaceLogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/exam/:id/leaderboard"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ExamLeaderboard />
            </ProtectedRoute>
          }
        />

        <Route          path="/exam/:examId"
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

        <Route path="/history"element={<ProtectedRoute allowedRole="STUDENT"> <HistoryPage /> </ProtectedRoute>          }/>

        <Route path="/review/:examId" element={ <ProtectedRoute allowedRole="STUDENT"> <ReviewAnswersPage /></ProtectedRoute>}/>

        <Route path="/verify-otp" element={<VerifyOtp />}/>

        <Route path="/admin/exam/:id/live-monitor" element={<LiveMonitoringPage />}/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
