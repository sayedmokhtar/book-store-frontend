import Header from "../components/headerLogin";
import Footer from "../components/footer";
import Api from "../api/Api";
import { useEffect, useState, useRef } from "react";

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const isFetching = useRef(false);
  const seeMoreController = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    async function getAllAuthors() {
      setServerError("");
      try {
        const response = await Api.get("/authors", {
          params: { limit: 15, ...(cursor && { after: cursor }) },
          signal: controller.signal,
        });
        const {
          authorsList: newAuthors,
          nextCursor,
          hasNextPage: hasMore,
        } = response.data;
        console.log(response.data);
        setAuthors(newAuthors);
        setCursor(nextCursor);
        setHasMore(hasMore);
      } catch (error) {
        if (error.code === "ERR_CANCELED") {
          return;
        }
        console.log(error.message);
        setServerError(error.response?.data?.message || "something went wrong");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    getAllAuthors();
    return () => {
      controller.abort();
      seeMoreController.current?.abort();
    };
  }, []);

  async function fetchAuthors() {
    if (isFetching.current || !hasMore) return;
    isFetching.current = true;
    setLoading(true);
    setServerError("");
    const controller = new AbortController();
    seeMoreController.current = controller;
    try {
      const response = await Api.get("/authors", {
        params: { limit: 15, ...(cursor && { after: cursor }) },
        signal: controller.signal,
      });
      const {
        authorsList: newAuthors,
        nextCursor,
        hasNextPage: hasMore,
      } = response.data;
      setAuthors((prev) => [...prev, ...newAuthors]);
      setCursor(nextCursor);
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
          {authors.map((author) => (
            <div className="card" key={author._id}>
              <img
                src={`http://localhost:5173/avatar.jpg`}
                alt="author-img"
                className="w-full h-100 rounded-lg"
              ></img>
              <h4 className="text-sm font-body pl-2 font-medium lg:text-lg">
                Name: {author.name}
              </h4>
              <p className="text-sm font-body pl-2 font-medium lg:text-lg">
                country: {author.country}
              </p>
            </div>
          ))}
        </div>
        {hasMore && (
          <button
            className="secondary-buuton w-[10%] ml-[45%]"
            disabled={loading}
            onClick={fetchAuthors}
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
