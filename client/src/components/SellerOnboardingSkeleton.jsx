import React from "react";

export default function SellerOnboardingLoader() {
  return (
    <>
      <style>{`
        .loader-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 32px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(240, 185, 50, 0.25);
          box-shadow: 0 4px 24px rgba(0,0,0,0.05);
          backdrop-filter: blur(6px);
        }

        /* Animated Circular Loader */
        .loader-ring {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 4px solid transparent;
          border-top-color: #f59e0b; /* Amber */
          border-right-color: #22c55e; /* Green */
          border-left-color: #f97316; /* Orange */
          animation: spinRing 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Floating dots */
        .floating-dots {
          display: flex;
          gap: 6px;
          justify-content: center;
          margin-top: -10px;
        }
        .dot {
          width: 8px;
          height: 8px;
          background: #f59e0b;
          border-radius: 50%;
          opacity: 0;
          animation: dotPulse 1.5s infinite ease-in-out;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; background: #f97316; }
        .dot:nth-child(3) { animation-delay: 0.4s; background: #22c55e; }

        @keyframes dotPulse {
          0% { transform: translateY(0); opacity: 0.2; }
          50% { transform: translateY(-6px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.2; }
        }

        /* Skeleton Lines */
        .skeleton {
          position: relative;
          background: #e5e7eb;
          overflow: hidden;
          border-radius: 6px;
        }
        .skeleton::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          height: 100%;
          width: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 220, 120, 0.45),
            transparent
          );
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

      `}</style>

      <div className="loader-container">

        <div className="loader-ring"></div>

        <div className="floating-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>

        <p className="text-center text-gray-700 text-sm font-medium mt-2">
          Welcome to Seller's Onboarding
        </p>

        <div className="space-y-4 mt-4">

          <div className="skeleton h-3 w-40"></div>
          <div className="skeleton h-3 w-56"></div>
          <div className="skeleton h-3 w-32"></div>

          <div className="mt-4 space-y-3">
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-4/5"></div>
            <div className="skeleton h-4 w-2/3"></div>
          </div>

        </div>

      </div>
    </>
  );
}
