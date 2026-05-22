"use client";
import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";


interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Session {
  id: string;
  title: string;
  created_at: string;
}

export default function ChatPage() {
  const { botId } = useParams();
  const [chatbot, setChatbot] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [botLoading, setBotLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [hoveredMsg, setHoveredMsg] = useState<number | null>(null);
  const [editingMsg, setEditingMsg] = useState<number | null>(null);
  const [editInput, setEditInput] = useState("");
  const [copiedMsg, setCopiedMsg] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getChatbot(botId as string);
      if (data.chatbot) {
        setChatbot(data.chatbot);
        startNewChat(data.chatbot.name);
      }
      const sessionsData = await api.getSessions(botId as string);
      setSessions(sessionsData.sessions || []);
      setBotLoading(false);
    };
    fetchData();
  }, [botId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startNewChat = (botName?: string) => {
    setSessionId(null);
    setMessages([
      {
        role: "assistant",
        content: `Hi! I'm **${botName || chatbot?.name}**. How can I help you today?`,
      },
    ]);
  };

  const loadSession = async (session: Session) => {
    setSessionId(session.id);
    const data = await api.getSessionMessages(session.id);
    const msgs = data.messages || [];
    setMessages(
      msgs.map((m: any) => ({ role: m.role, content: m.content }))
    );
  };


  const handleDeleteSession = async (e: any, sid: string) => {
    e.stopPropagation();
    await api.deleteSession(sid);
    setSessions(sessions.filter((s) => s.id !== sid));
    if (sessionId === sid) startNewChat();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    const data = await api.sendMessage(
      botId as string,
      userMessage,
      messages,
      chatbot?.instructions || "",
      sessionId
    );

    if (data.response) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
        const sessionsData = await api.getSessions(botId as string);
        setSessions(sessionsData.sessions || []);
      }
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (botLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading chatbot...</p>
      </div>
    );
  }

  if (!chatbot) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-red-400">Chatbot not found.</p>
      </div>
    );
  }

  const handleCopy = (content: string, index: number) => {
  navigator.clipboard.writeText(content);
  setCopiedMsg(index);
  setTimeout(() => setCopiedMsg(null), 2000);
};

const handleRetry = async (index: number) => {
  const userMsg = messages[index - 1];
  if (!userMsg) return;
  setMessages((prev) => prev.slice(0, index));
  setLoading(true);
  const data = await api.sendMessage(
    botId as string,
    userMsg.content,
    messages.slice(0, index - 1),
    chatbot?.instructions || "",
    sessionId
  );
  if (data.response) {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.response },
    ]);
  }
  setLoading(false);
};

const handleEdit = (index: number, content: string) => {
  setEditingMsg(index);
  setEditInput(content);
};

