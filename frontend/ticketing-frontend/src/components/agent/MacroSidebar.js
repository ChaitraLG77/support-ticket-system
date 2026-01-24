"use client";

import { useState } from "react";

export default function MacroSidebar({ onMacroSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const macros = [
    {
      id: 1,
      title: "Welcome Message",
      category: "greetings",
      content: "Hello! Thank you for contacting our support team. My name is [Agent Name] and I'll be happy to assist you today. I can see you've reached out about [Issue Type]. Let me look into this for you right away.",
      tags: ["welcome", "greeting", "first response"],
      usage: 245
    },
    {
      id: 2,
      title: "Request More Information",
      category: "information",
      content: "Thank you for providing those details. To better assist you, could you please share:\n\n1. [Specific detail 1]\n2. [Specific detail 2]\n3. Any error messages you're seeing\n\nThis information will help me resolve your issue more quickly.",
      tags: ["information", "details", "clarification"],
      usage: 189
    },
    {
      id: 3,
      title: "Technical Troubleshooting Steps",
      category: "technical",
      content: "Let's try some troubleshooting steps:\n\n1. Clear your browser cache and cookies\n2. Try using a different browser (Chrome, Firefox, Safari)\n3. Check if you're using the latest version\n4. Disable browser extensions temporarily\n5. Try accessing from an incognito/private window\n\nPlease let me know which step you're on and what happens.",
      tags: ["troubleshooting", "technical", "browser"],
      usage: 156
    },
    {
      id: 4,
      title: "Escalation Notice",
      category: "escalation",
      content: "I understand this is important to you. Based on the complexity of your issue, I'm escalating this to our senior support team. They have additional tools and expertise to handle this type of situation.\n\nYou can expect a response within [Timeframe]. I'll continue to monitor your ticket to ensure it gets the attention it deserves.",
      tags: ["escalate", "senior", "complex"],
      usage: 98
    },
    {
      id: 5,
      title: "Resolution Confirmation",
      category: "closing",
      content: "Great! It sounds like we've resolved your issue. Here's a quick summary of what we accomplished:\n\n✅ [Resolution details]\n✅ [Additional fixes]\n\nIf you experience any further problems, please don't hesitate to reach out. We're here 24/7 to help.\n\nI'll be marking this ticket as resolved, but feel free to reopen it if needed.",
      tags: ["resolved", "fixed", "closing"],
      usage: 312
    },
    {
      id: 6,
      title: "Follow-up Request",
      category: "followup",
      content: "I've implemented the changes we discussed. Could you please:\n\n1. Test the functionality and confirm it's working as expected\n2. Let me know if you notice any other issues\n3. Provide feedback on your experience\n\nI'll keep this ticket open for the next 24 hours to ensure everything continues to work smoothly.",
      tags: ["followup", "test", "feedback"],
      usage: 167
    },
    {
      id: 7,
      title: "Apology for Delay",
      category: "apology",
      content: "I sincerely apologize for the delay in responding to your ticket. I understand your time is valuable, and this delay is not the standard of service we aim to provide.\n\nI'm giving your ticket immediate attention now and will work to resolve this as quickly as possible. Thank you for your patience.",
      tags: ["apology", "delay", "sorry"],
      usage: 73
    },
    {
      id: 8,
      title: "Password Reset Instructions",
      category: "technical",
      content: "To reset your password:\n\n1. Go to the login page\n2. Click \"Forgot Password\"\n3. Enter your email address\n4. Check your inbox for the reset link (check spam folder too)\n5. Click the link and create a new password\n\nIf you don't receive the email within 5 minutes, please let me know and I can send you a manual reset.",
      tags: ["password", "reset", "login"],
      usage: 234
    },
    {
      id: 9,
      title: "Billing Inquiry Response",
      category: "billing",
      content: "Thank you for your billing inquiry. I've reviewed your account and can see:\n\n• Current plan: [Plan Name]\n• Next billing date: [Date]\n• Last payment: [Amount] on [Date]\n\nRegarding your question about [Specific billing issue], here's what I found: [Answer].\n\nIs there anything else about your billing that I can clarify?",
      tags: ["billing", "payment", "account"],
      usage: 145
    },
    {
      id: 10,
      title: "Feature Request Acknowledgment",
      category: "feature",
      content: "Thank you for suggesting this feature! I love hearing ideas from our users about how we can improve.\n\nI've documented your request for:\n📝 [Feature description]\n\nOur product team reviews all feature requests monthly. I'll make sure your suggestion gets their attention. While I can't promise when or if this will be implemented, your feedback helps us prioritize our roadmap.",
      tags: ["feature", "request", "suggestion"],
      usage: 89
    }
  ];

  const categories = [
    { id: "all", label: "All Macros", icon: "📚" },
    { id: "greetings", label: "Greetings", icon: "👋" },
    { id: "technical", label: "Technical", icon: "🔧" },
    { id: "billing", label: "Billing", icon: "💳" },
    { id: "escalation", label: "Escalation", icon: "⬆️" },
    { id: "closing", label: "Closing", icon: "✅" },
    { id: "followup", label: "Follow-up", icon: "🔄" },
    { id: "apology", label: "Apology", icon: "🙏" },
    { id: "information", label: "Information", icon: "ℹ️" },
    { id: "feature", label: "Features", icon: "💡" }
  ];

  const filteredMacros = macros.filter(macro => {
    const matchesSearch = macro.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         macro.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         macro.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || macro.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleMacroClick = (macro) => {
    onMacroSelect(macro.content);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Replies</h3>
        
        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search macros..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Macros List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredMacros.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-sm">No macros found</p>
            <p className="text-xs mt-1">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMacros.map(macro => (
              <div
                key={macro.id}
                onClick={() => handleMacroClick(macro)}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-1 flex-1">
                    {macro.title}
                  </h4>
                  <span className="text-xs text-gray-500 ml-2">
                    {macro.usage} uses
                  </span>
                </div>

                {/* Content Preview */}
                <p className="text-xs text-gray-600 line-clamp-3 mb-2">
                  {macro.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {macro.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Create New Macro
        </button>
      </div>
    </div>
  );
}
