import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";

function Books() {

  return (

    <Layout onSearch={(text) => handleSearch(text)}>

      {/* HEADER */}

      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 px-4 sm:px-8 py-5 sm:py-6 rounded-2xl shadow-xl mb-6 sm:mb-8 text-white"> {/* ✅ */}

        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide"> {/* ✅ */}
          📚 Library Books
        </h2>

        <p className="text-xs sm:text-sm opacity-80">
          Browse & Download Digital Resources
        </p>

      </div>

      {/* SUGGESTIONS */}

      {suggestions.length > 0 && (

        <div className="bg-white shadow rounded mb-6 max-h-60 overflow-y-auto"> {/* ✅ */}

          {suggestions.map((book) => (
            <div
              key={book._id}
              className="px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
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

      <div className="flex gap-2 sm:gap-4 mb-6 flex-wrap"> {/* ✅ */}

        {categories.map((cat) => (

          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full border whitespace-nowrap ${
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

        <p className="text-center text-gray-500 text-base sm:text-lg">
          No books found.
        </p>

      ) : (

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"> {/* ✅ */}

          {filteredBooks.map((book) => (

            <div
              key={book._id}
              className="bg-white p-3 sm:p-4 rounded-lg border shadow-sm hover:shadow-md transition"
            >

              <img
                src={`${BASE_URL}${book.cover_url}`}
                alt={book.title}
                className="h-28 sm:h-32 md:h-36 w-full object-cover rounded mb-2 sm:mb-3"
              />

              <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1"> {/* ✅ */}
                {book.title}
              </h3>

              <p className="text-[11px] sm:text-xs text-gray-500 mb-2 sm:mb-3 line-clamp-1">
                {book.author}
              </p>

              <a
                href={`${BASE_URL}${book.pdf_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-blue-600 text-white text-xs sm:text-sm py-1.5 sm:py-2 rounded hover:bg-blue-700"
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
export default Layout;