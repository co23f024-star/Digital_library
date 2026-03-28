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
      onSearch(value, "All"); // send typing text to LibraryHome
    }
  };

  return (

    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 px-8 py-4 flex justify-between items-center shadow-lg text-white">

      {/* LEFT SIDE */}
      <h1 className="text-xl font-bold tracking-wide">
        📚 Digital Library
      </h1>

      {/* SEARCH BAR */}
      <div className="flex-1 flex justify-center">

        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={handleSearch}
          className="w-[400px] px-4 py-2 rounded-lg text-black outline-none"
        />

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">

        <span className="font-medium opacity-90">
          Rahul
        </span>

        <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center font-bold">
          R
        </div>

        <button
          onClick={handleLogout}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all duration-300 shadow-md"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;