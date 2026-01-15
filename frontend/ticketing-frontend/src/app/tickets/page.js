"use client";
import { useState } from "react";
import { apiRequest } from "@/lib/api";
import Link from "next/link";


export default function TicketsPage() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("create");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const createTicket = async () => {
    try {
      await apiRequest(
        "/tickets",
        "POST",
        { subject, description, priority },
        { username, password }
      );
      alert("Ticket created successfully");
      setSubject("");
      setDescription("");
    } catch {
      alert("Failed to create ticket");
    }
  };

  const loadTickets = async () => {
    try {
      const data = await apiRequest(
        "/tickets",
        "GET",
        null,
        { username, password }
      );
      setTickets(data);
    } catch {
      alert("Failed to load tickets");
    }
  };



  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">
            Track and manage your support requests
          </p>
        </div>

       <Link
         href="/tickets/new"
         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
       >
         + New Ticket
       </Link>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Open", color: "blue", value: tickets.filter(t => t.status === "OPEN").length },
          { label: "In Progress", color: "amber", value: tickets.filter(t => t.status === "IN_PROGRESS").length },
          { label: "Resolved", color: "green", value: tickets.filter(t => t.status === "RESOLVED").length },
          { label: "Closed", color: "gray", value: tickets.filter(t => t.status === "CLOSED").length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded shadow">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}-600`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded font-semibold ${
            activeTab === "list"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          My Tickets
        </button>

      </div>


      {/* Ticket List */}
      {activeTab === "list" && (
        <div className="space-y-4">
          {tickets.length === 0 && (
            <p className="text-gray-500">No tickets found</p>
          )}

          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white p-5 rounded shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">
                  {ticket.subject}
                </h3>

                <span className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700">
                  {ticket.status}
                </span>
              </div>

              <p className="text-gray-600 mb-2">
                {ticket.description}
              </p>

              <div className="text-sm text-gray-500">
                Priority: <b>{ticket.priority}</b>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );


}
