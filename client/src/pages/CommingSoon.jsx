import React from "react";
import { Rocket, Sparkles, MailCheck } from "lucide-react";

const ComingSoon = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-br from-amber-100 to-amber-200 text-center px-6 overflow-hidden">
      {/* Background Sparkle Flair */}
      <Sparkles className="absolute top-10 left-10 text-purple-300 opacity-30 animate-ping" size={64} />
      <Sparkles className="absolute top-5 left-20 text-purple-300 opacity-50 animate-ping" size={64} />
      <Sparkles className="absolute bottom-16 right-10 text-amber-800 opacity-20 animate-spin-slow" size={48} />
      <Sparkles className=" text-yellow-500 opacity animate-pluse mb-4" size={64} />

      {/* Rocket Icon */}

      {/* Headline */}
      <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-800 drop-shadow-sm">
        Launching Soon
      </h1>

      {/* Subheading */}
      <p className="text-lg sm:text-xl text-gray-700 mt-4 max-w-xl">
        We’re almost ready to take off. Get ready for something amazing!
      </p>

      {/* Email Notification Form */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full max-w-md">
        <div className="relative w-full">
          <input
            type="email"
            placeholder="Your email"
            className="w-full rounded-xl border border-amber-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <MailCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400" size={20} />
        </div>
        <button className="w-full sm:w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-all">
          Notify Me
        </button>
      </div>

      {/* Footer note */}
      <p className="text-sm text-gray-500 mt-6">No spam. Just updates about the launch.</p>
    </div>
  );
};

export default ComingSoon;
