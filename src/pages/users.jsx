import Header from "../components/headerLogin";
import Footer from "../components/footer";
import Api from "../api/Api";
import { useState, useEffect, useRef } from "react";
export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const isFetching = useRef(false);
  const seeMoreControll = useRef(null);
  // static Api
  useEffect(() => {
    const controller = new AbortController();
    async function getUsers() {
      setServerError("");
      try {
        const response = await Api.get("/users", {
          params: { limit: 15, ...(cursor && { after: cursor }) },
          signal: controller.signal,
        });
        const {
          usersList: newUsers,
          nextCursor,
          hasNextPage: hasMore,
        } = response.data;
        setUsers(newUsers);
        setCursor(nextCursor);
        setHasMore(hasMore);
        console.log(users);
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
    getUsers();
    return () => {
      controller.abort();
      seeMoreControll.current?.abort();
    };
  }, []);
  // event handler
  async function fetchUsers() {
    if (isFetching || !hasMore) return;
    isFetching.current = true;
    setServerError("");
    setIsLoading(true);
    const controller = new AbortController();
    seeMoreControll.current = controller;
    try {
      const response = await Api.get("/users", {
        params: { limit: 15, ...(cursor && { after: cursor }) },
        signal: controller.signal,
      });
      const {
        usersList: newUsers,
        nextCursor,
        hasNextPage: hasMore,
      } = response.data;
      setUsers((prev) => [...prev, ...newUsers]);
      setCursor(nextCursor);
      setHasMore(hasMore);
    } catch (error) {
      if (error.code === "ERR_CANCELED") return;
      console.log(error.message);
      setServerError(error.response?.data?.message || "something went wrong");
    } finally {
      isFetching.current = false;
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
      if (seeMoreControll.current === controller) {
        seeMoreControll.current = null;
      }
    }
  }

  return (
    <>
      <Header />
      <div className="container animate-slide-in">
        <div className="grid">
          {users.map((user) => (
            <div className="card" key={user._id} value={user._id}>
              <img src="/avatar.jpg"></img>
              <h2>Name: {user.username}</h2>
              <h3>Email: {user.email}</h3>
              <h3>Cerated At: {new Date(user.createdAt).toLocaleString()}</h3>
            </div>
          ))}
        </div>
        {hasMore && (
          <button
            className="secondary-buuton w-[10%] ml-[45%]"
            disabled={isLoading}
            onClick={fetchUsers}
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
