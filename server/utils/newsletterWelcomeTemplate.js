const newsletterWelcomeTemplate = (email) => {
  return `
  <div style="
    font-family: 'Inter', Arial, sans-serif;
    max-width: 630px;
    margin: 30px auto;
    padding: 32px;
    background: #ffffff;
    border-radius: 14px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 6px 26px rgba(0,0,0,0.06);
  ">

    <!-- Header -->
    <div style="text-align:center; margin-bottom:25px;">
      <img src="https://quickoo.in/logo.png" alt="Quickoo Logo" style="height:50px; margin-bottom:12px;" />
      <h2 style="font-size:26px;color:#111827;margin:0;">Welcome to Quickoo Newsletter 🎉</h2>
      <p style="color:#6b7280;margin-top:6px;font-size:14px;">Subscribed using: <strong>${email}</strong></p>
    </div>

    <!-- Body -->
    <p style="font-size:16px;color:#374151;line-height:1.7;margin:18px 0;">
      You’re now officially part of our VIP list!  
      From now on you'll receive exclusive early access updates, special offers, new launches, product drops & insider alerts before anyone else.
    </p>

    <div style="
      margin:22px 0;
      background:#fff8e6;
      padding:18px;
      border-radius:10px;
      border-left:5px solid #f59e0b;
      font-size:15px;
      line-height:1.6;
      color:#b45309;
    ">
      🔒 <strong>Your email is now verified for early access pre-launch deals.</strong>
    </div>

    <div style="margin-top:28px;text-align:center;">
      <a href="https://quickoo.in" style="
        padding:12px 26px;
        background:#f59e0b;
        color:#fff;
        border-radius:8px;
        font-size:15px;
        text-decoration:none;
        font-weight:600;
        display:inline-block;
      ">
        Explore Quickoo →
      </a>
    </div>

    <!-- Info / legal -->
    <p style="font-size:13px;color:#9ca3af;margin-top:28px;text-align:center;">
      If this wasn’t you or you want to unsubscribe later, you can manage preferences anytime.
    </p>

    <!-- Footer -->
    <div style="border-top:1px solid #e5e7eb;margin-top:32px;padding-top:20px;text-align:center;font-size:13px;color:#6b7280;">
      <p style="margin:0;">© ${new Date().getFullYear()} Quickoo.</p>
      <p style="margin-top:6px;">Thanks for being here ❤️</p>
    </div>
  </div>
  `;
};

export default newsletterWelcomeTemplate;
