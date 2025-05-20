import React from "react";

const Navbar = () => {
  return (
    <header className="w-full">
      <nav className="px-6 py-4 border-b border-gray-200 bg-white shadow flex items-center">
        <div className="font-bold text-xl">
          {/* You can dynamically show the current page here */}
          Home
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
