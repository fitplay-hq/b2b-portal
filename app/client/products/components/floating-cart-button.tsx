"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingCartButtonProps {
  totalCartItems: number;
}

export function FloatingCartButton({ totalCartItems }: FloatingCartButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousCount, setPreviousCount] = useState(totalCartItems);
  const router = useRouter();

  // Animate when items are added
  useEffect(() => {
    if (totalCartItems > previousCount) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
    setPreviousCount(totalCartItems);
  }, [totalCartItems, previousCount]);

  const handleClick = () => {
    router.push("/client/cart");
  };

  // Don't render if cart is empty
  if (totalCartItems === 0) return null;

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className={`fixed bottom-6 right-6 z-[100] h-14 w-14 rounded-full shadow-2xl bg-white hover:bg-gray-50 border-2 transition-all duration-300 hover:scale-110 md:h-16 md:w-16 ${
        isAnimating ? "animate-bounce scale-110" : ""
      }`}
      size="icon"
    >
      <div className="relative">
        <ShoppingCart className="h-6 w-6 md:h-7 md:w-7 text-primary" />
        <div
          className={`absolute -top-3 -right-3 bg-primary text-primary-foreground text-xs rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center font-bold shadow-lg transition-all duration-300 ${
            isAnimating ? "scale-125 animate-pulse" : "scale-100"
          }`}
        >
          {totalCartItems > 99 ? "99+" : totalCartItems}
        </div>
      </div>
    </Button>
  );
}
