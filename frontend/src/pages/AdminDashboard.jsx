import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

const EMPTY_FORM = {
  title: "",
  author: "",
  department: "Computer Science Engineering",
  cover: null,
  pdf: null,
};

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [showModal, setShowModal] = useState(false);

  const departments = [
    "All Departments",
    "Computer Engineering",
    "Computer Science Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
  ];

  /* ================= FETCH BOOKS ================= */
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API}/books/`);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  /* ================= ADD ================= */
  const handleAddNew = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = (book) => {
    setEditingId(book._id);
    setFormData({
      title: book.title,
      author: book.author,
      department: book.department,
      cover: null,
      pdf: null,
    });
    setShowModal(true);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!formData.title || !formData.author) {
      alert("Title & Author required");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("department", formData.department);

    if (formData.cover) data.append("cover", formData.cover);
    if (formData.pdf) data.append("pdf", formData.pdf);

    try {
      setLoading(true);

      if (editingId) {
        await axios.put(`${API}/admin/update/${editingId}`, data);
        alert("Book updated successfully ✅");
      } else {
        await axios.post(`${API}/admin/upload`, data);
        alert("Book uploaded successfully 🚀");
      }

      setShowModal(false);
      setEditingId(null);
      setFormData(EMPTY_FORM);
      fetchBooks();
    } catch (err) {
      console.error(err);
      alert("Operation failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (bookId) => {
    if (!window.confirm("Delete this book permanently?")) return;

    try {
      await axios.delete(`${API}/admin/delete/${bookId}`);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FILTER ================= */
  const filteredBooks = books.filter((b) => {
    const deptOk =
      selectedDept === "All Departments" ||
      b.department === selectedDept;

    const searchOk = b.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return deptOk && searchOk;
  });

  /* ================= COUNTS ================= */
  const getCount = (dept) =>
    books.filter((b) => b.department === dept).length;

  const totalBooks = books.length;

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* ================= NAVBAR ================= */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 px-8 py-5 rounded-2xl shadow-xl mb-10 flex justify-between items-center text-white">
        <div>
          <h1 className="text-2xl font-extrabold">
            📚 Admin Dashboard
          </h1>
          <p className="text-sm opacity-80">
            Digital Library Management Panel
          </p>
        </div>

        <div className="flex gap-5">
          <button
            onClick={handleAddNew}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg shadow-md"
          >
            + Add Book
          </button>

          <button
            onClick={handleLogout}
            className="bg-blue-700 hover:bg-blue-800 px-5 py-2 rounded-lg shadow-md"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ================= COUNTS SECTION ================= */}
      <div className="grid grid-cols-5 gap-6 mb-10">

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center border-t-4 border-green-600">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Books
          </h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {totalBooks}
          </p>
        </div>

        {departments
          .filter((d) => d !== "All Departments")
          .map((dept) => (
            <div
              key={dept}
              className="bg-white rounded-2xl shadow-lg p-6 text-center border-t-4 border-blue-600"
            >
              <h2 className="text-lg font-semibold text-gray-600">
                {dept}
              </h2>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {getCount(dept)}
              </p>
            </div>
          ))}
      </div>

      {/* ================= SEARCH & FILTER ================= */}
      <div className="flex justify-between mb-6">
        <input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-1/3 shadow-sm"
        />

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="border px-4 py-2 rounded-lg shadow-sm"
        >
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-left">Cover</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Author</th>
              <th className="p-4 text-left">Department</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book._id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <img
                    src={`${API}${book.cover_url}`}
                    className="w-14 h-14 rounded object-cover"
                    alt="cover"
                  />
                </td>
                <td className="p-4">{book.title}</td>
                <td className="p-4">{book.author}</td>
                <td className="p-4">{book.department}</td>
                <td className="p-4">
  <div className="flex items-center gap-2">
    <button
      onClick={() =>
        window.open(`${API}${book.pdf_url}`, "_blank")
      }
      className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md"
    >
      View
    </button>

    <button
      onClick={() => handleEdit(book)}
      className="px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
    >
      Edit
    </button>

    <button
      onClick={() => handleDelete(book._id)}
      className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md"
    >
      Delete
    </button>
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[500px]">

            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Book" : "Add New Book"}
            </h2>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-3"
              placeholder="Title"
            />

            <input
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-3"
              placeholder="Author"
            />

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-3"
            >
              {departments
                .filter((d) => d !== "All Departments")
                .map((d) => (
                  <option key={d}>{d}</option>
                ))}
            </select>

           <label className="text-sm font-semibold text-gray-700">
  Book Cover Image
</label>

<input
  type="file"
  name="cover"
  accept="image/*"
  onChange={handleChange}
  className="border p-2 rounded w-full mb-3"
/>

<label className="text-sm font-semibold text-gray-700">
  Book PDF File
</label>

<input
  type="file"
  name="pdf"
  accept="application/pdf"
  onChange={handleChange}
  className="border p-2 rounded w-full mb-3"
/>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {loading
                  ? "Processing..."
                  : editingId
                  ? "Update"
                  : "Upload"}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;