const handleEditSend = async (index: number) => {
  if (!editInput.trim()) return;
  const newMessages = messages.slice(0, index);
  newMessages.push({ role: "user", content: editInput });
  setMessages(newMessages);
  setEditingMsg(null);
  setLoading(true);
  const data = await api.sendMessage(
    botId as string,
    editInput,
    newMessages.slice(0, -1),
    chatbot?.instructions || "",
    sessionId
  );
  if (data.response) {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.response },
    ]);
  }
  setLoading(false);
};

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* Sidebar */}
     {sidebarOpen && (
         <div className="fixed md:relative z-40 w-64 h-full border-r border-gray-800 flex flex-col shrink-0 bg-gray-950">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-800">
            <Link
              href="/dashboard"
              className="text-xs text-gray-400 hover:text-white transition mb-3 block"
            >
              ← Back to Dashboard
            </Link>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs"
                style={{ backgroundColor: chatbot.color }}
              >
                {chatbot.name[0].toUpperCase()}
              </div>
              <p className="font-semibold text-sm truncate">{chatbot.name}</p>
            </div>
            <button
              onClick={() => startNewChat()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 rounded-lg transition"
            >
              + New Chat
            </button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-2">
            {sessions.length === 0 ? (
              <p className="text-gray-500 text-xs text-center mt-4">
                No conversations yet
              </p>
            ) : (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 px-2 py-1">Recent</p>
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => loadSession(session)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer group transition ${
                      sessionId === session.id
                        ? "bg-indigo-600/20 border border-indigo-500/30"
                        : "hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 truncate">
                          {session.title && session.title !== "New Chat" 
                          ? session.title 
                          : messages[0]?.content?.slice(0, 40) || "New Chat"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition ml-2 text-xs"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-800 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition text-lg"
          >
            ☰
          </button>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: chatbot.color }}
          >
            {chatbot.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="font-semibold text-sm">{chatbot.name}</h1>
            <p className="text-xs text-green-400">● Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl w-full mx-auto">
         {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            onMouseEnter={() => setHoveredMsg(i)}
            onMouseLeave={() => setHoveredMsg(null)}
          >
            <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} w-full`}>
              {msg.role === "assistant" && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2 shrink-0 mt-1"
                  style={{ backgroundColor: chatbot.color }}
                >
              {chatbot.name[0].toUpperCase()}
            </div>
          )}

          {/* Message Bubble */}
          {editingMsg === i ? (
            <div className="max-w-[75%] w-full">
              <textarea
                value={editInput}
                onChange={(e) => setEditInput(e.target.value)}
                className="w-full bg-gray-800 border border-indigo-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                rows={3}
              />
              <div className="flex gap-2 mt-2 justify-end">
                <button
                  onClick={() => setEditingMsg(null)}
                  className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEditSend(i)}
                  className="text-xs text-white px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-sm"
                  : "bg-gray-800 text-gray-100 rounded-bl-sm"
              }`}
            >
              {msg.role === "user" ? (
                <p>{msg.content}</p>
              ) : (
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-base font-bold mb-2 text-white border-b border-gray-600 pb-1">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-sm font-bold mb-2 text-white mt-3">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-semibold mb-1 text-indigo-300 mt-2">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-outside ml-4 mb-2 space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-outside ml-4 mb-2 space-y-1">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-200 leading-relaxed">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-white">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-gray-300">{children}</em>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-900 text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-900 rounded-lg p-3 overflow-x-auto mb-2 text-xs font-mono border border-gray-700">{children}</pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-indigo-400 pl-3 text-gray-300 italic mb-2 bg-gray-900/50 py-1 rounded-r">{children}</blockquote>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons on Hover */}
        {hoveredMsg === i && editingMsg !== i && (
          <div className={`flex items-center gap-1 mt-1 ${msg.role === "user" ? "mr-2" : "ml-10"}`}>
            {/* Copy Button */}
            <div className="relative group/tooltip">
              <button
                onClick={() => handleCopy(msg.content, i)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition text-xs"
              >
                {copiedMsg === i ? "✅" : "📋"}
              </button>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap">
                {copiedMsg === i ? "Copied!" : "Copy"}
              </span>
            </div>

            {/* Retry Button — only for assistant */}
            {msg.role === "assistant" && (
              <div className="relative group/tooltip">
                <button
                  onClick={() => handleRetry(i)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition text-xs"
                >
                  🔄
                </button>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap">
                  Retry
                </span>
              </div>
            )}

            {/* Edit Button — only for user */}
            {msg.role === "user" && (
              <div className="relative group/tooltip">
                <button
                  onClick={() => handleEdit(i, msg.content)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition text-xs"
                >
                  ✏️
                </button>
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition whitespace-nowrap">
                  Edit
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex justify-start">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2 shrink-0"
                style={{ backgroundColor: chatbot.color }}
              >
                {chatbot.name[0].toUpperCase()}
              </div>
              <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-800 px-4 py-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl font-semibold text-white transition disabled:opacity-40"
              style={{ backgroundColor: chatbot.color }}
            >
              Send
            </button>
          </div>
          <p className="text-center text-xs text-gray-600 mt-2">
            Powered by <span className="text-indigo-400">Zova AI</span>
          </p>
        </div>
      </div>
    </div>
  );
}