import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { Select, MenuItem, FormControl, FormHelperText } from "@mui/material";
import Api from "../api/Api";
import Footer from "../components/footer";
import SecondaryHeader from "../components/headerLogin";
import SuccessMessage from "../components/successMessage";
import UpdateCount from "../utilsUpdateCountCache/dashboardUpdate";
const titleRegex = /^[a-zA-Z0-9\s.,!?`"():;-]{3,}$/;
const descriptionRegex = /^[a-zA-Z0-9\s.,!?`"():;-]{5,}$/;

export default function CreateBook() {
  const [bookData, setBookData] = useState({
    title: "",
    description: "",
    price: 0,
    image: null,
    pdf: null,
  });
  const [imagePre, setImagePre] = useState("");
  const [invalidInput, setInvalidInput] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    image: "",
    pdf: "",
  });
  const [serverError, setServerError] = useState("");
  const [authorList, setAuthorList] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [createBtn, setCreateBtn] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // handle image change
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const imageType = ["image/jpeg", "image/png", "image/avif", "jfif", "webp"];
    if (!imageType.includes(file.type)) {
      setInvalidInput((prev) => ({
        ...prev,
        image: "only jpeg png and avif images are allowed",
      }));
      setBookData((prev) => ({ ...prev, image: null }));
      e.target.value = "";
      setImagePre("");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setInvalidInput((prev) => ({
        ...prev,
        image: "image size must not exceed 5mb",
      }));
      setBookData((prev) => ({ ...prev, image: null }));
      e.target.value = "";
      setImagePre("");
      return;
    }
    setBookData((prev) => ({
      ...prev,
      image: file,
    }));
    setInvalidInput((prev) => ({
      ...prev,
      image: "",
    }));
    const reader = new FileReader();
    reader.onload = () => {
      setImagePre(reader.result);
    };
    reader.readAsDataURL(file);
  }
  // handle pdf change
  function handlePdfChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setInvalidInput((prev) => ({
        ...prev,
        pdf: "only pdf files are allowed",
      }));
      setBookData((prev) => ({
        ...prev,
        pdf: null,
      }));
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setInvalidInput((prev) => ({
        ...prev,
        pdf: "pdf size must be 10 MB",
      }));
      setBookData((prev) => ({
        ...prev,
        pdf: null,
      }));
      e.target.value = "";
      return;
    }
    setBookData((prev) => ({
      ...prev,
      pdf: file,
    }));
    setInvalidInput((prev) => ({
      ...prev,
      pdf: "",
    }));
  }
  // get all authors
  useEffect(() => {
    const controller = new AbortController();
    async function getAllAuthors() {
      try {
        const response = await Api.get("/authors/latest", {
          signal: controller.signal,
        });
        setAuthorList(response.data.authors);
      } catch (error) {
        if (error.code === "ERR_CANCELED") return;

        setServerError("cannot fetch authors ");
      }
    }
    getAllAuthors();
    return () => {
      controller.abort();
    };
  }, []);
  // validate input
  function validateInput(data) {
    const errors = {
      title: "",
      author: "",
      description: "",
      price: "",
      image: "",
      pdf: "",
    };
    if (!titleRegex.test(data.title)) {
      errors.title = "must includes atleast 3 letters";
    }
    if (!descriptionRegex.test(data.description)) {
      errors.description = "must includes atleast 3 letters";
    }
    if (
      data.price === "" ||
      !Number.isFinite(Number(data.price)) ||
      Number(data.price) <= 0
    ) {
      errors.price = "price must be greater than zero";
    }
    if (!selectedAuthor) {
      errors.author = "author is reauired";
    }
    if (!data.image) {
      errors.image = "please select availd image";
    }
    if (!data.pdf) {
      errors.pdf = "please select a vaild pdf file";
    }

    return errors;
  }
  // reset author form
  function reset() {
    setBookData({
      title: "",
      description: "",
      price: "",
      image: null,
      pdf: null,
    });
    setSelectedAuthor("");
    setImagePre("");
    setInvalidInput({
      title: "",
      description: "",
      author: "",
      price: "",
      image: "",
      pdf: "",
    });
  }
  // call api create
  async function handleClickSubmit(e) {
    e.preventDefault();
    if (createBtn) return;
    const error = validateInput(bookData);
    setInvalidInput(error);
    if (Object.values(error).some(Boolean)) {
      return;
    }
    setServerError("");
    setCreateBtn(true);
    setSuccessMessage("");
    let createdBookId;
    try {
      const formData = new FormData();
      formData.append("title", bookData.title);
      formData.append("author", selectedAuthor);
      formData.append("description", bookData.description);
      formData.append("price", bookData.price);
      formData.append("image", bookData.image);

      const response = await Api.post("/books", formData);
      createdBookId = response.data._id;
      const pdfFormData = new FormData();
      pdfFormData.append("pdf", bookData.pdf);
      await Api.post(`/books/${createdBookId}/pdf`, pdfFormData);
      UpdateCount("totalBooks", "add");
      setSuccessMessage("Book has been created successfully ✓");
      reset();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      if (createdBookId) {
        try {
          await Api.delete(`/books/${createdBookId}`);
        } catch (deletedBook) {
          console.log(
            "can not delet incomplete book",
            deletedBook.response?.data?.message,
          );
          setServerError(
            "pdf uploade failed and automatic cleanup also failed please check the book in DB",
          );
          return;
        }
      }
      console.log(message);
      setServerError(message);
    } finally {
      setCreateBtn(false);
    }
  }
  useEffect(() => {
    if (!successMessage) return;
    const timerId = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
    return () => {
      clearTimeout(timerId);
    };
  }, [successMessage]);
  const validationError = Object.values(invalidInput)
    .filter(Boolean)
    .join(", ");
  return (
    <>
      <SecondaryHeader />

      <form
        onSubmit={(e) => {
          handleClickSubmit(e);
        }}
        className="w-[90%] animate-slide-in ml-[5%] mt-5 lg:w-1/2 lg:ml-[25%] lg:mt-5"
      >
        <TextField
          label="Title"
          type="text"
          variant="outlined"
          fullWidth
          required
          error={Boolean(invalidInput.title)}
          helperText={invalidInput.title}
          value={bookData.title}
          onChange={(e) => {
            setBookData({ ...bookData, title: e.target.value });
            setInvalidInput((prev) => ({
              ...prev,
              title: "",
            }));
          }}
        />
        <TextField
          label="Description"
          type="text"
          sx={{ marginTop: 4 }}
          value={bookData.description}
          variant="outlined"
          error={Boolean(invalidInput.description)}
          helperText={invalidInput.description}
          fullWidth
          required
          onChange={(e) => {
            setBookData({ ...bookData, description: e.target.value });
            setInvalidInput((prev) => ({
              ...prev,
              description: "",
            }));
          }}
        />
        <TextField
          label="Price"
          type="text"
          variant="outlined"
          sx={{ marginTop: 4 }}
          fullWidth
          required
          error={Boolean(invalidInput.price)}
          helperText={invalidInput.price}
          value={bookData.price}
          onChange={(e) => {
            setBookData({ ...bookData, price: e.target.value });
            setInvalidInput((prev) => ({
              ...prev,
              price: "",
            }));
          }}
        />
        <Avatar
          src={imagePre || undefined}
          alt="book image"
          sx={{ width: 150, height: 150, marginTop: 4 }}
        >
          {!imagePre && "book image"}
        </Avatar>
        <TextField
          type="file"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
          sx={{ marginTop: 4 }}
          error={Boolean(invalidInput.image)}
          helperText={invalidInput.image}
          slotProps={{
            htmlInput: {
              accept: "image/jpeg,image/png,image/avif,image/png,image/jfif",
            },
          }}
          onChange={handleImageChange}
        />
        <TextField
          type="file"
          variant="outlined"
          fullWidth
          sx={{ marginTop: 4 }}
          error={Boolean(invalidInput.pdf)}
          helperText={invalidInput.pdf}
          slotProps={{ htmlInput: { accept: "application/pdf" } }}
          onChange={(e) => {
            handlePdfChange(e);
          }}
        />
        <FormControl
          sx={{ marginTop: 4 }}
          fullWidth
          error={Boolean(invalidInput.author)}
        >
          <Select
            labelId="author-label"
            id="author"
            value={selectedAuthor}
            onChange={(e) => {
              setSelectedAuthor(e.target.value);
              setInvalidInput((prev) => ({
                ...prev,
                author: "",
              }));
            }}
            displayEmpty
            fullWidth
            required
          >
            <MenuItem value="" disabled>
              Select an Author
            </MenuItem>
            {authorList.map((author) => (
              <MenuItem key={author._id} value={author._id}>
                {author.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{invalidInput.author}</FormHelperText>
        </FormControl>
        <button
          type="submit"
          disabled={createBtn}
          className="primary-button mt-4"
        >
          {createBtn ? "Loading..." : "Create Book"}
        </button>
        {(serverError || validationError) && (
          <p className="mt-5 text text-sm font-body font-medium bg-red-400 lg:text-lg">
            {serverError || validationError}
          </p>
        )}

        <SuccessMessage successMessage={successMessage} />
      </form>

      <Footer />
    </>
  );
}
