import Link from 'next/link';
import "./globals.css";

export default function Home() {
    return (
        <main className="bg-black flex min-h-screen flex-col items-center justify-center">
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
        </main>
    );
}
