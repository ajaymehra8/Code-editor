"use client"
import { useGlobalState } from '@/context/GlobalProvider'
import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, PlayIcon } from 'lucide-react'

const RunButton = () => {
  const {user,runCode,isRunning,executionResult}=useGlobalState();
  const handleRun=async()=>{
await runCode();
if(executionResult){
// save the result in db

}
  }
  return (
    <motion.button
    onClick={handleRun}
    disabled={isRunning||!user}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    title={!user?"Please signup first":undefined}
    className={`
      group relative inline-flex items-center gap-2.5 px-5 py-2.5
      disabled:cursor-not-allowed
      focus:outline-none cursor-pointer
    `}
  >
    {/* bg wit gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl opacity-100 transition-opacity group-hover:opacity-90" />

    <div className="relative flex items-center gap-2.5">
      {isRunning ? (
        <>
          <div className="relative">
            <Loader2 className="w-4 h-4 animate-spin text-white/70" />
            <div className="absolute inset-0 blur animate-pulse" />
          </div>
          <span className="text-sm font-medium text-white/90 hidden lg:block">Executing...</span>
        </>
      ) : (
        <>
          <div className="relative flex items-center justify-center w-4 h-4">
            <PlayIcon className="w-4 h-4 text-white/90 transition-transform group-hover:scale-110 group-hover:text-white" />
          </div>
          <span className="hidden lg:block text-sm font-medium text-white/90 group-hover:text-white">
            Run Code
          </span>
        </>
      )}
    </div>
  </motion.button>
  )
}

export default RunButton
