import Header from "../components/header";
import Footer from "../components/footer";
import Api from "../api/Api";
import { useState, useEffect, useRef } from "react";

export default function BooksForUsers() {
  const [books, setBooks] = useState([]);
  const [serverError, setServerError] = useState("");
  const [cursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFetching = useRef(false);
  const seeMoreController = useRef(null);

  // initial function to get books
  useEffect(() => {
    const controller = new AbortController();
    async function getBooks() {
      setServerError("");
      setIsLoading(true);
      try {
        const response = await Api.get("/books", {
          params: { limit: 15, ...(cursor && { after: cursor }) },
          signal: controller.signal,
        });
        const {
          booksList: newBooks,
          nextCursor,
          hasNextPage: hasMore,
        } = response.data;
        setBooks(newBooks);
        setNextCursor(nextCursor);
        setHasMore(hasMore);
      } catch (error) {
        if (error.code === "ERR_CANCELED") return;
        console.log(error.message);
        setServerError(error.response?.data?.message || "something went wrong");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }
    getBooks();
    return () => {
      controller.abort();
      seeMoreController.current?.abort();
    };
  }, []);

  // function to fetch rest of books

  async function fetchBooks() {
    if (isFetching.current || !hasMore) return;
    isFetching.current = true;
    setServerError("");
    setIsLoading(true);
    const controller = new AbortController();
    seeMoreController.current = controller;
    try {
      const response = await Api.get("/books", {
        params: { limit: 15, ...(cursor && { after: cursor }) },
        signal: controller.signal,
      });
      const {
        booksList: newBooks,
        nextCursor,
        hasNextPage: hasMore,
      } = response.data;
      setBooks((prev) => [...prev, ...newBooks]);
      setNextCursor(nextCursor);
      setHasMore(hasMore);
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        return;
      }
      console.log(error.message);
      setServerError(error.response?.data?.message || "something went wrong");
    } finally {
      isFetching.current = false;
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
      if (seeMoreController.current === controller) {
        seeMoreController.current = null;
      }
    }
  }

  // function to handle read now click

  function handleReadNow(book) {
    if (!book.bookPdf) {
      setServerError("PDF is not available");
      return;
    }
    window.open(
      `http://127.0.0.1:5000${book.bookPdf}`,
      "_blank",
      "noopener , noreferrer",
    );
  }

  return (
    <>
      <Header />
      <div className="container animate-slide-in">
        <div className="grid">
          {books.map((book) => (
            <div className="card" key={book._id}>
              <img
                src={`https://book-store-api-1t03.onrender.com${book.image}`}
                className="w-[90%] lg:w-full h-100 rounded-lg"
                alt={book.title}
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
                  handleReadNow(book);
                }}
              >
                {!book.bookPdf ? "PDF Unavailable" : "Read Now"}
              </button>
            </div>
          ))}
        </div>
        {hasMore && (
          <button
            className="secondary-buuton w-[10%] ml-[45%] mt-10"
            disabled={isLoading}
            onClick={fetchBooks}
          >
            {isLoading ? "Loading..." : "See More"}
          </button>
        )}
        {serverError && (
          <p className="text-sm font-body pl-2 font-medium lg:text-lg">
            {serverError}
          </p>
        )}
      </div>
      <Footer />
    </>
  );
}
