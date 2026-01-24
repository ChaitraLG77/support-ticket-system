"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import MacroSidebar from "@/components/agent/MacroSidebar";

export default function CommandCenter() {
  const router = useRouter();
  
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("unassigned");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadTickets();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadTickets, 30000);
    return () => clearInterval(interval);
  }, [activeView]);

  const loadTickets = async () => {
    try {
      const endpoint = activeView === "unassigned" 
        ? "/tickets/unassigned" 
        : activeView === "overdue"
        ? "/tickets/overdue"
        : activeView === "recent"
        ? "/tickets/recent"
        : "/tickets";
      
      const data = await apiRequest(endpoint, "GET");
      setTickets(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading tickets:", error);
      setLoading(false);
    }
  };

  const getSLABadge = (ticket) => {
    const now = new Date();
    const lastUpdate = new Date(ticket.lastUpdated);
    const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60);
    
    if (hoursSinceUpdate > 24) {
      return { color: "red", text: "Overdue", icon: "⚠️" };
    } else if (hoursSinceUpdate > 8) {
      return { color: "orange", text: "Due Soon", icon: "⏰" };
    } else if (hoursSinceUpdate > 2) {
      return { color: "yellow", text: "Response Due", icon: "🕐" };
    }
    return null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-amber-100 text-amber-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "LOW":
        return "text-gray-600 bg-gray-100";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-100";
      case "HIGH":
        return "text-orange-600 bg-orange-100";
      case "URGENT":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return "Just now";
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarViews = [
    { id: "unassigned", label: "Unassigned", icon: "📋", count: tickets.filter(t => t.status === "OPEN" && !t.assignedTo).length },
    { id: "my-tickets", label: "My Tickets", icon: "👤", count: tickets.filter(t => t.assignedTo === "current-agent").length },
    { id: "overdue", label: "Overdue", icon: "⚠️", count: tickets.filter(t => getSLABadge(t)?.color === "red").length },
    { id: "recent", label: "Recently Updated", icon: "🕐", count: tickets.filter(t => {
        const hours = (new Date() - new Date(t.lastUpdated)) / (1000 * 60 * 60);
        return hours < 24;
      }).length },
    { id: "all", label: "All Tickets", icon: "📊", count: tickets.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 text-2xl font-bold border-b border-slate-700">
          Command Center
          <div className="text-sm text-slate-400">Agent Dashboard</div>
        </div>

        {/* Views */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Views
          </div>
          {sidebarViews.map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${
                activeView === view.id
                  ? "bg-slate-800 text-white"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3">{view.icon}</span>
                <span>{view.label}</span>
              </div>
              {view.count > 0 && (
                <span className="bg-slate-700 text-white text-xs px-2 py-1 rounded-full">
                  {view.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm font-semibold">JD</span>
            </div>
            <div>
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-slate-400">Support Agent</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Ticket Feed */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              {sidebarViews.find(v => v.id === activeView)?.label}
            </h2>
            
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tickets..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Ticket List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading tickets...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-4 text-center text-gray-600">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No tickets found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredTickets.map(ticket => {
                  const slaBadge = getSLABadge(ticket);
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedTicket?.id === ticket.id ? "bg-blue-50 border-l-4 border-blue-600" : ""
                      }`}
                    >
                      {/* SLA Badge */}
                      {slaBadge && (
                        <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-${slaBadge.color}-100 text-${slaBadge.color}-800 mb-2`}>
                          <span className="mr-1">{slaBadge.icon}</span>
                          {slaBadge.text}
                        </div>
                      )}

                      {/* Ticket Info */}
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1 mr-2">
                          {ticket.subject}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                        {ticket.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace("_", " ")}
                          </span>
                          <span>#{ticket.id}</span>
                        </div>
                        <span>{formatTimeAgo(ticket.lastUpdated)}</span>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center mt-2 text-xs text-gray-600">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                          <span className="text-xs font-medium">
                            {ticket.customerName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span>{ticket.customerName}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col">
          {selectedTicket ? (
            <AgentWorkspace 
              ticket={selectedTicket} 
              onTicketUpdate={loadTickets}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-lg font-medium">Select a ticket to view details</p>
                <p className="text-sm mt-2">Choose a ticket from the list to start working</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Agent Workspace Component
function AgentWorkspace({ ticket, onTicketUpdate }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [customerHistory, setCustomerHistory] = useState([]);
  const [showMacros, setShowMacros] = useState(false);

  useEffect(() => {
    loadMessages();
    loadCustomerHistory();
  }, [ticket.id]);

  const loadMessages = async () => {
    try {
      const data = await apiRequest(`/tickets/${ticket.id}/messages`, "GET");
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading messages:", error);
      setLoading(false);
    }
  };

  const loadCustomerHistory = async () => {
    try {
      const data = await apiRequest(`/customers/${ticket.customerId}/history`, "GET");
      setCustomerHistory(data);
    } catch (error) {
      console.error("Error loading customer history:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    try {
      const message = await apiRequest(`/tickets/${ticket.id}/messages`, "POST", {
        content: newMessage,
        type: isInternalNote ? "INTERNAL_NOTE" : "RESPONSE"
      });

      setMessages(prev => [...prev, message]);
      setNewMessage("");
      onTicketUpdate();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleMacroSelect = (macroContent) => {
    setNewMessage(prev => prev + (prev ? "\n\n" : "") + macroContent);
    setShowMacros(false);
  };

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="flex-1 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Ticket Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                {ticket.subject}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>#{ticket.id}</span>
                <span>•</span>
                <span>{ticket.customerName}</span>
                <span>•</span>
                <span>{ticket.customerEmail}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={ticket.status}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.senderType === "AGENT" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-lg px-4 py-3 rounded-lg ${
                    message.senderType === "AGENT"
                      ? "bg-blue-600 text-white"
                      : message.type === "INTERNAL_NOTE"
                      ? "bg-yellow-100 text-yellow-900 border border-yellow-300"
                      : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  {message.type === "INTERNAL_NOTE" && (
                    <div className="flex items-center mb-2 text-xs font-medium">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Internal Note
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-2 ${message.senderType === "AGENT" ? "text-blue-100" : "text-gray-500"}`}>
                    {message.senderName} • {formatTimestamp(message.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={sendMessage} className="max-w-3xl mx-auto">
            {/* Internal Note Toggle */}
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInternalNote}
                  onChange={(e) => setIsInternalNote(e.target.checked)}
                  className="mr-2"
                />
                <span className={`text-sm font-medium ${isInternalNote ? "text-yellow-600" : "text-gray-700"}`}>
                  📝 Internal Note {isInternalNote && "(Visible only to agents)"}
                </span>
              </label>
              
              <button
                type="button"
                onClick={() => setShowMacros(!showMacros)}
                className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg font-medium"
              >
                🎭 Quick Replies
              </button>
            </div>

            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={isInternalNote ? "Add an internal note..." : "Type your response..."}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={sendingMessage}
                />
              </div>
              <button
                type="submit"
                disabled={!newMessage.trim() || sendingMessage}
                className={`px-6 py-3 rounded-lg font-medium disabled:cursor-not-allowed ${
                  isInternalNote
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white disabled:bg-gray-300"
                    : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
                }`}
              >
                {sendingMessage ? "Sending..." : isInternalNote ? "Add Note" : "Send Reply"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Macro Sidebar */}
      {showMacros && (
        <div className="w-80 border-l border-gray-200">
          <MacroSidebar onMacroSelect={handleMacroSelect} />
        </div>
      )}

      {/* Customer History Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Customer Context</h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 text-gray-900">{ticket.customerName}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 text-gray-900">{ticket.customerEmail}</span>
              </div>
            </div>
          </div>

          {/* Previous Tickets */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Previous Interactions</h4>
            <div className="space-y-3">
              {customerHistory.length === 0 ? (
                <p className="text-sm text-gray-600">No previous interactions</p>
              ) : (
                customerHistory.map(history => (
                  <div key={history.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        #{history.id}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(history.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {history.subject}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mt-2 ${
                      history.status === "RESOLVED" 
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {history.status.replace("_", " ")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                📧 Send Email Follow-up
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                ✅ Mark as Resolved
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
                🔄 Escalate to Senior Agent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
