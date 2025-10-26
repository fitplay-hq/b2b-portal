import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for debounced search functionality
 * @param onSearch - Callback function to execute when search should be performed
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Object with searchValue and handleSearch function
 */
export function useDebouncedSearch(
  onSearch: (searchTerm: string) => void,
  delay: number = 500
) {
  const [searchValue, setSearchValue] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value); // Update input immediately for UI responsiveness
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for API call
    timeoutRef.current = setTimeout(() => {
      onSearch(value.trim());
    }, delay);
  }, [onSearch, delay]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    searchValue,
    handleSearch,
    setSearchValue, // Allow manual control if needed
  };
}