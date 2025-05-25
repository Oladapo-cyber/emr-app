import { LocalHospitalOutlined } from "@mui/icons-material";

const NotFound = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center border border-blue-100">
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-300">
          <LocalHospitalOutlined
            className="text-blue-500"
            sx={{ fontSize: 40 }}
          />
        </span>
      </div>
      <h2 className="text-3xl font-extrabold mb-2 text-gray-700 tracking-tight">
        404 - Page Not Found
      </h2>
      <p className="mb-6 text-gray-600">
        Oops! The page you’re looking for doesn’t exist or has been moved.
        <br />
        If you believe this is an error, please contact support.
      </p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-blue-500 text-white rounded-md font-semibold shadow hover:bg-blue-700 transition-colors"
      >
        Go to Home
      </button>
    </div>
  </div>
);

export default NotFound;
