import Header from "../components/headerLogin";
import Footer from "../components/footer";
import { Search } from "lucide-react";
import Api from "../api/Api";
import SuccessMessage from "../components/successMessage";
import { useState, useEffect, useRef } from "react";
import UpdateCount from "../utilsUpdateCountCache/dashboardUpdate";

export default function RemoveBook() {
  const [search, setSearch] = useState("");
  const [deboucing, setDeboucing] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerErorr] = useState("");
  const [btn, setBtn] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [Cursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const seeMore = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDeboucing(search.trim());
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // handle initial
  useEffect(() => {
    if (!deboucing) {
      return;
    }
    const controller = new AbortController();
    let active = true;
    async function serachBook() {
      try {
        setLoading(true);
        setServerErorr("");
        const response = await Api.get("/books", {
          params: { limit: 15, search: deboucing },
          signal: controller.signal,
        });
        if (active) {
          console.log(response.data.booksList);
          setBooks(response.data.booksList);
          setHasMore(response.data.hasNextPage);
          setNextCursor(response.data.nextCursor);
        }
      } catch (error) {
        if (error.code === "ERR_CANCELED") {
          return;
        }
        if (active) {
          console.log(error.message);
          setServerErorr(
            error.response?.data?.message || "something went wrong",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    serachBook();
    return () => {
      active = false;
      controller.abort();
    };
  }, [deboucing]);

  // handle delete book
  async function removeBook(id) {
    if (btn) return;
    const controller = new AbortController();
    seeMore.current = controller;
    try {
      setBtn(true);
      await Api.delete(`/books/${id}`, { signal: controller.signal });
      setBooks((prev) => prev.filter((book) => book._id !== id));
      setSuccessMessage("book has been deleted successfually !");
      UpdateCount("totalBooks", "delete");
    } catch (error) {
      if (error.code === "ERR_CANCELED") return;
      setServerErorr(error.response?.data?.message || "somethign went wrong");
    } finally {
      if (seeMore.current === controller) {
        seeMore.current = null;
        setBtn(false);
      }
    }
  }

  // show message
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [successMessage]);

  // handle see more function
  async function handleSeeMore() {
    if (isLoading || !hasMore || !Cursor) return;
    const controller = new AbortController();
    seeMore.current = controller;
    try {
      setIsLoading(true);
      setServerErorr("");
      const response = await Api.get("/books", {
        params: {
          limit: 15,
          ...(Cursor && { after: Cursor }),
          ...(deboucing && { search: deboucing }),
        },
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
      setServerErorr(error.response?.data?.message);
    } finally {
      if (seeMore.current === controller) {
        seeMore.current = null;
        setIsLoading(false);
      }
    }
  }

  return (
    <>
      <Header />
      <div className="w-[80%] ml-[10%] flex items-center gap-2 mt-10 bg-gray-300 rounded-lg">
        <Search size={20} />
        <input
          type="search"
          placeholder="Search"
          autoFocus
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value === "") {
              setBooks([]);
            }
          }}
          className="flex-1 outline-none bg-transparent py-2"
        ></input>
      </div>
      <div className="container">
        <div className="grid">
          {books.map((book) => (
            <div className="card" key={book._id}>
              <img
                src={`https://book-store-api-1t03.onrender.com${book.image}`}
                alt="book-img"
                className="w-full h-100 rounded-lg"
              ></img>
              <h3 className="text-sm font-body pl-2 font-medium lg:text-lg">
                {book.title}
              </h3>
              <p className="text-sm font-body pl-2 font-medium lg:text-lg">
                {book.description}
              </p>
              <p className="text-sm font-body pl-2 font-medium lg:text-lg">
                price: {book.price}
              </p>
              <p className="text-sm font-body pl-2 font-medium lg:text-lg">
                {book.author?.name}
              </p>
              <button
                type="button"
                className="secondary-buuton"
                disabled={btn}
                onClick={(e) => {
                  removeBook(book._id);
                  if (e.target.trim()) {
                    setBooks([]);
                    setServerErorr("");
                  }
                }}
              >
                {btn ? "Loading..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
        <SuccessMessage successMessage={successMessage} />
        {!loading && deboucing && books.length === 0 && !serverError && (
          <p>No books found.</p>
        )}
        {serverError && (
          <p className="text-sm font-body pl-2 font-medium lg:text-lg">
            {serverError}
          </p>
        )}
        {hasMore && (
          <button
            className="secondary-buuton w-[10%] ml-[45%]"
            disabled={isLoading}
            onClick={() => {
              handleSeeMore;
            }}
          >
            {isLoading ? "Loading..." : "See More"}
          </button>
        )}
      </div>
      <Footer />
    </>
  );
}
