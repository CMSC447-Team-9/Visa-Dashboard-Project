"use client"

import { useState } from "react"
import { Menu, ChevronLeft } from "lucide-react"

export default function Navigation() {
    const [isOpen, setOpen] = useState(true)

    return (
        <div className="flex min-h-screen">
            <div className={`flex flex-col bg-[#636466] text-white transition-all duration-300 ease-in-out ${isOpen ? "w-48" : "w-16"}`}>
                <div className="flex flex-row h-18 justify-between p-4">
                    <div className={`flex items-center transition-all duration-300 ${isOpen ? "opacity-100 w-32" : "opacity-0 w-0"}`}>
                        {isOpen && <span className="p-2 text-lg whitespace-nowrap">Menu</span>}
                    </div>
                    <button className="p-2 rounded hover:bg-[#c7c8ca]" onClick={() => setOpen(!isOpen)}>
                        {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button className="block w-full text-left hover:bg-[#c7c8ca] p-2 rounded">
                        Dashboard
                    </button>
                    <button className="block w-full text-left hover:bg-[#c7c8ca] p-2 rounded">
                        Settings
                    </button>
                    <button className="block w-full text-left hover:bg-[#c7c8ca] p-2 rounded">
                        Logout
                    </button>
                </nav>
            </div>
        </div>
    )
}