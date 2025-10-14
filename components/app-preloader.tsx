import { Loader2 } from "lucide-react";

export function AppPreloader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-blue-50 p-4 rounded-full">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">Loading Fitplay B2B</h2>
          <p className="text-sm text-gray-500">Setting up your workspace...</p>
        </div>
      </div>
    </div>
  );
}