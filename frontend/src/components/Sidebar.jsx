import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-white min-h-screen p-6 border-r shadow-sm">
      <h2 className="text-xl font-bold text-blue-600 mb-8">
        YBIT Library
      </h2>

      <ul className="space-y-4">
        <li>
          <Link
            to="/dashboard"
            className="block p-2 rounded hover:bg-gray-100 transition"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/books"
            className="block p-2 rounded hover:bg-gray-100 transition"
          >
            Books
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className="block p-2 rounded hover:bg-gray-100 transition"
          >
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;