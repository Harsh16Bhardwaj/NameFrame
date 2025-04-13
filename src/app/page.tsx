import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#c31432] to-[#240b36] text-white flex flex-col items-center">
      {/* Hero Section */}
      <header className="w-full text-center py-16 px-8">
        <h1 className="text-4xl sm:text-6xl font-bold animate-glowText">
          Welcome to NameFrame
        </h1>
        <p className="mt-4 text-lg sm:text-xl font-light animate-floatText">
          Create, manage, and share personalized certificates effortlessly.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <SignedOut>
            <Link href="/signup">
              <button className="bg-gradient-to-r from-[#dca200] to-[#F37335] hover:from-red-500 hover:to-red-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
                Sign Up to Get Started
              </button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className="bg-gray-200 text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300">
                Explore Dashboard
              </button>
            </Link>
          </SignedIn>
        </div>
      </header>

      {/* Features Section */}
      <main className="w-full px-8 py-16 bg-gray-100 text-black rounded-t-3xl shadow-inner">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Choose NameFrame?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/feature1.svg"
              alt="Feature 1"
              width={80}
              height={80}
              className="mb-4"
            />
            <h3 className="text-xl font-semibold">Easy Certificate Creation</h3>
            <p className="mt-2 text-sm">
              Design and customize certificates with ease using our intuitive
              tools.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Image
              src="/feature2.svg"
              alt="Feature 2"
              width={80}
              height={80}
              className="mb-4"
            />
            <h3 className="text-xl font-semibold">Seamless Management</h3>
            <p className="mt-2 text-sm">
              Organize and manage your events and certificates in one place.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Image
              src="/feature3.svg"
              alt="Feature 3"
              width={80}
              height={80}
              className="mb-4"
            />
            <h3 className="text-xl font-semibold">Share Instantly</h3>
            <p className="mt-2 text-sm">
              Share certificates with participants instantly via email or
              download.
            </p>
          </div>
        </div>
      </main>

      {/* Call-to-Action Section */}
      <section className="w-full py-16 px-8 bg-gradient-to-r from-[#240b36] to-[#c31432] text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg font-light mb-8">
          Join thousands of users who trust NameFrame for their certificate
          needs.
        </p>
        <Link href="/signup">
          <button className="bg-gradient-to-r from-[#dca200] to-[#F37335] hover:from-red-500 hover:to-red-500 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
            Sign Up Now
          </button>
        </Link>
      </section>
    </div>
  );
}
