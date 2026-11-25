import SecondaryHeader from "../components/headerLogin";
import Footer from "../components/footer";
import TextField from "@mui/material/TextField";
import { useAuth } from "../userContext/userDataContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UpdateCount from "../utilsUpdateCountCache/dashboardUpdate";

import Api from "../api/Api";
export default function CreateAccount() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");
  const [invalidInput, setInvaildInput] = useState({
    userNmae: "",
    email: "",
    password: "",
  });
  const [createBtn, setCreateBtn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();
  const navigateTo = useNavigate();
  const userNameRegex = /^[a-zA-Z0-9 ]{2,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/;

  function vaildateUserInput(data) {
    const errors = {
      userName: "",
      email: "",
      password: "",
    };
    if (!data.userName.trim()) {
      errors.userName = "userName is required";
    } else if (!userNameRegex.test(data.userName)) {
      errors.userName = "name must be letters or numbers";
    }
    if (!data.email) {
      errors.email = "email is required";
    } else if (!emailRegex.test(data.email)) {
      errors.email = "invalid Email";
    }
    if (!data.password) {
      errors.password = "passowrd is required";
    } else if (!passwordRegex.test(data.password)) {
      errors.password = "password must be min-8-char-lower-upper-number-symbol";
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (createBtn) return;
    const errors = vaildateUserInput(formData);
    setInvaildInput(errors);
    setServerError("");
    if (errors.userName || errors.email || errors.password) {
      return;
    }
    try {
      setCreateBtn(true);
      const response = await Api.post("/auth/register", {
        username: formData.userName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      const userData = {
        id: response.data.id,
        isAdmin: response.data.isAdmin,
        name: response.data.username,
        email: response.data.email,
      };
      UpdateCount("totalUsers", "add");
      setUser(userData);
      navigateTo("/home");
    } catch (error) {
      const messag = error.response?.data?.message || error.message;
      console.log(messag);
      setServerError(messag);
    }
  }
  return (
    <>
      <SecondaryHeader />
      <div className="w-[90%] ml-[5%] mt-2 flex flex-col animate-slide-in lg:w-[50%] lg:ml-[25%] ">
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-title font-bold text-cnter py-4">
            Create Your Account
          </h2>
          <span className="text-sm text-white font-bold font-body lg:text-lg ">
            {invalidInput.userNmae} {invalidInput.email} {invalidInput.password}
            {serverError}
          </span>
          <div className="w-full flex flex-col gap-10">
            <TextField
              label="userName"
              value={formData.userName}
              type="text"
              variant="outlined"
              fullWidth
              onChange={(e) => {
                setFormData({ ...formData, userName: e.target.value });
              }}
            />
            <TextField
              label="Email"
              value={formData.email}
              type="Email"
              variant="outlined"
              fullWidth
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
              }}
            />
            <TextField
              label="password"
              value={formData.password}
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
            />
            <button
              className="secondary-buuton"
              type="button"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
            <button
              className="primary-button"
              type="submit"
              disabled={createBtn}
            >
              {createBtn ? "Loading..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
      <div className="w-full flex flex-col mt-8">
        <h4 className="text-lg font-bold font-title text-center p-4">
          Boost Your knowledge
        </h4>
        <img
          src="/createaccount.avif"
          alt="img"
          className="w-[80%] ml-[10%]  rounded-lg hover:rotate-1 transition duration-1000"
          style={{ height: "auto" }}
        />
      </div>
      <Footer />
    </>
  );
}
