import Header from "../components/headerLogin";
import TextField from "@mui/material/TextField";
import { InputLabel, Select, MenuItem } from "@mui/material";
import { Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import Api from "../api/Api";
import SuccessMessage from "../components/successMessage";
import Footer from "../components/footer";
import UpdateCount from "../utilsUpdateCountCache/dashboardUpdate";
export default function CreateAuthor() {
  const [authorData, setAuthorData] = useState({
    name: "",
    age: "",
    country: "",
  });
  const [invaildInput, setInvaildInput] = useState({
    name: "",
    country: null,
    age: "",
  });
  const [serverError, setServerError] = useState("");
  const [createBtn, setCreateBtn] = useState(false);
  const [successMessage, setSuccessMessge] = useState("");
  const allContries = [
    "Egypt",
    "USA",
    "Italy",
    "Spain",
    "Russia",
    "Turkey",
    "Kazakhstan",
    "Algeria",
    "Bahrain",
    "Germany",
  ];
  const authorNameRegex = /^[a-zA-Z0-9 ]{2,}$/;
  function vaildateInput(data) {
    const errors = {
      name: "",
      country: "",
      age: "",
    };
    if (!data.name.trim()) {
      errors.name = "Author name is required";
    } else if (!authorNameRegex.test(data.name)) {
      errors.name = "name must includes characters or numbers and spaces ";
    }
    if (!data.age) {
      errors.age = "age is required";
    }
    if (!data.country) {
      errors.country = "At least one country is reuired";
    }
    return errors;
  }
  function reset() {
    setAuthorData({ ...authorData, name: "", country: "", age: "" });
  }
  async function handleCreateAuthor(e) {
    e.preventDefault();
    const error = vaildateInput(authorData);
    setInvaildInput(error);
    setServerError("");
    if (error.name || error.age || error.country) {
      return;
    }
    if (createBtn) {
      return;
    }
    setCreateBtn(true);
    try {
      await Api.post("/authors", {
        name: authorData.name,
        country: authorData.country,
        age: authorData.age,
      });
      setSuccessMessge("Author has been created successfully ✓");
      UpdateCount("totalAuthors", "add");
      reset();
    } catch (error) {
      console.log(error);
      setServerError(error.response?.data?.message || "something went wrong");
    } finally {
      setCreateBtn(false);
    }
  }
  useEffect(() => {
    if (!successMessage) {
      return;
    }
    const timerId = setTimeout(() => {
      setSuccessMessge("");
    }, 3000);
    return () => {
      clearTimeout(timerId);
    };
  }, [successMessage]);

  return (
    <>
      <Header />
      <form
        className="w-[50%] ml-[25%] mt-5 animate-slide-in"
        onSubmit={handleCreateAuthor}
      >
        <TextField
          label="Name"
          type="text"
          variant="outlined"
          fullWidth
          value={authorData.name}
          error={Boolean(invaildInput.name)}
          helperText={invaildInput.name}
          onChange={(e) => {
            setAuthorData({ ...authorData, name: e.target.value });
            setInvaildInput({ ...invaildInput, name: "" });
          }}
        />
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          className="w-full mb-4 mt-2"
          value={authorData.age}
          onChange={(e) => {
            setAuthorData({ ...authorData, age: e.target.value });
            setInvaildInput({ ...invaildInput, age: "" });
          }}
        >
          <MenuItem value="" disabled>
            Select Age
          </MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={21}>21</MenuItem>
          <MenuItem value={22}>22</MenuItem>
          <MenuItem value={23}>23</MenuItem>
          <MenuItem value={24}>24</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={26}>26</MenuItem>
          <MenuItem value={27}>27</MenuItem>
          <MenuItem value={28}>28</MenuItem>
          <MenuItem value={29}>29</MenuItem>
          <MenuItem value={30}>30</MenuItem>
          <MenuItem value={31}>31</MenuItem>
          <MenuItem value={32}>32</MenuItem>
          <MenuItem value={33}>33</MenuItem>
          <MenuItem value={34}>34</MenuItem>
          <MenuItem value={35}>35</MenuItem>
          <MenuItem value={36}>36</MenuItem>
          <MenuItem value={37}>37</MenuItem>
          <MenuItem value={38}>38</MenuItem>
          <MenuItem value={39}>39</MenuItem>
          <MenuItem value={40}>40</MenuItem>
        </Select>
        <Autocomplete
          options={allContries}
          value={authorData.country}
          onChange={(event, newValue) => {
            setAuthorData({ ...authorData, country: newValue });
            setInvaildInput({ ...invaildInput, country: "" });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Country"
              error={Boolean(invaildInput.country)}
            />
          )}
        />

        <button
          className="primary-button mt-2"
          disabled={createBtn}
          type="submit"
        >
          {createBtn ? "Loading..." : "Create Author"}
        </button>
        {serverError && (
          <p className="text-sm pt-2 text-red-500 font-bold font-body lg:text-lg">
            {serverError}
          </p>
        )}
        <SuccessMessage successMessage={successMessage} />
      </form>
      <Footer />
    </>
  );
}
