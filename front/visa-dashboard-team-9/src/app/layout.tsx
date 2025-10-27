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
            <body
                className={`w-100vh h-screen`}>
                    <Navigation/>
                {children}
            </body>
        </html>
    );
}
