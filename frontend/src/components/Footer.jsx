const Footer = () => (
  <footer className="bg-gray-900 text-gray-200">
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h2 className="font-heading text-2xl font-bold mb-2 text-white">
          Daps EMR
        </h2>
        <p className="text-gray-400 text-sm">
          Daps EMR is dedicated to empowering healthcare professionals with a
          secure, efficient, and user-friendly electronic medical records
          platform.
        </p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Navigation</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <a href="/patients" className="hover:text-white">
              Patients
            </a>
          </li>
          <li>
            <a href="/appointments" className="hover:text-white">
              Appointments
            </a>
          </li>
          <li>
            <a href="/medical-records" className="hover:text-white">
              Medical Records
            </a>
          </li>
          <li>
            <a href="/scheduling" className="hover:text-white">
              Scheduling
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Resources</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <a href="#" className="hover:text-white">
              User Guide
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              FAQ
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Contact & Connect</h3>
        <div className="flex flex-col space-y-2 mt-2">
          <a
            href="mailto:ydapo50@gmail.com"
            aria-label="Email"
            className="hover:text-white"
          >
            ydapo50@gmail.com
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-white">
            LinkedIn
          </a>
          <a href="#" aria-label="GitHub" className="hover:text-white">
            GitHub
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Need help?{" "}
          <a
            href="mailto:support@dapsemr.com"
            className="underline hover:text-white"
          >
            Contact our support team
          </a>
        </p>
      </div>
    </div>
    <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-400">
      &copy; {new Date().getFullYear()} Daps EMR. All rights reserved.
    </div>
  </footer>
);

export default Footer;
