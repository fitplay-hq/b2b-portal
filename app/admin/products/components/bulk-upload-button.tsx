"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button"; // Assuming your button path
import { Upload } from "lucide-react";
import { toast } from "sonner"; // Using sonner for notifications, as in your previous code

// Define the props for the component
// It takes an 'onUpload' callback function to pass the parsed data to the parent
interface BulkUploadButtonProps<T> {
  onUpload: (data: T) => void;
  buttonText?: string;
}

export function BulkUploadButton<T>({
  onUpload,
  buttonText = "Bulk Add Products",
}: BulkUploadButtonProps<T>) {
  // Create a ref to access the hidden file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  // This function is called when the visible button is clicked
  const handleButtonClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current?.click();
  };

  // This function is called when the user selects a file from the picker
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return; // User cancelled the file picker
    }

    // Check if the file is a JSON file
    if (file.type !== "application/json") {
      toast.error("Invalid file type. Please upload a JSON file.");
      return;
    }

    const reader = new FileReader();

    // Setup the onload event handler, which is triggered when the file is read
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== "string") {
          throw new Error("Failed to read file content.");
        }
        // Parse the string content into a JSON object
        const jsonData = JSON.parse(content) as T;

        // Call the parent component's onUpload function with the parsed data
        onUpload(jsonData);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        toast.error("Invalid JSON file. Please check the file format.");
      }
    };

    // Setup the onerror event handler for any reading errors
    reader.onerror = () => {
      console.error("Error reading file:", reader.error);
      toast.error("An error occurred while reading the file.");
    };

    // Read the file as text
    reader.readAsText(file);

    // Reset the input value to allow uploading the same file again
    event.target.value = "";
  };

  return (
    <>
      <Button onClick={handleButtonClick}>
        <Upload className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>

      {/* This is the actual file input, but it's hidden from the user */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/json,.json" // Restrict file picker to JSON files
        style={{ display: "none" }}
      />
    </>
  );
}
