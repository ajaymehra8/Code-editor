"use client";
import { useGlobalState } from "@/context/GlobalProvider";
import { shareSnippet } from "@/utils/api";
import { AxiosError } from "axios";
import { X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ShareSnippetDialog = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState<string>("");
  const [isSharing, setIsSharing] = useState(false);
  const { language, getCode } = useGlobalState();

  // FUNCTION TO STORE SNIPPET IN DB
  const createSnippet = async (obj: {
    title: string;
    language: string;
    code: string;
  }) => {
    try {
      const { data } = await shareSnippet(obj);
      if (data.success) {
        toast.success(data.message);
      }
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) toast.error(err?.response?.data.message);
      else toast.error("Something went wrong");
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSharing(true);
    try {
      const code = getCode();
      await createSnippet({ title, language, code });
      onClose();
      setTitle("");
    } catch (err) {
      console.log(err);
      toast.error("Error in creating snippet");
    } finally {
      setIsSharing(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e2e] rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Share Snippet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X className="w-5 h-5 cursor-pointer" />
          </button>
        </div>

        <form onSubmit={handleShare}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#181825] border border-[#313244] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter snippet title"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSharing}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                  disabled:opacity-50"
            >
              {isSharing ? "Sharing..." : "Share"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareSnippetDialog;
