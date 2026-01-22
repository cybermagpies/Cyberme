import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-green-500 flex flex-col items-center justify-center p-4 font-mono">
      <h1 className="text-6xl font-bold mb-8 glitch-effect">CYBERME</h1>
      <p className="text-xl mb-12">Personal Knowledge Hub. System Online.</p>

      <div className="flex gap-6">
        <Link href="/auth?mode=register">
          <button className="px-8 py-3 border border-green-500 hover:bg-green-500 hover:text-black transition uppercase">
            Initialize (Get Started)
          </button>
        </Link>

        <Link href="/auth?mode=login">
          <button className="px-8 py-3 bg-green-900 text-white border border-transparent hover:border-green-500 transition uppercase">
            Access (Sign In)
          </button>
        </Link>
      </div>
    </main>
  );
}
