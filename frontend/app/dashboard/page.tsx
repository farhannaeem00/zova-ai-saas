"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChatbotCardSkeleton } from "@/components/ui/Skeleton";
import { Toast, useToast } from "@/components/ui/Toast";


export default function DashboardPage() {
  const router = useRouter();
  const [chatbots, setChatbots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();
  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const data = await api.getChatbots(user.id);
      setChatbots(data.chatbots || []);
      setLoading(false);
    };
    getData();
  }, []);

  const handleDelete = async (chatbotId: string) => {
  try {
    await api.deleteChatbot(chatbotId);
    setChatbots(chatbots.filter((b) => b.id !== chatbotId));
    showToast("Chatbot deleted successfully", "success");
  } catch (error) {
    showToast("Failed to delete chatbot. Try again.", "error");
  }
};

  if (loading) {
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-48 bg-gray-800 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-gray-800 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <ChatbotCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Your Chatbots</h2>
          <p className="text-gray-400 mt-1">
            {chatbots.length} chatbot{chatbots.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <Link
          href="/dashboard/chatbots/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
        >
          + New Chatbot
        </Link>
      </div>

      {/* Empty State */}
      {chatbots.length === 0 ? (
        <div className="border border-dashed border-gray-700 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold">Z</div>
          </div>
          <h3 className="text-lg font-semibold mb-2">No chatbots yet</h3>
          <p className="text-gray-400 mb-6">Create your first AI chatbot in minutes</p>
          <Link
            href="/dashboard/chatbots/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
          >
            Create Chatbot
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chatbots.map((bot) => (
            <div
              key={bot.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: bot.color }}
                >
                  {bot.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold">{bot.name}</h3>
                  <p className="text-xs text-gray-400">
                    {new Date(bot.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {bot.description || "No description"}
              </p>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/chatbots/${bot.id}`}
                  className="flex-1 text-center text-sm bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition"
                >
                  Manage
                </Link>
                <Link
                  href={`/chat/${bot.id}`}
                  className="flex-1 text-center text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
                >
                  Chat
                </Link>
                <button
                  onClick={() => handleDelete(bot.id)}
                  className="text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg transition"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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