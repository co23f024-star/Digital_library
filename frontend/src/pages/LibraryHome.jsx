import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";

/* ✅ BASE URL */
const BASE_URL = "https://digital-library-wtvm.onrender.com";

/* SLIDER IMAGES */
import slide1 from "../assets/slider1.png";
import slide2 from "../assets/slider2.png";
import slide3 from "../assets/slider3.png";
import slide4 from "../assets/slider4.png";
import slide5 from "../assets/slider5.png";

function LibraryHome() {

  const [books, setBooks] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [searchDept, setSearchDept] = useState("All");

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [slide1, slide2, slide3, slide4, slide5];

  /* ================= SLIDER ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  /* ================= FETCH BOOKS ================= */
  useEffect(() => {
    axios.get(`${BASE_URL}/books`)
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  }, []);

  /* ================= SEARCH ================= */
  const handleNavbarSearch = (text, dept) => {
    setSearchText(text.toLowerCase());
    setSearchDept(dept);
    setSelectedDept(null);
  };

  const searchedBooks = books.filter(book => {
    return (
      book.title.toLowerCase().includes(searchText) &&
      (searchDept === "All" || book.department === searchDept)
    );
  });

  /* ================= DOWNLOAD ================= */
  const handleDownload = async (pdfUrl, title) => {
    const res = await axios.get(`${BASE_URL}${pdfUrl}`, {
      responseType: "blob"
    });

    const blob = new Blob([res.data], { type: "application/pdf" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${title}.pdf`;
    link.click();
  };

  /* ✅ IMPORTANT: MATCH YOUR DATABASE VALUES */
  const departments = [
    "Computer Engineering",
    "Computer Science",
    "Mechanical Engineering",
    "Electrical Engineering",
  ];

  /* ================= DEPARTMENT PAGE ================= */
  if (selectedDept) {

    const deptBooks = books.filter(
      book => book.department === selectedDept
    );

    return (
      <Layout onSearch={handleNavbarSearch}>

        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">{selectedDept}</h2>

          <button
            onClick={() => setSelectedDept(null)}
            className="text-blue-600"
          >
            ← Back
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {deptBooks.map(book => (
            <BookCard
              key={book._id}
              book={book}
              onClick={() => setSelectedBook(book)}
            />
          ))}
        </div>

        {selectedBook && (
          <BookModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onDownload={handleDownload}
          />
        )}

      </Layout>
    );
  }

  /* ================= MAIN PAGE ================= */
  return (
    <Layout onSearch={handleNavbarSearch}>

      {/* SLIDER */}
      <div className="relative h-[350px] mb-14 rounded-3xl overflow-hidden">
        {slides.map((img, i) => (
          <img
            key={i}
            src={img}
            className={`absolute w-full h-full object-cover transition ${
              i === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* RECENTLY */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Recently Uploaded</h2>

        <div className="flex gap-6 overflow-x-auto">
          {books.slice(0, 10).map(book => (
            <BookCard
              key={book._id}
              book={book}
              onClick={() => setSelectedBook(book)}
            />
          ))}
        </div>
      </div>

      {/* 🔥 DEPARTMENT SECTIONS */}
      {departments.map(dept => {

        const deptBooks = books.filter(
          book => book.department === dept
        );

        if (deptBooks.length === 0) return null;

        return (
          <div key={dept} className="mb-16">

            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">{dept}</h2>

              <button
                onClick={() => setSelectedDept(dept)}
                className="text-blue-600"
              >
                View All →
              </button>
            </div>

            <div className="flex gap-6 overflow-x-auto">
              {deptBooks.slice(0, 8).map(book => (
                <BookCard
                  key={book._id}
                  book={book}
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </div>

          </div>
        );
      })}

      {/* MODAL */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onDownload={handleDownload}
        />
      )}

    </Layout>
  );
}

/* ================= BOOK CARD ================= */
function BookCard({ book, onClick }) {
  return (
    <div onClick={onClick} className="min-w-[200px] cursor-pointer">

      <img
        src={`${BASE_URL}${book.cover_url}`}
        className="h-32 w-full object-cover rounded"
      />

      <h3 className="font-bold">{book.title}</h3>
      <p className="text-sm text-gray-500">{book.author}</p>
      <p className="text-xs text-blue-600">{book.department}</p>

    </div>
  );
}

/* ================= MODAL ================= */
function BookModal({ book, onClose, onDownload }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

      <div className="bg-white p-6 w-[400px]">

        <button onClick={onClose}>✖</button>

        <img
          src={`${BASE_URL}${book.cover_url}`}
          className="w-full h-60 object-cover"
        />

        <h3>{book.title}</h3>
        <p>{book.author}</p>

        <div className="flex gap-2 mt-4">

          <button
            onClick={() =>
              window.open(`${BASE_URL}${book.pdf_url}`)
            }
            className="bg-green-600 text-white px-4 py-2"
          >
            View
          </button>

          <button
            onClick={() =>
              onDownload(book.pdf_url, book.title)
            }
            className="bg-blue-600 text-white px-4 py-2"
          >
            Download
          </button>

        </div>

      </div>
    </div>
  );
}

export default LibraryHome;