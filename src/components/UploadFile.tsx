import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image';

interface UploadFileProps {
  onFileUpload: (url: string) => void; // Callback to pass the uploaded image URL
  resetImage?: boolean; // Prop to trigger image reset
}

const UploadFile: React.FC<UploadFileProps> = ({ onFileUpload, resetImage }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset the image preview and file input when `resetImage` changes
  useEffect(() => {
    if (resetImage) {
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input
      }
      onFileUpload(""); // Notify the parent that the image has been cleared
    }
  }, [resetImage, onFileUpload]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }

      // Generate a preview URL for the uploaded image
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        onFileUpload(imageUrl); // Pass the image URL to the parent component
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <label htmlFor="file-input" className="btn-default">
      {imagePreview ? (
        // Display the uploaded image as a thumbnail
        <Image
          src={imagePreview}
          alt="Uploaded thumbnail"
          className="object-cover"
          width={100}
          height={100}
        />
      ) : (
        // Display the upload icon if no image is uploaded
        <span className="text-indigo-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-upload"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
        </span>
      )}
      <input
        id="file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef} // Add a ref to the file input
        data-gtm-form-interact-field-id="0"
      />
    </label>
  );
};

export default UploadFile;