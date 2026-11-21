import Header from "../components/headerLogin";
import Footer from "../components/footer";
import Api from "../api/Api";
import { useState, useEffect } from "react";
export default function LatestBooks() {
  const [Books, setBooks] = useState([]);
  const [serverError, setServerError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    async function getLatestBooks() {
      try {
        const response = await Api.get("/books/latest", {
          signal: controller.signal,
        });
        setBooks(response.data);
      } catch (error) {
        if (error.code === "ERR_CANCELED") return;
        console.log(error.message);
        setServerError(error.response?.data?.message || "something went wrong");
      }
    }
    getLatestBooks();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <Header />
      <div className="container animate-slide-in">
        <h2 className="text-lg font-title font-bold animate-ping duration-1000">
          The Latest Books
        </h2>
        <div className="grid">
          {Books.map((Book) => (
            <div className="card" key={Book._id}>
              <img
                src={`http://127.0.0.1:5000${Book.image}`}
                alt={Book.title}
                className="w-full h-100 rounded-lg"
              ></img>
              <h2 className="text-sm font-body pl-2 font-medium lg:text-lg">
                Title: {Book.title}
              </h2>
              <h2 className="text-sm font-body pl-2 font-medium lg:text-lg">
                Description: {Book.description}
              </h2>
              <h2 className="text-sm font-body pl-2 font-medium lg:text-lg">
                Price: {Book.price}$
              </h2>
              <h2 className="text-sm font-body pl-2 font-medium lg:text-lg">
                Author: {Book.author?.name}
              </h2>
            </div>
          ))}
        </div>
        {serverError && (
          <p className="text-sm font-body pl-2 font-medium lg:text-lg">
            {serverError}
          </p>
        )}
      </div>
      <div className="w-[70%] h-full mt-5 ml-[15%] border-4 rounded-lg border-purple-300 shadow-lg shadow-blue-50">
        <video
          src="/zoomingin.mp4"
          muted
          loop
          autoPlay
          playsInline
          w-full
        ></video>
      </div>
      <Footer />
    </>
  );
}
