"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { LucideIcon, Menu, ChevronLeft, LogOut, Home, FileText } from "lucide-react"


// Type Definition for NavBar Buttons
type NavButton = {
    name: string
    href: string
    icon: LucideIcon
};

// Groups of buttons for specific pages
const groups: Record<string, NavButton[]> = {
    dashboard: [
        { name: "Home", href: "/dashboard/home", icon: Home },
        { name: "Reports", href: "/dashboard/reports", icon: FileText },
    ]
}

// Classes for buttons
const buttonClass: string = "flex flex-row w-full h-10 pl-1 gap-4 items-center hover:bg-[#c7c8ca] rounded transition-all duration-300"

export default function Navigation() {
    const [isOpen, setOpen] = useState(true)
    const pathname = usePathname()

    // Select group based off path
    let activeGroup: NavButton[] = []
    if (pathname.startsWith("/dashboard")) activeGroup = groups.dashboard

    return (
        <div className="flex min-h-screen">
            <div className={`flex flex-col bg-[#636466] text-white transition-all duration-100 ease-in-out ${isOpen ? "w-48" : "w-16"}`}>
                <nav className="flex flex-col h-full p-4 gap-4 items-center">

                    {/* Menu Header */}
                    <button className={buttonClass} onClick={() => setOpen(!isOpen)}>
                        {isOpen ? <ChevronLeft className="flex-shrink-0" /> : <Menu className="flex-shrink-0" />}
                        {isOpen && <span>Menu</span>}
                    </button>

                    {/* Active Buttons */}
                    {activeGroup.map((btn) => {
                        const Icon = btn.icon
                        return (
                            <Link className={buttonClass} key={btn.name} href={btn.href}>
                                <Icon className="flex-shrink-0 w-5 h-5" />
                                {isOpen && <span>{btn.name}</span>}
                            </Link>
                        );
                    })}

                    {/* Exit Button */}
                    <button className={`mt-auto ${buttonClass}`}>
                        <LogOut className="flex-shrink-0 scale-x-[-1]" />
                        {isOpen && <span>Exit</span>}
                    </button>
                </nav>
            </div>
        </div>
    )
}