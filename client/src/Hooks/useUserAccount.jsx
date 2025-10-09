import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Axios from "../utils/axios";
import SummaryApi from "../comman/summaryApi";
import AxiosToastError from "../utils/AxiosToastErroe";
import { logout, setUserDetails } from "../Store/userSlice";
import fetchUserDetails from "../utils/featchUserDetails";
import useMobile from "./useMobile";

const useUserAccount = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const [openAvatarEdit, setOpenAvatarEdit] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isMobile = useMobile(1024);

  // Redirect desktop users to profile
  useEffect(() => {
    if (!isMobile) {
      navigate("/dashboard/profile", { replace: true });
    }
  }, [isMobile, navigate]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Logout action with better loading state
  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    
    setIsLoggingOut(true);
    try {
      const response = await Axios({ ...SummaryApi.logout });
      if (response.data.success) {
        dispatch(logout());
        localStorage.clear();
        navigate("/", { replace: true });
        toast.dismiss();
        toast.success(response.data.message || "Logged out successfully");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Toggle sections
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Remove user avatar with better confirmation
  const handleRemoveAvatar = async () => {
    if (!window.confirm("Are you sure you want to remove your avatar?")) return;
    
    try {
      const res = await Axios(SummaryApi.removeUserAvatar);
      if (res.data.success) {
        toast.success("Avatar removed successfully");
        const userdata = await fetchUserDetails();
        dispatch(setUserDetails(userdata.data));
      } else {
        toast.error(res.data.message || "Failed to remove avatar");
      }
    } catch (error) {
      toast.error("Error removing avatar");
      console.error("Avatar removal error:", error);
    }
  };

  return {
    user,
    activeSection,
    openAvatarEdit,
    profileDropdownOpen,
    isLoggingOut,
    setOpenAvatarEdit,
    setProfileDropdownOpen,
    handleLogout,
    toggleSection,
    handleRemoveAvatar,
    isMobile,
  };
};

export default useUserAccount;