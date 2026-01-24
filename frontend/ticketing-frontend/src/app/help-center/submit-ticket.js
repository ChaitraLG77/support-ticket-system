"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function SubmitTicket() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    subject: searchParams?.get("subject") || "",
    description: "",
    priority: "MEDIUM",
    category: "GENERAL"
  });

  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.description.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("subject", formData.subject);
      submitData.append("description", formData.description);
      submitData.append("priority", formData.priority);
      submitData.append("category", formData.category);

      // Add files
      files.forEach((file, index) => {
        submitData.append(`file_${index}`, file);
      });

      // Submit ticket
      const response = await fetch("http://localhost:8080/tickets", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: submitData
      });

      if (response.ok) {
        alert("Ticket submitted successfully!");
        router.push("/help-center/activity");
      } else {
        throw new Error("Failed to submit ticket");
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      alert("Failed to submit ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Submit a Support Request
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Tell us about your issue
            </h2>
            <p className="text-gray-600 mt-2">
              Please provide as much detail as possible so we can help you better.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief summary of your issue"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="GENERAL">General Inquiry</option>
                <option value="TECHNICAL">Technical Issue</option>
                <option value="BILLING">Billing Question</option>
                <option value="FEATURE">Feature Request</option>
                <option value="BUG">Bug Report</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: "LOW", label: "Low", color: "gray" },
                  { value: "MEDIUM", label: "Medium", color: "yellow" },
                  { value: "HIGH", label: "High", color: "orange" },
                  { value: "URGENT", label: "Urgent", color: "red" }
                ].map(priority => (
                  <label
                    key={priority.value}
                    className={`
                      relative flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-colors
                      ${formData.priority === priority.value 
                        ? `border-${priority.color}-500 bg-${priority.color}-50 text-${priority.color}-700` 
                        : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={priority.value}
                      checked={formData.priority === priority.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      className="sr-only"
                    />
                    <span className="font-medium">{priority.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you expected to happen."
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              
              {/* Drag & Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                
                <p className="text-gray-600 mb-2">
                  {isDragging ? "Drop files here" : "Drag and drop files here, or click to browse"}
                </p>
                <p className="text-sm text-gray-500">
                  Supports: Images, PDFs, Documents (Max 10MB per file)
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-400 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
