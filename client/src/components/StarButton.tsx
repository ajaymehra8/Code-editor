"use client";
import { useGlobalState } from "@/context/GlobalProvider";
import { starSnippet } from "@/utils/api";
import { AxiosError } from "axios";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

const StarButton = ({ snippetId,isStarred,starCount }: { snippetId: string,isStarred:boolean,starCount:number }) => {
  const { setSnippets } = useGlobalState();
  // star the snippet
  const handleStar = async () => {
    try {
      const { data } = await starSnippet(snippetId);
      if (data.success) {
        toast.success(data.message);
        setSnippets((prevSninppets)=>{
          return prevSninppets.map((snippet)=>{
            if(snippet._id===data.snippet._id){
              return data.snippet;
            }
            return snippet;
          })
        })
      }
    } catch (err) {
      if (err instanceof AxiosError) toast.error(err.response?.data.message);
    }
    console.log(snippetId);
  };
  return (
    <button
      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer 
        transition-all duration-200 ${
          isStarred
            ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
            : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
        }`}
      onClick={handleStar}
    >
      <Star
        className={`w-4 h-4 ${
          isStarred ? "fill-yellow-500" : "fill-none group-hover:fill-gray-400"
        }`}
      />
      <span
        className={`text-xs font-medium ${
          isStarred ? "text-yellow-500" : "text-gray-400"
        }`}
      >
        {starCount}
      </span>
    </button>
  );
};

export default StarButton;
