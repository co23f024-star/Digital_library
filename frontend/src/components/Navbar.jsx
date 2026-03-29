import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar({ onSearch }) {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (onSearch) {
      onSearch(value, "All");
    }
  };

  return (

    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 px-4 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 shadow-lg text-white"> {/* ✅ */}

      {/* LEFT SIDE */}
      <h1 className="text-lg sm:text-xl font-bold tracking-wide text-center sm:text-left w-full sm:w-auto"> {/* ✅ */}
        📚 Digital Library
      </h1>

      {/* SEARCH BAR */}
      <div className="w-full sm:flex-1 flex justify-center"> {/* ✅ */}
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={handleSearch}
          className="w-full sm:w-[400px] px-4 py-2 rounded-lg text-black outline-none"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto"> {/* ✅ */}

        <span className="font-medium opacity-90 text-sm sm:text-base">
          Rahul
        </span>

        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-500 rounded-full flex items-center justify-center font-bold">
          R
        </div>

        <button
          onClick={handleLogout}
          className="bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg transition-all duration-300 shadow-md"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;