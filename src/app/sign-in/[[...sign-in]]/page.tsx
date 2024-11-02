"use client";

import { Sun, Moon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignedOut, SignIn } from "@clerk/nextjs";

export default function Page() {

  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    document.body.classList.toggle("dark", !isDarkMode); 
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background transition-colors duration-400">
      <div className="absolute top-4 right-4">
        <Button onClick={toggleDarkMode} className="p-2">
          {isDarkMode ? <Sun /> : <Moon />}
        </Button>
      </div>
      <div className="">
        <SignedOut>
          <SignIn />
        </SignedOut>
      </div>
    </div>
  );
}
