import { useEffect, useState } from "react";
import axios from "axios";

/* ✅ FIXED API */
const API = "https://digital-library-wtvm.onrender.com";

const EMPTY_FORM = {
  title: "",
  author: "",
  department: "Computer Science",
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
    "Computer Science",
    "Mechanical Engineering",
    "Electrical Engineering",
  ];

  /* ================= FETCH ================= */
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API}/books`);
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

  /* ================= INPUT ================= */
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
        alert("Updated ✅");
      } else {
        await axios.post(`${API}/admin/upload`, data);
        alert("Uploaded 🚀");
      }

      setShowModal(false);
      setEditingId(null);
      setFormData(EMPTY_FORM);
      fetchBooks();

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    await axios.delete(`${API}/admin/delete/${id}`);
    fetchBooks();
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

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <button onClick={handleAddNew}>
        + Add Book
      </button>

      {/* SEARCH */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <table className="w-full mt-6">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Dept</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book._id}>

              <td>
                <img
                  src={`${API}${book.cover_url}`}
                  className="w-12"
                />
              </td>

              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.department}</td>

              <td>
                <button onClick={() => handleEdit(book)}>Edit</button>
                <button onClick={() => handleDelete(book._id)}>Delete</button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default AdminDashboard;