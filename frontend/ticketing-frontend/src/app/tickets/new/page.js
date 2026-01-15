"use client";
import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewTicketPage() {
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const createTicket = async () => {
    try {
      await apiRequest(
        "/tickets",
        "POST",
        { subject, description, priority },
        { username, password }
      );
      alert("Ticket created successfully");
      router.push("/tickets");
    } catch {
      alert("Failed to create ticket");
    }
  };

  return (
    <div className="flex justify-center py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-2">Create New Ticket</h1>
        <p className="text-gray-500 mb-6">
          Describe your issue and we’ll get back to you as soon as possible.
        </p>

        {/* Auth (temporary, backend-based auth) */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            className="border p-3 rounded"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Ticket Form */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Subject</label>
          <input
            className="border p-3 w-full rounded"
            placeholder="Brief summary of your issue"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Priority</label>
          <select
            className="border p-3 w-full rounded"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium - Issue affecting work</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="border p-3 w-full rounded min-h-[120px]"
            placeholder="Provide detailed information about your issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-5 py-2 border rounded"
            onClick={() => router.push("/tickets")}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
            onClick={createTicket}
          >
            Create Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
