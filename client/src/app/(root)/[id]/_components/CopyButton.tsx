"use client";
import { Check,Copy } from "lucide-react";
import React, { useState } from "react";

const CopyButton = ({ code }: { code: string }) => {
  const [copy, setCopy] = useState(false);
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopy(true);
    setTimeout(() => setCopy(false), 2000);
  };
  return (
    <button
      onClick={copyToClipboard}
      type="button"
      className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200  group relative cursor-pointer"
      
    >
        {copy?(
            <Check className="size-4 text-green-400"/>
        ):(
            <Copy className="size-4 text-gray-400 group:hover:text-gray-300 "/>
        )}
    </button>
  );
};

export default CopyButton;
