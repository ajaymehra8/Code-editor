"use client";
import { useGlobalState } from "@/context/GlobalProvider";
import React from "react";
import Image from "next/image";
function Avatar() {
  const { user } = useGlobalState();
  if (!user) return null;
  console.log(user?.image);
  return (
    <Image
      src={user?.image}
      width={30}
      height={30}
      alt="profile"
      className="cursor-pointer rounded-full"
      unoptimized
    />
  );
}

export default Avatar;
