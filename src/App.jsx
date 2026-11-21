import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about";
import Authors from "./pages/authors";
import AuhtorById from "./pages/authorById";
import Books from "./pages/Books";
import BookById from "./pages/bookById";
import CreateAccount from "./pages/createAccount";
import DashBoard from "./pages/dashBoard";
import ProtectedRoute from "./components/protectedRoute";
import PageLoginRoute from "./components/pageLoginRoute";
import CreateAuthor from "./pages/createauthor";
import CreateBook from "./pages/createBook";
import RemoveALL from "./pages/removeAll";
import RemoveBook from "./pages/removebook";
import RemoveAuthor from "./pages/removeauthor";
import RemoveUser from "./pages/removeuser";
import LatestBooks from "./pages/latestBooks";
import BooksForUsers from "./pages/booksForUsers";
import AuthorsForUsers from "./pages/authorsForUsers";
function App() {
  return (
    <div className="m-0 p-0  w-full h-full text-center">
      <Routes>
        <Route path="/" element={<PageLoginRoute />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/about" element={<About />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/author/:id" element={<AuhtorById />} />
          <Route path="/books" element={<Books />} />
          <Route path="/book/:id" element={<BookById />} />
          <Route path="/home" element={<Home />} />
          <Route path="/latestbooks" element={<LatestBooks />} />
          <Route path="/dashBoard" element={<DashBoard />} />
          <Route path="/createauthor" element={<CreateAuthor />} />
          <Route path="/createbook" element={<CreateBook />} />
          <Route path="/removeall" element={<RemoveALL />} />
          <Route path="/removebook" element={<RemoveBook />} />
          <Route path="/removeauthor" element={<RemoveAuthor />} />
          <Route path="/removeuser" element={<RemoveUser />} />
          <Route path="/booksForUsers" element={<BooksForUsers />} />
          <Route path="/authorsForUsers" element={<AuthorsForUsers />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
