"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function BackButton() {
    const router = useRouter()
    return (
        <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 text-lg rounded-md cursor-pointer">
            <ArrowLeft size={24} />
        </button>
    )
}
