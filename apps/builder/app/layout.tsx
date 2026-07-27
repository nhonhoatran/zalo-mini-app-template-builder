import React from "react";
import "./globals.css";

export const metadata = {
  title: "Zalo Mini App Builder",
  description: "Trình kéo thả thiết kế Zalo Mini App và tự động sinh source code",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="h-screen w-screen overflow-hidden bg-slate-100 flex flex-col">
        {children}
      </body>
    </html>
  );
}
