import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../userContext/userDataContext";
import { useNavigate } from "react-router-dom";
import Api from "../api/Api";
export default function Header() {
  const [isOpne, setIsOpen] = useState(false);
  const navigateTo = useNavigate();
  const { setUser } = useAuth();
  async function handleLogout() {
    try {
      await Api.post("/auth/logout");
      setUser(null);
      navigateTo("/", { replace: true });
    } catch (error) {
      console.log(
        error.response?.data?.message || "somethong went wrong try again",
      );
    }
  }

  return (
    <div className="relative w-full flex justify-between items-center bg-black">
      <div className="w-[60%] lg:w[30%]">
        <h1 className="p-4 text-left text-white text-sm font-bold font-title lg:text-lg">
          Book Nook
        </h1>
      </div>

      {/* Desktop navigation */}
      <div className="hidden lg:flex lg:w-[50%] items-center justify-end">
        <ul className="flex justify-end gap-10 mr-10">
          <Link to="/home">
            <li className="text-lg text-white font-title font-medium cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="text-lg text-white font-title font-medium cursor-pointer">
              About
            </li>
          </Link>
          <Link to="/authorsForUsers">
            <li className="text-lg text-white font-title font-medium cursor-pointer">
              Authors
            </li>
          </Link>
          <Link to="/booksForUsers">
            <li className="text-lg text-white font-title font-medium cursor-pointer">
              Books
            </li>
          </Link>
          <li>
            <button
              className="text-lg text-white font-title font-mediummr-2 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Burger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpne)}
        className="text-2xl text-white mr-6 cursor-pointer lg:hidden"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpne}
      >
        {isOpne ? "✕" : "☰"}
      </button>

      {/* Mobile navigation */}
      {isOpne && (
        <ul className="absolute top-full left-0 z-50 w-full bg-purple-400 shadow-md flex flex-col gap-5 p-5 lg:hidden">
          <Link to="/home">
            <li className="cursor-pointer">Home</li>
          </Link>
          <Link to="/about">
            <li className="cursor-pointer">About</li>
          </Link>
          <Link to="/authorsForUsers">
            <li className="cursor-pointer">Authors</li>
          </Link>
          <Link to="/booksForUsers">
            <li className="cursor-pointer">Books</li>
          </Link>
          <li>
            <button className="mr-2 cursor-pointer" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
