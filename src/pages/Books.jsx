import Header from "../components/headerLogin";
import Footer from "../components/footer";
import { useState, useEffect, useRef } from "react";
import Api from "../api/Api";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const isFetching = useRef(false);
  const seeMoreController = useRef(null);
  useEffect(() => {
    const controller = new AbortController();
    async function getBooks() {
      setServerError("");
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
        setCursor(nextCursor);
        setHasMore(hasMore);
      } catch (error) {
        if (error.code === "ERR_CANCELED") {
          return;
        }
        console.log(error.message);
        setServerError(
          error.response?.data?.message || "something went wronge",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    getBooks();
    return () => {
      controller.abort();
      seeMoreController.current?.abort();
    };
  }, []);

  // handle see more button
  async function fetchBooks() {
    if (isFetching.current || !hasMore) return;
    isFetching.current = true;
    setLoading(true);
    setServerError("");
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
      setCursor(nextCursor);
      setHasMore(hasMore);
    } catch (error) {
      if (error.code === "ERR_CANCELED") {
        return;
      }
      console.log(error.message);
      setServerError(error.response?.data?.message || "somethins went wronge");
    } finally {
      isFetching.current = false;
      if (!controller.signal.aborted) {
        setLoading(false);
      }
      if (seeMoreController.current === controller) {
        seeMoreController.current = null;
      }
    }
  }
  return (
    <>
      <Header />
      <div className="container animate-slide-in">
        <div className="grid">
          {books.map((book) => (
            <div
              className="card border border-purple-900 p-2"
              key={book._id}
              value={book._id}
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-100 rounded-lg"
              ></img>
              <h3 className="text-sm font-body pl-2 font-medium lg:text-lg">
                {book.title}
              </h3>
              <p className="text-sm font-body pl-2 font-medium lg:text-lg">
                {book.description}
              </p>
              <p className="text-sm font-body pl-2 font-medium lg:text-lg">
                price:{book.price}
              </p>
              <p className="text-sm font-body pl-2 font-medium lg:text-lg">
                author:{book.author?.name}
              </p>
            </div>
          ))}
        </div>
        {hasMore && (
          <button
            className="secondary-buuton w-[10%] ml-[45%]"
            onClick={fetchBooks}
            disabled={loading}
          >
            {loading ? "Loading..." : "See More"}
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
