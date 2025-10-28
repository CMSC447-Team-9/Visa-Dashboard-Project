"use client"

import { useRef, useState } from "react"

const cardClass1: string = "rounded-xl border border-[#A6A7A9] bg-[#B6B7B9] shadow-[0_0_10px_1px_rgba(0,0,0,0.1)]"
const cardClass2: string = "rounded-xl border border-[#A6A7A9] bg-[#B6B7B9] shadow-[0_0_10px_5px_rgba(0,0,0,0.15)]"
export default function Dashboard() {

    // The actual design of the page
    return (
        <div className="flex flex-col justify-end w-full h-full p-2 gap-4">
            <div className={`flex flex-row w-full h-2/8 items-center gap-2`}>
                <div className={`w-1/4 h-full ${cardClass1}`}></div>
                <div className={`w-1/4 h-full ${cardClass1}`}></div>
                <div className={`w-1/4 h-full ${cardClass1}`}></div>
                <div className={`w-1/4 h-full ${cardClass1}`}></div>
            </div>
            <div className={`flex flex-col w-full h-6/8 items-center justify-center gap-4 ${cardClass2}`}>
            </div>
        </div>
    )
}
