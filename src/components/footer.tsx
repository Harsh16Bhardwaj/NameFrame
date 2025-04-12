import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";

function Footer() {
  return (
    <footer className="mt-8 bottom-0  px-6 py-6 bg-gradient-to-r from-red-900 to-gray-700 text-white rounded-t-xl shadow-inner">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Branding & Love */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold tracking-wide">NameFrame</h3>
          <p className="text-sm mt-1">
            © {new Date().getFullYear()} NameFrame. All rights reserved.
          </p>
          <p className="text-sm mt-1 animate-pulse">Made with ❤️ by Team NF</p>
        </div>

        {/* Quick Links */}
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:underline hover:text-yellow-400">
            Home
          </Link>
          <Link href="/create" className="hover:underline hover:text-yellow-400">
            Create
          </Link>
          <Link href="/about" className="hover:underline hover:text-yellow-400">
            About
          </Link>
          <Link href="/contact" className="hover:underline hover:text-yellow-400">
            Contact
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-2xl">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transform hover:-translate-y-1 transition duration-300"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transform hover:-translate-y-1 transition duration-300"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transform hover:-translate-y-1 transition duration-300"
          >
            <FaInstagram />
          </a>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transform hover:-translate-y-1 transition duration-300"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
