'use client';

import { useState } from 'react';
import { updateSnippet } from '@/utils/api';
import { AxiosError } from 'axios';
import { Pen } from 'lucide-react';
import toast from 'react-hot-toast';

const UpdateSnippet = ({ id }: { id: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const { data } = await updateSnippet(id);
      if (data.success) {
        toast.success('Snippet updated!');
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || 'Update failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpdate}
      disabled={isLoading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 bg-gray-500/10 text-gray-400 hover:bg-[#478cdd] hover:text-white border border-gray-800 hover:border-blue-500/50 ${
        isLoading ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {isLoading ? (
        <div className="size-3.5 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
      ) : (
        <Pen className="size-3.5" />
      )}
    </button>
  );
};

export default UpdateSnippet;
