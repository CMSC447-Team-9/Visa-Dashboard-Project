"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload } from "lucide-react"
import { UPLOAD_PATH } from "./types/API_Paths"

export default function Home() {
    const fileIn = useRef<HTMLInputElement | null>(null)
    const [uploadStatus, updateStatus] = useState("Upload an Excel sheet (.xlsx or .xls)")
    const router = useRouter()

    // This opens the file upload when the div is clicked
    const handleClick = () => {
        fileIn.current?.click()
    }

    // This uploads a file when selected
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
            updateStatus("Invalid File: Not an Excel Sheet")
            return
        }

        // Send file to Server
        try {
            const formData = new FormData()
            formData.append("file", file)
            const res = await fetch(UPLOAD_PATH, {
                method: "POST",
                body: formData,
            })

            if (!res.ok) {
                updateStatus("Invalid File: Could not process")
                return
            }

            // Redirect to dashboard page
            router.push("/dashboard")
        } catch (err) {
            console.error("Error uploading file:", err)
        }
    }

    // The actual design of the page
    return (
        <div className="flex flex-col items-center w-full h-full p-4 gap-4 pt-12">
            <div className="mb-auto relative w-[50vw] h-[15vh]">
                <Image src="/umbc_logo.png" alt="UMBC Logo" className="object-contain" fill sizes="50vw" priority />
            </div>
            <div className="flex flex-1 items-center justify-center w-full">
                <div className="flex flex-col items-center gap-4 justify-center rounded-xl border border-[#A6A7A9] w-3/4 h-3/4 bg-[#B6B7B9]
                shadow-[0_0_10px_5px_rgba(0,0,0,0.15)] cursor-pointer" onClick={handleClick}>
                    <Upload className="w-12 h-12 text-gray-700" />
                    <span className="text-gray-700">{uploadStatus}</span>
                    <input type="file" ref={fileIn} onChange={handleFileChange} className="hidden" />
                </div>
            </div>
        </div>
    )
}
