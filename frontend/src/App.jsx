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
import LiveMonitoringPage from "./pages/LiveMonitoringPage";
import PageTransition from "./components/PageTransition";
import SystemCheckPage from "./pages/SystemCheckPage";
import "./styles/button.css";
import "./styles/navbar.css";
import "./styles/cards.css";
import ExamCandidates from "./pages/ExamCandidates";


function App() {
  // Ensure theme class is initialized globally so Tailwind `dark:` variants work across pages
  useTheme();

  return (

    <BrowserRouter>

     <Toaster
    position="top-right"
    reverseOrder={false}
    gutter={12}
    toastOptions={{

        duration: 3200,

            style: {

            background:
                "linear-gradient(135deg,rgba(17,24,39,0.96),rgba(15,23,42,0.92))",

            color: "#ffffff",

            border:
                "1px solid rgba(250,204,21,0.18)",

            borderRadius: "18px",

            padding: "16px 18px",

            backdropFilter: "blur(18px)",

            WebkitBackdropFilter: "blur(18px)",

            boxShadow:
                "0 0 30px rgba(250,204,21,0.12),0 18px 50px rgba(0,0,0,0.45)",

            fontSize: "14px",

            fontWeight: "600",

            letterSpacing: "0.2px",
        },

        success: {

            iconTheme: {

                primary: "#22c55e",

                secondary: "#ecfdf5",
            },
        },

        error: {

            iconTheme: {

                primary: "#ef4444",

                secondary: "#fef2f2",
            },
        },
    }}
/>

      <Routes>

    <Route
        path="/"
        element={
            <PageTransition>
                <Login />
            </PageTransition>
        }
    />

    <Route
        path="/leaderboard"
        element={
            <ProtectedRoute allowedRole="STUDENT">

                <PageTransition>
                    <Leaderboard />
                </PageTransition>

            </ProtectedRoute>
        }
    />

    <Route
        path="/login"
        element={
            <PageTransition>
                <Login />
            </PageTransition>
        }
    />

    <Route
        path="/register"
        element={
            <PageTransition>
                <Register />
            </PageTransition>
        }
    />

    <Route
        path="/student-dashboard"
        element={
            <ProtectedRoute allowedRole="STUDENT">

                <PageTransition>
                    <StudentDashboard />
                </PageTransition>

            </ProtectedRoute>
        }
    />

    <Route
        path="/admin-dashboard"
        element={
            <ProtectedRoute allowedRole="ADMIN">

                <PageTransition>
                    <AdminDashboard />
                </PageTransition>

            </ProtectedRoute>
        }
    />

    <Route
        path="/admin/create-exam"
        element={
            <ProtectedRoute allowedRole="ADMIN">

                <PageTransition>
                    <CreateExam />
                </PageTransition>

            </ProtectedRoute>
        }
    />

    <Route
        path="/admin/exam/:id"
        element={
            <ProtectedRoute allowedRole="ADMIN">

                <PageTransition>
                    <ExamDetails />
                </PageTransition>

            </ProtectedRoute>
        }
    />

    <Route
        path="/admin/exam/:id/questions"
        element={
            <ProtectedRoute allowedRole="ADMIN">

                <PageTransition>
                    <ExamQuestions />
                </PageTransition>

            </ProtectedRoute>
        }
    />

    <Route
        path="/admin/exam/:id/activity"
        element={
            <ProtectedRoute allowedRole="ADMIN">

                <PageTransition>
                    <ExamActivity />
                </PageTransition>

            </ProtectedRoute>
        }
    />

    <Route
        path="/admin/exam/:id/face-logs"
        element={
            <ProtectedRoute allowedRole="ADMIN">

                <PageTransition>
                    <ExamFaceLogs />
                </PageTransition>

            </ProtectedRoute>
        }
    />

    <Route
        path="/admin/exam/:id/leaderboard"
        element={
            <ProtectedRoute allowedRole="ADMIN">

                <PageTransition>
                    <ExamLeaderboard />
                </PageTransition>

            </ProtectedRoute>
        }
    />

    <Route
    path="/system-check/:examId"
    element={
        <ProtectedRoute allowedRole="STUDENT">

            <PageTransition>
                <SystemCheckPage />
            </PageTransition>

        </ProtectedRoute>
    }
    />

    <Route
        path="/exam/:examId"
        element={
            <ProtectedRoute allowedRole="STUDENT">

                <PageTransition>
                    <ExamPage />
                </PageTransition>

            </ProtectedRoute>
        }
    />

    <Route
        path="/result"
        element={
            <ProtectedRoute allowedRole="STUDENT">

                <PageTransition>
                    <ResultPage />
                </PageTransition>

            </ProtectedRoute>
        }
    />

    <Route
        path="/history"
        element={
            <ProtectedRoute allowedRole="STUDENT">

                <PageTransition>
                    <HistoryPage />
                </PageTransition>

            </ProtectedRoute>
        }
    />

    <Route
        path="/review/:examId"
        element={
            <ProtectedRoute allowedRole="STUDENT">

                <PageTransition>
                    <ReviewAnswersPage />
                </PageTransition>

            </ProtectedRoute>
        }
    />

    <Route
        path="/verify-otp"
        element={
            <PageTransition>
                <VerifyOtp />
            </PageTransition>
        }
    />

    <Route
        path="/admin/exam/:id/live-monitor"
        element={
            <PageTransition>
                <LiveMonitoringPage />
            </PageTransition>
        }
    />

    <Route
    path="/admin/exam/:id/candidates"
    element={<ExamCandidates />}
    />

</Routes>

    </BrowserRouter>
  );
}

export default App;
