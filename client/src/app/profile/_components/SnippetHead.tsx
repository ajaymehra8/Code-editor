import { Snippet } from '@/types/allTypes'
import { deleteSnippet } from '@/utils/api'
import { AxiosError } from 'axios'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const SnippetHead = ({snippet,setSnippets}:{snippet:Snippet,setSnippets:React.Dispatch<React.SetStateAction<Snippet[]|null>>}) => {
     const [isDeleting, setIsDeleting] = useState(false);
    
      const handleDelete = async (snippet:Snippet) => {
        // FUNCTION TO DELETE A SNIPPET
        setIsDeleting(true);
        try {
          const { data } = await deleteSnippet(snippet._id);
          if (data.success) {
            setSnippets(
              (prevSnippets) =>
                prevSnippets && prevSnippets.filter((s) => s?._id !== snippet?._id)
            );
            toast.success(data.message);
          }
        } catch (err) {
          if (err instanceof AxiosError) toast.error(err?.response?.data?.message);
        } finally {
          setIsDeleting(false);
        }
      };
  return (
    <div className="flex items-center justify-between p-4 bg-black/30 border border-gray-800/50 rounded-t-xl">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
                              <Image
                                src={"/" + snippet.language + ".png"}
                                alt=""
                                className="rounded-lg relative z-10 object-cover"
                                width={40}
                                height={40}
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="hidden lg:block text-sm font-medium text-white">
                                  {snippet.language.toUpperCase()}
                                </span>
                                <span className="hidden lg:block text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-400">
                                  {new Date(snippet.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>

                           
                          </div>
                           <div
                              className="z-10 justify-self-end"
                              onClick={(e) => e.preventDefault()}
                            >
                              <button
                                onClick={()=>handleDelete(snippet)}
                                disabled={isDeleting}
                                className={`group cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200
                                  ${
                                    isDeleting
                                      ? "bg-red-500/20 text-red-400 cursor-not-allowed"
                                      : "bg-gray-500/10 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                                  }
                                `}
                              >
                                {isDeleting ? (
                                  <div className="size-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                                ) : (
                                  <Trash2 className="size-3.5" />
                                )}
                              </button>
                            </div>
                        </div>
  )
}

export default SnippetHead
