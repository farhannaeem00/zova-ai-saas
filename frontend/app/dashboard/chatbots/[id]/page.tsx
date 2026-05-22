"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SettingsPageSkeleton } from "@/components/ui/Skeleton";
import { Toast, useToast } from "@/components/ui/Toast";

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899",
  "#f59e0b", "#10b981", "#3b82f6",
];

export default function ChatbotSettingsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [chatbot, setChatbot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editInstructions, setEditInstructions] = useState("");
  const [editColor, setEditColor] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    const fetchChatbot = async () => {
      const data = await api.getChatbot(id as string);
      if (!data.chatbot) { router.push("/dashboard"); return; }
      setChatbot(data.chatbot);
      const docs = await api.getDocuments(id as string);
      setDocuments(docs.documents || []);
      setEditName(data.chatbot.name);
      setEditDescription(data.chatbot.description || "");
      setEditInstructions(data.chatbot.instructions || "");
      setEditColor(data.chatbot.color);
      setLoading(false);
    };
    fetchChatbot();
  }, [id]);

  const handleSave = async () => {
  setSaving(true);
  try {
    const data = await api.updateChatbot(id as string, {
      name: editName,
      description: editDescription,
      instructions: editInstructions,
      color: editColor,
    });
    if (data.status === "success") {
      setChatbot(data.chatbot);
      setEditing(false);
      showToast("Changes saved successfully!", "success");
    } else {
      showToast("Failed to save changes.", "error");
    }
  } catch (error) {
    showToast("Something went wrong.", "error");
  }
  setSaving(false);
};

 const handleUpload = async () => {
  if (!file) {
    showToast("Please select a PDF file first.", "error");
    return;
  }
  setUploading(true);
  try {
    const data = await api.uploadPDF(id as string, file);
    if (data.status === "success") {
      showToast(`Uploaded! ${data.chunks_processed} chunks processed.`, "success");
      setFile(null);
      const docs = await api.getDocuments(id as string);
      setDocuments(docs.documents || []);
    } else {
      showToast("Upload failed. Try again.", "error");
    }
  } catch (error) {
    showToast("Something went wrong.", "error");
  }
  setUploading(false);
};
  const handleDeleteDocument = async (documentId: string) => {
  await api.deleteDocument(documentId);
  setDocuments(documents.filter((d) => d.id !== documentId));
};

  const handleCopyEmbed = () => {
    const embedCode = `<!-- Zova AI Chatbot Widget -->\n<script>\n  window.ChatbotConfig = { botId: "${id}" };\n</script>\n<script src="${window.location.origin}/embed.js" defer></script>`;
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

 if (loading) {
  return <SettingsPageSkeleton />;
}

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: chatbot.color }}
          >
            {chatbot.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold">{chatbot.name}</h1>
            <p className="text-sm text-gray-400">{chatbot.description || "No description"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
          >
            {editing ? "Cancel" : "✏️ Edit"}
          </button>
          <Link
            href={`/chat/${id}`}
            className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
          >
            🧪 Test Chat
          </Link>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="bg-gray-900 border border-indigo-500/30 rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-lg text-indigo-400">Edit Chatbot</h2>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Name</label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Description</label>
            <input
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Instructions</label>
            <textarea
              value={editInstructions}
              onChange={(e) => setEditInstructions(e.target.value)}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Color</label>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setEditColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    editColor === c ? "border-white scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {saveMsg && <p className="text-sm text-gray-300">{saveMsg}</p>}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      {/* Chatbot Info */}
      {!editing && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-4">Chatbot Info</h2>
          <div className="space-y-2 text-sm text-gray-400">
            <p><span className="text-gray-500">ID:</span> {chatbot.id}</p>
            <p><span className="text-gray-500">Name:</span> {chatbot.name}</p>
            <p><span className="text-gray-500">Description:</span> {chatbot.description || "—"}</p>
            <p><span className="text-gray-500">Instructions:</span> {chatbot.instructions || "—"}</p>
            <p><span className="text-gray-500">Created:</span> {new Date(chatbot.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      {/* Upload Documents */}
      {/* Upload Documents */}
<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
  <h2 className="font-semibold text-lg mb-2">Upload Documents</h2>
  <p className="text-sm text-gray-400 mb-4">
    Upload PDF files to train your chatbot.
  </p>

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

  {uploadMsg && <p className="text-sm mb-3 text-gray-300">{uploadMsg}</p>}

  <button
    onClick={handleUpload}
    disabled={uploading}
    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
  >
    {uploading ? "Uploading..." : "Upload PDF"}
  </button>

  {/* Documents List */}
  {documents.length > 0 && (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">
        Uploaded Documents ({documents.length})
      </h3>
      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📄</span>
              <div>
                <p className="text-sm text-white font-medium">{doc.file_name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(doc.created_at).toLocaleDateString()} •{" "}
                  <span className="text-green-400">{doc.status}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDeleteDocument(doc.id)}
              className="text-red-400 hover:text-red-300 text-sm transition"
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

      {/* Embed Code */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="font-semibold text-lg mb-2">Embed on Your Website</h2>
        <p className="text-sm text-gray-400 mb-4">Copy this code and paste into your website HTML.</p>
        <div className="bg-gray-800 rounded-lg p-4 text-sm text-gray-300 font-mono mb-4 overflow-x-auto">
          {`<script>\n  window.ChatbotConfig = { botId: "${id}" };\n</script>\n<script src="YOUR_DOMAIN/embed.js" defer></script>`}
        </div>
        <button
          onClick={handleCopyEmbed}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-lg transition"
        >
          {copied ? "✅ Copied!" : "Copy Embed Code"}
        </button>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>  
  );
}