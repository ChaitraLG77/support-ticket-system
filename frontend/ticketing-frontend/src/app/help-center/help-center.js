"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HelpCenter() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // For now, redirect to ticket creation with search query as subject
      router.push(`/help-center/submit?subject=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                TicketDesk
              </Link>
              <span className="ml-2 text-sm text-gray-500">Help Center</span>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <Link
                href="/help-center/submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Submit a Request
              </Link>
              
              {isAuthenticated ? (
                <Link
                  href="/help-center/activity"
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300"
                >
                  My Activity
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Search our knowledge base or submit a support ticket
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe your issue or search for help..."
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Quick Actions
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Submit Ticket Card */}
            <Link
              href="/help-center/submit"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Submit a Ticket
              </h3>
              <p className="text-gray-600">
                Can't find what you're looking for? Create a support ticket and our team will help you.
              </p>
            </Link>

            {/* Track Activity Card */}
            <Link
              href={isAuthenticated ? "/help-center/activity" : "/login"}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Track Your Activity
              </h3>
              <p className="text-gray-600">
                View the status of your support tickets and track your interaction history.
              </p>
            </Link>

            {/* Browse FAQ Card */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Browse FAQ
              </h3>
              <p className="text-gray-600">
                Find quick answers to commonly asked questions in our knowledge base.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Updates */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Recent System Updates
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-900">System Maintenance Complete</h3>
              <p className="text-sm text-gray-600 mt-1">All systems are now operational following scheduled maintenance.</p>
              <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-900">New Feature Released</h3>
              <p className="text-sm text-gray-600 mt-1">You can now attach multiple files to your support tickets.</p>
              <p className="text-xs text-gray-500 mt-2">1 day ago</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
