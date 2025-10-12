import React, { useState, useEffect, useCallback, useMemo } from "react";
import { IoMdEyeOff, IoMdLock } from "react-icons/io";
import { IoEye, IoClose, IoMailOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import toast, { Toaster } from "react-hot-toast";
import Axios from "../utils/axios";
import SummaryApi from "../comman/summaryApi";
import fetchUserDetails from "../utils/featchUserDetails";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../Store/userSlice";
import welcomeimg from "../assets/wecomeback.jpg";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail && savedPassword) {
      setData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validateForm = useMemo(
    () => Object.values(data).every((el) => el),
    [data]
  );

  const handleGoogleLoginSuccess = async (googleAccessToken) => {
    setIsGoogleLoading(true);
    const loadingToast = toast.loading("Authenticating with Google...");
    try {
      const response = await Axios({
        ...SummaryApi.google_login,
        data: { accessToken: googleAccessToken },
      });
      if (!response.data || response.data.error)
        throw new Error(response.data?.message || "Google authentication failed");

      const { accessToken, refreshToken, user } = response.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      if (user) dispatch(setUserDetails(user));

      toast.dismiss(loadingToast);
      // toast.success("Login successful!");
      navigate("/", { replace: true });

      const userDetails = await fetchUserDetails();
      if (userDetails?.data) dispatch(setUserDetails(userDetails.data));
    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error(error?.response?.data?.message || error.message || "Google login failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleLoginError = (error) => {
    console.error(error);
    toast.error(error.message || "Google login failed");
    setIsGoogleLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm) return toast.error("Please fill all fields");

    setIsLoading(true);
    const loadingToast = toast.loading("Signing in...");
    try {
      const response = await Axios({ ...SummaryApi.login, data });
      if (!response.data || response.data.error)
        throw new Error(response.data?.message || "Login failed");

      const { accessToken, refreshToken, user } = response.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
        localStorage.setItem("rememberedPassword", data.password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      if (user) dispatch(setUserDetails(user));
      
      toast.dismiss(loadingToast);
      // toast.success("Login successful!");
      navigate("/", { replace: true });
     
      const userDetails = await fetchUserDetails();
      if (userDetails?.data) dispatch(setUserDetails(userDetails.data));
    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error(error?.response?.data?.message || error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const GoogleLoginButton = useMemo(() => {
    return ({ onSuccess, onError, isLoading }) => {
      const login = useGoogleLogin({
        onSuccess: (res) =>
          res.access_token
            ? onSuccess(res.access_token)
            : onError(new Error("No access token")),
        onError,
        flow: "implicit",
        scope: "email profile openid",
      });

      if (!GOOGLE_CLIENT_ID)
        return (
          <div className="w-full py-3 px-4 rounded-xl bg-yellow-50 border border-yellow-200 text-center">
            <span className="text-sm font-medium text-yellow-700">
              ⚠️ Google login not configured
            </span>
          </div>
        );

      return (
        <button
          disabled={isLoading}
          onClick={login}
          className={`flex items-center justify-center w-full py-3 rounded-xl border transition-all duration-200 ${
            isLoading
              ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-70"
              : "bg-white border-gray-300 hover:border-amber-300 hover:bg-amber-50"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full mr-2 animate-spin"></div>
              Connecting...
            </div>
          ) : (
            <>
              <FcGoogle size={20} />
              <span className="ml-3 text-sm font-medium text-gray-700">
                Continue with Google
              </span>
            </>
          )}
        </button>
      );
    };
  }, [GOOGLE_CLIENT_ID]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#374151",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
            },
          }}
        />

        <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2 bg-white border border-amber-100 transition-all duration-200">
          {/* Close button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-500 hover:text-gray-700 shadow-md transition"
            aria-label="Close"
          >
            <IoClose className="w-5 h-5" />
          </button>

          {/* Left section - Form */}
          <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Sign in to your account to continue
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-2 text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <IoMailOutline className="absolute left-3 top-3.5 text-gray-500" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm sm:text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-amber-600 hover:text-amber-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <IoMdLock className="absolute left-3 top-3.5 text-gray-500" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="block w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 placeholder-gray-400 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm sm:text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-amber-600 transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <IoEye className="h-5 w-5" />
                    ) : (
                      <IoMdEyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember + Submit */}
              <div className="flex flex-col items-start gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>

                <button
                  type="submit"
                  disabled={!validateForm || isLoading}
                  className={`px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 w-full flex items-center justify-center ${
                    !validateForm || isLoading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2 animate-spin"></div>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-sm bg-white text-gray-500 font-medium">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            {/* Google Login */}
            <GoogleLoginButton
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              isLoading={isGoogleLoading}
            />

            <div className="mt-4 text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-amber-600 hover:text-amber-500 hover:underline"
              >
                Create one
              </Link>
            </div>
          </div>

          {/* Right section - Image */}
          <div className="hidden lg:block relative overflow-hidden">
            <img
              src={welcomeimg}
              alt="Welcome illustration"
              className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-orange-900/20 to-amber-800/30"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white drop-shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Join Our Community</h2>
              <p className="text-amber-100">
                Access exclusive features and connect with others
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
