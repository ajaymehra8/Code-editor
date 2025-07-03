"use client";
import HeaderProfileBtn from "@/app/editor/_components/HeaderProfileBtn";
import { Blocks, Code2, LogIn, Sparkles, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useGlobalState } from "@/context/GlobalProvider";
import Avatar from "./Avatar";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import toast from "react-hot-toast";

function NavigationHeader() {
  const { user, setOpenSignupModal,setUser,setToken } = useGlobalState();
  const handleLogout=()=>{
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
          setToken("");
          toast.success("Logout successfully");
  }
  return (
    <div className="sticky top-0 w-full z-[50] border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group relative">
              {/* logo hover effect */}
              <div
                className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
              group-hover:opacity-100 transition-all duration-500 blur-xl"
              />

              {/* Logo */}
              <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                <Blocks className="w-6 h-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
              </div>

              <div className="relative hidden md:block">
                <span
                  className="block text-lg font-semibold bg-gradient-to-r
                 from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text"
                >
                  CodeCraft
                </span>
                <span className="block text-xs text-blue-400/60 font-medium">
                  Interactive Code Editor
                </span>
              </div>
            </Link>

            {/* snippets Link */}
            <Link
              href="/editor"
              className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50 hover:bg-blue-500/10 
              border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 
              to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
              <span className="text-sm font-medium relative z-10 group-hover:text-white transition-colors">
                Code
              </span>
            </Link>
          </div>

          {/* right rection */}
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-lg border border-amber-500/20
                 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 
                to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 transition-all 
                duration-300"
            >
              <Sparkles className="w-4 h-4 text-amber-400 hover:text-amber-300" />
              <span className="text-sm font-medium text-amber-400/90 hover:text-amber-300">
                Pro
              </span>
            </Link>

            {!user ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
      group relative inline-flex items-center gap-2.5 px-5 py-2.5
      disabled:cursor-not-allowed
      focus:outline-none cursor-pointer
    `}
                onClick={() => {
                  setOpenSignupModal(true);
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl opacity-100 transition-opacity group-hover:opacity-90" />
                <div className="relative flex items-center gap-2.5">
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <LogIn className="w-4 h-4 text-white/90 transition-transform group-hover:scale-110 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-medium text-white/90 group-hover:text-white">
                    Sign In
                  </span>{" "}
                </div>
              </motion.button>
            ) : (
              <Menu as="div" className="relative inline-block text-left">
  <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold text-white shadow-inner shadow-white/10 hover:bg-gray-700 focus:outline-none focus:ring-0 focus:border-0">
    <Avatar />
    <ChevronDown className="w-5 h-5" />
  </MenuButton>

  <MenuItems
    className="fixed right-4 top-16 z-[100] w-52 rounded-xl border border-white/5 bg-gray-800/90 p-1 text-sm text-white shadow-lg backdrop-blur-xl focus:outline-none focus:border-0"
  >
    <div className="py-1">
      <MenuItem>
        {({ active }) => (
          <Link
            href="/profile"
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 transition-colors ${
              active ? "bg-white/10" : ""
            }`}
          >
            Profile
          </Link>
        )}
      </MenuItem>
      <MenuItem>
        {({ active }) => (
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 transition-colors ${
              active ? "bg-white/10" : ""
            }`}
          >
            Logout
          </button>
        )}
      </MenuItem>
    </div>
  </MenuItems>
</Menu>

            )}
            {/* profile button */}
            <HeaderProfileBtn />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationHeader;
