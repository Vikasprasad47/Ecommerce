import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiList,
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiX,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import { BsCheck2 } from "react-icons/bs";
import SummaryApi from "../comman/summaryApi";
import Axios from "../utils/network/axios";
import toast from "react-hot-toast";

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

// Simple skeleton loader
const ShimmerLoader = () => (
  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm animate-pulse space-y-3">
    <div className="h-4 bg-slate-200 rounded w-2/3" />
    <div className="h-4 bg-slate-200 rounded w-1/3" />
    <div className="h-4 bg-slate-200 rounded w-3/4" />
    <div className="h-8 bg-slate-200 rounded w-1/2 mt-2" />
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16">
    <h3 className="text-lg font-semibold text-slate-700">
      No subscription plans yet
    </h3>
    <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
      Create your first plan to start offering pricing tiers to sellers.
    </p>
  </div>
);

const AdminSellerSubscriptionPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState("card");
  const [selectedDuration, setSelectedDuration] = useState("month_1");

  const [showEditor, setShowEditor] = useState(false);
  const [editorLoading, setEditorLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

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

  const visiblePlans = useMemo(
    () =>
      plans.filter((p) =>
        p.name?.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [plans, search]
  );

  // Dashboard stats for top strip
  const stats = useMemo(() => {
    if (!plans.length) {
      return {
        total: 0,
        active: 0,
        popular: 0,
        minPrice: 0,
        maxPrice: 0,
      };
    }
    const active = plans.filter((p) => p.status === "ACTIVE").length;
    const popular = plans.filter((p) => p.isPopular).length;
    const prices = plans
      .map((p) => Number(p.pricing?.[selectedDuration]) || 0)
      .filter((n) => n > 0);
    return {
      total: plans.length,
      active,
      popular,
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 0,
    };
  }, [plans, selectedDuration]);

  const openEditor = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setForm({
        ...plan,
        features: Array.isArray(plan.features)
          ? plan.features.join(", ")
          : String(plan.features || ""),
        pricing: { ...plan.pricing },
      });
    } else {
      setEditingPlan(null);
      setForm({ ...emptyForm });
    }
    setShowEditor(true);
  };

  const setField = (path, value) => {
    if (path.startsWith("pricing.")) {
      const key = path.split(".")[1];
      setForm((prev) => ({
        ...prev,
        pricing: { ...prev.pricing, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [path]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditorLoading(true);

    const payload = {
      ...form,
      features: form.features
        ? form.features
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
      pricing: {
        month_1: Number(form.pricing.month_1) || 0,
        month_3: Number(form.pricing.month_3) || 0,
        month_6: Number(form.pricing.month_6) || 0,
        month_12: Number(form.pricing.month_12) || 0,
      },
      productLimit: form.productLimit ? Number(form.productLimit) : 0,
      storageLimitGB: form.storageLimitGB ? Number(form.storageLimitGB) : 0,
      priorityLevel: form.priorityLevel ? Number(form.priorityLevel) : 1,
    };

    try {
      if (editingPlan) {
        const res = await Axios({
          ...SummaryApi.updateSubscriptionPlan,
          data: { id: editingPlan._id, ...payload },
        });
        if (res?.data?.success) {
          toast.success("Plan updated");
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
          toast.success("Plan created");
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
        toast.success("Plan deleted");
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

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* === TOP HEADER + CONTROLS === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          {/* Left: Title + Subtitle */}
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Seller Subscription Plans
            </h1>
            <p className="text-sm text-slate-600">
              Configure pricing tiers, limits, and popularity for seller plans.
            </p>
          </div>

          {/* Right: Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search plans..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
              />
            </div>

            {/* View mode switch */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg text-sm cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white shadow text-slate-900"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Table view"
              >
                <FiList size={17} />
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-lg text-sm cursor-pointer ${
                  viewMode === "card"
                    ? "bg-white shadow text-slate-900"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Card view"
              >
                <FiGrid size={17} />
              </button>
            </div>

            {/* Add plan */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openEditor(null)}
              className="inline-flex cursor-pointer items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium shadow hover:bg-amber-700"
            >
              <FiPlus size={16} />
              <span>Create Plan</span>
            </motion.button>
          </div>
        </motion.div>

        {/* === STATS STRIP (UNIQUE TOUCH) === */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-slate-500 tracking-wide">
                Total Plans
              </p>
              <p className="text-xl font-semibold text-slate-900 mt-1">
                {stats.total}
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-600">
              Active: {stats.active}
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-slate-500 tracking-wide">
                Popular Plans
              </p>
              <p className="text-xl font-semibold text-slate-900 mt-1 flex items-center gap-1.5">
                <FiStar className="text-amber-500" />
                {stats.popular}
              </p>
            </div>
            <p className="text-[11px] text-slate-500">
              Mark plans as <span className="font-medium">Popular</span> in edit
              modal.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-slate-500 tracking-wide">
                {durationOptions.find((d) => d.key === selectedDuration)?.label}{" "}
                Range
              </p>
              <p className="text-xl font-semibold text-slate-900 mt-1">
                ₹{stats.minPrice} – ₹{stats.maxPrice}
              </p>
            </div>
            <FiTrendingUp className="text-slate-500" />
          </div>
        </motion.div>

        {/* === DURATION SELECTOR === */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            {durationOptions.map((d) => (
              <button
                key={d.key}
                onClick={() => setSelectedDuration(d.key)}
                className={`px-4 py-1.5 text-xs sm:text-sm rounded-lg font-medium cursor-pointer ${
                  selectedDuration === d.key
                    ? "bg-amber-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* === CONTENT === */}
        {viewMode === "card" ? (
          // CARD VIEW
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-5">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <ShimmerLoader key={i} />)
            ) : visiblePlans.length === 0 ? (
              <div className="col-span-full">
                <EmptyState />
              </div>
            ) : (
              visiblePlans.map((p) => (
                <motion.div
                  key={p._id}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 250, damping: 22 }}
                  className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col"
                >
                  {/* Badge */}
                  {(p.badgeText || p.isPopular) && (
                    <div className="absolute -top-3 left-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-[11px] font-medium text-amber-700">
                        <FiStar className="text-amber-500" size={12} />
                        {p.badgeText || "Popular"}
                      </span>
                    </div>
                  )}

                  {/* Top row: name + status */}
                  <div className="flex justify-between items-start gap-3 mt-1">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                        p.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  {/* Price + Duration */}
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs uppercase text-slate-500">
                        {durationOptions.find(
                          (d) => d.key === selectedDuration
                        )?.label || ""}{" "}
                        price
                      </p>
                      <p className="text-2xl font-semibold text-slate-900 mt-1">
                        ₹{p.pricing?.[selectedDuration] ?? 0}
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-slate-500">
                      <p>Products:{" "}
                        <span className="font-medium text-slate-800">
                          {p.productLimit || "—"}
                        </span>
                      </p>
                      <p>
                        Storage:{" "}
                        <span className="font-medium text-slate-800">
                          {p.storageLimitGB || 0} GB
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Features list */}
                  <ul className="mt-4 space-y-2 flex-1">
                    {Array.isArray(p.features) &&
                      p.features.slice(0, 4).map((f, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-xs text-slate-700"
                        >
                          <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <BsCheck2 className="text-emerald-600 text-[10px]" />
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                  </ul>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 mt-4 border-t border-slate-200">
                    <button
                      onClick={() => openEditor(p)}
                      className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(p)}
                      className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          // TABLE VIEW
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-xs text-slate-600 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Plan</th>
                  <th className="px-6 py-3 text-left font-medium">Pricing</th>
                  <th className="px-6 py-3 text-left font-medium">Limits</th>
                  <th className="px-6 py-3 text-center font-medium">
                    Popular
                  </th>
                  <th className="px-6 py-3 text-center font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx}>
                      <td colSpan={5} className="px-6 py-4">
                        <ShimmerLoader />
                      </td>
                    </tr>
                  ))
                ) : visiblePlans.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState />
                    </td>
                  </tr>
                ) : (
                  visiblePlans.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-900">
                            {p.name}
                          </span>
                          <span className="text-xs text-slate-600">
                            {p.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="text-sm font-semibold text-slate-900">
                          ₹{p.pricing?.[selectedDuration] ?? 0}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {durationOptions.find(
                            (d) => d.key === selectedDuration
                          )?.label || ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top text-xs text-slate-700">
                        <div>Products: {p.productLimit || "—"}</div>
                        <div>Storage: {p.storageLimitGB || 0} GB</div>
                      </td>
                      <td className="px-6 py-4 align-top text-center">
                        {p.isPopular ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] border border-amber-200">
                            <FiStar size={12} />
                            {p.badgeText || "Popular"}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top text-center">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => openEditor(p)}
                            className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 cursor-pointer"
                          >
                            <FiEdit size={15} />
                          </button>
                          <button
                            onClick={() => confirmDelete(p)}
                            className="p-2 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* === EDITOR MODAL === */}
        <AnimatePresence>
          {showEditor && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                className="bg-white w-full max-w-lg rounded-xl border border-slate-200 shadow-lg p-5"
              >
                {/* Modal header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      {editingPlan ? "Edit Subscription Plan" : "Create Plan"}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Define pricing, limits and visibility for this seller plan.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEditor(false)}
                    className="p-1.5 rounded-md hover:bg-slate-100"
                  >
                    <FiX size={16} />
                  </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 max-h-[65vh] overflow-y-auto pr-1"
                >
                  {/* Row: name + badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        Plan Name
                      </label>
                      <input
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Basic / Standard / Premium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        Badge Text (optional)
                      </label>
                      <input
                        value={form.badgeText}
                        onChange={(e) => setField("badgeText", e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="e.g. Best Seller"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={form.description}
                      onChange={(e) => setField("description", e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 resize-none"
                      placeholder="Short description of the plan benefits..."
                    />
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Features (comma-separated)
                    </label>
                    <input
                      value={form.features}
                      onChange={(e) => setField("features", e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="100 listings, 10GB storage, priority support"
                    />
                  </div>

                  {/* Pricing */}
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      Pricing (₹)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                      {Object.keys(form.pricing).map((key) => (
                        <div key={key}>
                          <div className="text-[11px] text-slate-500 mb-0.5 capitalize">
                            {key === "month_12"
                              ? "12 Months"
                              : key === "month_6"
                              ? "6 Months"
                              : key === "month_3"
                              ? "3 Months"
                              : "1 Month"}
                          </div>
                          <input
                            type="number"
                            value={form.pricing[key]}
                            onChange={(e) =>
                              setField(`pricing.${key}`, e.target.value)
                            }
                            className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Limits */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        Product Limit
                      </label>
                      <input
                        type="number"
                        value={form.productLimit}
                        onChange={(e) =>
                          setField("productLimit", e.target.value)
                        }
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="e.g. 100 / 500 / 0 = unlimited"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        Storage (GB)
                      </label>
                      <input
                        type="number"
                        value={form.storageLimitGB}
                        onChange={(e) =>
                          setField("storageLimitGB", e.target.value)
                        }
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="e.g. 10 / 25"
                      />
                    </div>
                  </div>

                  {/* Status + Popular */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        Status
                      </label>
                      <select
                        value={form.status}
                        onChange={(e) => setField("status", e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        Priority (for ordering)
                      </label>
                      <input
                        type="number"
                        value={form.priorityLevel}
                        onChange={(e) =>
                          setField("priorityLevel", e.target.value)
                        }
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        min={1}
                        max={10}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!form.isPopular}
                        onChange={(e) =>
                          setField("isPopular", e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-slate-700">
                        Mark as <span className="font-medium">Popular</span>{" "}
                        plan
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowEditor(false)}
                      className="px-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={editorLoading}
                      className={`px-5 py-2 text-xs sm:text-sm rounded-lg text-white ${
                        editorLoading
                          ? "bg-amber-300 cursor-not-allowed"
                          : "bg-amber-600 hover:bg-amber-700"
                      }`}
                    >
                      {editorLoading
                        ? "Saving..."
                        : editingPlan
                        ? "Update Plan"
                        : "Create Plan"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* === DELETE CONFIRM MODAL === */}
        <AnimatePresence>
          {showDeleteConfirm && planToDelete && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                className="bg-white w-full max-w-sm rounded-xl border border-slate-200 shadow-lg p-5"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  Delete plan
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  Are you sure you want to delete{" "}
                  <span className="font-medium">{planToDelete.name}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2 mt-5">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-xs sm:text-sm rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                  >
                    Delete
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

export default AdminSellerSubscriptionPage;
