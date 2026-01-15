import "./globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <div className="flex min-h-screen">

          {/* Sidebar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}

