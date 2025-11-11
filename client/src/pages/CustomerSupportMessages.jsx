import React, { useEffect, useState } from "react";
import { FiMail, FiUser, FiPhone, FiTrash2, FiEye, FiCheckCircle, FiClock } from "react-icons/fi";
import { MdOutlinePending } from "react-icons/md";
import Axios from "../utils/network/axios"; // ✅ your configured Axios instance
import SummaryApi from "../comman/summaryApi";
import { motion, AnimatePresence } from "framer-motion";

const CustomerSupportMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // ✅ Fetch all contact messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        method: SummaryApi.getAllContactsMessage.method,
        url: SummaryApi.getAllContactsMessage.url,
      });
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error("❌ Failed to fetch contact messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update message status (Pending → Resolved)
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdating(true);
      await Axios({
        method: SummaryApi.getAllContactsMessage.method,
        url: SummaryApi.getAllContactsMessage.url,
        data: { id, status: newStatus },
      });
      fetchMessages();
    } catch (err) {
      console.error("❌ Error updating status:", err);
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Delete message
  const handleDelete = async (id) => {
    try {
      setDeleting(id);
      await Axios({
        method: SummaryApi.deleteContactMessage.method,
        url: SummaryApi.deleteContactMessage.url,
        data: { id },
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("❌ Error deleting message:", err);
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-bold text-gray-800">Customer Support Messages</h1>
          <button
            onClick={fetchMessages}
            className="text-sm text-blue-600 hover:underline"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Subject</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No messages found.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    Loading messages...
                  </td>
                </tr>
              )}

              {messages.map((msg) => (
                <tr
                  key={msg._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <FiUser className="text-gray-500" />
                    <span>{msg.name}</span>
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <FiMail className="text-gray-500" />
                    <span>{msg.email}</span>
                  </td>
                  <td className="px-6 py-4">{msg.subject}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        msg.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {msg.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-4">
                    <button
                      onClick={() => setSelectedMessage(msg)}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <FiEye size={18} />
                    </button>

                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          msg._id,
                          msg.status === "Resolved" ? "Pending" : "Resolved"
                        )
                      }
                      disabled={updating}
                      className="text-gray-600 hover:text-green-600 disabled:opacity-50"
                    >
                      {msg.status === "Resolved" ? (
                        <MdOutlinePending size={18} />
                      ) : (
                        <FiCheckCircle size={18} />
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(msg._id)}
                      disabled={deleting === msg._id}
                      className="text-gray-600 hover:text-red-600 disabled:opacity-50"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Modal for Message Details */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Message Details</h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <FiUser className="text-gray-500" />
                  <span className="font-medium">{selectedMessage.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiMail className="text-gray-500" />
                  <span>{selectedMessage.email}</span>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center space-x-2">
                    <FiPhone className="text-gray-500" />
                    <span>{selectedMessage.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <FiClock className="text-gray-500" />
                  <span>
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-4 text-gray-800 border-t border-gray-100 pt-3 whitespace-pre-line">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerSupportMessages;
