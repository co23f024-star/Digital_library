import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";

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

  const [suggestions, setSuggestions] = useState([]); // NEW

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
        const res = await axios.get("http://127.0.0.1:8000/books");
        setBooks(res.data);
      } catch (error) {
        console.error(error);
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

    const matchTitle = book.title
      .toLowerCase()
      .includes(searchText);

    const matchDept =
      searchDept === "All" ||
      book.department === searchDept;

    return matchTitle && matchDept;

  });

  /* ================= DOWNLOAD ================= */

  const handleDownload = async (pdfUrl, title) => {

    try {

      const response = await axios.get(
        `http://127.0.0.1:8000${pdfUrl}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const link = document.createElement("a");

      link.href = window.URL.createObjectURL(blob);
      link.download = `${title}.pdf`;

      link.click();

    } catch (error) {
      console.error(error);
    }

  };

  const departments = [
    "Computer Engineering",
    "Computer Science Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
  ];

  /* ================= DEPARTMENT PAGE ================= */

  if (selectedDept) {

    const deptBooks = searchedBooks.filter(
      (book) => book.department === selectedDept
    );

    return (
      <Layout onSearch={handleNavbarSearch}>

        <div className="flex justify-between items-center mb-10">

          <h2 className="text-3xl font-bold">
            {selectedDept} - All Books
          </h2>

          <button
            onClick={() => setSelectedDept(null)}
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Back
          </button>

        </div>

        {deptBooks.length === 0 ? (

          <p className="text-center text-gray-500 text-lg">
            No books found.
          </p>

        ) : (

          <div className="grid md:grid-cols-5 sm:grid-cols-2 gap-6">

            {deptBooks.map((book) => (

              <BookCard
                key={book._id}
                book={book}
                onClick={() => setSelectedBook(book)}
              />

            ))}

          </div>

        )}

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

      {/* ================= SLIDER ================= */}

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

      {/* ================= SEARCH SUGGESTIONS ================= */}

      {suggestions.length > 0 && (

        <div className="bg-white shadow rounded mb-6 p-3">

          {suggestions.map((book) => (

            <div
              key={book._id}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => {
                setSearchText(book.title.toLowerCase());
                setSuggestions([]);
              }}
            >
              {book.title}
            </div>

          ))}

        </div>

      )}

      {/* ================= SEARCH RESULTS ================= */}

      {searchText ? (

        <>
          <h2 className="text-2xl font-bold mb-6">
            Search Results
          </h2>

          {searchedBooks.length === 0 ? (

            <p className="text-center text-gray-500 text-lg">
              No books found.
            </p>

          ) : (

            <div className="grid md:grid-cols-5 sm:grid-cols-2 gap-6">

              {searchedBooks.map((book) => (

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
          {/* ================= RECENTLY ================= */}

          <div className="mb-16">

            <h2 className="text-2xl font-bold mb-6">
              Recently Uploaded
            </h2>

            <div className="flex gap-6 overflow-x-auto pb-4">

              {[...books]
                .sort(
                  (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
                )
                .slice(0, 8)
                .map((book) => (

                  <div key={book._id} className="min-w-[200px]">

                    <BookCard
                      book={book}
                      onClick={() => setSelectedBook(book)}
                    />

                  </div>

                ))}

            </div>

          </div>

          {/* ================= DEPARTMENTS ================= */}

          {departments.map((dept) => {

            const deptBooks = books.filter(
              (book) => book.department === dept
            );

            if (deptBooks.length === 0) return null;

            return (

              <div key={dept} className="mb-16">

                <div className="flex justify-between items-center mb-6">

                  <h2 className="text-2xl font-bold">
                    {dept}
                  </h2>

                  <button
                    onClick={() => setSelectedDept(dept)}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    All Books →
                  </button>

                </div>

                <div className="flex gap-6 overflow-x-auto pb-4">

                  {deptBooks.slice(0, 10).map((book) => (

                    <div
                      key={book._id}
                      className="min-w-[200px]"
                    >

                      <BookCard
                        book={book}
                        onClick={() => setSelectedBook(book)}
                      />

                    </div>

                  ))}

                </div>

              </div>

            );

          })}

        </>

      )}

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
      className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition cursor-pointer p-4 hover:scale-105"
    >

      <img
        src={`http://127.0.0.1:8000${book.cover_url}`}
        className="h-32 w-full object-cover rounded mb-3"
        alt="cover"
      />

      <h3 className="text-sm font-extrabold line-clamp-2">
        {book.title}
      </h3>

      <p className="text-xs text-gray-500">
        {book.author}
      </p>

      <p className="text-xs text-blue-600 font-semibold mt-1">
        {book.department}
      </p>

    </div>

  );
}

/* ================= MODAL ================= */

function BookModal({ book, onClose, onDownload }) {

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">

      <div className="bg-white w-[400px] rounded-2xl shadow-xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-red-600"
        >
          ✖
        </button>

        <img
          src={`http://127.0.0.1:8000${book.cover_url}`}
          className="w-full h-60 object-cover rounded mb-4"
          alt="cover"
        />

        <h3 className="text-lg font-bold">
          {book.title}
        </h3>

        <p className="text-sm text-gray-500 mb-4">
          {book.author}
        </p>

        <div className="flex gap-3">

          <button
            onClick={() =>
              window.open(
                `http://127.0.0.1:8000${book.pdf_url}`,
                "_blank"
              )
            }
            className="flex-1 bg-green-600 text-white py-2 rounded-lg"
          >
            View
          </button>

          <button
            onClick={() =>
              onDownload(book.pdf_url, book.title)
            }
            className="flex-1 bg-blue-700 text-white py-2 rounded-lg"
          >
            Download
          </button>

        </div>

      </div>

    </div>

  );
}

export default LibraryHome;