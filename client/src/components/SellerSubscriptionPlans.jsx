import React, { useState, useMemo } from "react";
import { DisplayPriceInRupees } from "../utils/helpers/DisplayPriceInRupees";
import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

export default function SellerSubscriptionPlans({ plans = [] }) {
  const [duration, setDuration] = useState("month_1");

  const durations = [
    { key: "month_1", label: "1 Month" },
    { key: "month_3", label: "3 Months" },
    { key: "month_6", label: "6 Months" },
    { key: "month_12", label: "1 Year" },
  ];

  // 1) Sort by priorityLevel (backend control)
  // 2) Force "Standard" into the middle if exactly 3 plans
  const displayPlans = useMemo(() => {
    if (!Array.isArray(plans)) return [];

    const sorted = [...plans].sort(
      (a, b) => (b.priorityLevel || 0) - (a.priorityLevel || 0)
    );

    if (sorted.length === 3) {
      const standardIndex = sorted.findIndex((p) => p.name === "Standard");
      if (standardIndex !== -1) {
        const copy = [...sorted];
        const [standardPlan] = copy.splice(standardIndex, 1);
        // put Standard at index 1 (center of 3)
        copy.splice(1, 0, standardPlan);
        return copy;
      }
    }

    return sorted;
  }, [plans]);

  return (
    <div className="w-full py-6 font-inter bg-linear-to-b from-amber-50 via-white to-emerald-50 rounded-3xl">
      {/* HEADER */}
      <div className="text-center mb-6 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Seller Growth Subscriptions
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Plans built for <span className="text-amber-600"> Real Sellers</span> .
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-xl mx-auto">
          Start lean, scale fast, and unlock premium visibility across the
          marketplace.
        </p>
      </div>

      {/* DURATION TOGGLE */}
      <div className="flex justify-center lg:mb-17 mb-8 px-4">
        <div className="inline-flex items-center rounded-full bg-gray-100 p-1 shadow-inner">
          {durations.map((d) => (
            <button
              key={d.key}
              onClick={() => setDuration(d.key)}
              className={`cursor-pointer px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full font-semibold transition-all duration-150
                ${
                  duration === d.key
                    ? "bg-amber-400 text-black shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* PLANS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 px-4 md:px-12 max-w-6xl mx-auto">
        {displayPlans.map((plan) => {
          const price = plan.pricing?.[duration] ?? 0;
          const isStandard = plan.name === "Standard";

          const priceLabel =
            duration === "month_1"
              ? "per month"
              : duration === "month_3"
              ? "per 3 months"
              : duration === "month_6"
              ? "per 6 months"
              : "per year";

          return (
            <motion.div
              key={plan._id}
              whileHover={{ y: -4, scale: isStandard ? 1.04 : 1.02 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={`relative w-full rounded-3xl border bg-white/90 backdrop-blur-sm p-6 sm:p-7 
                shadow-sm flex flex-col
                ${
                  isStandard
                    ? "border-amber-500 shadow-[0_0_45px_rgba(251,191,36,0.45)] ring-2 ring-amber-400/80 scale-[1.02] z-10"
                    : "border-gray-200"
                }`}
            >
              {/* BADGE (text badge or Popular) */}
              {(plan.badgeText || plan.isPopular || isStandard) && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 drop-shadow-xl z-20">
                  <div
                    className="
                      flex items-center justify-center gap-2 
                      px-5 py-2 rounded-full
                      bg-linear-to-r from-amber-400 via-yellow-300 to-amber-500
                      text-black text-[12px] sm:text-[13px] font-bold tracking-wide uppercase
                      shadow-[0_4px_12px_rgba(255,180,0,0.45)]
                      border border-amber-600/40
                    "
                  >
                    <Star className="w-4 h-4 text-black" />
                    <span>
                      {plan.badgeText
                        ? plan.badgeText
                        : isStandard
                        ? "Recommended"
                        : "Popular"}
                    </span>
                  </div>
                </div>
              )}

              {/* PLAN NAME + DESCRIPTION */}
              <div className="mt-2 mb-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                  {plan.name}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 whitespace-pre-line">
                  {plan.description}
                </p>

                {/* SMALL META INFO (unique detail) */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-gray-500 font-medium">
                  {typeof plan.productLimit === "number" && (
                    <span className="px-2 py-1 rounded-full bg-gray-100">
                      {plan.productLimit === 100
                        ? "Up to 100 products"
                        : plan.productLimit === 500
                        ? "Up to 500 products"
                        : plan.productLimit === 0
                        ? "Unlimited products"
                        : `${plan.productLimit} product limit`}
                    </span>
                  )}
                  {typeof plan.storageLimitGB === "number" && (
                    <span className="px-2 py-1 rounded-full bg-gray-100">
                      {plan.storageLimitGB} GB media storage
                    </span>
                  )}
                </div>
              </div>

              {/* PRICE BLOCK */}
              <div className="mt-2 mb-3 flex items-baseline gap-2">
                <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                  {DisplayPriceInRupees(price).replace(".00", "")}
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-gray-500">
                  {priceLabel}
                </div>
              </div>

              {/* FEATURES */}
              <ul className="mt-4 space-y-2.5 text-sm text-gray-800 flex-1">
                {plan.features?.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs sm:text-sm"
                  >
                    <Check className="mt-0.5 w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA BUTTON */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                className={`mt-6 w-full rounded-xl py-2.5 text-xs sm:text-sm font-semibold shadow-md transition-colors
                  ${
                    isStandard
                      ? "bg-amber-400 hover:bg-amber-500 text-black"
                      : "bg-gray-900 hover:bg-black text-white"
                  }`}
              >
                Choose {plan.name}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
