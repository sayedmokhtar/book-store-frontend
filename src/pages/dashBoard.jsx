import Header from "../components/headerLogin";
import Footer from "../components/footer";
import { useAuth } from "../userContext/userDataContext";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Api from "../api/Api";
export default function DashBoard() {
  const { user, setUser } = useAuth();
  const [appInformation, setAppInformation] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalAuthors: 0,
  });
  const [serverError, setServerError] = useState("");
  const navigateTo = useNavigate();
  useEffect(() => {
    const controller = new AbortController();
    async function usersCount() {
      const cachedUsers = sessionStorage.getItem("totalUsers");
      if (cachedUsers !== null) {
        setAppInformation((prev) => ({
          ...prev,
          totalUsers: Number(cachedUsers),
        }));
        return;
      }
      try {
        const response = await Api.get("/users/count", {
          signal: controller.signal,
        });
        const totalUsers = response.data.totalUsers;
        setAppInformation((prev) => ({
          ...prev,
          totalUsers,
        }));
        sessionStorage.setItem("totalUsers", String(totalUsers));
      } catch (error) {
        if (error.name === "CanceledError") {
          return;
        }
        setServerError(error.response?.data?.message || "something went wrong");
      }
    }
    usersCount();
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function authorsCount() {
      const cachedUsers = sessionStorage.getItem("totalAuthors");
      if (cachedUsers !== null) {
        setAppInformation((prev) => ({
          ...prev,
          totalAuthors: Number(cachedUsers),
        }));
        return;
      }
      try {
        const response = await Api.get("/authors/count", {
          signal: controller.signal,
        });
        const totalAuthors = response.data.totalAuthors;
        sessionStorage.setItem("totalAuthors", String(totalAuthors));
        setAppInformation((prev) => ({
          ...prev,
          totalAuthors,
        }));
      } catch (error) {
        if (error.name === "CanceledError") {
          return;
        }
        setServerError(error.response?.data?.message || "somethign went wrong");
      }
    }
    authorsCount();
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function booksCount() {
      const cachedBooks = sessionStorage.getItem("totalBooks");
      if (cachedBooks !== null) {
        setAppInformation((prev) => ({
          ...prev,
          totalBooks: Number(cachedBooks),
        }));
        return;
      }
      try {
        const response = await Api.get("/books/count", {
          signal: controller.signal,
        });
        const totalBooks = response.data.totalBooks;
        sessionStorage.setItem("totalBooks", String(totalBooks));
        setAppInformation((prev) => ({
          ...prev,
          totalBooks,
        }));
      } catch (error) {
        if (error.name === "CanceledError") {
          return;
        }
        setServerError(error.response?.data?.message || "something went wrong");
      }
    }
    booksCount();
    return () => {
      controller.abort();
    };
  }, []);

  async function handleClickLogout() {
    try {
      await Api.post("/auth/logout");
      setUser(null);
      navigateTo("/");
    } catch (error) {
      console.log(error.response?.data.message || "something went wrong");
    }
  }

  return (
    <>
      <Header />
      {/* wellcome message */}
      <div className="w-full mt-2">
        <h2 className="text-center pt-2 text-sm font-title font-bold lg:text-xl ">
          Wellcome To Admin Dashboard
        </h2>
      </div>
      {/*================= wellcome message =================*/}
      {/* user infromation */}
      <div className="w-screen flex flex-col gap-2 mt-2 lg:flex lg:flex-row justify-center items-center">
        <h2 className="w-1/4 border-2 border-purple-500 rounded-lg text-sm text-left font-title pl-2 font-medium lg:text-xl">
          Wellcome {user.name}
        </h2>
        <h2 className="w-1/4 border-2 border-purple-500 rounded-lg text-sm text-left pl-2 font-title font-medium lg:text-xl">
          {user.email}
        </h2>
      </div>
      <hr className="mt-2 border-2" />
      {/*============= user infromation ========*/}
      {/* aside  */}
      <div className="w-full mt-5 flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="border-2 ml-2 rounded-lg border-teal-700 w-full lg:w-1/4 shrink-0 p-2  ">
          <div className="w-full pl-2 flex flex-col gap-2">
            <span className="text-sm text-left text-white font-bold font-title flex gap-2 lg:text-xl">
              Dashboard
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-7"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.22.53l-2.25 2.25a.75.75 0 1 1-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 1 1 1.06-1.06l2.25 2.25c.141.14.22.331.22.53Zm-10.28-.53a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06L8.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-2.25 2.25Z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <hr />
            <span className="dash-span">
              <Link className="link-aside" to="/createauthor">
                Create Author
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6 text-white"
              >
                <path
                  fill-rule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span className="dash-span">
              <Link className="link-aside" to="/createbook">
                Create Book
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6 text-white"
              >
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
              </svg>
            </span>
            <span className="dash-span">
              <Link className="link-aside" to="/removeAll">
                Remove All Data
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6 text-white"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span className="dash-span">
              <Link className="link-aside" to="/books">
                Display Books
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6 text-white"
              >
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
              </svg>
            </span>
            <span className="dash-span">
              <Link className="link-aside" to="/authors">
                Display Authors
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6 text-white"
              >
                <path
                  fill-rule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>

            <span className="dash-span">
              <Link className="link-aside" to="/removebook">
                Remove Book
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6 text-white"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span className="dash-span">
              <Link className="link-aside" to="/removeauthor">
                Remove Author
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6 text-white"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span className="dash-span">
              <Link className="link-aside" to="/removeuser">
                Remove User
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6 text-white"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span className="dash-span">
              <Link className="link-aside" to="/latestbooks">
                Latest Books
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6 text-white"
              >
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
              </svg>
            </span>
            <span className="dash-span">
              <button className="primary-button" onClick={handleClickLogout}>
                Logout
              </button>
            </span>
          </div>
        </aside>
        {/*=================== aside =================*/}
        {/* main */}
        <main className="w-full mr-5 min-w-0 flex-1">
          <div className="mt-0 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-2 border rounded-lg p-4">
              <h2 className="text-sm  text-center pt-2 font-title font-bold lg:text-xl">
                Users Count
              </h2>
              <span className="dash-span">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6 text-white"
                >
                  <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
                </svg>
                <p className="text-sm font-body lg:text-lg">
                  Users {appInformation.totalUsers || serverError}
                </p>
              </span>
            </div>
            <div className="flex flex-col gap-2 border rounded-lg p-4">
              <h2 className="text-sm  pt-2 text-center font-title font-bold lg:text-xl">
                Books Count
              </h2>
              <span className="dash-span">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6 text-white"
                >
                  <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                </svg>
                <p> Books {appInformation.totalBooks || serverError}</p>
              </span>
            </div>
            <div className="flex flex-col gap-2 border rounded-lg p-4">
              <h2 className="text-sm  pt-2 text-center font-title font-bold lg:text-xl">
                Authors Count
              </h2>
              <span className="dash-span">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6 text-white"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <p>Authors {appInformation.totalAuthors || serverError}</p>
              </span>
            </div>
          </div>
          <div className="w-full  border-8 rounded-2xl border-purple-500 shadow-xl shadow-blue-20">
            <video
              src="/earthtoland.mp4"
              muted
              autoPlay
              loop
              playsInline
              className="block w-full h-110 object-cover"
            ></video>
          </div>
        </main>
        {/*============= main  ========================*/}
      </div>
      <Footer />
    </>
  );
}
