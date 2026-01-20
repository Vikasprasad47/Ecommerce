import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from "../utils/network/axios";
import SummaryApi from "../comman/summaryApi";
import { useSearchParams } from "react-router-dom";
import { LiaUserEditSolid } from "react-icons/lia";
import { motion, AnimatePresence } from "framer-motion";
import AxiosToastError from '../utils/network/AxiosToastError'
import { 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiUserX, 
  FiUserCheck, 
  FiMail, 
  FiPhone, 
  FiCalendar,
  FiStar,
  FiBell,
  FiX,
  FiGrid,
  FiList,
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiCreditCard,
  FiShield,
  FiActivity,
  FiTrash2
} from 'react-icons/fi';

import toast from 'react-hot-toast';

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [showSendEmailModal, setShowSendEmailModal] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToEditRole, setUserToEditRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [userToUpdateStatus, setUserToUpdateStatus] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const defaultImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
  const [bulkEmailSubject, setBulkEmailSubject] = useState("");
  const [bulkEmailMessage, setBulkEmailMessage] = useState("");
  const [isSendingBulkEmail, setIsSendingBulkEmail] = useState(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [previewEmails, setPreviewEmails] = useState([]);
  const [isRoleUpdating, setIsRoleUpdating] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const pageQuery = parseInt(searchParams.get("page") || "1");
  const filterType = searchParams.get("filter") || "name";
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [searchField, setSearchField] = useState(filterType);
  const [currentPage, setCurrentPage] = useState(pageQuery);
  const usersPerPage = 12;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const [showDropdown, setShowDropdown] = useState(false);
  const filterOptions = [
    { label: "Name", value: "name", icon: FiUser },
    { label: "Email", value: "email", icon: FiMail },
    { label: "Phone", value: "mobile", icon: FiPhone },
    { label: "Status", value: "status", icon: FiActivity },
  ];

  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch users
  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(SummaryApi.getAllUsers.url, { withCredentials: true });
      setUsers(res.data.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams({
        search: searchInput,
        filter: searchField,
        page: 1,
      });
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, searchField, setSearchParams]);

  // Sync page param to state
  useEffect(() => {
    setSearchParams(prev => ({
      search: prev.get("search") || "",
      filter: searchField,
      page: currentPage.toString(),
    }));
  }, [currentPage, searchField, setSearchParams]);

  // Filter users
  useEffect(() => {
    const filteredData = users.filter(user => {
      const val = user[searchField]?.toString().toLowerCase() || '';
      return val.includes(searchQuery.toLowerCase());
    });
    setFiltered(filteredData);
  }, [users, searchQuery, searchField]);

  const totalPages = Math.ceil(filtered.length / usersPerPage);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filtered.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeactivateClick = (user) => {
    setUserToDeactivate(user);
    setShowDeactivateModal(true);
  };

  const handleDeactivateConfirm = async () => {
    if (userToDeactivate) {
      try {
        await axios.patch(`${SummaryApi.updateUser.url}/${userToDeactivate._id}`, 
          { status: "Inactive" }, 
          { withCredentials: true }
        );
        fetchAllUsers();
        setShowDeactivateModal(false);
        setUserToDeactivate(null);
      } catch (err) {
        console.error("Failed to deactivate user", err);
      }
    }
  };

  const handleSendEmail = (user) => {
    setSelectedUser(user);
    setEmailContent('');
    setShowSendEmailModal(true);
  };

  const handleEditRole = (user) => {
    setUserToEditRole(user);
    setSelectedRole(user.role);
    setShowRoleModal(true);
  };

  const handleSendEmailConfirm = async () => {
    if (!selectedUser || !emailContent.trim()) {
      toast.error("Please fill out both subject and message before sending.");
      return;
    }

    setIsSendingEmail(true);

    try {
      const res = await axios.post(
        SummaryApi.sendEmailToUser.url,
        {
          userId: selectedUser._id,
          subject: emailSubject, // ✅ new
          message: emailContent,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Email sent successfully!");
        setShowSendEmailModal(false);
        setSelectedUser(null);
        setEmailContent("");
        setEmailSubject("");
      } else {
        toast.error(res.data.message || "Failed to send email.");
      }
    } catch (err) {
      console.error("Email send error:", err);
      AxiosToastError(err);
      toast.error("Something went wrong while sending email.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleRoleFilterChange = async (role) => {
    setSelectedRoleFilter(role);
    try {
      const res = await axios.get(SummaryApi.getEmailsByRole.url, {
        params: { role },
        withCredentials: true,
      });
      setPreviewEmails(res.data.emails || []);
    } catch (error) {
      console.error("Failed to fetch emails", error);
      setPreviewEmails([]);
    }
  };

  const handleBulkEmailClick = () => {
    setShowBulkEmailModal(true);
  };

  const handleSendBulkEmailConfirm = async () => {
    if (!bulkEmailSubject.trim() || !bulkEmailMessage.trim()) {
      toast.error("Please enter both subject and message");
      return;
    }

    try {
      setIsSendingBulkEmail(true);
      const res = await axios.post(
        SummaryApi.sendBulkEmail.url,
        {
          subject: bulkEmailSubject,
          message: bulkEmailMessage,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Emails sent successfully!");
        setShowBulkEmailModal(false);
        setBulkEmailSubject("");
        setBulkEmailMessage("");
      } else {
        toast.error(res.data.message || "Failed to send bulk emails");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setIsSendingBulkEmail(false);
    }
  };


  const handleActivateUser = async (userId) => {
    try {
      await axios.patch(`${SummaryApi.updateUser.url}/${userId}`, 
        { status: "Active" }, 
        { withCredentials: true }
      );
      fetchAllUsers();
    } catch (err) {
      console.error("Failed to activate user", err);
    }
  };

  const handleConfirmRoleChange = async () => {
  if (!userToEditRole || !selectedRole) return;

  try {
      const res = await axios.patch(SummaryApi.updateRole.url, {
        userId: userToEditRole._id,
        role: selectedRole
      }, { withCredentials: true });

      if (res.data.success) {
        setShowRoleModal(false);
        setUserToEditRole(null);
        fetchAllUsers();
        toast.dismiss()
        toast.success(res.data.message)
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Failed to update role", err);
      AxiosToastError(err)
      alert("Something went wrong while updating role.");
    }
  };

  const handleStatusChangeClick = (user, status) => {
    setUserToUpdateStatus(user);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!userToUpdateStatus || !newStatus) return;
    setIsUpdatingStatus(true);

    try {
      const res = await axios.patch(SummaryApi.updateStatus.url, {
        userId: userToUpdateStatus._id,
        status: newStatus
      }, { withCredentials: true });

      if (res.data.success) {
        fetchAllUsers();
        setShowStatusModal(false);
        setUserToUpdateStatus(null);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Failed to update user status:", err);
      alert("Something went wrong while updating status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteClick = (user) => {
  setUserToDelete(user);
  setShowDeleteModal(true);
};

const handleConfirmDelete = async () => {
  if (!userToDelete) return;

  try {
    setIsDeleting(true);
    const res = await axios.delete(
      `${SummaryApi.deleteUser.url}/${userToDelete._id}`,
      { withCredentials: true }
    );

    if (res.data.success) {
      toast.success(res.data.message || "User deleted");
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchAllUsers();
    } else {
      toast.error(res.data.message || "Failed to delete user");
    }
  } catch (err) {
    AxiosToastError(err);
  } finally {
    setIsDeleting(false);
  }
};




  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-emerald-500/10 text-emerald-700 border border-emerald-200";
      case "Inactive": return "bg-slate-500/10 text-slate-600 border border-slate-200";
      case "Suspended": return "bg-rose-500/10 text-rose-700 border border-rose-200";
      default: return "bg-slate-500/10 text-slate-600 border border-slate-200";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN": return "bg-violet-500/10 text-violet-700 border border-violet-200";
      case "USER": return "bg-blue-500/10 text-blue-700 border border-blue-200";
      case "DELIVERY-AGENT": return "bg-amber-500/10 text-amber-700 border border-amber-200";
      default: return "bg-slate-500/10 text-slate-600 border border-slate-200";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN": return FiShield;
      case "USER": return FiUser;
      case "DELIVERY-AGENT": return FiActivity;
      default: return FiUser;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };



  // Modal backdrop animation
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // Modal content animation
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.9, y: 20 }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-slate-200">
          <div className="flex flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="font-bold text-2xl text-slate-800">User Management</h2>
              <p className="text-slate-600 mt-1">Manage and view all user accounts</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkEmailClick}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <FiSend size={15} />
                Send Bulk Email
              </button>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mt-4">
            {/* Search Bar */}
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={`Search by ${searchField}...`}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:amber-blue-500 transition text-slate-700 bg-white outline-none"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative w-full sm:w-48" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(prev => !prev)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition text-left flex items-center justify-between text-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FiFilter size={18} className="text-slate-400" />
                    <span>{filterOptions.find(opt => opt.value === searchField)?.label}</span>
                  </div>
                  <FiChevronLeft 
                    size={16} 
                    className={`transform transition-transform ${showDropdown ? '-rotate-90' : 'rotate-0'} text-slate-400`}
                  />
                </button>
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden"
                    >
                      {filterOptions.map(opt => {
                        const IconComponent = opt.icon;
                        return (
                          <div
                            key={opt.value}
                            onClick={() => { setSearchField(opt.value); setShowDropdown(false); }}
                            className={`px-4 py-3 cursor-pointer hover:bg-slate-50 flex items-center gap-3 transition-colors ${
                              searchField === opt.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'
                            }`}
                          >
                            <IconComponent size={16} />
                            {opt.label}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden lg:flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  viewMode === "list" 
                  ? "bg-white text-slate-800 shadow-sm" 
                  : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <FiList size={16} />
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  viewMode === "grid" 
                  ? "bg-white text-slate-800 shadow-sm" 
                  : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <FiGrid size={16} />
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Toggle for Small Screens */}
        <div className="flex lg:hidden justify-end mt-2">
          <div className="bg-slate-100 rounded-xl p-1 flex">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                viewMode === "list" 
                ? "bg-white text-slate-800 shadow-sm" 
                : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <FiList size={16} />
              List
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                viewMode === "grid" 
                ? "bg-white text-slate-800 shadow-sm" 
                : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <FiGrid size={16} />
              Grid
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 mt-3">
          <p className="text-slate-600 text-sm">
            Showing <span className="font-semibold text-slate-800">{currentUsers.length}</span> of{" "}
            <span className="font-semibold text-slate-800">{filtered.length}</span> users
          </p>
          <p className="text-slate-600 text-sm">
            Page <span className="font-semibold text-slate-800">{currentPage}</span> of{" "}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </p>
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          /* List View */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-32"></div></td>
                        <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-40"></div></td>
                        <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-20"></div></td>
                        <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-32 mx-auto"></div></td>
                      </tr>
                    ))
                  ) : currentUsers.length > 0 ? (
                    currentUsers.map(user => {
                      const RoleIcon = getRoleIcon(user.role);
                      return (
                        <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={user.avatar || defaultImg} 
                                alt={user.name} 
                                className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                              />
                              <div className="flex flex-col gap-0">
                                <p className="font-medium text-slate-900 line-clamp-1">{user.name}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500 flex items-center">
                                    {user.role}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-slate-900 font-medium">{user.email}</p>
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                              <FiPhone size={12} />
                              {user.mobile || "N/A"}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => handleViewUser(user)}
                                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="View Details"
                              >
                                <FiEye size={18} />
                              </button>
                              <button 
                                onClick={() => handleSendEmail(user)}
                                className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                title="Send Email"
                              >
                                <FiMail size={18} />
                              </button>
                              {user.status === "Active" ? (
                                <button
                                  onClick={() => handleStatusChangeClick(user, "Inactive")}
                                  className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Deactivate User"
                                >
                                  <FiUserCheck size={18} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStatusChangeClick(user, "Active")}
                                  className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                  title="Activate User"
                                >
                                  <FiUserX size={18} />
                                </button>
                              )}

                              <button 
                                onClick={() => handleEditRole(user)}
                                className="p-2 text-slate-800 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit Role"
                              >
                                <LiaUserEditSolid  size={20} />
                              </button>

                              <button
                                onClick={() => handleDeleteClick(user)}
                                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete User"
                              >
                                <FiTrash2 size={18} />
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                            <FiUserX size={24} className="text-slate-400" />
                          </div>
                          <p className="text-lg font-medium text-slate-700">No users found</p>
                          <p className="text-sm">Try adjusting your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-24"></div>
                      <div className="h-3 bg-slate-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                    <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : currentUsers.length > 0 ? (
              currentUsers.map(user => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <div
                    key={user._id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar || defaultImg} 
                          alt={user.name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" 
                        />
                        <div>
                          <h3 className="font-semibold text-slate-900 truncate max-w-30">{user.name}</h3>
                          <div className="flex items-center gap-1 mt-0">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="">
                        {user.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FiMail size={14} className="text-slate-400 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FiPhone size={14} className="text-slate-400 shrink-0" />
                        <span>{user.mobile || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FiStar size={14} className="text-slate-400 shrink-0" />
                        <span>Coins: {user.superCoins?.balance || 0}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewUser(user)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                      >
                        <FiEye size={14} />
                        View
                      </button>
                      {user.status === "Active" ? (
                        <button 
                          onClick={() => handleStatusChangeClick(user, "Inactive")}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors font-medium"
                        >
                          <FiUserX size={14} />
                          Deactivate
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStatusChangeClick(user, "Active")}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
                        >
                          <FiUserCheck size={14} />
                          Activate
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                    <FiUserX size={24} className="text-slate-400" />
                  </div>
                  <p className="text-lg font-medium text-slate-700">No users found</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex justify-center mt-8 gap-2 flex-wrap">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft size={16} />
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    currentPage === pageNum 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <FiChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Enhanced User Detail Modal */}
        <AnimatePresence>
          {showUserModal && selectedUser && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                {/* Header */}
                <div className="flex justify-between items-center px-5 py-3 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-md flex items-center justify-center">
                      <FiUser size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">User Profile</h3>
                      <p className="text-xs text-slate-500">Details and account info</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-md transition cursor-pointer"
                  >
                    <FiX size={16} />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="max-h-[75vh] overflow-y-auto px-5 py-4 text-sm">
                  {/* Profile Header */}
                  <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
                    <img
                      src={selectedUser.avatar || defaultImg}
                      alt={selectedUser.name}
                      className="w-14 h-14 rounded-full object-cover border border-slate-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-base text-slate-800">
                          {selectedUser.name}
                        </h4>
                        <span className="text-xs text-amber-600 font-medium">
                          ({selectedUser.role})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        {selectedUser.verify_email ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <FiCheckCircle size={12} /> Verified
                          </span>
                        ) : (
                          <span className="text-amber-600 flex items-center gap-1">
                            <FiAlertCircle size={12} /> Not Verified
                          </span>
                        )}
                        <span className="text-slate-500">•</span>
                        <span
                          className={`${
                            selectedUser.status === 'Active'
                              ? 'text-emerald-600'
                              : 'text-slate-500'
                          } font-medium`}
                        >
                          {selectedUser.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {/* Personal Info */}
                    <div>
                      <h5 className="font-semibold text-slate-700 mb-2 text-sm flex items-center gap-1">
                        <FiUser size={13} /> Personal Info
                      </h5>
                      <div className="space-y-2 bg-slate-50 rounded-md border border-slate-200 p-3">
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-0.5">
                            Date of Birth
                          </label>
                          <p className="font-medium text-slate-800 text-sm">
                            {formatDate(selectedUser.dob) || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-0.5">
                            Phone
                          </label>
                          <p className="font-medium text-slate-800 text-sm">
                            {selectedUser.mobile || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-0.5">
                            Email
                          </label>
                          <p className="font-medium text-slate-800 text-md overflow-y-auto">
                            {selectedUser.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Account Info */}
                    <div>
                      <h5 className="font-semibold text-slate-700 mb-2 text-sm flex items-center gap-1">
                        <FiCreditCard size={13} /> Account Info
                      </h5>
                      <div className="space-y-2 bg-slate-50 rounded-md border border-slate-200 p-3">
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-0.5">
                            Member Since
                          </label>
                          <p className="font-medium text-slate-800 text-sm">
                            {formatDate(selectedUser.createdAt)}
                          </p>
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-0.5">
                            Super Coins
                          </label>
                          <p className="font-medium text-slate-800 text-sm">
                            {selectedUser.superCoins?.balance || 0}
                          </p>
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 block mb-0.5">
                            Last Updated
                          </label>
                          <p className="font-medium text-slate-800 text-sm">
                            {formatDate(selectedUser.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={() => handleSendEmail(selectedUser)}
                    className="flex items-center gap-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-md transition cursor-pointer"
                  >
                    <FiMail size={14} />
                    Email
                  </button>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium rounded-md transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Send Email Modal */}
        <AnimatePresence>
          {showSendEmailModal && selectedUser && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md mx-3 overflow-hidden"
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                      <FiSend size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-800">Send Email</h2>
                      <p className="text-xs text-slate-500">Quick message to user</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSendEmailModal(false)}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-md transition"
                  >
                    <FiX size={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="px-5 py-4 space-y-4 text-sm">
                  {/* Recipient Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
                        Name
                      </label>
                      <div className="border border-slate-200 bg-slate-50 rounded-md py-2 px-3 text-slate-800 truncate text-sm">
                        {selectedUser.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
                        Email
                      </label>
                      <div className="border border-slate-200 bg-slate-50 rounded-md py-2 px-3 text-slate-800 truncate text-sm">
                        {selectedUser.email}
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="e.g., Account Update"
                      className="w-full border border-slate-200 rounded-md py-2.5 px-3 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
                      Message
                    </label>
                    <textarea
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      placeholder="Write your message here..."
                      rows="4"
                      className="w-full border border-slate-200 rounded-md py-2.5 px-3 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none transition"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={() => setShowSendEmailModal(false)}
                    className="px-4 py-2 rounded-md text-sm text-slate-600 border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSendEmailConfirm}
                    disabled={!emailContent.trim() || isSendingEmail}
                    className={`px-5 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition ${
                      !emailContent.trim() || isSendingEmail
                        ? "bg-slate-300 text-white cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600 text-white"
                    }`}
                  >
                    {isSendingEmail ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend size={14} />
                        Send
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== Edit Role Modal (enterprise, no blur, card selectors, accessible) ===== */}
        <AnimatePresence>
          {showRoleModal && userToEditRole && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              aria-hidden={!showRoleModal}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-role-title"
                aria-describedby="edit-role-desc"
                className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-slate-200"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                      <LiaUserEditSolid size={22} className="text-slate-700" />
                    </div>
                    <div>
                      <h3 id="edit-role-title" className="text-lg font-semibold text-slate-900">Edit User Role</h3>
                      <p id="edit-role-desc" className="text-xs text-slate-500 mt-0.5">Adjust access level for <span className="font-medium text-slate-700">{userToEditRole.name}</span></p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowRoleModal(false)}
                    aria-label="Close role editor"
                    className="p-2 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition cursor-pointer "
                    title="Close"
                  >
                    <FiX size={16} />
                  </button>
                </div>

                {/* body */}
                <div className="space-y-4">
                  {/* username display */}
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">User</label>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                      <img src={userToEditRole.avatar || defaultImg} alt={userToEditRole.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <div>
                        <div className="text-sm font-medium text-slate-900 leading-tight">{userToEditRole.name}</div>
                        <div className="text-xs text-slate-500">{userToEditRole.email}</div>
                      </div>
                      {/* role preview badge */}
                      <div className="ml-auto">
                        <span className={`text-xs font-semibold py-1 px-2 rounded-md ${getRoleColor(selectedRole || userToEditRole.role)}`}>
                          {selectedRole || userToEditRole.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* role cards (vertical) */}
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-2 block">Choose role</label>

                    <div
                      role="listbox"
                      aria-label="Role options"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        // basic keyboard navigation: ArrowUp/ArrowDown + Enter
                        const flat = ['USER','ADMIN','DELIVERY-AGENT','SELLER'];
                        const current = selectedRole || userToEditRole.role;
                        const idx = flat.indexOf(current);
                        if (e.key === 'ArrowDown') {
                          const next = flat[(idx + 1) % flat.length];
                          setSelectedRole(next);
                        } else if (e.key === 'ArrowUp') {
                          const prev = flat[(idx - 1 + flat.length) % flat.length];
                          setSelectedRole(prev);
                        } else if (e.key === 'Home') {
                          setSelectedRole(flat[0]);
                        } else if (e.key === 'End') {
                          setSelectedRole(flat[flat.length - 1]);
                        } else if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          // keep current selection
                        } else if (e.key === 'Escape') {
                          setShowRoleModal(false);
                        }
                      }}
                      className="grid grid-cols-1 gap-3 max-h-50 overflow-y-scroll customScrollbar"
                    >
                      {/* Role Card: helper to render */}
                      {[
                        { key: 'USER', title: 'User', note: 'Standard customer access' },
                        { key: 'ADMIN', title: 'Admin', note: 'Full platform access' },
                        { key: 'DELIVERY-AGENT', title: 'Delivery Agent', note: 'Manage deliveries' },
                        { key: 'SELLER', title: 'Seller', note: 'List & manage products' }
                      ].map((r) => {
                        const active = (selectedRole || userToEditRole.role) === r.key;
                        return (
                          <button
                            key={r.key}
                            type="button"
                            onClick={() => setSelectedRole(r.key)}
                            aria-pressed={active}
                            className={`w-full text-left rounded-xl border px-4 py-3 transition flex items-start gap-3 focus:outline-none cursor-pointer ${
                              active
                                ? 'border-amber-400 bg-amber-50 shadow-sm'
                                : 'border-slate-100 bg-white hover:bg-slate-50'
                            }`}
                          >
                            <div className={`w-3 h-3 mt-2 rounded-full ${active ? 'bg-amber-500' : 'bg-slate-200'}`} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <div className="text-sm font-semibold text-slate-900">{r.title}</div>
                                  <div className="text-xs text-slate-500 mt-0.5">{r.note}</div>
                                </div>
                                <div className="text-xs">
                                  {active && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[11px] font-semibold">
                                      Selected
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowRoleModal(false)}
                    className="px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    disabled={isRoleUpdating}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={async () => {
                      if (isRoleUpdating) return;
                      // if no change selected, still allow confirm (optional)
                      if (!selectedRole) setSelectedRole(userToEditRole.role);
                      try {
                        setIsRoleUpdating(true);
                        await handleConfirmRoleChange(); // uses your existing async handler
                      } catch (err) {
                        // handle (your handler already shows toast); ensure we unset loading
                        console.error(err);
                      } finally {
                        setIsRoleUpdating(false);
                      }
                    }}
                    disabled={isRoleUpdating}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition cursor-pointer ${
                      isRoleUpdating ? 'bg-amber-300 text-white cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                    aria-busy={isRoleUpdating}
                  >
                    {isRoleUpdating ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle size={16} />
                        Update Role
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Activate/Deactivate Modal */}
        <AnimatePresence>
          {showStatusModal && userToUpdateStatus && (
            <motion.div
              key="statusModal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="bg-white rounded-xl shadow-xl border border-amber-200/60 max-w-md w-full overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-amber-50/80">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                      newStatus === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {newStatus === "Active" ? <FiUserCheck size={20} /> : <FiUserX size={20} />}
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-slate-800">
                      {newStatus === "Active" ? "Activate User Account" : "Deactivate User Account"}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {newStatus === "Active"
                        ? "This will allow the user to log back into their account."
                        : "This will temporarily suspend this user’s access."}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                  <div className="bg-slate-50 border border-amber-100 rounded-lg p-4 mb-5">
                    <p className="text-slate-700 text-sm font-medium leading-relaxed">
                      Are you sure you want to{" "}
                      <span className="font-semibold text-amber-700">
                        {newStatus === "Active" ? "activate" : "Deactivate"}
                      </span>{" "}
                      the account of{" "}
                      <span className="font-semibold text-slate-900">
                        {userToUpdateStatus.name}
                      </span>
                      ?
                    </p>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-slate-500">
                    <FiShield className="mt-0.5 text-amber-500" size={14} />
                    <p>
                      {newStatus === "Active"
                        ? "Activated users regain full access immediately."
                        : "Deactivated users will be restricted until reactivated."}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end gap-3">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    disabled={isUpdatingStatus}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-800 transition-all disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirmStatusChange}
                    disabled={isUpdatingStatus}
                    className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all ${
                      newStatus === "Active"
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-slate-700 hover:bg-slate-800"
                    } ${isUpdatingStatus ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isUpdatingStatus ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : newStatus === "Active" ? (
                      <>
                        <FiUserCheck size={15} /> Activate
                      </>
                    ) : (
                      <>
                        <FiUserX size={15} /> Deactivate
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showBulkEmailModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg mx-3 overflow-hidden"
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                {/* Header */}
                <div className="flex justify-between items-center px-5 py-3 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-md flex items-center justify-center">
                      <FiSend size={16} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">Send Bulk Email</h3>
                  </div>
                  <button
                    onClick={() => setShowBulkEmailModal(false)}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-md transition cursor-pointer"
                  >
                    <FiX size={16} />
                  </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-4 text-sm">
                  {/* Role Filter */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
                      Recipient Group
                    </label>
                    <select
                      value={selectedRoleFilter}
                      onChange={(e) => handleRoleFilterChange(e.target.value)}
                      className="w-full border border-slate-200 rounded-md py-2.5 px-3 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    >
                      <option value="ALL">All Users</option>
                      <option value="ADMIN">Admins</option>
                      <option value="DELIVERY-AGENT">Delivery Agents</option>
                      <option value="USER">Users</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={bulkEmailSubject}
                      onChange={(e) => setBulkEmailSubject(e.target.value)}
                      placeholder="Enter subject (e.g., System Update, Announcement)"
                      className="w-full border border-slate-200 rounded-md py-2.5 px-3 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
                      Message
                    </label>
                    <textarea
                      value={bulkEmailMessage}
                      onChange={(e) => setBulkEmailMessage(e.target.value)}
                      placeholder="Type your message here..."
                      rows="5"
                      className="w-full border border-slate-200 rounded-md py-2.5 px-3 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none transition"
                    />
                  </div>

                  {/* Email Preview */}
                  {previewEmails.length > 0 && (
                    <div className="mt-3">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
                        Recipients ({previewEmails.length})
                      </label>
                      <div className="max-h-28 overflow-y-auto border border-slate-200 rounded-md bg-slate-50 p-2 text-xs text-slate-700">
                        {previewEmails.map((email) => (
                          <p key={email} className="truncate">{email}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={() => setShowBulkEmailModal(false)}
                    className="px-4 py-2 rounded-md text-sm text-slate-600 border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSendBulkEmailConfirm}
                    disabled={!bulkEmailSubject.trim() || !bulkEmailMessage.trim() || isSendingBulkEmail}
                    className={`px-5 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition cursor-pointer ${
                      !bulkEmailSubject.trim() || !bulkEmailMessage.trim() || isSendingBulkEmail
                        ? "bg-slate-300 text-white cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600 text-white"
                    }`}
                  >
                    {isSendingBulkEmail ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend size={14} />
                        Send Emails
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDeleteModal && userToDelete && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-red-200 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-start gap-4 px-6 py-5 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
                  <div className="w-11 h-11 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                    <FiTrash2 size={20} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-slate-900 leading-tight">
                      Permanently delete user
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      This action is{" "}
                      <span className="font-semibold text-red-600">irreversible</span>.
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    You are about to permanently remove{" "}
                    <span className="font-semibold text-red-700">
                      {userToDelete.name}
                    </span>
                    . All associated data will be deleted and cannot be recovered.
                  </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeleting}
                    className="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 transition disabled:opacity-60 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className={`px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-all shadow-sm cursor-pointer ${
                      isDeleting
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 hover:shadow-md"
                    }`}
                  >
                    {isDeleting ? "Deleting…" : "Delete User"}
                  </button>
                </div>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default AllUser;