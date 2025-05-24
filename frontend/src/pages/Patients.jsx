import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Patients = () => {
  const navigate = useNavigate();
  const handleNavigate = () => navigate("/patients/patient-details");
  return (
    <div>
      <button className="p-3 bg-blue-500 rounded-lg" onClick={handleNavigate}>
        {" "}
        View Patients Details
      </button>
    </div>
  );
};

export default Patients;
