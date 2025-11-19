import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { FcDocument } from "react-icons/fc";
import toast from "react-hot-toast";
import { readToken } from "../../../lib/apis";
import { MdClose } from "react-icons/md";

const ImportFile = ({ onImportSuccess }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const file = files[0];

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }

    // Validate file size (max 25MB)
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size exceeds 25MB limit");
      return;
    }

    // Store file for preview without uploading
    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }

    setIsUploading(true);
    try {
      const token = readToken();
      if (!token) {
        toast.error("Authentication required");
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("csv", selectedFile);

      const API_URL = import.meta.env.VITE_API_BASE;
      const response = await fetch(`${API_URL}/menu/import-csv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to upload file");
      }

      const data = await response.json();
      toast.success(`Successfully imported ${data.count || 0} items`);

      // Call callback to refresh the table
      if (onImportSuccess) {
        onImportSuccess();
      }

      // Clear the file selection
      setSelectedFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto ">
      {/* File Upload Area */}
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`flex flex-col items-center justify-center p-12 mt-5 shadow-xl cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-[#EFEFEF]"
              : "border-border bg-[#dddddd]"
          }`}>
          {/* File Icon */}
          <div className="mb-6 relative">
            {/* Document icon - gray background */}
            <FcDocument className="w-16 h-16" />

            {/* Upload icon circle */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-900 dark:bg-blue-700 rounded-full flex items-center justify-center shadow-lg">
              <Upload className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center">
            <p className="text-foreground text-base">
              Drag and Drop file here or{" "}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                className="underline font-medium hover:text-primary transition-colors">
                Choose file
              </button>
            </p>
          </div>

          {/* Hidden file input */}
          <input
            ref={inputRef}
            type="file"
            onChange={handleChange}
            accept=".csv"
            className="hidden"
          />
        </div>
      ) : (
        // File Preview Section
        <div className="mt-5 shadow-xl bg-[#dddddd] p-6 rounded">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FcDocument className="w-8 h-8" />
              <div>
                <p className="font-medium text-[#072A57]">Selected File:</p>
                <p className="text-sm text-gray-700 truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-600">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-2 hover:scale-110"
              title="Remove file">
              <MdClose className="w-5 h-5 text-red-600" />
            </button>
          </div>

          {/* Upload and Cancel Buttons */}
          <div className="flex gap-3">
            <button
              onClick={uploadFile}
              disabled={isUploading}
              className="flex-1 px-4 py-2 bg-green-600 text-white border border-green-700 rounded-sm hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      )}

      {/* Support Info */}
      <div className="flex justify-between items-center mt-6 text-xs text-muted-foreground">
        <p>Supported formats: CSV</p>
        <p>Maximum size: 25MB</p>
      </div>
    </div>
  );
};

export default ImportFile;
