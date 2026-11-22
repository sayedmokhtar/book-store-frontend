import Footer from "../components/footer";
import Header from "../components/header";
import Api from "../api/Api";
import { useState, useEffect, useRef } from "react";
export default function AuthorsForUsers() {
  const [authors, setAuthors] = useState([]);
  const [serverError, setServerErorr] = useState("");
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const seeMoreController = useRef(null);
  const isFetching = useRef(null);

  // initial fetching function
  useEffect(() => {
    const controller = new AbortController();
    async function getAuthors() {
      setIsLoading(true);
      setServerErorr("");
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
        setAuthors(newAuthors);
        setCursor(nextCursor);
        setHasMore(hasMore);
      } catch (error) {
        if (error.code === "ERR_CANCELED") return;
        console.log(error.message);
        setServerErorr(error.response?.data?.message || "something went wrong");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }
    getAuthors();
    return () => {
      controller.abort();
      seeMoreController.current?.abort();
    };
  }, []);

  // function to handle see more button
  async function handleSeeMore() {
    if (isFetching.current || !hasMore) return;
    isFetching.current = true;
    setServerErorr("");
    setIsLoading(true);
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
        hasNextPage: hasMor,
      } = response.data;
      setAuthors((prev) => [...prev, ...newAuthors]);
      setCursor(nextCursor);
      setHasMore(hasMor);
    } catch (error) {
      if (error.code === "ERR_CANCELED") return;
      console.log(error.response?.data?.message || "something went wrong");
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
  return (
    <>
      <Header />
      <div className="container">
        <div className="grid">
          {authors.map((author) => (
            <div className="card">
              <img
                src={`https://book-store-api-1t03.onrender.com${book.image}`}
                alt={author.name}
                className="w-[90] ml-[5%] h-100 rounded-lg lg:w-full"
              ></img>
              <h2 className="text-sm font-body pl-2 font-medium lg:text-lg">
                Name: {author.name}
              </h2>
              <h2 className="text-sm font-body pl-2 font-medium lg:text-lg">
                Country: {author.country}
              </h2>
              <h2 className="text-sm font-body pl-2 font-medium lg:text-lg">
                Age: {author.age}
              </h2>
            </div>
          ))}
        </div>
        {hasMore && (
          <button
            className="secondary-buuton w[10%] mt-5 ml-[45%]"
            disabled={isLoading}
            onClick={handleSeeMore}
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
