"use client";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { CommentType } from "@/types/allTypes";
import { AxiosError } from "axios";
import { doComment } from "@/utils/api";
import { useGlobalState } from "@/context/GlobalProvider";

function Comments({ snippetId,comments,setComments }: { snippetId: string | undefined,comments:CommentType[] | null,setComments:React.Dispatch<React.SetStateAction<CommentType[] | null>> }) {
  const { user } = useGlobalState();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmitComment = async (content: string) => {
    // function for adding a comment
    console.log(content);
    setIsSubmitting(true);
    try {
      // call add comment api here
      const { data } = await doComment(snippetId, content);
      if (data.success) {
        setComments((prevComments) => {
          if (prevComments) return [data.comment, ...prevComments];
          else return [data.comment];
        });
      }
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) toast.error(err.response?.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!snippetId) return null;
  return (
    <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl overflow-hidden">
      <div className="px-6 sm:px-8 py-6 border-b border-[#ffffff0a]">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Discussion ({comments?.length})
        </h2>
      </div>

      <div className="p-6 sm:p-8">
        {user ? (
          <CommentForm
            onSubmit={handleSubmitComment}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="bg-[#0a0a0f] rounded-xl p-6 text-center mb-8 border border-[#ffffff0a]">
            <p className="text-[#808086] mb-4">
              Sign in to join the discussion
            </p>
          </div>
        )}

        <div className="space-y-6 ">
          {comments?.map((comment) => (
            <Comment
              key={comment?._id}
              comment={comment}
              setComments={setComments}
              currentUserId={user?._id || undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Comments;
