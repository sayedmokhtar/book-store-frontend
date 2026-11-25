import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../userContext/userDataContext";
import Api from "../api/Api";
import SecondaryHeader from "../components/headerLogin";
import Footer from "../components/footer";

export default function LoginPage() {
  const navigateTo = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginBtn, setLoginBtn] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [invaildInput, setInvaildInput] = useState({
    emailInput: "",
    passwordInput: "",
  });

  const [serverError, setServerError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // handle click===========================================================
  function validateUserData(data) {
    const errors = {
      emailInput: "",
      passwordInput: "",
    };

    if (!data.email.trim()) {
      errors.emailInput = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      errors.emailInput = "Invalid email";
    }

    if (!data.password) {
      errors.passwordInput = "Password is required";
    }

    return errors;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (loginBtn) {
      return;
    }
    const errors = validateUserData(loginData);
    setInvaildInput(errors);
    setServerError("");
    if (errors.emailInput || errors.passwordInput) {
      return;
    }
    try {
      setLoginBtn(true);
      const response = await Api.post("/auth/login", loginData);
      const userData = {
        id: response.data._id,
        isAdmin: response.data.isAdmin,
        name: response.data.username,
        email: response.data.email,
      };
      setUser(userData);
      userData.isAdmin ? navigateTo("/dashBoard") : navigateTo("/home");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "something went wrong.please try again",
      );
    } finally {
      setLoginBtn(false);
    }
  }
  function handleCreateClick() {
    navigateTo("/createaccount");
  }
  return (
    <>
      <SecondaryHeader />
      <div className="w-full  flex flex-col gap-2 lg:flex lg:w-full lg:h-full lg:flex-row lg:justify-center items-center lg:mt-2">
        {/* content */}
        <div className="w-full flex flex-col gap-2 animate-slide-up lg:animate-slide-up lg:justify-center items-center">
          <p className="capitalize font-body p-5 text-left w-full  h-auto font-medium md:text-lg md:w-full lg:p-5 leading-relaxed">
            Welcome to our bookstore, your gateway to knowledge, imagination,
            and inspiration. Discover a wide collection of books across
            different genres, from technology and science to novels, history,
            and personal development. Whether you're looking to learn a new
            skill, explore a fascinating story, or expand your knowledge
          </p>
          <div className=" lg:flex gap-2 ml-10 mb-10 lg:w-full h-auto rounded-lg">
            <video
              src="/earthtoland.mp4"
              muted
              autoPlay
              playsInline
              loop
              className="w-[90%] border-2 border-purple-500 rounded-2xl shadow-lg shadow-blue-200 "
            ></video>
          </div>
        </div>
        {/* ========================= content =============================== */}
        {/* form login */}
        <div className="w-[100%] p-2 flex flex-col lg:w-1/2 lg:mt-30 lg:flex lg:flex-col justify-center items-center animate-slide-in">
          <form onSubmit={handleSubmit}>
            <h2 className="mb-8 text-md font-body font-extrabold">Login</h2>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={loginData.email}
              onChange={(e) => {
                setLoginData({ ...loginData, email: e.target.value });
                setInvaildInput({ ...invaildInput, email: "" });
              }}
            />
            <TextField
              sx={{ marginTop: "40px" }}
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              value={loginData.password}
              onChange={(e) => {
                setLoginData({ ...loginData, password: e.target.value });
                setInvaildInput({ ...invaildInput, password: "" });
              }}
            />
            <button
              type="button"
              className="secondary-buuton mt-2"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
            {/* buttons */}
            <div className="w-full p-25 gap-2 flex flex-col mt-2 lg:w-full">
              <p className="text-xs font-body font-bold text-white">
                {invaildInput.emailInput} {invaildInput.passwordInput}
                {serverError}
              </p>

              <button
                type="submit"
                className="primary-button"
                disabled={loginBtn}
              >
                {loginBtn ? "Loading..." : "Login"}
              </button>
              <button
                type="button"
                className="link-button"
                onClick={handleCreateClick}
              >
                Create Account
              </button>
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  window.location.href =
                    "https://book-store-api-1t03.onrender.com/api/password/forgot-password";
                }}
              >
                Reset Password ?
              </button>
              <img
                src="/preve.avif"
                alt="img"
                className="hidden lg:size-20 lg:ml-8 lg:rounded-full xl:ml-25"
              />
            </div>
            {/*===== buttons ========= */}
          </form>
        </div>
        {/* ===== form login ========= */}
      </div>
      <Footer />
    </>
  );
}
