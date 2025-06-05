"use client";
import { Github, X } from "lucide-react";
import { motion } from "framer-motion";
import { useGlobalState } from "@/context/GlobalProvider";
import { useGoogleLogin } from "@react-oauth/google";
import { getOtp, googleLogin, login, signup, verifyOtp } from "../utils/api";

import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
const SignupModal = () => {
  const { setOpenSignupModal, setUser, setToken } = useGlobalState();
  const [email, setEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");

  const [otp, setOTP] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState("login");
  const emailRef = useRef<HTMLInputElement>(null);
  const cleanup = () => {
    setEmail("");
    setPassword("");
    setOTP("");
    setLoginEmail("");
    setLoginPassword("");
    setStep(1);
  };
  // Inside the component
  useEffect(() => {
    if (step === 1) {
      emailRef.current?.focus();
    }
  }, [step]);

  const responseGoogle = async (authResult) => {
    try {
      if (authResult?.code) {
        const result = await googleLogin(authResult?.code);
        if (result.data.success) {
          const user = JSON.stringify(result?.data?.user);
          localStorage.setItem("user", user);
          localStorage.setItem("token", result.data.token);
          setUser(result?.data?.user);
          setToken(result.data.token);
          toast.success("Login successfully");
          setOpenSignupModal(false);
        }
      }
    } catch (err) {
      if (err instanceof AxiosError) alert(err.message);
    }
  };
  const googleLoginHandle = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  // signup handler
  const handleSignup = async () => {
    if (step === 1) {
      try {
        const { data } = await getOtp(email);
        if (data.success) {
          toast.success(data.message);
          setStep(2);
        }
      } catch (err) {
        console.log(err);
        if (err instanceof AxiosError) toast.error(err.response?.data.message);
      }
    } else if (step == 2) {
      try {
        const { data } = await verifyOtp(email, otp);
        if (data.success) {
          toast.success(data.message);
          setStep(3);
        }
      } catch (err) {
        console.log(err);
        if (err instanceof AxiosError) toast.error(err.response?.data.message);
      }
    } else if (step == 3) {
      try {
        const { data } = await signup(email, password, name);
        if (data.success) {
          const user = JSON.stringify(data?.user);
          localStorage.setItem("user", user);
          localStorage.setItem("token", data.token);
          setUser(data?.user);
          setToken(data.token);
          toast.success(data.message);
          setOpenSignupModal(false);
        }
      } catch (err) {
        console.log(err);
        if (err instanceof AxiosError) alert(err.response?.data.message);
      }
    }
  };

  // login handler
  const handleLogin=async()=>{
      try {
        const { data } = await login(loginEmail, loginPassword);
        if (data.success) {
          const user = JSON.stringify(data?.user);
          localStorage.setItem("user", user);
          localStorage.setItem("token", data.token);
          setUser(data?.user);
          setToken(data.token);
          toast.success(data.message);
          setOpenSignupModal(false);
        }
      } catch (err) {
        console.log(err);
        if (err instanceof AxiosError) toast.error(err.response?.data.message);
      }
  }
  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`min-h-[50vh] bg-[#ffffff] 
        text-black min-w-[25vw] fixed z-[100] 
        left-1/2 top-1/2 -translate-x-1/2  font-fira -translate-y-1/2 rounded-sm flex flex-col py-5 items-center
        `}
      >
        <X
          className="cursor-pointer absolute right-3 top-2"
          onClick={() => setOpenSignupModal(false)}
        />
        {modal === "signup" ? (
          <>
            <h2 className="tracking-normal text-lg font-bold">
              Sign up to Code Craft
            </h2>
            <p className="font-normal text-sm">
              Already have an account?{" "}
              <span
                className="text-[blue] cursor-pointer font-semibold"
                onClick={() => {
                  setModal("login");
                  cleanup();
                }}
              >
                Log in
              </span>
            </p>
            {step == 1 && (
              <div className="flex gap-[10%] w-full items-center justify-center mt-2">
                <button className="rounded-full border py-1 px-5 cursor-pointer flex gap-3 text-[15px] items-center">
                  <Github /> Github
                </button>
                <button
                  className="rounded-full border py-1 px-5 cursor-pointer flex gap-3 items-center text-[15px]"
                  onClick={googleLoginHandle}
                >
                  <Image
                    src={
                      "https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                    }
                    alt="google-icon"
                    width={25}
                    height={10}
                  />{" "}
                  Google
                </button>
              </div>
            )}

            <div className="flex flex-col gap-[2px] mt-5 w-[90%]">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  id="email"
                  value={email}
                  className="border w-[100%] border-black-300 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:border"
                  ref={emailRef}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  disabled={step != 1}
                />
                {step != 1 && (
                  <button
                    className="absolute right-[5%] cursor-pointer text-[blue]"
                    onClick={() => {
                      setStep(1);
                    }}
                  >
                    Edit
                  </button>
                )}{" "}
              </div>
            </div>
            {step == 2 && (
              <div className="flex flex-col gap-[2px] mt-5 w-[90%]">
                <label htmlFor="otp" className="text-sm font-medium">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  className="border border-black-300 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:border"
                  onChange={(e) => {
                    setOTP(e.target.value);
                  }}
                />
              </div>
            )}
            {step == 3 && (
              <>
                <div className="flex flex-col gap-[2px] mt-5 w-[90%]">
                  <label htmlFor="name" className="text-sm font-medium">
                    Enter your name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    className="border border-black-300 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:border"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-[2px] mt-5 w-[90%]">
                  <label htmlFor="password" className="text-sm font-medium">
                    Create password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    className="border border-black-300 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:border"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
              </>
            )}
            <button
              className="mt-8 rounded-md py-2 w-[90%] bg-gradient-to-t from-gray-900 to-gray-500 cursor-pointer text-lg text-white tracking-wide"
              onClick={handleSignup}
            >
              {step === 1 && "Continue"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Sign up"}
            </button>
          </>
        ) : (
          <>
            <h2 className="tracking-normal text-lg font-bold">
              Log in to Code Craft
            </h2>
            <p className="font-normal text-sm">
              Don't have an account?{" "}
              <span
                className="text-[blue] cursor-pointer font-semibold"
                onClick={() => {
                  setModal("signup");
                  cleanup();
                }}
              >
                Sign up
              </span>
            </p>

            <div className="flex flex-col gap-[2px] mt-2 w-[90%]">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  id="email"
                  value={loginEmail}
                  className="border w-[100%] border-black-300 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:border"
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-[2px] mt-5 w-[90%]">
              <label htmlFor="password" className="text-sm font-medium">
                Your Password
              </label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  id="password"
                  value={loginPassword}
                  className="border w-[100%] border-black-300 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:border"
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                  }}
                />
              </div>
            </div>
            <button
              className="mt-8 rounded-md py-2 w-[90%] bg-gradient-to-t from-gray-900 to-gray-500 cursor-pointer text-lg text-white tracking-wide"
              onClick={handleLogin}
            >
              Log in
            </button>
          </>
        )}
      </motion.div>
    </>
  );
};

export default SignupModal;
