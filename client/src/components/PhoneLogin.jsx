import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../Store/userSlice";
import Axios from "../utils/network/axios";
import SummaryApi from "../comman/summaryApi";

import { auth } from "../utils/auth/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const PhoneLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const otpRefs = useRef([]);
  const phoneRef = useRef(null);

  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

    // initialize recaptcha once
    useEffect(() => {
  if (!window.recaptchaVerifier && auth) {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
      window.recaptchaVerifier.render().then(() => {
        console.log("Recaptcha Rendered ✅");
      });
    } catch (err) {
      console.error("Recaptcha init error:", err);
    }
  }
    }, [auth]);


  // countdown timer for resend
  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const id = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(id);
    }
    if (timer === 0) setCanResend(true);
  }, [timer, step]);

  useEffect(() => {
    if (step === "phone") phoneRef.current?.focus();
    if (step === "otp") otpRefs.current[0]?.focus();
  }, [step]);

  const resetOtpInputs = () => {
    setOtp(new Array(6).fill(""));
    otpRefs.current = [];
  };

  /* -------------------- SEND OTP -------------------- */
  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + mobile,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmation;
      toast.success("OTP sent successfully!");
      setStep("otp");
      setTimer(30);
      setCanResend(false);
      resetOtpInputs();
    } catch (err) {
      console.error(err);
      if (err?.code === "auth/too-many-requests") setError("Too many attempts. Please try later.");
      else if (err?.code === "auth/invalid-phone-number") setError("Invalid phone number.");
      else if (err?.code === "auth/quota-exceeded") setError("SMS quota exceeded. Try later.");
      else setError("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- VERIFY OTP -------------------- */
  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await window.confirmationResult.confirm(code);

      const res = await Axios({
        ...SummaryApi.loginWithMobile,
        data: { mobile: Number(mobile) },
      });

      localStorage.setItem("accessToken", res.data.data.accessToken);
      localStorage.setItem("refreshToken", res.data.data.refreshToken);
      dispatch(setUserDetails(res.data.data.user));
      toast.success("Welcome back!");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Invalid OTP. Please try again.");
      resetOtpInputs();
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    sendOtp();
  };

  const onOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const copy = [...otp];
    copy[idx] = val;
    setOtp(copy);
    setError("");

    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const onOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
    if (e.key === "Enter") step === "phone" ? sendOtp() : verifyOtp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
      <Toaster position="top-center" />
      <div id="recaptcha-container" className="fixed bottom-0"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Illustration */}
        <div className="hidden lg:flex flex-col justify-center pl-12 pr-6">
          <div className="mb-6">
            <svg viewBox="0 0 600 500" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#FFB300"/>
                  <stop offset="100%" stopColor="#FF6F00"/>
                </linearGradient>
              </defs>
              <rect x="20" y="100" rx="24" width="420" height="320" fill="url(#g1)" opacity="0.12"/>
              <g transform="translate(40, 20)">
                <rect x="120" y="40" rx="20" width="240" height="320" fill="#fff" opacity="0.9"/>
                <circle cx="240" cy="120" r="36" fill="#FF6F00"/>
                <rect x="160" y="180" width="160" height="18" rx="8" fill="#FFD54F"/>
                <rect x="160" y="210" width="130" height="18" rx="8" fill="#FFE082"/>
                <rect x="160" y="240" width="190" height="18" rx="8" fill="#FFD54F"/>
              </g>
              <g transform="translate(380, 220) rotate(-12)">
                <circle cx="0" cy="0" r="40" fill="#FFECB3"/>
                <path d="M-12 0 l20 -28 l20 28 z" fill="#FF6F00"/>
              </g>
            </svg>
          </div>
          <h3 className="text-3xl font-semibold text-amber-800 mb-2">Fast & Secure Login</h3>
          <p className="text-gray-600 leading-relaxed">
            Sign in quickly with your phone number. We ensure secure OTP verification to protect your account.
          </p>
        </div>

        {/* Auth Card */}
        <div className="mx-auto w-full max-w-md">
          <div className="bg-white shadow-2xl rounded-2xl px-6 py-8 border border-amber-50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-amber-700">Sign in with Phone</h2>
                <p className="text-sm text-gray-500 mt-1">Enter your mobile number to receive an OTP.</p>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z" stroke="#ff8f00" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 8h8" stroke="#ff8f00" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* PHONE STEP */}
            {step === "phone" && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-2 bg-amber-50 rounded-lg border border-amber-100 text-amber-700 font-medium">+91</div>
                  <input
                    ref={phoneRef}
                    type="tel"
                    inputMode="numeric"
                    aria-label="Mobile number"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => { if (e.key === "Enter") sendOtp(); }}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition"
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>
                <div className="mt-6">
                  <button
                    onClick={sendOtp}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
                {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
                <p className="mt-4 text-xs text-gray-400">By continuing, you agree to our Terms & Privacy.</p>
              </>
            )}

            {/* OTP STEP */}
            {step === "otp" && (
              <>
                <div className="mb-2">
                  <p className="text-sm text-gray-600">We sent a 6-digit code to</p>
                  <p className="text-sm font-medium text-amber-800">+91 {mobile}</p>
                </div>
                <div className="mt-4 grid grid-cols-6 gap-3">
                  {otp.map((val, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={(e) => onOtpChange(e.target.value, i)}
                      onKeyDown={(e) => onOtpKeyDown(e, i)}
                      aria-label={`OTP digit ${i + 1}`}
                      className="w-full h-14 text-center rounded-xl border border-gray-200 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400 transition"
                    />
                  ))}
                </div>
                {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={verifyOtp}
                    disabled={loading || otp.some((d) => d === "")}
                    className="w-full inline-flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
                  >
                    {loading ? "Verifying..." : "Verify & Continue"}
                  </button>
                  <button
                    onClick={() => { setStep("phone"); resetOtpInputs(); }}
                    className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 rounded-xl bg-white hover:bg-gray-50 transition"
                  >
                    Change Number
                  </button>
                </div>

                <div className="mt-4 text-center text-sm">
                  {canResend ? (
                    <button onClick={resendOtp} className="text-amber-700 font-semibold hover:underline">
                      Resend code
                    </button>
                  ) : (
                    <span className="text-gray-400">Resend code in <span className="text-gray-700 font-medium">{timer}s</span></span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneLogin;
