"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import Link from "next/link";

export default function TicketDetail({ params }) {
  const router = useRouter();
  const ticketId = params?.id;
  const messagesEndRef = useRef(null);
  
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (ticketId) {
      loadTicket();
      loadMessages();
    }
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadTicket = async () => {
    try {
      const data = await apiRequest(`/tickets/${ticketId}`, "GET");
      setTicket(data);
    } catch (error) {
      console.error("Error loading ticket:", error);
      if (error.message.includes("404")) {
        router.push("/help-center/activity");
      }
    }
  };

  const loadMessages = async () => {
    try {
      const data = await apiRequest(`/tickets/${ticketId}/messages`, "GET");
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading messages:", error);
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    try {
      const message = await apiRequest(`/tickets/${ticketId}/messages`, "POST", {
        content: newMessage,
        type: "CUSTOMER"
      });

      setMessages(prev => [...prev, message]);
      setNewMessage("");
      
      // Update ticket last updated time
      loadTicket();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
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
        return "text-gray-600";
      case "MEDIUM":
        return "text-yellow-600";
      case "HIGH":
        return "text-orange-600";
      case "URGENT":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ticket not found</h2>
          <Link
            href="/help-center/activity"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to My Activity
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/help-center/activity" className="mr-4 text-gray-500 hover:text-gray-700">
                ← Back to Activity
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 truncate max-w-md">
                {ticket.subject}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace("_", " ")}
              </span>
              <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Ticket Info Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div>
                <span className="font-medium">Ticket ID:</span> #{ticket.id}
              </div>
              <div>
                <span className="font-medium">Created:</span> {formatTimestamp(ticket.createdAt)}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span> {formatTimestamp(ticket.lastUpdated)}
              </div>
            </div>
            {ticket.status === "RESOLVED" && (
              <button
                onClick={() => {
                  // Reopen ticket logic
                  apiRequest(`/tickets/${ticketId}/reopen`, "POST");
                  loadTicket();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Reopen Ticket
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-280px)] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-600">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderType === "CUSTOMER" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-lg px-4 py-3 rounded-lg ${
                      message.senderType === "CUSTOMER"
                        ? "bg-blue-600 text-white"
                        : message.type === "INTERNAL_NOTE"
                        ? "bg-yellow-100 text-yellow-900 border border-yellow-300"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {message.type === "INTERNAL_NOTE" && (
                      <div className="flex items-center mb-2 text-xs font-medium">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Internal Note (Not visible to customer)
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-2 ${message.senderType === "CUSTOMER" ? "text-blue-100" : "text-gray-500"}`}>
                      {message.senderName} • {formatTimestamp(message.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {ticket.status !== "CLOSED" && (
            <form onSubmit={sendMessage} className="border-t border-gray-200 p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={sendingMessage}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sendingMessage}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium disabled:cursor-not-allowed"
                >
                  {sendingMessage ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          )}
          
          {ticket.status === "CLOSED" && (
            <div className="border-t border-gray-200 p-4 text-center">
              <p className="text-gray-600">This ticket is closed. No further messages can be sent.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
