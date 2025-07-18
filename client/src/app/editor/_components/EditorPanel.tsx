"use client"
import { useGlobalState } from '@/context/GlobalProvider';
import React, { useEffect, useState } from 'react'
import { defineMonacoThemes, LANGUAGE_CONFIG } from '../../(root)/_constants';
import { Editor } from '@monaco-editor/react';
import Image from 'next/image';
import { RotateCcwIcon, ShareIcon, TypeIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import useMounted from '@/hooks/useMounted';
import ShareSnippetDialog from './ShareSnippetDialog';
const EditorPanel = () => {
const [isShareDialogOpen,setIsShareDialogOpen]=useState<boolean>(false);
const {language,theme,fontSize,editor,setFontSize,setEditor}=useGlobalState();
const mounted=useMounted();
useEffect(()=>{
const savedCode=localStorage.getItem(`editor-code-${language}`);
const newCode=savedCode||LANGUAGE_CONFIG[language].defaultCode;
if(editor) editor.setValue(newCode);

},[language,editor])

const handleRefresh = () => {
  const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
  if (editor) editor.setValue(defaultCode);
  localStorage.removeItem(`editor-code-${language}`);
};

const handleEditorChange = (value: string | undefined) => {
  if (value) localStorage.setItem(`editor-code-${language}`, value);
};

const handleFontSizeChange = (newSize: number) => {
  const size = Math.min(Math.max(newSize, 12), 24);
  setFontSize(size);
};
if(!mounted) return null;

return (
  <div className="relative">
    <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
            <Image src={"/" + language + ".png"} alt="Logo" width={24} height={24} />
          </div>
          <div className='lg:block hidden'>
            <h2 className="text-sm font-medium text-white">Code Editor</h2>
            <p className="text-xs text-gray-500">Write and execute your code</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Font Size Slider */}
          <div className=" hidden lg:flex lg:items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
            <TypeIcon className="size-4 text-gray-400" />
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                {fontSize}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors cursor-pointer"
            aria-label="Reset to default code"
          >
            <RotateCcwIcon className="size-4 text-gray-400" />
          </motion.button>

          {/* Share Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsShareDialogOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
             from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <ShareIcon className="size-4 text-white" />
            <span className="text-sm font-medium text-white ">Share</span>
          </motion.button>
        </div>
      </div>

      {/* Editor  */}
      <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
       
          <Editor
            height="600px"
            language={LANGUAGE_CONFIG[language].monacoLanguage}
            onChange={handleEditorChange}
            theme={theme}
            beforeMount={defineMonacoThemes}
            onMount={(editor) => setEditor(editor)}
            options={{
              minimap: { enabled: true },
              fontSize,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              renderWhitespace: "selection",
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
              fontLigatures: true,
              cursorBlinking: "smooth",
              smoothScrolling: true,
              contextmenu: true,
              renderLineHighlight: "all",
              lineHeight: 1.6,
              letterSpacing: 0.5,
              roundedSelection: true,
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
            }}
          />
       

        {/* {!user && <EditorPanelSkeleton />} */}
      </div>
    </div>
    {isShareDialogOpen && <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />}
  </div>
);
}

export default EditorPanel
