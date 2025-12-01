"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { LucideIcon, Menu, ChevronLeft, LogOut, Home, FileText } from "lucide-react"
import { LOGOUT_PATH } from "@/types/API_Paths"


// Type Definition for NavBar Buttons
type NavButton = {
    name: string
    href: string
    icon: LucideIcon
};

// Groups of buttons for specific pages
const groups: Record<string, NavButton[]> = {
    reports: [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Reports", href: "/reports", icon: FileText },
    ],
    dashboard: [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Reports", href: "/reports", icon: FileText },
    ]
}

// Classes for buttons
const buttonClass: string = "flex w-full h-10 items-center hover:bg-[#c7c8ca] rounded transition-all duration-300"

export default function Navigation() {
    const [isOpen, setOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    // Select group based off path
    let activeGroup: NavButton[] = []
    if (pathname.startsWith("/dashboard")) activeGroup = groups.dashboard
    if (pathname.startsWith("/reports")) activeGroup = groups.reports


    // Logout and clear cookies
    const handleLogout = async () => {
        setOpen(false)
        try {
            const res = await fetch(LOGOUT_PATH, { method: "POST" });
            if (res.ok) {
                router.push("/")
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="flex min-h-screen">
            <div className={`flex flex-col bg-[#636466] text-white transition-all duration-300 ease-in-out ${isOpen ? "w-48" : "w-16"}`}>
                <nav className="flex flex-col h-full p-4 gap-4 items-center">

                    {/* Menu Header */}
                    <button className={buttonClass} onClick={() => setOpen(!isOpen)}>
                        <div className={`flex-shrink-0 flex items-center transition-all duration-300 ${isOpen ? "justify-start w-10 pl-2" : "justify-center w-full"}`}>
                            {isOpen ? <ChevronLeft /> : <Menu />}
                        </div>
                        <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isOpen ? "opacity-100 w-auto ml-2" : "opacity-0 w-0"}`}>
                            Menu
                        </span>
                    </button>

                    {/* Active Buttons */}
                    {activeGroup.map((btn) => {
                        const Icon = btn.icon
                        return (
                            <Link className={buttonClass} key={btn.name} href={btn.href}>
                                <div className={`flex-shrink-0 flex items-center transition-all duration-300 ${isOpen ? "justify-start w-10 pl-2" : "justify-center w-full"}`}>
                                    <Icon />
                                </div>
                                <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isOpen ? "opacity-100 w-auto ml-2" : "opacity-0 w-0"}`}>
                                    {btn.name}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Exit Button */}
                    <button className={`mt-auto ${buttonClass}`} onClick={handleLogout}>
                        <div className={`flex-shrink-0 flex items-center transition-all duration-300 ${isOpen ? "justify-start w-10 pl-2" : "justify-center w-full"}`}>
                            <LogOut />
                        </div>
                        <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isOpen ? "opacity-100 w-auto ml-2" : "opacity-0 w-0"}`}>
                            Logout
                        </span>
                    </button>
                </nav>
            </div>
        </div>
    )
}