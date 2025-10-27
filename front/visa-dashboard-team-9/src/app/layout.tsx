import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
    title: "UMBC Visa Dashboard",
    icons: [
        { url: "/umbc_shield.png", type: "image/png", sizes: "32x32" },
    ]
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`flex flex-row h-screen`}>
                <Navigation />
                <main className="flex-1 p-4">
                    {children}
                </main>
            </body>
        </html>
    );
}
