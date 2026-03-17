"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface OMInfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export function OMInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
}: OMInfiniteScrollProps) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const isProcessing = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isProcessing.current) {
          isProcessing.current = true;
          onLoadMore();
          // Reset local lock after a short delay to allow parent state to update
          setTimeout(() => {
            isProcessing.current = false;
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  if (!hasMore && !isLoading) return null;

  return (
    <div ref={observerTarget} className="flex justify-center p-4 w-full">
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading more...</span>
        </div>
      )}
    </div>
  );
}
