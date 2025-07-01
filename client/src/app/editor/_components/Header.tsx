"use client";
import { useGlobalState } from "@/context/GlobalProvider";
import { Blocks, Code2, LogIn, Sparkles } from "lucide-react";
import Link from "next/link";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";
import RunButton from "./RunButton";
import HeaderProfileBtn from "./HeaderProfileBtn";
import { motion } from "framer-motion";

const Header = () => {
  const { user } = useGlobalState();
  return (
    <div className="relative z-10">
      <div
        className="flex items-center lg:justify-between justify-center 
        bg-[#0a0a0f]/80 backdrop-blur-xl p-6 mb-4 rounded-lg"
      >
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group relative">
            {/* Logo hover effect */}

            <div
              className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
                group-hover:opacity-100 transition-all duration-500 blur-xl"
            />

            {/* Logo */}
            <div
              className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1
              ring-white/10 group-hover:ring-white/20 transition-all"
            >
              <Blocks className="size-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
            </div>

            <div className="flex flex-col">
              <span className="block text-lg font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
                CodeCraft
              </span>
              <span className="block text-xs text-blue-400/60 font-medium">
                Interactive Code Editor
              </span>
            </div>
          </Link>
          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            <Link
              href="/"
              className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50 
                hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 
                to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
              <span
                className="text-sm font-medium relative z-10 group-hover:text-white
                 transition-colors"
              >
                Snippets
              </span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <ThemeSelector />
            <LanguageSelector hasAccess={user?.isPro||false} />
          </div>

          {user && !user?.isPro && (
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 
                to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 
                transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 text-amber-400 hover:text-amber-300" />
              <span className="text-sm font-medium text-amber-400/90 hover:text-amber-300">
                Pro
              </span>
            </Link>
          )}

          <RunButton />
          {!user && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
      group relative inline-flex items-center gap-2.5 px-5 py-2.5
      disabled:cursor-not-allowed
      focus:outline-none cursor-pointer
    `}
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
          )}
          <div className="pl-3 border-l border-gray-800">
            <HeaderProfileBtn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
