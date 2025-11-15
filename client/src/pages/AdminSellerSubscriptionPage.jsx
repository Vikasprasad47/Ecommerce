import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiList,
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiZap,
} from "react-icons/fi";
import { BsCheck2 } from "react-icons/bs";
import SummaryApi from "../comman/summaryApi";
import Axios from "../utils/network/axios";
import toast from "react-hot-toast";

/**
 * Enhanced AdminSellerSubscriptionPage with professional UI/UX
 * - Improved typography and spacing
 * - Beautiful animated loaders
 * - Custom SVG for empty states
 * - Professional color scheme and animations
 */

const durationOptions = [
  { label: "1 Month", key: "month_1" },
  { label: "3 Months", key: "month_3" },
  { label: "6 Months", key: "month_6" },
  { label: "1 Year", key: "month_12" },
];

const emptyForm = {
  name: "",
  description: "",
  features: "",
  pricing: { month_1: "", month_3: "", month_6: "", month_12: "" },
  isPopular: false,
  badgeText: "",
  productLimit: "",
  storageLimitGB: "",
  priorityLevel: 1,
  status: "ACTIVE",
};

// Beautiful animated loader component
const ShimmerLoader = ({ type = "card" }) => {
  if (type === "card") {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 overflow-hidden">
        <div className="animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-32"></div>
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-48"></div>
            </div>
            <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-8"></div>
          </div>
          <div className="h-8 bg-gradient-to-r from-amber-200 to-amber-300 rounded w-24 mb-4"></div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-5/6"></div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-20"></div>
            <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded mb-3"></div>
      <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4"></div>
    </div>
  );
};

// Custom SVG for empty state
const EmptyStateIllustration = () => (
  <div className="text-center py-12">
    <div className="max-w-md mx-auto">
      <svg
        className="w-48 h-48 mx-auto mb-6 text-slate-300"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M80 40H60C48.9543 40 40 48.9543 40 60V140C40 151.046 48.9543 160 60 160H140C151.046 160 160 151.046 160 140V120"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <rect
          x="80"
          y="50"
          width="70"
          height="30"
          rx="4"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="80"
          y="90"
          width="50"
          height="10"
          rx="2"
          fill="currentColor"
          fillOpacity="0.1"
        />
        <rect
          x="80"
          y="110"
          width="60"
          height="10"
          rx="2"
          fill="currentColor"
          fillOpacity="0.1"
        />
        <rect
          x="80"
          y="130"
          width="40"
          height="10"
          rx="2"
          fill="currentColor"
          fillOpacity="0.1"
        />
        <path
          d="M120 30L150 50H120V30Z"
          fill="currentColor"
          fillOpacity="0.2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="160"
          cy="80"
          r="20"
          fill="#FBBF24"
          fillOpacity="0.2"
          stroke="#F59E0B"
          strokeWidth="2"
        />
        <path
          d="M155 75L165 85M165 75L155 85"
          stroke="#F59E0B"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <h3 className="text-xl font-semibold text-slate-600 mb-2">
        No subscription plans yet
      </h3>
      <p className="text-slate-500 mb-6 max-w-sm mx-auto">
        Get started by creating your first subscription plan to offer sellers various pricing options and features.
      </p>
    </div>
  </div>
);

const AdminSellerSubscriptionPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [viewMode, setViewMode] = useState("card");
  const [selectedDuration, setSelectedDuration] = useState("month_1");

  // modal / form state
  const [showEditor, setShowEditor] = useState(false);
  const [editorLoading, setEditorLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  // search
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Axios({ ...SummaryApi.getAllSubscriptionPlans });
      if (res?.data?.success) {
        setPlans(res.data.plans || []);
      } else {
        setPlans([]);
      }
    } catch (err) {
      console.error("Failed to fetch plans:", err);
      toast.error("Unable to load plans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // filter display by search
  const visiblePlans = plans.filter((p) =>
    p.name?.toLowerCase().includes(search.trim().toLowerCase())
  );

  const openEditor = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setForm({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features.join(", ") : String(plan.features || ""),
        pricing: { ...plan.pricing },
      });
    } else {
      setEditingPlan(null);
      setForm({ ...emptyForm });
    }
    setShowEditor(true);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setEditorLoading(true);
    
    const payload = {
      ...form,
      features: form.features ? form.features.split(",").map((f) => f.trim()).filter(Boolean) : [],
      pricing: {
        month_1: Number(form.pricing.month_1) || 0,
        month_3: Number(form.pricing.month_3) || 0,
        month_6: Number(form.pricing.month_6) || 0,
        month_12: Number(form.pricing.month_12) || 0,
      },
      productLimit: form.productLimit ? Number(form.productLimit) : undefined,
      storageLimitGB: form.storageLimitGB ? Number(form.storageLimitGB) : undefined,
      priorityLevel: form.priorityLevel ? Number(form.priorityLevel) : 1,
    };

    try {
      if (editingPlan) {
        const res = await Axios({
          ...SummaryApi.updateSubscriptionPlan,
          data: { id: editingPlan._id, ...payload },
        });
        if (res?.data?.success) {
          toast.success("Plan updated successfully");
          fetchPlans();
          setShowEditor(false);
        } else {
          toast.error(res?.data?.message || "Update failed");
        }
      } else {
        const res = await Axios({
          ...SummaryApi.createSubscriptionPlan,
          data: payload,
        });
        if (res?.data?.success) {
          toast.success("Plan created successfully");
          fetchPlans();
          setShowEditor(false);
        } else {
          toast.error(res?.data?.message || "Create failed");
        }
      }
    } catch (err) {
      console.error("Save error", err);
      toast.error("Something went wrong");
    } finally {
      setEditorLoading(false);
    }
  };

  const confirmDelete = (plan) => {
    setPlanToDelete(plan);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!planToDelete) return;
    try {
      const res = await Axios({
        ...SummaryApi.deleteSubscriptionPlan,
        data: { id: planToDelete._id },
      });
      if (res?.data?.success) {
        toast.success("Plan deleted successfully");
        fetchPlans();
      } else {
        toast.error(res?.data?.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Delete failed");
    } finally {
      setShowDeleteConfirm(false);
      setPlanToDelete(null);
    }
  };

  const setField = (path, value) => {
    if (path.startsWith("pricing.")) {
      const key = path.split(".")[1];
      setForm((s) => ({ ...s, pricing: { ...s.pricing, [key]: value } }));
    } else {
      setForm((s) => ({ ...s, [path]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-4 border border-slate-200/60 shadow-sm shadow-slate-200/50 mb-4"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Subscription Plans
              </h1>
              <p className="text-slate-600 text-sm font-light max-w-2xl">
                Manage subscription plans for sellers with.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Search */}
              <div className="relative group w-full">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-amber-500" />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search plans..."
                  className="pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-base w-full sm:w-72 focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-all duration-200 shadow-sm"
                />
              </div>

              {/* View toggle */}
              <div className="bg-slate-100 rounded-2xl p-1.5 flex items-center gap-1 border border-slate-200/50">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2.5 rounded-xl text-sm transition-all duration-200 ${
                    viewMode === "table" 
                      ? "bg-white shadow-sm text-slate-900 shadow-slate-200/50" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  title="Table view"
                >
                  <FiList size={18} />
                </button>
                <button
                  onClick={() => setViewMode("card")}
                  className={`p-2.5 rounded-xl text-sm transition-all duration-200 ${
                    viewMode === "card" 
                      ? "bg-white shadow-sm text-slate-900 shadow-slate-200/50" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  title="Card view"
                >
                  <FiGrid size={18} />
                </button>
              </div>

              {/* Add plan */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openEditor(null)}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3.5 rounded-2xl text-base font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200"
              >
                <FiPlus size={20} /> Create
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Duration selector */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-slate-200/60 shadow-sm inline-flex gap-1">
            {durationOptions.map((d) => (
              <button
                key={d.key}
                onClick={() => setSelectedDuration(d.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedDuration === d.key
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/25"
                    : "text-slate-600 hover:text-slate-800 hover:bg-white"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        {viewMode === "table" ? (
          // Enhanced Table View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl border border-slate-200/60 shadow-sm shadow-slate-200/50 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200/60">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Plan Details</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Price</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Limits</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-center text-sm font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-slate-200/60">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {Array.from({ length: 5 }).map((_, cellIndex) => (
                          <td key={cellIndex} className="px-8 py-6">
                            <ShimmerLoader />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : visiblePlans.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-16">
                        <EmptyStateIllustration />
                      </td>
                    </tr>
                  ) : (
                    visiblePlans.map((p) => (
                      <motion.tr 
                        key={p._id} 
                        className="hover:bg-slate-50/50 transition-colors duration-200 group"
                        whileHover={{ scale: 1.002 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-slate-900 text-lg">{p.name}</h3>
                              {p.isPopular && (
                                <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200/60">
                                  <FiStar size={12} className="fill-amber-400" />
                                  {p.badgeText || "Popular"}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 mt-2 leading-relaxed">{p.description}</p>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <div className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            ₹{p.pricing?.[selectedDuration] ?? 0}
                          </div>
                          <div className="text-sm text-slate-500 mt-1">per {durationOptions.find(d => d.key === selectedDuration)?.label.toLowerCase()}</div>
                        </td>

                        <td className="px-8 py-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <FiZap size={14} className="text-amber-500" />
                              Products: <span className="font-semibold">{p.productLimit ?? "—"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <FiZap size={14} className="text-amber-500" />
                              Storage: <span className="font-semibold">{p.storageLimitGB ?? "—"} GB</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                            p.status === "ACTIVE" 
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200/60" 
                              : "bg-slate-100 text-slate-600 border border-slate-200/60"
                          }`}>
                            {p.status}
                          </span>
                        </td>

                        <td className="px-8 py-6">
                          <div className="flex justify-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openEditor(p)}
                              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white hover:text-slate-800 hover:border-slate-300 transition-all duration-200 shadow-sm"
                            >
                              <FiEdit size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => confirmDelete(p)}
                              className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-all duration-200 shadow-sm"
                            >
                              <FiTrash2 size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          // Enhanced Card View
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <ShimmerLoader key={i} type="card" />
              ))
            ) : visiblePlans.length === 0 ? (
              <div className="col-span-full">
                <EmptyStateIllustration />
              </div>
            ) : (
              visiblePlans.map((p) => (
                <motion.div
                  key={p._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ 
                    y: -8,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                  className="relative group"
                >
                  <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/30 transition-all duration-300 h-full flex flex-col">
                    {/* Quick actions */}
                    <div className="absolute top-5 right-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEditor(p)} 
                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-800 shadow-sm"
                      >
                        <FiEdit size={14} />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => confirmDelete(p)} 
                        className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:text-rose-700 shadow-sm"
                      >
                        <FiTrash2 size={14} />
                      </motion.button>
                    </div>

                    {/* Popular badge */}
                    {p.isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg shadow-amber-500/25">
                          <FiStar size={12} className="fill-white" />
                          {p.badgeText || "Most Popular"}
                        </span>
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{p.name}</h3>
                      <p className="text-slate-600 leading-relaxed mb-4">{p.description}</p>

                      <div className="mb-6">
                        <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                          ₹{p.pricing?.[selectedDuration] ?? 0}
                        </div>
                        <div className="text-sm text-slate-500">per {durationOptions.find(d => d.key === selectedDuration)?.label.toLowerCase()}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-3 rounded-2xl bg-slate-50/50 border border-slate-200/50">
                          <div className="text-sm text-slate-600 mb-1">Products</div>
                          <div className="text-lg font-semibold text-slate-900">{p.productLimit ?? "—"}</div>
                        </div>
                        <div className="text-center p-3 rounded-2xl bg-slate-50/50 border border-slate-200/50">
                          <div className="text-sm text-slate-600 mb-1">Storage</div>
                          <div className="text-lg font-semibold text-slate-900">{p.storageLimitGB ?? "—"} GB</div>
                        </div>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {Array.isArray(p.features) && p.features.slice(0, 4).map((f, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 text-sm text-slate-700"
                          >
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <BsCheck2 className="text-emerald-600 text-xs" />
                            </div>
                            <span>{f}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-200/60">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openEditor(p)}
                        className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-sm font-medium"
                      >
                        Edit Plan
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => confirmDelete(p)}
                        className="px-4 py-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition-all duration-200 text-sm font-medium"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>

      {/* ⚡ Compact Professional Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop (no blur) */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowEditor(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative z-10 w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    {editingPlan ? "Edit Subscription Plan" : "Create Subscription Plan"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {editingPlan
                      ? "Modify your existing plan details."
                      : "Define pricing and limits for a new seller plan."}
                  </p>
                </div>
                <button
                  onClick={() => setShowEditor(false)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <FiX size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1.5">
                {/* Name & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Plan Name
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      placeholder="e.g., Premium Plan"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Badge Text
                    </label>
                    <input
                      value={form.badgeText}
                      onChange={(e) => setField("badgeText", e.target.value)}
                      placeholder="Optional badge label"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Describe what this plan offers..."
                    rows={2}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-all resize-none"
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Features
                  </label>
                  <input
                    value={form.features}
                    onChange={(e) => setField("features", e.target.value)}
                    placeholder="e.g., 100 listings, 10GB storage"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-all"
                  />
                </div>

                {/* Pricing */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Pricing (₹)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.keys(form.pricing).map((k) => (
                      <div key={k}>
                        <label className="block text-[10px] text-slate-400 mb-0.5 capitalize">
                          {k.replace("month_", "")} Mo
                        </label>
                        <input
                          type="number"
                          value={form.pricing[k]}
                          onChange={(e) => setField(`pricing.${k}`, e.target.value)}
                          placeholder="0"
                          className="w-full border border-slate-200 rounded-md px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-amber-400/40 focus:border-amber-400 outline-none transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Limits */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Product Limit
                    </label>
                    <input
                      type="number"
                      value={form.productLimit}
                      onChange={(e) => setField("productLimit", e.target.value)}
                      placeholder="Unlimited"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-400/50 focus:border-amber-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Storage (GB)
                    </label>
                    <input
                      type="number"
                      value={form.storageLimitGB}
                      onChange={(e) => setField("storageLimitGB", e.target.value)}
                      placeholder="Storage in GB"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-400/50 focus:border-amber-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => setField("status", e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-1 focus:ring-amber-400/50 focus:border-amber-400 outline-none"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                </div>

                {/* Popular Toggle */}
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/70">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={!!form.isPopular}
                      onChange={(e) => setField("isPopular", e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                    />
                    Popular plan
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Priority</span>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={form.priorityLevel}
                      onChange={(e) =>
                        setField("priorityLevel", Number(e.target.value))
                      }
                      className="w-14 border border-slate-200 rounded-md px-2 py-1 text-xs text-center focus:ring-1 focus:ring-amber-400/40 focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <motion.button
                    type="button"
                    onClick={() => setShowEditor(false)}
                    disabled={editorLoading}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={editorLoading}
                    whileHover={editorLoading ? {} : { scale: 1.03 }}
                    whileTap={editorLoading ? {} : { scale: 0.97 }}
                    className={`px-5 py-2 text-xs font-semibold rounded-md text-white transition-all ${
                      editorLoading
                        ? "bg-amber-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-sm"
                    }`}
                  >
                    {editorLoading ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : editingPlan ? (
                      "Update"
                    ) : (
                      "Create"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && planToDelete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowDeleteConfirm(false)} />
            <motion.div
              className="bg-white rounded-3xl shadow-2xl border border-rose-100 w-full max-w-md mx-auto p-8 relative z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiTrash2 className="text-rose-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Plan</h3>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to delete <span className="font-semibold text-slate-900">{planToDelete.name}</span>? This action cannot be undone.
                </p>

                <div className="flex justify-center gap-3">
                  <motion.button
                    onClick={() => { setShowDeleteConfirm(false); setPlanToDelete(null); }}
                    className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleDelete}
                    className="px-6 py-3 rounded-2xl bg-rose-600 text-white hover:bg-rose-700 font-medium transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Delete Plan
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSellerSubscriptionPage;