import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";

/* ✅ BASE URL (IMPORTANT) */
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

  const [suggestions, setSuggestions] = useState([]);
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
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/books`);
        setBooks(res.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  /* ================= SEARCH SUGGESTIONS ================= */
  useEffect(() => {
    if (!searchText) {
      setSuggestions([]);
      return;
    }

    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchText.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5));
  }, [searchText, books]);

  /* ================= SEARCH ================= */
  const handleNavbarSearch = (text, dept) => {
    setSearchText(text.toLowerCase());
    setSearchDept(dept);
    setSelectedDept(null);
  };

  const searchedBooks = books.filter((book) => {
    const matchTitle = book.title.toLowerCase().includes(searchText);

    const matchDept =
      searchDept === "All" || book.department === searchDept;

    return matchTitle && matchDept;
  });

  /* ================= DOWNLOAD ================= */
  const handleDownload = async (pdfUrl, title) => {
    try {
      const response = await axios.get(`${BASE_URL}${pdfUrl}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${title}.pdf`;
      link.click();

    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const departments = [
    "Computer Engineering",
    "Computer Science Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
  ];

  /* ================= MAIN PAGE ================= */
  return (
    <Layout onSearch={handleNavbarSearch}>

      {/* SLIDER */}
      <div className="relative h-[350px] mb-14 rounded-3xl overflow-hidden shadow-2xl">
        {slides.map((image, index) => (
          <img
            key={index}
            src={image}
            alt="slider"
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* RECENT BOOKS */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">
          Recently Uploaded
        </h2>

        {books.length === 0 ? (
          <p className="text-gray-500">No books found.</p>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {books.slice(0, 10).map((book) => (
              <div key={book._id} className="min-w-[200px]">
                <BookCard
                  book={book}
                  onClick={() => setSelectedBook(book)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

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
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg border hover:shadow-xl cursor-pointer p-4"
    >
      <img
        src={`https://digital-library-wtvm.onrender.com${book.cover_url}`}
        className="h-32 w-full object-cover rounded mb-3"
        alt="cover"
      />

      <h3 className="text-sm font-bold">{book.title}</h3>

      <p className="text-xs text-gray-500">{book.author}</p>

      <p className="text-xs text-blue-600">{book.department}</p>
    </div>
  );
}

/* ================= MODAL ================= */
function BookModal({ book, onClose, onDownload }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

      <div className="bg-white w-[400px] rounded-xl p-6">

        <button onClick={onClose}>✖</button>

        <img
          src={`https://digital-library-wtvm.onrender.com${book.cover_url}`}
          className="w-full h-60 object-cover rounded mb-4"
        />

        <h3>{book.title}</h3>

        <p>{book.author}</p>

        <div className="flex gap-3 mt-4">

          <button
            onClick={() =>
              window.open(
                `https://digital-library-wtvm.onrender.com${book.pdf_url}`
              )
            }
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            View
          </button>

          <button
            onClick={() =>
              onDownload(book.pdf_url, book.title)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download
          </button>

        </div>

      </div>
    </div>
  );
}

export default LibraryHome;