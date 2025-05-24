import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import MedicalRecords from "./pages/MedicalRecords";
import NewPatient from "./pages/NewPatient";
import Patients from "./pages/Patients";
import Scheduling from "./pages/Scheduling";
import Footer from "./components/Footer";
import Breadcrumbs from "./components/Breadcrumbs";
import PatientDetails from "./components/PatientDetails";

function App() {
  return (
    <div className="font-inter">
      <Sidebar />
      <div className="ml-[220px] min-h-screen flex flex-col">
        <Navbar />
        <Breadcrumbs />
        <main className="flex-1 px-6 py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/new-patient" element={<NewPatient />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/scheduling" element={<Scheduling />} />
            <Route
              path="/patient/patient-details"
              element={<PatientDetails />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
