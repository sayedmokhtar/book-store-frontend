import Header from "../components/headerLogin";
import Footer from "../components/footer";
import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import SuccessMessage from "../components/successMessage";
import Api from "../api/Api";
import UpdateCount from "../utilsUpdateCountCache/dashboardUpdate";
export default function RemoveAuthor() {
  const [search, setSearch] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [serverError, setServerError] = useState("");
  const [debounce, setDebounce] = useState("");
  const [seeLoading, setSeeLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const seeMore = useRef(null);

  // handle search input
  useEffect(() => {
    const time = setTimeout(() => {
      setDebounce(search.trim());
    }, 1000);
    return () => {
      clearTimeout(time);
    };
  }, [search]);

  // debounce function
  useEffect(() => {
    if (!debounce) return;
    const controller = new AbortController();
    let active = true;
    async function SearchAuthor() {
      try {
        setLoading(true);
        setServerError("");
        const response = await Api.get("/authors", {
          params: { limit: 15, search: debounce },
          signal: controller.signal,
        });
        if (active) {
          setAuthors(response.data.authorsList);
          setHasMore(response.data.nextPage);
          setCursor(response.data.nextCursor);
        }
      } catch (error) {
        if (error.code === "ERR_CANCELED") return;
        if (active) {
          console.log(error.message);
          setServerError(
            error.response?.data?.message || "something went wrong",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    SearchAuthor();
    return () => {
      active = false;
      controller.abort();
    };
  }, [debounce]);

  // handle remove author
  async function handleRemoveAuthor(id) {
    if (isDelete) return;
    try {
      setIsDelete(true);
      setServerError("");
      await Api.delete(`/authors/${id}`);
      setAuthors((prev) => prev.filter((author) => author._id !== id));
      setSuccessMessage("Author Has Been Deleted Successfully");
      UpdateCount("totalAuthors", "delete");
    } catch (error) {
      console.log(error.message);
      setServerError(error.message || "something went wrong");
    } finally {
      setIsDelete(false);
    }
  }

  // handle the message
  useEffect(() => {
    const time = setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
    return () => {
      clearTimeout(time);
    };
  }, [successMessage]);

  // see more function
  async function handleSeeMore() {
    if (seeLoading || !hasMore || !cursor) return;
    const controller = new AbortController();
    seeMore.current = controller;
    try {
      setSeeLoading(true);
      setServerError("");
      const response = await Api.get("/authors", {
        params: {
          limit: 15,
          ...(cursor && { after: cursor }),
          ...(debounce && { search: debounce }),
        },
        signal: controller.signal,
      });
      const {
        authorsList: newAuthros,
        nextCursor,
        nextPage: hasMore,
      } = response.data;
      setAuthors((prev) => [...prev, ...newAuthros]);
      setCursor(nextCursor);
      setHasMore(hasMore);
    } catch (error) {
      if (error.code === "ERR_CANCELED") return;
      console.log(error.message);
      setServerError(error.response?.data?.message || "something went wrong");
    } finally {
      if (seeMore.current === controller) {
        seeMore.current = null;
        setSeeLoading(false);
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
              setAuthors([]);
              setHasMore(false);
              setCursor(null);
            }
          }}
          className="flex-1 outline-none bg-transparent py-2"
        ></input>
      </div>
      <div className="container">
        <div className="grid">
          {authors.map((author) => (
            <div className="card" key={author._id}>
              <img
                src={`http://localhost:5173/avatar.jpg`}
                alt="author-img"
                className="w-full h-100 rounded-lg"
              ></img>
              <h3 className="text-sm font-body pl-2 font-medium lg:text-lg">
                Name: {author.name}
              </h3>
              <h3 className="text-sm font-body pl-2 font-medium lg:text-lg">
                Country:{author.country}
              </h3>
              <button
                className="secondary-buuton"
                disabled={isDelete}
                onClick={(e) => {
                  handleRemoveAuthor(author._id);
                  if (e.target.trim()) {
                    setAuthors([]);
                    setServerError("");
                  }
                }}
              >
                {isDelete ? "Loading..." : "Delete"}
              </button>
            </div>
          ))}
          <SuccessMessage successMessage={successMessage} />
          {!loading && debounce && authors.length === 0 && !serverError && (
            <p>No Authors found.</p>
          )}
        </div>

        {hasMore && (
          <button
            className="secondary-buuton w-[20%] ml-[40%] mt-2"
            disabled={seeLoading}
            onClick={() => {
              handleSeeMore();
            }}
          >
            {seeLoading ? "Loading..." : "See More"}
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
