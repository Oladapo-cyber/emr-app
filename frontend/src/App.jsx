import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import MedicalRecords from "./pages/MedicalRecords";
import NewPatient from "./pages/NewPatient";
import Patients from "./pages/Patients";
import Scheduling from "./pages/Scheduling";
import Breadcrumbs from "./components/Breadcrumbs";
import PatientDetails from "./components/PatientDetails";
import NotFound from "./components/modals/NotFound";
import Login from "./components/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateUser from "./components/admin/CreateUser";
import ManageUsers from "./components/admin/ManageUsers";
import AdminDashboard from "./components/admin/AdminDashboard";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isNotFound = location.pathname === "/404" || location.state?.notFound;

  const handleClose = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="font-inter">
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <div className="ml-[220px] min-h-screen flex flex-col relative">
                  <Sidebar />
                  <Navbar />
                  <Breadcrumbs />
                  <main
                    className={`flex-1 px-6 py-4 transition-all ${
                      isNotFound ? "filter blur-sm pointer-events-none" : ""
                    }`}
                  >
                    <Outlet />
                  </main>
                  {isNotFound && <NotFound onClose={handleClose} />}
                </div>
              </ProtectedRoute>
            }
          >
            {/* All your protected routes go here */}
            <Route path="/" element={<Home />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/new-patient" element={<NewPatient />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/scheduling" element={<Scheduling />} />
            <Route
              path="/patients/patient-details"
              element={<PatientDetails />}
            />
            {/* Admin Routes - Protected by role */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/create-user"
              element={
                <ProtectedRoute requiredRole="admin">
                  <CreateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route path="/404" element={null} />
            <Route
              path="*"
              element={
                <Navigate to="/404" state={{ notFound: true }} replace />
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
