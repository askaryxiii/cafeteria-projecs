import React from "react";
import Logo from "../components/ui/logos/Logo";


const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left side - Retro TV */}
          <div className="flex justify-center">
            <Logo src={"/assets/logo/logo.webp"} alt="art" width="300" />
          </div>

          {/* Right side - Content */}
          <div className="flex flex-col gap-4 md:gap-6 justify-center">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold text-[#032552] tracking-tight">
                Oops!
              </h1>
              <p className="text-lg md:text-xl text-[#032552] leading-relaxed">
                We couldn't find the page you were looking for
              </p>
            </div>

            <div className="pt-2">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#032552]  text-white rounded-full font-medium hover:bg-gray-800 transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Go home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
