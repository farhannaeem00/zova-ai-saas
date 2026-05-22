"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function FileUploader({ chatbotId }: { chatbotId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file first.");
      return;
    }
    setUploading(true);
    setMessage("");
    const data = await api.uploadPDF(chatbotId, file);
    if (data.status === "success") {
      setMessage(`✅ Uploaded! ${data.chunks_processed} chunks processed.`);
      setFile(null);
    } else {
      setMessage("❌ Upload failed. Try again.");
    }
    setUploading(false);
  };

  return (
    <div>
      <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center mb-4">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <p className="text-4xl mb-2">📄</p>
          <p className="text-gray-400 text-sm">
            {file ? file.name : "Click to select a PDF file"}
          </p>
        </label>
      </div>
      {message && <p className="text-sm mb-3 text-gray-300">{message}</p>}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
}