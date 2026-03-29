import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";

function Books() {

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [suggestions, setSuggestions] = useState([]);

  // 🔥 Backend Base URL
  const BASE_URL = "https://digital-library-wtvm.onrender.com";

  // ✅ Fetch books from backend
  useEffect(() => {
    axios
      .get(`${BASE_URL}/books`)
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
      });
  }, []);

  // 🔹 Dynamic categories from backend
  const categories = [
    "All",
    ...new Set(books.map((book) => book.department)),
  ];

  /* SEARCH HANDLER */

  const handleSearch = (text) => {
    setSearch(text);

    if (text === "") {
      setSuggestions([]);
      return;
    }

    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(text.toLowerCase()) ||
      book.author.toLowerCase().includes(text.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5));
  };

  /* FILTER BOOKS */

  const filteredBooks = books.filter((book) => {

    const matchCategory =
      category === "All" || book.department === category;

    const matchSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (

    <Layout onSearch={(text) => handleSearch(text)}>

      {/* HEADER */}

      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 px-8 py-6 rounded-2xl shadow-xl mb-8 text-white">

        <h2 className="text-3xl font-extrabold tracking-wide">
          📚 Library Books
        </h2>

        <p className="text-sm opacity-80">
          Browse & Download Digital Resources
        </p>

      </div>

      {/* SUGGESTIONS */}

      {suggestions.length > 0 && (

        <div className="bg-white shadow rounded mb-6">

          {suggestions.map((book) => (
            <div
              key={book._id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSearch(book.title);
                setSuggestions([]);
              }}
            >
              {book.title} — {book.author}
            </div>
          ))}

        </div>

      )}

      {/* CATEGORIES */}

      <div className="flex gap-4 mb-6 flex-wrap">

        {categories.map((cat) => (

          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full border ${
              category === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {cat}
          </button>

        ))}

      </div>

      {/* BOOK GRID */}

      {filteredBooks.length === 0 ? (

        <p className="text-center text-gray-500 text-lg">
          No books found.
        </p>

      ) : (

        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">

          {filteredBooks.map((book) => (

            <div
              key={book._id}
              className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition"
            >

              {/* ✅ BOOK IMAGE */}
              <img
                src={`${BASE_URL}${book.cover_url}`}
                alt={book.title}
                className="h-36 w-full object-cover rounded mb-3"
              />

              <h3 className="text-sm font-semibold text-gray-800">
                {book.title}
              </h3>

              <p className="text-xs text-gray-500 mb-3">
                {book.author}
              </p>

              {/* ✅ DOWNLOAD PDF */}
              <a
                href={`${BASE_URL}${book.pdf_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700"
              >
                Download PDF
              </a>

            </div>

          ))}

        </div>

      )}

    </Layout>

  );
}

export default Books;