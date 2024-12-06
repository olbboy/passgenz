'use client'

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { BookOpen } from "lucide-react";
import { GuideContent } from "./guide-content";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function GuideDrawer() {
  const [width, setWidth] = useState("95%");

  // Dynamically adjust width based on screen size
  useEffect(() => {
    function updateWidth() {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) { // mobile
        setWidth("95%");
      } else if (screenWidth < 1024) { // tablet
        setWidth("85%");
      } else if (screenWidth < 1280) { // small desktop
        setWidth("75%");
      } else { // large desktop
        setWidth("65%");
      }
    }

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="w-9 h-9">
          <BookOpen className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className={cn(
          "p-0 max-h-screen",
          "w-full sm:max-w-none transition-all duration-300"
        )}
        style={{ width }} // Dynamic width
      >
        <div className="h-full flex flex-col bg-background">
          <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between shrink-0">
            <SheetTitle className="text-2xl font-semibold">Password Security Guide</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">
            <GuideContent />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 