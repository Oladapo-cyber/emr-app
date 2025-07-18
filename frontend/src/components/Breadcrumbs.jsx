import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const pageNames = {
  "/": "Home",
  "/patients": "Patients",
  "/patients/new-patient": "New Patient",
  "/medical-records": "Medical Records",
  "/scheduling": "Scheduling",
  "/report": "Report",
  "/support": "Help & Support",
  "/staff": "Staff List",
  "/settings": "Settings",
  "/login": "Login",
  "/patients/patient-details": "Patient Details",
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  const crumbs = pathnames.map((_, idx) => {
    const to = "/" + pathnames.slice(0, idx + 1).join("/");
    return {
      name: pageNames[to] || to.replace("/", ""),
      to,
    };
  });

  return (
    <nav className="text-sm py-2 px-6 flex items-center border-b-2 border-gray-200">
      <Link to="/" className="text-gray-400 font-medium hover:text-gray-500">
        Home
      </Link>
      {crumbs.map((crumb, idx) => (
        <span key={crumb.to} className="flex items-center">
          <span className="mx-1 text-gray-400">
            <KeyboardArrowRight />
          </span>
          {idx === crumbs.length - 1 ? (
            <span className="font-semibold text-blue-600">{crumb.name}</span>
          ) : (
            <Link
              to={crumb.to}
              className="text-gray-400 font-medium hover:text-gray-500"
            >
              {crumb.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
