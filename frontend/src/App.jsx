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
import NotFound from "./components/NotFound";
import CustomerSupport from "./pages/CustomerSupport";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isNotFound = location.pathname === "/404" || location.state?.notFound;

  const handleClose = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="font-inter">
      <Sidebar />
      <div className="ml-[220px] min-h-screen flex flex-col relative">
        <Navbar />
        <Breadcrumbs />
        <main
          className={`flex-1 px-6 py-4 transition-all ${
            isNotFound ? "filter blur-sm pointer-events-none" : ""
          }`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/new-patient" element={<NewPatient />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/scheduling" element={<Scheduling />} />
            <Route
              path="/patients/patient-details"
              element={<PatientDetails />}
            />
            <Route path="/support" element={<CustomerSupport />} />
            <Route path="/404" element={null} />
            <Route
              path="*"
              element={
                <Navigate to="/404" state={{ notFound: true }} replace />
              }
            />
          </Routes>
        </main>
        {isNotFound && <NotFound onClose={handleClose} />}
      </div>
    </div>
  );
}

export default App;
