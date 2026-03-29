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

  const departments = [
    "Computer Engineering",
    "Computer Science",
    "Mechanical Engineering",
    "Electrical Engineering",
  ];

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
  const handleNavbarSearch = (text, dept = "All") => {
    setSearchText((text || "").toLowerCase());
    setSearchDept(dept);
    setSelectedDept(null);
  };

  const searchedBooks = books.filter(book =>
    (book.title || "").toLowerCase().includes(searchText) &&
    (searchDept === "All" || book.department === searchDept)
  );

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

  return (
    <Layout onSearch={handleNavbarSearch}>

      {/* SLIDER */}
      <div className="relative h-[180px] sm:h-[250px] md:h-[350px] mb-10 sm:mb-14 overflow-hidden">
        {slides.map((img, i) => (
          <img
            key={i}
            src={img}
            className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
              i === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* SEARCH RESULT */}
      {searchText ? (
        <>
          <h2 className="text-xl sm:text-2xl font-bold mb-6">
            Search Results
          </h2>

          {searchedBooks.length === 0 ? (
            <p className="text-center text-gray-500">
              No books found.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {searchedBooks.map(book => (
                <BookCard
                  key={book._id}
                  book={book}
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* RECENTLY */}
          <div className="mb-10 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Recently Uploaded
            </h2>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2">
              {books.slice(0, 10).map(book => (
                <BookCard
                  key={book._id}
                  book={book}
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </div>
          </div>

          {/* DEPARTMENTS */}
          {departments.map(dept => {

            const deptBooks = books.filter(
              book => book.department === dept
            );

            if (deptBooks.length === 0) return null;

            return (
              <div key={dept} className="mb-10 sm:mb-16">

                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-2xl font-bold">
                    {dept}
                  </h2>

                  <button
                    onClick={() => setSelectedDept(dept)}
                    className="text-blue-600 text-sm sm:text-base"
                  >
                    View All →
                  </button>
                </div>

                <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2">
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
        </>
      )}

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
    <div onClick={onClick} className="min-w-[140px] sm:min-w-[180px] md:min-w-[200px] cursor-pointer">

      <img
        src={`${BASE_URL}${book.cover_url}`}
        className="h-24 sm:h-28 md:h-32 w-full object-cover rounded"
      />

      <h3 className="font-bold text-sm sm:text-base line-clamp-1">
        {book.title}
      </h3>

      <p className="text-xs sm:text-sm text-gray-500">
        {book.author}
      </p>

      <p className="text-xs text-blue-600">
        {book.department}
      </p>

    </div>
  );
}


/* ================= MODAL ================= */
function BookModal({ book, onClose, onDownload }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

      <div className="bg-white p-4 sm:p-6 w-full max-w-sm sm:max-w-md rounded-lg">

        <button onClick={onClose} className="mb-2 text-right w-full">
          ✖
        </button>

        <img
          src={`${BASE_URL}${book.cover_url}`}
          className="w-full h-40 sm:h-52 md:h-60 object-cover rounded"
        />

        <h3 className="text-lg sm:text-xl font-bold mt-3">
          {book.title}
        </h3>

        <p className="text-sm text-gray-600">{book.author}</p>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">

          <button
            onClick={() =>
              window.open(`${BASE_URL}${book.pdf_url}`)
            }
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            View
          </button>

          <button
            onClick={() =>
              onDownload(book.pdf_url, book.title)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Download
          </button>

        </div>

      </div>
    </div>
  );
}

export default LibraryHome;