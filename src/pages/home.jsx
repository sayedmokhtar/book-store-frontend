import Header from "../components/header";
import Footer from "../components/footer";
import Api from "../api/Api";
import { useState, useEffect } from "react";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [serverError, setServerError] = useState("");

  // fetch books
  useEffect(() => {
    const controller = new AbortController();

    async function getBooks() {
      try {
        const response = await Api.get("/books/latest", {
          signal: controller.signal,
        });
        console.log(response.data);
        setBooks(response.data);
      } catch (error) {
        if (error.code === "ERR_CANCELED") return;
        console.log(error.message);
        setServerError(error.response?.data?.message || "something went wrong");
      }
    }
    getBooks();
    return () => {
      controller.abort();
    };
  }, []);

  // function to dosplay book pdf
  function handleReadBook(book) {
    if (!book.bookPdf) {
      setServerError("PDF is not available");
      return;
    }
    window.open(
      `https://book-store-api-1t03.onrender.com${book.bookPdf}`,
      "_blank",
      "noopener , noreferrer",
    );
  }
  return (
    <>
      <Header />
      <div className="container animate-slide-in">
        <h2 className="text-lg font-title font-bold animate-ping duration-1000">
          The Latest Books
        </h2>
        <div className="grid">
          {books.map((book) => (
            <div className="card" key={book._id}>
              <img
                src={`https://book-store-api-1t03.onrender.com${book.image}`}
                alt={book.title}
                className="w-[90%] lg:w-full h-100 rounded-lg"
              ></img>
              <h2 className="text-sm font-body pl-2 font-medium lg:text-lg">
                {book.title}
              </h2>
              <h2 className="text-sm font-body pl-2 font-medium lg:text-lg">
                {book.description}
              </h2>
              <h2 className="text-sm font-body pl-2 font-medium lg:text-lg">
                {book.price}$
              </h2>
              <h2 className="text-sm font-body pl-2 font-medium lg:text-lg">
                {book.author?.name}
              </h2>
              <button
                className="secondary-buuton"
                disabled={!book.bookPdf}
                onClick={() => {
                  handleReadBook(book);
                }}
              >
                {!book.bookPdf ? "PDF Unavailable" : "Read Now"}
              </button>
            </div>
          ))}
        </div>
        {serverError && (
          <p className="text-sm font-body pl-2 font-medium lg:text-lg">
            {serverError}
          </p>
        )}
      </div>
      <div className="w-[70%] h-full mt-5 ml-[15%] border-4 rounded-lg border-purple-300 shadow-lg shadow-blue-50">
        <video
          src="/zoomingin.mp4"
          muted
          loop
          playsInline
          autoPlay
          w-full
        ></video>
      </div>
      <Footer />
    </>
  );
}
