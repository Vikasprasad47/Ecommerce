import React, { useState, useMemo } from "react";

export default function SellerSubscriptionPlans({ plans }) {
  const [duration, setDuration] = useState("month_1");

  const durations = [
    { key: "month_1", label: "Monthly" },
    { key: "month_3", label: "Quarterly" },
    { key: "month_6", label: "Half-Yearly" },
    { key: "month_12", label: "Yearly" },
  ];

  const sortedPlans = useMemo(() => {
    return [...plans].sort((a, b) => (b.priorityLevel || 0) - (a.priorityLevel || 0));
  }, [plans]);

  return (
    <>
      {/* SELF-CONTAINED CSS */}
      <style>{`
        :root {
          --amber: #ffb300;
          --amber-dark: #ff8f00;
          --green: #16a34a;
          --border: #e5e7eb;
          --text-dark: #1f2937;
          --text-light: #6b7280;
          --bg-card: #ffffff;
          --glow: rgba(255,175,0,0.25);
        }
        .plans-wrapper {
          padding: 20px 0;
          font-family: 'Inter', sans-serif;
        }

        /* Header */
        .plans-title {
          font-size: 32px;
          font-weight: 800;
          text-align: center;
          margin-bottom: 6px;
        }
        .plans-subtitle {
          font-size: 17px;
          color: var(--text-light);
          text-align: center;
          margin-bottom: 28px;
        }

        /* Toggle */
        .plan-toggle {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 35px;
        }
        .plan-toggle button {
          padding: 10px 20px;
          border-radius: 22px;
          font-size: 15px;
          font-weight: 600;
          border: 1px solid #ddd;
          background: #f8f8f8;
          color: #444;
          cursor: pointer;
          transition: 0.2s;
        }
        .plan-toggle button.active {
          background: var(--amber);
          border-color: var(--amber-dark);
          color: #000;
          font-weight: 700;
          box-shadow: 0 6px 18px var(--glow);
        }

        /* Grid */
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media(max-width: 900px) {
          .plans-grid { grid-template-columns: 1fr 1fr; }
        }
        @media(max-width: 650px) {
          .plans-grid { grid-template-columns: 1fr; }
        }

        /* Plan Card */
        .plan-card {
          background: var(--bg-card);
          border: 1.5px solid var(--border);
          border-radius: 20px;
          padding: 26px;
          transition: 0.25s;
        }
        .plan-card:hover {
          border-color: var(--amber);
          box-shadow: 0 10px 30px rgba(255,170,0,0.15);
          transform: translateY(-4px);
        }
        .plan-card.popular {
          border-color: var(--amber-dark);
          box-shadow: 0 14px 40px rgba(255,170,0,0.2);
        }

        .plan-badge {
          background: var(--green);
          color: #fff;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 20px;
          display: inline-block;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .plan-name {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-dark);
        }
        .plan-desc {
          font-size: 15px;
          color: var(--text-light);
          margin-top: 4px;
          line-height: 1.4;
        }

        .plan-price {
          font-size: 38px;
          font-weight: 800;
          margin: 18px 0 2px;
          color: var(--text-dark);
        }
        .plan-duration {
          font-size: 14px;
          color: var(--text-light);
          margin-bottom: 14px;
        }

        /* Features */
        .plan-features {
          list-style: none;
          margin-top: 18px;
          padding-left: 0;
        }
        .plan-features li {
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 10px;
          color: var(--text-dark);
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .plan-features li::before {
          content: "✔";
          font-size: 14px;
          font-weight: 800;
          color: var(--green);
        }
      `}</style>

      <div className="plans-wrapper">

        {/* HEADER */}
        <h1 className="plans-title">Seller Plans</h1>
        <p className="plans-subtitle">Choose the best plan for your growth — just viewing here</p>

        {/* TOGGLE */}
        <div className="plan-toggle">
          {durations.map((d) => (
            <button
              key={d.key}
              className={duration === d.key ? "active" : ""}
              onClick={() => setDuration(d.key)}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* PLANS GRID */}
        <div className="plans-grid">
          {sortedPlans.map((plan) => {
            const price = plan.pricing?.[duration] ?? 0;

            return (
              <div
                key={plan._id}
                className={`plan-card ${plan.isPopular ? "popular" : ""}`}
              >
                {plan.badgeText && (
                  <span className="plan-badge">{plan.badgeText}</span>
                )}

                <h2 className="plan-name">{plan.name}</h2>
                <p className="plan-desc">{plan.description}</p>

                <div className="plan-price">₹{price.toLocaleString("en-IN")}</div>
                <div className="plan-duration">
                  {duration === "month_1"
                    ? "per month"
                    : duration === "month_3"
                    ? "per 3 months"
                    : duration === "month_6"
                    ? "per 6 months"
                    : "per year"}
                </div>

                <ul className="plan-features">
                  {plan.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>

              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
