"use client";
import { Trash2Icon, UserIcon } from "lucide-react";
import CommentContent from "./CommentContent";
import { CommentType } from "@/types/allTypes";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteSnippetComment } from "@/utils/api";
import { AxiosError } from "axios";

interface CommentProps {
  comment: CommentType;
  currentUserId?: string;
  setComments: React.Dispatch<React.SetStateAction<CommentType[] | null>>;
}
function Comment({ comment, currentUserId, setComments }: CommentProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const deleteComment = async () => {
    setLoading(true);
    try {
      // call api to delete element
      console.log(comment._id);
      const { data } = await deleteSnippetComment(comment._id);
      if (data.success) {
        setComments((prevComments) => {
          if (prevComments) {
            return prevComments.filter(
              (currComment) => comment._id != currComment._id
            );
          }
          return null;
        });
        toast.success(data.message);
      }
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) toast.error(err.response?.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="group">
      <div className="bg-[#0a0a0f] rounded-xl p-6 border border-[#ffffff0a] hover:border-[#ffffff14] transition-all">
        <div className="flex items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#ffffff08] flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-4 h-4 text-[#808086]" />
            </div>
            <div className="min-w-0">
              <span className="block text-[#e1e1e3] font-medium truncate">
                {comment.user?.name}
              </span>
              <span className="block text-sm text-[#808086]">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {comment.user?._id === currentUserId && (
            <button
              onClick={deleteComment}
              disabled={loading}
              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg transition-all"
              title="Delete comment"
            >
              <Trash2Icon className="w-4 h-4 text-red-400" />
            </button>
          )}
        </div>

        <CommentContent content={comment.content} />
      </div>
    </div>
  );
}

export default Comment;
