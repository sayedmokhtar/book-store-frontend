import Header from "../components/headerLogin";
import Footer from "../components/footer";
import Api from "../api/Api";
import { Search } from "lucide-react";
import SuccessMessage from "../components/successMessage";
import UpdateCount from "../utilsUpdateCountCache/dashboardUpdate";
import { useEffect, useState, useRef } from "react";

export default function RemoveUser() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteBtn, setDeleteBtn] = useState(false);
  const [debounce, setDebounce] = useState("");
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [serverError, setServerError] = useState("");
  const [initial, setInitial] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [seeBtn, setSeeBtn] = useState(false);
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

  // handle initial fetch
  useEffect(() => {
    if (!debounce) return;
    const controller = new AbortController();
    let active = true;
    async function getUsers() {
      try {
        setInitial(true);
        const response = await Api.get("/users", {
          params: { limit: 15, search: debounce },
          signal: controller.signal,
        });
        if (active) {
          setUsers(response.data.usersList);
          setHasMore(response.data.nextPage);
          setCursor(response.data.nextCursor);
        }
      } catch (error) {
        if (error.code === "ERR_CANCELED") return;
        if (active) {
          console.log(error.mesage);
          setServerError(
            error.response?.data?.message || "something went wrong",
          );
        }
      } finally {
        if (active) {
          setInitial(false);
        }
      }
    }
    getUsers();
    return () => {
      active = false;
      controller.abort();
    };
  }, [debounce]);

  // hanlde delete button
  async function handleDelete(id) {
    if (deleteBtn) return;
    const controller = new AbortController();
    seeMore.current = controller;
    try {
      setDeleteBtn(true);
      await Api.delete(`/users/${id}`, { signal: controller.signal });
      setUsers((prev) => prev.filter((user) => user._id !== id));
      setSuccessMessage("User Has Been Deleted successfully");
      UpdateCount("totalUsers", "delete");
    } catch (error) {
      if (error.code === "ERR_CANCELED") return;
      console.log(error.message);
      setServerError(error.response?.data?.message || "something went wrong");
    } finally {
      if (seeMore.current === controller) {
        seeMore.current = null;
        setDeleteBtn(false);
      }
    }
  }

  // hanlde success message
  useEffect(() => {
    const time = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
    return () => {
      clearTimeout(time);
    };
  }, [successMessage]);

  // handle see more
  async function handleSeeMore() {
    if (seeBtn || !hasMore || !cursor) return;
    const controller = new AbortController();
    seeMore.current = controller;
    try {
      setSeeBtn(true);
      const response = await Api.get("/users", {
        params: {
          limit: 15,
          ...(cursor && { after: cursor }),
          ...(debounce && { search: debounce }),
        },
        signal: controller.signal,
      });
      const {
        usersList: newUsers,
        nextCursor,
        nextPage: hasMore,
      } = response.data;
      setUsers((prev) => [...prev, ...newUsers]);
      setHasMore(hasMore);
      setCursor(nextCursor);
    } catch (error) {
      if (error.code === "ERR_CANCELED") return;
      console.log(error.message);
      setServerError(error.response?.data?.message || "something went wrong");
    } finally {
      if (seeMore.current === controller) {
        seeMore.current = null;
        setSeeBtn(false);
      }
    }
  }

  return (
    <>
      <Header />
      <div className="w-[80%] ml-[10%] flex items-center mt-10 gap-2 bg-gray-300 rounded-lg">
        <Search size={20} />
        <input
          type="search"
          placeholder="Search"
          value={search}
          autoFocus
          className="flex-1 outline-none bg-transparent py-2"
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value.trim() === "") {
              setUsers([]);
              setServerError("");
              setCursor(null);
              setHasMore(false);
            }
          }}
        ></input>
      </div>
      <div className="container">
        <div className="grid">
          {users.map((user) => (
            <div className="card">
              <img
                src="/avatar.jpg"
                alt="user-img"
                className="w-full h-100 rounded-lg"
              ></img>
              <h2 className="text-sm font-body pl-2 font-medium lg:text-lg">
                Name: {user.username}
              </h2>
              <h2 className="text-sm font-body pl-2 font-medium lg:text-lg">
                Email: {user.email}
              </h2>
              <p className="text-sm font-body pl-2 font-medium lg:text-lg">
                {new Date(user.createdAt).toLocaleString()}
              </p>
              <button
                className="secondary-buuton"
                disabled={deleteBtn}
                onClick={() => {
                  handleDelete(user._id);
                }}
              >
                {deleteBtn ? "Loading..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
        <SuccessMessage successMessage={successMessage} />

        {!initial && debounce && users.length === 0 && !serverError && (
          <p>No users found.</p>
        )}
        {serverError && (
          <p className="text-sm font-body pl-2 font-medium lg:text-lg">
            {serverError}
          </p>
        )}
        {hasMore && (
          <button
            className="secondary-buuton w-[20%] ml-[40%] mt-2"
            disabled={seeBtn}
            onClick={handleSeeMore}
          >
            {seeBtn ? "Loading..." : "See More"}
          </button>
        )}
      </div>
      <Footer />
    </>
  );
}
