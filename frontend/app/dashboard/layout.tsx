"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setEmail(user.email || "");
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "🤖 Chatbots" },
    { href: "/dashboard/analytics", label: "📊 Analytics" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top Navbar */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between shrink-0">
        <Link href="/dashboard">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold">Z</div>
            <h1 className="text-xl font-bold">Zova <span className="text-indigo-400">AI</span></h1>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block w-56 border-r border-gray-800 p-4 space-y-1 shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2.5 rounded-lg text-sm transition ${
                pathname === link.href
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-4 border-t border-gray-800 mt-4">
            <Link
              href="/dashboard/chatbots/create"
              className="block px-4 py-2.5 rounded-lg text-sm bg-indigo-600 hover:bg-indigo-700 text-white text-center transition"
            >
              + New Chatbot
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}