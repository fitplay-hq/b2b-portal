import { useState, useCallback } from 'react';

interface PincodeData {
  pincode: string;
  city: string;
  state: string;
  district: string;
  postOffice: string;
  success: boolean;
}

interface UsePincodeLookupResult {
  data: PincodeData | null;
  isLoading: boolean;
  error: string | null;
  lookupPincode: (pincode: string) => Promise<void>;
  clearError: () => void;
}

export function usePincodeLookup(): UsePincodeLookupResult {
  const [data, setData] = useState<PincodeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupPincode = useCallback(async (pincode: string) => {
    // Clear previous state
    setError(null);
    setData(null);

    // Validate pincode format
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔍 Looking up pincode:', pincode);
      
      const response = await fetch(`/api/pincode/${pincode}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to lookup pincode');
      }

      console.log('✅ Pincode lookup successful:', result);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to lookup pincode';
      console.error('❌ Pincode lookup failed:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    lookupPincode,
    clearError
  };
}