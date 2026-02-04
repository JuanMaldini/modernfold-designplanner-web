import Link from 'next/link';
import "./globals.css";

export default function Home() {
    return (
        <main className="bg-black gap-2 flex flex-col min-h-screen items-center justify-center">

            <div>
                <Link href="/E3DS">
                    <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                        Start app
                    </button>
                </Link>

                <Link href="/send-email">
                    <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                        Send email
                    </button>
                </Link>
            </div>

            <div>

            <Link href="/partition-operable">
                <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                    Operable Partition
                </button>
            </Link>
            <Link href="/partition-glass">
                <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                    Glass Partition
                </button>
            </Link>
            <Link href="/partition-acousti-clear">
                <button disabled className="rounded bg-blue-500 px-4 py-2 font-bold text-white saturate-0">
                    Acousti-Clear Partition
                </button>
            </Link>
            <Link href="/partition-accordion">
                <button disabled className="rounded bg-blue-500 px-4 py-2 font-bold text-white saturate-0">
                    Accordion Partition
                </button>
            </Link>
            </div>

        </main>
    );
}
