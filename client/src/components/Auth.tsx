import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LabelledInput from "./LabelledInput";
import { SignupInput } from "@hemilpatel/medium-common";
import axios from "axios";
import toast from "react-hot-toast";

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState<SignupInput>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSignUpHandler = async () => {
    const loadingToast = toast.loading("Please wait...");
    try {
      const res = await axios.post(
        `https://blog-app-cf.hemilpatel3534.workers.dev/api/v1/user/${
          type === "signin" ? "signin" : "signup"
        }`,
        inputs
      );
      const { token } = res.data;
      localStorage.setItem("jwt", token);
      toast.success(
        `${type === "signin" ? "Logged In" : "Signed Up"} Successfully!`,
        {
          id: loadingToast,
        }
      );
      navigate("/");
    } catch (error) {
      toast.dismiss(loadingToast);
      // @ts-expect-error: error.response may be undefined
      setErrorMsg(error.response.data.msg);
      setError(true);
    }
  };

  useEffect(() => {
    if (error && errorMsg) {
      if (errorMsg.trim().split(" ")[0] === "email") {
        const msg = errorMsg.substring(errorMsg.indexOf(" ") + 1);
        toast.error(msg);
        return;
      }
      toast.error(errorMsg);
      setError(false);
    }
  }, [error, errorMsg]);

  return (
    <div className="h-screen w-full md:w-1/2 px-6 lg:px-20 flex flex-col justify-center items-center">
      {type === "signin" ? (
        <div className="text-center">
          {" "}
          <p className="text-3xl font-extrabold">Welcome Back</p>
          <span className="flex justify-center items-center">
            <p>Don't have an account ?</p>
            <Link
              className="ml-2 underline text-blue-700 font-semibold"
              to={"/signup"}
            >
              Signup
            </Link>
          </span>
        </div>
      ) : (
        <>
          <div>
            <p className="text-3xl font-extrabold">Create an Account</p>
            <span className="flex justify-center items-center">
              <p>Already have an Account?</p>
              <Link
                className="ml-2 underline text-blue-700 font-semibold"
                to={"/signin"}
              >
                Login
              </Link>
            </span>
          </div>
          <LabelledInput
            label="Username"
            type="text"
            placeholder="Enter your username"
            onChange={(e) => {
              setInputs({
                ...inputs,
                username: e.target.value,
              });
            }}
          />
        </>
      )}

      <LabelledInput
        label="Email"
        type="email"
        placeholder="example@domain.com"
        onChange={(e) => {
          setInputs({
            ...inputs,
            email: e.target.value,
          });
        }}
      />

      <LabelledInput
        label="Password"
        type="password"
        placeholder="Enter your password"
        onChange={(e) => {
          setInputs({
            ...inputs,
            password: e.target.value,
          });
        }}
      />

      <button
        type="button"
        className="w-full mt-5 text-gray-900 hover:text-white border border-gray-800 hover:bg-black focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg text-base px-5 py-2.5 text-center me-2 mb-2 transition-all duration-300 font-semibold"
        onClick={onSignUpHandler}
      >
        {type === "signin" ? "Login" : "Sign Up"}
      </button>
    </div>
  );
};

export default Auth;
