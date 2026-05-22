"use client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar({ email }: { email: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link href="/dashboard">
        <h1 className="text-xl font-bold text-indigo-400">🤖 ChatSaaS</h1>
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
  );
}