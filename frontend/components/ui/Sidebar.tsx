"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "🤖 Chatbots" },
    { href: "/dashboard/analytics", label: "📊 Analytics" },
  ];

  return (
    <div className="w-56 border-r border-gray-800 min-h-screen p-4 space-y-1">
      {links.map((link) => (
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
    </div>
  );
}