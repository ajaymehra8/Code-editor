"use client";
import { Github, X } from "lucide-react";
import { motion } from "framer-motion";
import { useGlobalState } from "@/context/GlobalProvider";
import { useGoogleLogin } from "@react-oauth/google";
import { getOtp, googleLogin } from "../utils/api";

import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useState } from "react";
const SignupModal = () => {
  const { setOpenSignupModal, setUser, setToken } = useGlobalState();
  const [email, setEmail] = useState("");
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
  const sendOtp = async () => {
    try {
      await getOtp(email);
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) alert(err.response?.data.message);
    }
  };
  return (
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
      <h2 className="tracking-normal text-lg font-bold">
        Sign in to Code Craft
      </h2>
      <p className="font-normal text-sm">Welcome back! Sign in to continue.</p>
      <div className="flex gap-[10%] w-full items-center justify-center mt-2">
        <button className="rounded-full border py-1 px-5 cursor-pointer flex gap-3">
          <Github /> Github
        </button>
        <button
          className="rounded-full border py-1 px-5 cursor-pointer flex gap-3"
          onClick={googleLoginHandle}
        >
          Google
        </button>
      </div>

      <div className="flex flex-col gap-2 mt-5 w-[90%]">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          type="text"
          id="email"
          value={email}
          className="border border-black-300 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:border"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <button
        className="mt-8 rounded-md py-2 w-[90%] bg-gradient-to-t from-gray-900 to-gray-500 cursor-pointer text-lg text-white tracking-wide"
        onClick={sendOtp}
      >
        Continue
      </button>
    </motion.div>
  );
};

export default SignupModal;
