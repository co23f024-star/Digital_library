import { Link } from "react-router-dom";
import { useState } from "react";

function Sidebar() {

  const [open, setOpen] = useState(false); // ✅ mobile toggle

  return (
    <>
      {/* ✅ MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 shadow border-b">
        <h2 className="text-lg font-bold text-blue-600">
          YBIT Library
        </h2>

        <button
          onClick={() => setOpen(!open)}
          className="text-xl"
        >
          ☰
        </button>
      </div>

      {/* ✅ SIDEBAR */}
      <div
        className={`fixed md:static top-0 left-0 z-50 w-64 bg-white min-h-screen p-6 border-r shadow-sm transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >

        {/* CLOSE BUTTON (MOBILE) */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-600">
            YBIT Library
          </h2>

          <button
            onClick={() => setOpen(false)}
            className="text-xl"
          >
            ✖
          </button>
        </div>

        {/* MENU */}
        <ul className="space-y-4">

          <li>
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)} // ✅ auto close mobile
              className="block p-2 rounded hover:bg-gray-100 transition"
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/books"
              onClick={() => setOpen(false)}
              className="block p-2 rounded hover:bg-gray-100 transition"
            >
              Books
            </Link>
          </li>

          <li>
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="block p-2 rounded hover:bg-gray-100 transition"
            >
              Profile
            </Link>
          </li>

        </ul>
      </div>

      {/* ✅ OVERLAY (MOBILE) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden"
        />
      )}
    </>
  );
}

export default Sidebar;