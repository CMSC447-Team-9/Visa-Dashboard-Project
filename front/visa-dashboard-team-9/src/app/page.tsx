import Image from "next/image"

export default function Home() {
    return (
        <div className="flex flex-col items-center w-full h-full p-4">
            <Image src="/umbc_logo.png" alt="UMBC Logo" width={600} height={300} />
            <div>
            </div>
        </div>
    )
}
