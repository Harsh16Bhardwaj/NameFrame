  import React from "react";
  import { Github, Linkedin, Twitter } from "lucide-react";
  import Image from "next/image";
  const Footer = () => {
    return (
      <footer className="w-full bg-[#141414] text-[#D3D3D3] py-10 px-6 sm:px-12 rounded-t-xl shadow-inner border-t-2 border-gray-700">
        <div className="container mx-auto max-w-7xl">
          {/* Main content grid for columns */}
          <div className="flex justify-between flex-wrap ">
            {/* Brand Column - takes up more space */}
            <div className="flex flex-col items-center md:items-start md:col-span-2">
              {/* Logo and branding */}
              <Image
                src="/title.png"
                alt="NameFrame Logo"
                width={340}
                height={80}
                className="object-contain"
              />
              <p className="text-md mt-3 max-w-[350px] leading-relaxed text-[#A9A9A9]">
                Made with <span style={{ color: "#C83E4D" }}>❤️</span> to
                celebrate your events.
              </p>
            </div>

            <div className="flex">
              {/* Links Column - 2nd and 3rd columns */}
              <div className="flex flex-col  md:flex-row gap-12 text-gray-400  justify-center">
                {/* Quick Links Column */}
                <div className="flex w-32 flex-col ">
                  <h4 className="font-semibold text-left text-xl text-[#e1e1e1] mb-1">
                    Miscellaneous
                  </h4>
                  <ul>
                    <li>
                      <a
                        href="#"
                        className="hover:text-[#4eb3a3] transition-colors duration-200"
                      >
                        See in Action
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-[#4eb3a3] transition-colors duration-200"
                      >
                        Pricing
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="flex w-auto flex-col ">
                  <h4 className="font-semibold text-left text-xl text-[#e1e1e1] mb-1">
                    Services
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href="#"
                        className="hover:text-[#4eb3a3] transition-colors duration-200"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-[#4eb3a3] transition-colors duration-200"
                      >
                        Create Event
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-[#4eb3a3] transition-colors duration-200"
                      >
                        Check a Certificate
                      </a>
                    </li>
                  </ul>
                </div>
                
                {/* Company/Info Links Column */}
                <div className="flex w-40 flex-col">
                  <h4 className="font-semibold text-lg text-[#FFFFFF] mb-2">
                    Company
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a
                        href="#"
                        className="hover:text-[#4eb3a3] transition-colors duration-200"
                      >
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-[#4eb3a3] transition-colors duration-200"
                      >
                        FAQs
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-[#4eb3a3] transition-colors duration-200"
                      >
                        Contact Team
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Social Media Column */}
              <div className="flex flex-col items-center ">
                <h4 className="font-semibold text-center text-lg text-[#FFFFFF] mb-4">
                  Follow Us
                </h4>
                <div className="flex gap-4 text-2xl">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A9A9A9] hover:text-[#4eb3a3] hover:scale-125 transition-transform duration-300"
                    aria-label="Twitter"
                  >
                    <Twitter size={24} />
                  </a>
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A9A9A9] hover:text-[#4eb3a3] hover:scale-125 transition-transform duration-300"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A9A9A9] hover:text-[#4eb3a3] hover:scale-125 transition-transform duration-300"
                    aria-label="GitHub"
                  >
                    <Github size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar with fun lines */}
          <div className="mt-8 pt-6 border-t border-[#2A2A2A] text-center text-sm">
            <p className="flex items-center justify-center gap-2 mb-1 text-[#A9A9A9]">
              Powered with AI insights. Celebrating moments, one certificate at a
              time.
            </p>
            <p className="text-gray-500">
              © {new Date().getFullYear()} NameFrame. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  };

  export default Footer;
