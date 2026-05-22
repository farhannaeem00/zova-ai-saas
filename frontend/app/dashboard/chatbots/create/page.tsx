"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toast, useToast } from "@/components/ui/Toast";

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899",
  "#f59e0b", "#10b981", "#3b82f6",
];


export default function CreateChatbotPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const { toast, showToast, hideToast } = useToast();
  const handleCreate = async () => {
  if (!name.trim()) {
    showToast("Chatbot name is required.", "error");
    return;
  }
  setLoading(true);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { router.push("/login"); return; }

  try {
    const data = await api.createChatbot({
      user_id: user.id,
      name,
      description,
      instructions,
      color,
    });
    if (data.status === "success") {
      showToast("Chatbot created successfully!", "success");
      setTimeout(() => router.push(`/dashboard/chatbots/${data.chatbot.id}`), 1000);
    } else {
      showToast("Failed to create chatbot. Try again.", "error");
    }
  } catch (error) {
    showToast("Something went wrong. Try again.", "error");
  }
  setLoading(false);
};

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
          ← Back
        </Link>
        <h1 className="text-xl font-bold text-indigo-400">Create Chatbot</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Chatbot Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Support Bot"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Answers customer questions"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Instructions (Personality)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. You are a friendly support agent. Always be polite and helpful."
              rows={4}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Widget Color
            </label>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-9 h-9 rounded-full transition border-2 ${
                    color === c ? "border-white scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-sm text-gray-400 mb-3">Preview</p>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: color }}
              >
                {name ? name[0].toUpperCase() : "?"}
              </div>
              <div>
                <p className="font-semibold">{name || "Chatbot Name"}</p>
                <p className="text-sm text-gray-400">
                  {description || "No description"}
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Chatbot"}
          </button>
        </div>
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