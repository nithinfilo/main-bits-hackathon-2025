"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ButtonSignin from "./ButtonSignin";
import config from "@/config";

const links = [
  { href: "/#pricing", label: "Pricing" },
  { href: "/#features", label: "Features" },
  { href: "/#faq", label: "FAQ" },
];

const Header = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <nav className="container flex items-center justify-between px-8 py-6 mx-auto" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link 
            className="flex items-center gap-2 shrink-0 relative" 
            href="/" 
            title={`${config.appName} homepage`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div 
              className={`absolute inset-0 rounded-full bg-primary transition-all duration-300 ease-in-out ${
                isHovered ? 'opacity-40 scale-110' : 'opacity-20 scale-100'
              }`}
              style={{
                filter: 'blur(8px)',
              }}
            />
          </Link>
        </div>

        <div className="hidden lg:flex lg:justify-center lg:gap-12 lg:items-center font-bold">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="link link-hover text-white text-lg transition-colors duration-200 hover:text-purple-300"
              title={link.label}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:justify-end lg:flex-1">
          <ButtonSignin extraStyle="btn-primary" />
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`relative z-50 ${isOpen ? "" : "hidden"}`}>
        <div className="fixed inset-y-0 right-0 z-10 w-full px-8 py-4 overflow-y-auto bg-purple-950 sm:max-w-sm sm:ring-1 sm:ring-white/10 transform origin-right transition ease-in-out duration-300">
          <div className="flex items-center justify-between">
            <Link
              className="flex items-center gap-2 shrink-0"
              title={`${config.appName} homepage`}
              href="/"
            >
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                className="w-8"
                placeholder="blur"
                priority={true}
                width={32}
                height={32}
              />
              <span className="font-extrabold text-lg text-white">{config.appName}</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-white"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flow-root mt-6">
            <div className="py-4">
              <div className="flex flex-col gap-y-4 items-start">
                {links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    className="text-white text-lg hover:text-purple-300 transition-colors duration-200"
                    title={link.label}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <ButtonSignin extraStyle="btn-primary w-full" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;