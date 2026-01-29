// import React, { useEffect, useState } from "react";
// import { FiMail, FiUser, FiPhone, FiTrash2, FiEye, FiCheckCircle, FiClock } from "react-icons/fi";
// import { MdOutlinePending } from "react-icons/md";
// import Axios from "../utils/network/axios"; // ✅ your configured Axios instance
// import SummaryApi from "../comman/summaryApi";
// import { motion, AnimatePresence } from "framer-motion";

// const CustomerSupportMessages = () => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [updating, setUpdating] = useState(false);
//   const [deleting, setDeleting] = useState(null);

//   // ✅ Fetch all contact messages
//   const fetchMessages = async () => {
//     try {
//       setLoading(true);
//       const res = await Axios({
//         method: SummaryApi.getAllContactsMessage.method,
//         url: SummaryApi.getAllContactsMessage.url,
//       });
//       if (res.data.success) {
//         setMessages(res.data.data);
//       }
//     } catch (err) {
//       console.error("❌ Failed to fetch contact messages:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Update message status (Pending → Resolved)
//   const handleUpdateStatus = async (id, newStatus) => {
//     try {
//       setUpdating(true);
//       await Axios({
//         method: SummaryApi.getAllContactsMessage.method,
//         url: SummaryApi.getAllContactsMessage.url,
//         data: { id, status: newStatus },
//       });
//       fetchMessages();
//     } catch (err) {
//       console.error("❌ Error updating status:", err);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // ✅ Delete message
//   const handleDelete = async (id) => {
//     try {
//       setDeleting(id);
//       await Axios({
//         method: SummaryApi.deleteContactMessage.method,
//         url: SummaryApi.deleteContactMessage.url,
//         data: { id },
//       });
//       setMessages((prev) => prev.filter((msg) => msg._id !== id));
//     } catch (err) {
//       console.error("❌ Error deleting message:", err);
//     } finally {
//       setDeleting(null);
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
//         <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
//           <h1 className="text-lg font-bold text-gray-800">Customer Support Messages</h1>
//           <button
//             onClick={fetchMessages}
//             className="text-sm text-blue-600 hover:underline"
//             disabled={loading}
//           >
//             {loading ? "Refreshing..." : "Refresh"}
//           </button>
//         </div>

//         {/* Table Section */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm text-left text-gray-700">
//             <thead className="bg-gray-100 border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-3 font-semibold">Name</th>
//                 <th className="px-6 py-3 font-semibold">Email</th>
//                 <th className="px-6 py-3 font-semibold">Subject</th>
//                 <th className="px-6 py-3 font-semibold">Status</th>
//                 <th className="px-6 py-3 font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {messages.length === 0 && !loading && (
//                 <tr>
//                   <td colSpan="5" className="text-center py-8 text-gray-500">
//                     No messages found.
//                   </td>
//                 </tr>
//               )}

//               {loading && (
//                 <tr>
//                   <td colSpan="5" className="text-center py-8 text-gray-400">
//                     Loading messages...
//                   </td>
//                 </tr>
//               )}

//               {messages.map((msg) => (
//                 <tr
//                   key={msg._id}
//                   className="border-b border-gray-100 hover:bg-gray-50 transition"
//                 >
//                   <td className="px-6 py-4 flex items-center space-x-2">
//                     <FiUser className="text-gray-500" />
//                     <span>{msg.name}</span>
//                   </td>
//                   <td className="px-6 py-4 flex items-center space-x-2">
//                     <FiMail className="text-gray-500" />
//                     <span>{msg.email}</span>
//                   </td>
//                   <td className="px-6 py-4">{msg.subject}</td>
//                   <td className="px-6 py-4">
//                     <span
//                       className={`px-2 py-1 text-xs rounded-full font-medium ${
//                         msg.status === "Resolved"
//                           ? "bg-green-100 text-green-700"
//                           : "bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {msg.status || "Pending"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 flex items-center space-x-4">
//                     <button
//                       onClick={() => setSelectedMessage(msg)}
//                       className="text-gray-600 hover:text-blue-600"
//                     >
//                       <FiEye size={18} />
//                     </button>

//                     <button
//                       onClick={() =>
//                         handleUpdateStatus(
//                           msg._id,
//                           msg.status === "Resolved" ? "Pending" : "Resolved"
//                         )
//                       }
//                       disabled={updating}
//                       className="text-gray-600 hover:text-green-600 disabled:opacity-50"
//                     >
//                       {msg.status === "Resolved" ? (
//                         <MdOutlinePending size={18} />
//                       ) : (
//                         <FiCheckCircle size={18} />
//                       )}
//                     </button>

//                     <button
//                       onClick={() => handleDelete(msg._id)}
//                       disabled={deleting === msg._id}
//                       className="text-gray-600 hover:text-red-600 disabled:opacity-50"
//                     >
//                       <FiTrash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ✅ Modal for Message Details */}
//       <AnimatePresence>
//         {selectedMessage && (
//           <motion.div
//             className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6"
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//             >
//               <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
//                 <h2 className="text-lg font-semibold text-gray-800">Message Details</h2>
//                 <button
//                   onClick={() => setSelectedMessage(null)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="space-y-3 text-sm text-gray-700">
//                 <div className="flex items-center space-x-2">
//                   <FiUser className="text-gray-500" />
//                   <span className="font-medium">{selectedMessage.name}</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <FiMail className="text-gray-500" />
//                   <span>{selectedMessage.email}</span>
//                 </div>
//                 {selectedMessage.phone && (
//                   <div className="flex items-center space-x-2">
//                     <FiPhone className="text-gray-500" />
//                     <span>{selectedMessage.phone}</span>
//                   </div>
//                 )}
//                 <div className="flex items-center space-x-2">
//                   <FiClock className="text-gray-500" />
//                   <span>
//                     {new Date(selectedMessage.createdAt).toLocaleString()}
//                   </span>
//                 </div>
//                 <p className="mt-4 text-gray-800 border-t border-gray-100 pt-3 whitespace-pre-line">
//                   {selectedMessage.message}
//                 </p>
//               </div>

//               <div className="mt-6 flex justify-end">
//                 <button
//                   onClick={() => setSelectedMessage(null)}
//                   className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 transition"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default CustomerSupportMessages;

// pages/CustomerSupportMessages.jsx
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import Axios from "../utils/network/axios";
import SummaryApi from "../comman/summaryApi";
import { toast } from "react-hot-toast";
import {
  FiMail,
  FiUser,
  FiPhone,
  FiTrash2,
  FiEye,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiInfo,
  FiAlertCircle,
  FiX,
  FiTag,
  FiInbox,
} from "react-icons/fi";

/* ---------------------- Custom Dropdown Component ---------------------- */
const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        className={`w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-white flex items-center justify-between text-xs sm:text-sm transition-all duration-200
          ${
            disabled
              ? "opacity-60 cursor-not-allowed"
              : "hover:border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 cursor-pointer"
          } shadow-sm`}
      >
        <span className={selectedOption ? "text-slate-900" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDownIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1.5 max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-xs sm:text-sm transition-colors duration-150
                ${
                  value === option.value
                    ? "bg-amber-50 text-amber-800 font-medium"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const FiChevronDownIcon = ({ isOpen }) => (
  <svg
    className={`text-slate-400 text-sm transition-transform duration-200 ${
      isOpen ? "rotate-180" : ""
    }`}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M7 10l5 5l5-5H7z"
    />
  </svg>
);

/* ---------------------- Status Badge ---------------------- */
const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  const variants = {
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      dot: "bg-amber-500",
      label: "Pending",
    },
    resolved: {
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      label: "Resolved",
    },
  };

  const variant = variants[normalized] || variants.pending;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${variant.bg} ${variant.text} ${variant.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${variant.dot}`} />
      <span>{variant.label}</span>
    </div>
  );
};

/* ---------------------- Department Badge ---------------------- */
const DepartmentBadge = ({ department }) => {
  if (!department) return null;

  const dep = department.toLowerCase();

  const variants = {
    general: "bg-slate-50 text-slate-700 border-slate-200",
    support: "bg-amber-50 text-amber-800 border-amber-200",
    sales: "bg-emerald-50 text-emerald-800 border-emerald-200",
    technical: "bg-sky-50 text-sky-800 border-sky-200",
    billing: "bg-indigo-50 text-indigo-800 border-indigo-200",
    partnership: "bg-purple-50 text-purple-800 border-purple-200",
  };

  const cls = variants[dep] || variants.general;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] sm:text-[11px] font-medium ${cls}`}
    >
      <FiTag className="text-[10px]" />
      <span className="capitalize">{dep}</span>
    </span>
  );
};

