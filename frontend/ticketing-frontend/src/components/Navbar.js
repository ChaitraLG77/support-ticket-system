"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Navbar() {
  const router = useRouter();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">

      {/* Logo */}
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        TicketDesk
        <div className="text-sm text-slate-400">Support System</div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => router.push("/tickets")}
          className="w-full text-left px-4 py-2 rounded hover:bg-slate-800"
        >
          Dashboard
        </button>

        <button
          onClick={() => router.push("/tickets")}
          className="w-full text-left px-4 py-2 rounded hover:bg-slate-800"
        >
          My Tickets
        </button>

       <Link
         href="/tickets/new"
         className="flex items-center gap-2 px-4 py-2 rounded hover:bg-slate-700 text-white"
       >
         + New Ticket
       </Link>

      </nav>

      {/* User */}
      <div className="p-4 border-t border-slate-700 text-sm text-slate-400">
        John Doe<br />
        <span className="text-xs">User</span>
      </div>

    </aside>
  );
}
