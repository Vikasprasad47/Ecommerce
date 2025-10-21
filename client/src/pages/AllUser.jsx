import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from "../utils/axios";
import SummaryApi from "../comman/summaryApi";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  FiActivity
} from 'react-icons/fi';

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
  const defaultImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const pageQuery = parseInt(searchParams.get("page") || "1");
  const filterType = searchParams.get("filter") || "name";

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [searchField, setSearchField] = useState(filterType);
  const [currentPage, setCurrentPage] = useState(pageQuery);
  const usersPerPage = 12;

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

  const handleSendEmailConfirm = async () => {
    // Implement email sending logic here
    console.log('Sending email to:', selectedUser.email, 'Content:', emailContent);
    setShowSendEmailModal(false);
    setSelectedUser(null);
    setEmailContent('');
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

  const ExportButton = () => (
    <button className="flex items-center gap-2 px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium">
      <FiSend size={16} />
      Send bulk Email
    </button>
  );

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
      <div className="w-full mx-auto px-4 pb-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-slate-200">
          <div className="flex flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="font-bold text-2xl text-slate-800">User Management</h2>
              <p className="text-slate-600 mt-1">Manage and view all user accounts</p>
            </div>
            
            <div className="flex items-center gap-3">
              <ExportButton />
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
                                  onClick={() => handleDeactivateClick(user)}
                                  className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Deactivate User"
                                >
                                  <FiUserX size={18} />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleActivateUser(user._id)}
                                  className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                  title="Activate User"
                                >
                                  <FiUserCheck size={18} />
                                </button>
                              )}
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
                          <h3 className="font-semibold text-slate-900 truncate max-w-[120px]">{user.name}</h3>
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
                        <FiMail size={14} className="text-slate-400 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FiPhone size={14} className="text-slate-400 flex-shrink-0" />
                        <span>{user.mobile || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FiStar size={14} className="text-slate-400 flex-shrink-0" />
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
                          onClick={() => handleDeactivateClick(user)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors font-medium"
                        >
                          <FiUserX size={14} />
                          Deactivate
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleActivateUser(user._id)}
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
              className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Header */}
                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md">
                      <FiUser size={24} className="" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">User Profile</h3>
                      <p className="text-slate-500 text-sm">Complete user information and details</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-2 rounded-xl transition-all duration-200"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                  <div className="p-6 space-y-6">
                    {/* Profile Header */}
                    <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
                      <img 
                        src={selectedUser.avatar || defaultImg} 
                        alt={selectedUser.name} 
                        className="w-17 h-17 rounded-full object-cover border-4 border-white shadow-lg" 
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-bold text-2xl text-slate-900">{selectedUser.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className='text-red-600'>
                              ({selectedUser.role})
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`flex items-center gap-2 ${selectedUser.verify_email ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {selectedUser.verify_email ? (
                              <><FiCheckCircle size={16} className="text-emerald-500" /> Email Verified</>
                            ) : (
                              <><FiAlertCircle size={16} className="text-amber-500" /> Email Not Verified</>
                            )}
                          </span>
                        </div>
                        <span>
                          Status: {selectedUser.status}
                        </span>
                      </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div className="space-y-2">
                        <h5 className="font-semibold text-slate-900 text-lg flex items-center gap-2">
                          <FiUser size={18} className="text-blue-500" />
                          Personal Information
                        </h5>
                        
                        <div className="space-y-4 bg-slate-50 rounded-xl p-4 grid grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                              <FiMail size={14} className="text-slate-400" />
                              Email Address
                            </label>
                            <p className="text-slate-900 font-medium">{selectedUser.email}</p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                              <FiPhone size={14} className="text-slate-400" />
                              Phone Number
                            </label>
                            <p className="text-slate-900 font-medium">{selectedUser.mobile || "Not provided"}</p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                              <FiCalendar size={14} className="text-slate-400" />
                              Date of Birth
                            </label>
                            <p className="text-slate-900 font-medium">{formatDate(selectedUser.dob) || "Not provided"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Account Information */}
                      <div className="space-y-2">
                        <h5 className="font-semibold text-slate-900 text-lg flex items-center gap-2">
                          <FiCreditCard size={18} className="text-purple-500" />
                          Account Information
                        </h5>
                        
                        <div className="space-y-4 bg-slate-50 rounded-xl p-4 grid grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Member Since</label>
                            <p className="text-slate-900 font-medium">{formatDate(selectedUser.createdAt)}</p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Super Coins Balance:</label>
                              <p className="text-slate-900 font-medium">{selectedUser.superCoins?.balance || 0} coins</p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Last Updated</label>
                            <p className="text-slate-900 font-medium">{formatDate(selectedUser.updatedAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-3 pb-3 border-t border-slate-200">
                      <button
                        onClick={() => handleSendEmail(selectedUser)}
                        className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <FiMail size={16} />
                        Send Email
                      </button>
                      <button
                        onClick={() => setShowUserModal(false)}
                        className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Deactivate Confirmation Modal */}
        <AnimatePresence>
          {showDeactivateModal && userToDeactivate && (
            <motion.div
              className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div
                className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center shadow-inner">
                    <FiUserX size={28} className="text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-800">Deactivate User Account</h3>
                    <p className="text-slate-600 mt-1">This action will restrict user access</p>
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6">
                  <p className="text-rose-800 text-sm font-medium">
                    Are you sure you want to deactivate <span className="font-bold">{userToDeactivate.name}</span>? 
                    They will no longer be able to access their account and all active sessions will be terminated.
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeactivateModal(false)}
                    className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeactivateConfirm}
                    className="px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                  >
                    Confirm Deactivation
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
              className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div
                className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FiSend size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-slate-800">Send Email Message</h3>
                      <p className="text-slate-600 text-sm">Compose and send email to user</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSendEmailModal(false)}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-all duration-200 cursor-pointer"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Recipient Name</label>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl font-medium text-slate-900">
                        {selectedUser.name}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Email Address</label>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl font-medium text-slate-900">
                        {selectedUser.email}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-3 block">Message Content</label>
                    <textarea
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      placeholder="Type your message here... You can include greetings, notifications, or any important information for the user."
                      rows="5"
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-slate-700 bg-slate-50 font-medium outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowSendEmailModal(false)}
                    className="px-6 py-3 bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-all duration-200 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendEmailConfirm}
                    className="px-8 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <FiSend size={16} />
                    Send Message
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