/* ---------------------- Loading Skeleton ---------------------- */
const MessageSkeleton = () => (
  <tbody className="animate-pulse">
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="border-b border-slate-100">
        <td className="p-4 pl-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-slate-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-slate-200 rounded w-24" />
              <div className="h-3 bg-slate-200 rounded w-32" />
            </div>
          </div>
        </td>
        <td className="p-4">
          <div className="h-3.5 bg-slate-200 rounded w-40 mb-1" />
          <div className="h-3 bg-slate-200 rounded w-28" />
        </td>
        <td className="p-4">
          <div className="h-5 bg-slate-200 rounded-full w-20" />
        </td>
        <td className="p-4">
          <div className="h-3.5 bg-slate-200 rounded w-24" />
        </td>
        <td className="p-4 pr-6">
          <div className="h-3.5 bg-slate-200 rounded w-16 ml-auto" />
        </td>
      </tr>
    ))}
  </tbody>
);

/* ---------------------- Confirmation / Action Modal ---------------------- */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmVariant = "danger",
  loading = false,
  children,
}) => {
  if (!isOpen) return null;

  const variantClasses = {
    danger: {
      btn: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-200",
      iconWrap: "bg-rose-100 text-rose-700",
    },
    success: {
      btn: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-200",
      iconWrap: "bg-emerald-100 text-emerald-700",
    },
    neutral: {
      btn: "bg-slate-800 hover:bg-slate-900 focus:ring-slate-200",
      iconWrap: "bg-amber-100 text-amber-700",
    },
  };

  const variant = variantClasses[confirmVariant] || variantClasses.danger;

  return (
    <div className="fixed inset-0 bg-black/55 z-110 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-xl w-full shadow-xl border border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-start gap-3">
          <div
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${variant.iconWrap}`}
          >
            {confirmVariant === "danger" && (
              <FiAlertCircle className="text-base" />
            )}
            {confirmVariant === "success" && (
              <FiCheckCircle className="text-base" />
            )}
            {confirmVariant === "neutral" && <FiInfo className="text-base" />}
          </div>
          <div className="flex-1">
            <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900">
              {title}
            </h3>
            {message && (
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {message}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <FiX className="text-slate-500 text-sm" />
          </button>
        </div>

        {children && <div className="px-5 pt-3 pb-1">{children}</div>}

        <div className="flex gap-3 px-5 py-4 border-t border-slate-100 bg-slate-50 rounded-lg">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-white disabled:opacity-60 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 text-white rounded-lg text-xs sm:text-sm font-semibold disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-sm focus:ring-2 focus:outline-none ${variant.btn}`}
          >
            {loading && <FiClock className="animate-spin text-sm" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------- Info / Help Modal ---------------------- */
const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onClose}
      title="How to use customer support inbox"
      message="Use this view to triage customer queries, reply from your helpdesk, and keep track of what’s pending or resolved."
      confirmText="Got it"
      confirmVariant="neutral"
    >
      <div className="space-y-3 text-xs sm:text-sm text-slate-600">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <StatusBadge status="pending" />
            <p className="leading-relaxed text-xs sm:text-[13px]">
              New or unanswered messages. Prioritise these to keep response
              times low.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <StatusBadge status="resolved" />
            <p className="leading-relaxed text-xs sm:text-[13px]">
              Queries that have been addressed or closed. You can reopen them if
              the customer replies again.
            </p>
          </div>
        </div>
        <div className="mt-1 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 flex items-start gap-2">
          <FiAlertCircle className="text-amber-600 mt-0.5 text-sm" />
          <p className="text-[11px] sm:text-xs text-amber-900 leading-relaxed">
            Always resolve messages only after the customer’s issue is actually
            addressed in your support system or helpdesk.
          </p>
        </div>
      </div>
    </ConfirmationModal>
  );
};

/* ---------------------- Message Detail Modal ---------------------- */
const MessageDetailModal = ({
  isOpen,
  message,
  loading,
  actionLoading,
  onClose,
  onToggleStatus,
  onOpenDeleteModal,
}) => {
  if (!isOpen || !message) return null;

  const status = (message.status || "pending").toLowerCase();
  const isResolved = status === "resolved";

  return (
    <div className="fixed inset-0 z-105 bg-black/55 flex items-center justify-center px-3 sm:px-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl border border-slate-200 flex flex-col h-120">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <FiInbox className="text-amber-700 text-base" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <h2 className="text-sm sm:text-[15px] font-semibold text-slate-900 truncate">
                {message.subject || "Customer message"}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-600 flex items-center gap-1.5">
                <FiUser className="text-[11px]" />
                <span className="truncate">
                  {message.name || "Unknown customer"}
                </span>
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5">
                <FiMail className="text-[11px]" />
                <span className="truncate">{message.email || "-"}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <StatusBadge status={status} />
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"
              disabled={actionLoading || loading}
            >
              <FiX className="text-slate-500 text-sm" />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <FiClock className="animate-spin text-amber-600 text-2xl mb-2" />
            <p className="text-xs sm:text-sm">Loading message…</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 text-xs sm:text-sm space-y-4">
              {/* Meta row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500">
                  <FiClock className="text-[11px]" />
                  <span>
                    Received{" "}
                    {message.createdAt
                      ? new Date(message.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "-"}
                  </span>
                </div>
                <DepartmentBadge department={message.department} />
              </div>

              {/* Contact info */}
              <section className="border border-slate-100 rounded-lg p-3.5 sm:p-4 bg-slate-50/70">
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5 text-xs sm:text-sm">
                  <FiUser className="text-amber-600 text-sm" />
                  Customer details
                </h3>
                <div className="grid grid-cols-1 gap-1.5 text-xs sm:text-sm">
                  <Row label="Name" value={message.name} />
                  <Row label="Email" value={message.email} />
                  <Row label="Phone" value={message.phone || "-"} />
                </div>
              </section>

              {/* Message body */}
              <section className="border border-slate-100 rounded-lg p-3.5 sm:p-4 bg-white">
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5 text-xs sm:text-sm">
                  <FiInbox className="text-amber-600 text-sm" />
                  Message
                </h3>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {message.message}
                </p>
              </section>
            </div>

            {/* Footer actions */}
            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg">
              <p className="text-[11px] sm:text-xs text-slate-500">
                Status:{" "}
                <span className="font-medium text-slate-700">
                  {status === "resolved" ? "resolved" : "pending"}
                </span>
              </p>

              <div className="flex flex-wrap gap-2.5 sm:justify-end">
                <button
                  onClick={onOpenDeleteModal}
                  disabled={actionLoading}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-rose-700 disabled:opacity-60 transition-all shadow-sm"
                >
                  <FiTrash2 className="text-xs" />
                  Delete
                </button>
                <button
                  onClick={onToggleStatus}
                  disabled={actionLoading}
                  className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold disabled:opacity-60 transition-all shadow-sm ${
                    isResolved
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {actionLoading ? (
                    <FiClock className="animate-spin text-xs" />
                  ) : (
                    <FiCheckCircle className="text-xs" />
                  )}
                  {isResolved ? "Mark as pending" : "Mark as resolved"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-3">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium text-slate-900 text-right">
      {value || "-"}
    </span>
  </div>
);

/* ---------------------- Main Admin Page ---------------------- */
const CustomerSupportMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [error, setError] = useState(null);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [infoOpen, setInfoOpen] = useState(false);

  /* ------------ Status Options for Dropdown ------------ */
  const statusOptions = useMemo(
    () => [
      { value: "ALL", label: "All statuses" },
      { value: "pending", label: "Pending" },
      { value: "resolved", label: "Resolved" },
    ],
    []
  );

  /* ------------ Debounced Search ------------ */
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase());
    }, 250);
    return () => clearTimeout(id);
  }, [searchInput]);

  /* ------------ Fetch Messages ------------ */
  const fetchMessages = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    try {
      const res = await Axios({
        method: SummaryApi.getAllContactsMessage.method,
        url: SummaryApi.getAllContactsMessage.url,
        // Add params here if later you support server-side filters
      });

      if (res.data?.success) {
        setMessages(res.data.data || []);
      } else {
        throw new Error(res.data?.message || "Failed to load messages");
      }
    } catch (err) {
      console.error("getAllContactsMessage error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load messages";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  /* ------------ Filtered Messages ------------ */
  const filteredMessages = useMemo(() => {
    let data = [...messages];

    if (statusFilter !== "ALL") {
      data = data.filter(
        (msg) => (msg.status || "pending").toLowerCase() === statusFilter
      );
    }

    if (!debouncedSearch) return data;

    return data.filter((msg) => {
      const name = msg.name?.toLowerCase() || "";
      const email = msg.email?.toLowerCase() || "";
      const subject = msg.subject?.toLowerCase() || "";
      const message = msg.message?.toLowerCase() || "";

      return (
        name.includes(debouncedSearch) ||
        email.includes(debouncedSearch) ||
        subject.includes(debouncedSearch) ||
        message.includes(debouncedSearch)
      );
    });
  }, [messages, statusFilter, debouncedSearch]);

  /* ------------ Stats Calculation ------------ */
  const stats = useMemo(() => {
    const total = messages.length;
    const pending = messages.filter(
      (m) => (m.status || "pending").toLowerCase() === "pending"
    ).length;
    const resolved = messages.filter(
      (m) => (m.status || "pending").toLowerCase() === "resolved"
    ).length;

    return { total, pending, resolved };
  }, [messages]);

  /* ------------ Stat Cards Config ------------ */
  const statCards = [
    {
      key: "total",
      label: "Total",
      value: stats.total,
      icon: FiInbox,
      statusValue: "ALL",
      textClass: "text-slate-900",
      bgIcon: "bg-amber-100",
      borderActive: "border-amber-600",
      surface: "bg-white",
    },
    {
      key: "pending",
      label: "Pending",
      value: stats.pending,
      icon: FiClock,
      statusValue: "pending",
      textClass: "text-amber-800",
      bgIcon: "bg-amber-100",
      borderActive: "border-amber-600",
      surface: "bg-amber-50",
    },
    {
      key: "resolved",
      label: "Resolved",
      value: stats.resolved,
      icon: FiCheckCircle,
      statusValue: "resolved",
      textClass: "text-emerald-700",
      bgIcon: "bg-emerald-100",
      borderActive: "border-emerald-600",
      surface: "bg-emerald-50",
    },
  ];

  /* ------------ Handlers ------------ */
  const handleRetry = () => {
    fetchMessages();
  };

  const openDetailModal = (msg) => {
    setSelectedMessage(msg);
    setDetailModalOpen(true);
    setLoadingDetail(false); // currently we already have full msg
  };

  const handleToggleStatus = async () => {
    if (!selectedMessage?._id) return;
    const current = (selectedMessage.status || "pending").toLowerCase();
    const nextStatus = current === "resolved" ? "pending" : "resolved";

    setActionLoading(true);
    try {
      await Axios({
        // NOTE: replace with your dedicated update endpoint if available
        method: SummaryApi.getAllContactsMessage.method,
        url: SummaryApi.getAllContactsMessage.url,
        data: { id: selectedMessage._id, status: nextStatus },
      });

      toast.success(
        nextStatus === "resolved"
          ? "Message marked as resolved."
          : "Message marked as pending."
      );

      await fetchMessages();
      // Update selected message locally
      setSelectedMessage((prev) =>
        prev ? { ...prev, status: nextStatus } : prev
      );
    } catch (err) {
      console.error("Error updating status:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to update status";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMessage?._id) return;
    setActionLoading(true);
    try {
      await Axios({
        method: SummaryApi.deleteContactMessage.method,
        url: SummaryApi.deleteContactMessage.url,
        data: { id: selectedMessage._id },
      });

      toast.success("Message deleted.");
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== selectedMessage._id)
      );
      setDeleteModalOpen(false);
      setDetailModalOpen(false);
      setSelectedMessage(null);
    } catch (err) {
      console.error("Error deleting message:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to delete";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  /* ------------ Status Filter Options ------------ */
  const statusFilterOptions = statusOptions;

  return (
    <div className="min-h-screen px-3 sm:px-4 py-4 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5">
        {/* Header Section */}
        <div className="bg-white border border-slate-200 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 border border-amber-100">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                  <FiInbox className="text-amber-700 text-xs" />
                </span>
                <p className="text-[11px] sm:text-xs font-medium text-amber-800">
                  Admin · Customer support
                </p>
              </div>
              <div>
                <h1 className="text-[18px] sm:text-[20px] font-semibold text-slate-900 tracking-tight mt-1">
                  Support inbox
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  View and triage contact form messages from customers with a
                  focused, corporate workflow.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setInfoOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-100 text-[11px] sm:text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 transition-all"
              >
                <FiInfo className="text-xs" />
                Guide
              </button>

              <button
                onClick={handleRetry}
                disabled={loadingList}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200 text-[11px] sm:text-xs font-medium text-slate-800 bg-white hover:bg-slate-50 disabled:opacity-60 transition-all"
              >
                <FiRefreshCw
                  className={`text-xs ${
                    loadingList ? "animate-spin" : ""
                  }`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-4">
            {statCards.map(
              ({
                key,
                label,
                value,
                icon: Icon,
                statusValue,
                textClass,
                bgIcon,
                borderActive,
                surface,
              }) => {
                const isActive = statusFilter === statusValue;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatusFilter(statusValue)}
                    className={`
                      text-left rounded-2xl px-3.5 py-3 sm:px-4 sm:py-3.5
                      border transition-all duration-150 shadow-sm hover:shadow-md
                      flex flex-col gap-2 focus:outline-none focus:ring-2 focus:ring-amber-200
                      ${
                        isActive
                          ? `${borderActive} ring-1 ring-amber-200`
                          : "border-slate-200 hover:border-amber-200"
                      }
                      ${surface}
                    `}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] sm:text-xs font-medium text-slate-600">
                        {label}
                      </p>
                      <div
                        className={`p-2 rounded-lg ${bgIcon} flex items-center justify-center`}
                      >
                        <Icon className={`${textClass} text-xs sm:text-sm`} />
                      </div>
                    </div>
                    <p
                      className={`text-lg sm:text-xl font-semibold leading-tight ${textClass}`}
                    >
                      {value}
                    </p>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Main Content – Support Messages List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Filters */}
          <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs sm:text-sm font-medium text-slate-700 flex items-center gap-1.5">
                <FiFilter className="text-xs text-amber-700" />
                Filters
              </p>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {filteredMessages.length} result
                {filteredMessages.length !== 1 && "s"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  placeholder="Search by name, email, subject, or message…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>

              {/* Status Filter Dropdown */}
              <CustomDropdown
                options={statusFilterOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by status"
                disabled={loadingList}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-left text-[11px] sm:text-xs font-semibold text-slate-500">
                  <th className="p-3 sm:p-4 pl-4 sm:pl-6">Customer</th>
                  <th className="p-3 sm:p-4">Subject</th>
                  <th className="p-3 sm:p-4">Status</th>
                  <th className="p-3 sm:p-4">Received</th>
                  <th className="p-3 sm:p-4 pr-4 sm:pr-6 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              {loadingList ? (
                <MessageSkeleton />
              ) : (
                <tbody className="divide-y divide-slate-100">
                  {error && !loadingList && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                          <FiAlertCircle className="text-xl mb-1 text-rose-500" />
                          <p className="text-xs sm:text-sm">{error}</p>
                          <button
                            onClick={handleRetry}
                            className="mt-2 inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                          >
                            <FiRefreshCw className="text-xs" />
                            Try again
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {!error && filteredMessages.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-8 text-center text-slate-500"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <FiInbox className="text-3xl text-slate-300" />
                          <p className="text-xs sm:text-sm">
                            No messages found
                          </p>
                          {debouncedSearch && (
                            <p className="text-[11px] sm:text-xs text-slate-400">
                              Try adjusting your search or filters.
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}

                  {!error &&
                    filteredMessages.map((msg) => {
                      const status = (msg.status || "pending").toLowerCase();
                      return (
                        <tr
                          key={msg._id}
                          className={`group cursor-pointer transition-colors duration-150 hover:bg-slate-50`}
                          onClick={() => openDetailModal(msg)}
                        >
                          {/* Customer */}
                          <td className="p-3 sm:p-4 pl-4 sm:pl-6">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-lg bg-amber-600 text-white font-semibold text-xs shadow-sm">
                                {msg.name?.[0]?.toUpperCase() || "C"}
                              </div>
                              <div className="space-y-0.5">
                                <p className="font-medium text-xs sm:text-sm text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                                  {msg.name || "Unknown"}
                                </p>
                                <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1">
                                  <FiMail className="text-[10px]" />
                                  <span className="truncate max-w-35 sm:max-w-55">
                                    {msg.email}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Subject */}
                          <td className="p-3 sm:p-4 align-top">
                            <p className="text-xs sm:text-sm font-medium text-slate-900 line-clamp-1">
                              {msg.subject || "-"}
                            </p>
                            <div className="mt-1">
                              <DepartmentBadge department={msg.department} />
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-3 sm:p-4 align-top">
                            <StatusBadge status={status} />
                          </td>

                          {/* Received */}
                          <td className="p-3 sm:p-4 align-top">
                            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500">
                              <FiClock className="text-[11px]" />
                              {msg.createdAt
                                ? new Date(msg.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )
                                : "-"}
                            </div>
                          </td>

                          {/* Actions */}
                          <td
                            className="p-3 sm:p-4 pr-4 sm:pr-6 align-top"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-2.5">
                              <button
                                onClick={() => openDetailModal(msg)}
                                className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                                title="View details"
                              >
                                <FiEye className="text-xs sm:text-sm" />
                              </button>

                              <button
                                onClick={async () => {
                                  setSelectedMessage(msg);
                                  await handleToggleStatus();
                                }}
                                className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
                                title={
                                  status === "resolved"
                                    ? "Mark as pending"
                                    : "Mark as resolved"
                                }
                              >
                                <FiCheckCircle className="text-xs sm:text-sm" />
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedMessage(msg);
                                  setDeleteModalOpen(true);
                                }}
                                className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                title="Delete message"
                              >
                                <FiTrash2 className="text-xs sm:text-sm" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <MessageDetailModal
        isOpen={detailModalOpen}
        message={selectedMessage}
        loading={loadingDetail}
        actionLoading={actionLoading}
        onClose={() => {
          if (actionLoading) return;
          setDetailModalOpen(false);
          setSelectedMessage(null);
        }}
        onToggleStatus={handleToggleStatus}
        onOpenDeleteModal={() => setDeleteModalOpen(true)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (actionLoading) return;
          setDeleteModalOpen(false);
        }}
        onConfirm={handleDelete}
        title="Delete message"
        message="This will permanently remove this support message from your inbox. This action cannot be undone."
        confirmText={actionLoading ? "Deleting…" : "Delete"}
        confirmVariant="danger"
        loading={actionLoading}
      />

      {/* Info Modal */}
      <InfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} />
    </div>
  );
};

export default CustomerSupportMessages;
