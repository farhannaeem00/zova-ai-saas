"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

export default function AnalyticsPage() {
  const [chatbots, setChatbots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const data = await api.getChatbots(user.id);
      setChatbots(data.chatbots || []);
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <p className="text-gray-400 mt-1">Overview of your chatbots performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          {
            label: "Total Chatbots",
            value: chatbots.length,
            icon: "🤖",
            color: "indigo",
          },
          {
            label: "Active Chatbots",
            value: chatbots.filter((b) => b.is_active).length,
            icon: "✅",
            color: "green",
          },
          {
            label: "Total Documents",
            value: "—",
            icon: "📄",
            color: "purple",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-4xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chatbots Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="font-semibold">Chatbot Overview</h3>
        </div>

        {chatbots.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-3xl mb-3">📊</p>
            <p>No chatbots yet. Create one to see analytics.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                <th className="px-6 py-3">Chatbot</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Color</th>
              </tr>
            </thead>
            <tbody>
              {chatbots.map((bot, i) => (
                <tr
                  key={bot.id}
                  className={`text-sm ${
                    i !== chatbots.length - 1 ? "border-b border-gray-800" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: bot.color }}
                      >
                        {bot.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{bot.name}</p>
                        <p className="text-gray-500 text-xs">{bot.description || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        bot.is_active
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {bot.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(bot.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: bot.color }}
                      />
                      <span className="text-gray-400 text-xs">{bot.color}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}