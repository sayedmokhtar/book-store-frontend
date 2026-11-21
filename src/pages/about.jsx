import Header from "../components/header";
import Footer from "../components/footer";

export default function About() {
  return (
    <>
      <Header />
      <div className="container">
        <div className="w-full h-auto lg:w-[90%] lg:ml-[10%]">
          <p className="text-sm font-body font-medium lg:text-lg">
            Welcome to our Online Book Store! <br></br>
            Our goal is to make reading easier and more accessible for everyone.
            We provide a collection of books across different categories to help
            readers discover new ideas, gain knowledge, and enjoy reading.
            Whether you are looking for educational books, technology, personal
            development, or entertainment, we aim to help you find the right
            book. We believe that every book has something valuable to offer,
            and every reader deserves the opportunity to explore it.
          </p>
        </div>
        <div className="w-full h-auto lg:w-[90%] lg:ml-[10%] flex">
          <p className="text-sm font-body font-medium lg:text-lg">
            Our Mission <br></br> To encourage reading, support learning, and
            make knowledge accessible to everyone. Thank you for choosing our
            bookstore. Happy Reading!
          </p>
        </div>
        <div className="w-full mt-10 h-full border-4 border-purple-200 rounded-lg shadow-blue-100 lg:w-[70%] lg:ml-[20%]">
          <video
            src="/readingonchar.mp4"
            muted
            playsInline
            loop
            autoPlay
          ></video>
        </div>
      </div>
      <Footer />
    </>
  );
}
