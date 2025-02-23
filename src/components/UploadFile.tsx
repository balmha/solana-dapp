import React, { useState } from "react";

const UploadFile = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Generate a preview URL for the uploaded image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <label htmlFor="file-input" className="btn-default" flow-btn>
      {imagePreview ? (
        // Display the uploaded image as a thumbnail
        <img
          src={imagePreview}
          alt="Uploaded thumbnail"
          className="max-w-24 max-h-24 object-cover"
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
        data-gtm-form-interact-field-id="0"
      />
    </label>
  );
};

export default UploadFile;