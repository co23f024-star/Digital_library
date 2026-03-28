import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Layout({ children, onSearch }) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (onSearch) {
      onSearch(search, department);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= PREMIUM COOL STICKY NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 shadow-2xl px-10 py-5 flex justify-between items-center text-white">

        {/* LEFT - LOGO */}
        <div
          onClick={() => {
            navigate("/home", { replace: true });
            window.location.reload();
          }}
          className="cursor-pointer select-none"
        >
          <h1 className="text-2xl font-extrabold tracking-wide hover:opacity-80 transition">
            📚 Digital Library
          </h1>
          <p className="text-xs opacity-80">
            Explore. Learn. Download.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">

          {/* ================= PREMIUM SEARCH BAR ================= */}
          <div className="flex items-center bg-blue-900 rounded-xl overflow-hidden shadow-lg border border-blue-700">

            {/* Department Dropdown */}
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-blue-900 text-white px-4 py-2 outline-none border-r border-blue-700"
            >
              <option value="All">All Departments</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Computer Science Engineering">CSE</option>
              <option value="Mechanical Engineering">Mechanical</option>
              <option value="Electrical Engineering">Electrical</option>
            </select>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);

                if (onSearch) {
                  onSearch(value, department);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="px-4 py-2 w-72 bg-blue-900 text-white placeholder-gray-300 outline-none"
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 transition flex items-center justify-center"
            >
              🔍
            </button>

          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-blue-700 hover:bg-blue-800 px-5 py-2 rounded-lg transition-all duration-300 shadow-md hover:scale-105"
          >
            Logout
          </button>

        </div>
      </nav>

      {/* ================= PAGE CONTENT ================= */}
      <div className="px-10 py-8">
        {children}
      </div>

    </div>
  );
}

export default Layout;