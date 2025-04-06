"use client";

import { useState } from "react";
import SnippetsPageSkeleton from "./_components/SnippetPageSkelton";

const snippetPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [view,setView]=useState<"grid"|"list">("grid");
const [loading,setLoading]=useState<boolean>(false);
  const snippets=[];
  //WRITE A DB REQUEST TO FETCH SNIPPETS

  if(loading){
    return (
        
        <SnippetsPageSkeleton/>
    )
  }
  return <div>snippetPage</div>;
};

export default snippetPage;
