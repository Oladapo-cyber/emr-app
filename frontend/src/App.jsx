import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import MedicalRecords from "./pages/MedicalRecords";
import NewPatient from "./pages/NewPatient";
import Patients from "./pages/Patients";
import Scheduling from "./pages/Scheduling";
import Footer from "./components/Footer";

function App() {
  return (
    <div classname="font-inter">
      <Navbar />
      <div className="flex">
        <div className="bg-gray-100">
          <Sidebar />
        </div>

        <div className="flex-1 px-6 py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/new-patient" element={<NewPatient />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/scheduling" element={<Scheduling />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
