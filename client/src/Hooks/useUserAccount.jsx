import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Axios from "../utils/axios";
import SummaryApi from "../comman/summaryApi";
import AxiosToastError from "../utils/AxiosToastErroe";
import { logout, setUserDetails } from "../Store/userSlice";
import fetchUserDetails from "../utils/featchUserDetails";
import useMobile from "./useMobile"; // your existing mobile hook

const useUserAccount = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const [openAvatarEdit, setOpenAvatarEdit] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const [isMobile] = useMobile(1024); // detect small screen

  // Redirect desktop users to profile
  useEffect(() => {
    if (!isMobile) navigate("/dashboard/profile");
  }, [isMobile, navigate]);

  // Logout action
  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try {
      const response = await Axios({ ...SummaryApi.logout });
      if (response.data.success) {
        dispatch(logout());
        localStorage.clear();
        navigate("/");
        toast.dismiss();
        toast.success(response.data.message);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Toggle sections like notifications
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Remove user avatar
  const handleRemoveAvatar = async () => {
    if (!window.confirm("Remove your avatar?")) return;
    try {
      const res = await Axios(SummaryApi.removeUserAvatar);
      if (res.data.success) {
        toast.dismiss();
        toast.success("Avatar removed successfully.");
        const userdata = await fetchUserDetails();
        dispatch(setUserDetails(userdata.data));
      } else {
        toast.dismiss();
        toast.error(res.data.message || "Failed to remove avatar.");
      }
    } catch {
      toast.dismiss();
      toast.error("Error removing avatar.");
    }
  };

  return {
    user,
    activeSection,
    openAvatarEdit,
    profileDropdownOpen,
    setOpenAvatarEdit,
    setProfileDropdownOpen,
    handleLogout,
    toggleSection,
    handleRemoveAvatar,
    isMobile,
  };
};

export default useUserAccount;
