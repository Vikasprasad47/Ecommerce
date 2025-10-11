// import React, { useEffect, useState, useRef } from 'react';
// import axios from "../utils/axios";
// import SummaryApi from "../comman/summaryApi";
// import { useSearchParams } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// const AllUser = () => {
//   const [users, setUsers] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const defaultImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

//   const [searchParams, setSearchParams] = useSearchParams();
//   const searchQuery = searchParams.get("search") || "";
//   const pageQuery = parseInt(searchParams.get("page") || "1");
//   const filterType = searchParams.get("filter") || "name";

//   const [searchInput, setSearchInput] = useState(searchQuery);
//   const [searchField, setSearchField] = useState(filterType);
//   const [currentPage, setCurrentPage] = useState(pageQuery);
//   const usersPerPage = 10;

//   const [showDropdown, setShowDropdown] = useState(false);
//   const filterOptions = [
//     { label: "Name", value: "name" },
//     { label: "Email", value: "email" },
//     { label: "Phone", value: "phone" },
//     { label: "Role", value: "role" },
//   ];

//   const dropdownRef = useRef();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const fetchAllUsers = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(SummaryApi.getAllUsers.url, {
//         withCredentials: true,
//       });
//       setUsers(res.data.data);
//     } catch (err) {
//       console.error("Failed to fetch users", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllUsers();
//   }, []);

//   // Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setSearchParams({
//         search: searchInput,
//         filter: searchField,
//         page: 1,
//       });
//       setCurrentPage(1);
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [searchInput, searchField]);

//   // Sync page param to state
//   useEffect(() => {
//     setSearchParams(prev => ({
//       search: prev.get("search") || "",
//       filter: searchField,
//       page: currentPage.toString(),
//     }));
//   }, [currentPage]);

//   // Filter logic
//   useEffect(() => {
//     const filteredData = users.filter(user => {
//       const val = user[searchField]?.toLowerCase() || '';
//       return val.includes(searchQuery.toLowerCase());
//     });
//     setFiltered(filteredData);
//   }, [users, searchQuery, searchField]);

//   const totalPages = Math.ceil(filtered.length / usersPerPage);
//   const indexOfLast = currentPage * usersPerPage;
//   const indexOfFirst = indexOfLast - usersPerPage;
//   const currentUsers = filtered.slice(indexOfFirst, indexOfLast);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-5 flex flex-col items-center justify-center">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">User Management</h1>
//           <p className="text-gray-600 mt-2">Manage all registered users in the system</p>
//         </div>

//         {/* Search and filter */}
//         <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
//               <input
//                 type="text"
//                 placeholder={`Search by ${searchField}...`}
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//                 className="w-full sm:w-72 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//               />

//               <div className="relative w-full sm:w-40" ref={dropdownRef}>
//                 <button
//                   onClick={() => setShowDropdown((prev) => !prev)}
//                   className="w-full px-4 py-2.5 text-sm text-left border border-gray-200 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition flex items-center justify-between"
//                 >
//                   <span>{filterOptions.find((opt) => opt.value === searchField)?.label}</span>
//                   <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>

//                 <AnimatePresence>
//                   {showDropdown && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       transition={{ duration: 0.2 }}
//                       className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
//                     >
//                       {filterOptions.map((option) => (
//                         <div
//                           key={option.value}
//                           onClick={() => {
//                             setSearchField(option.value);
//                             setShowDropdown(false);
//                           }}
//                           className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition ${
//                             searchField === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
//                           }`}
//                         >
//                           {option.label}
//                         </div>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </div>

//             <div className="text-right">
//               <p className="text-sm text-gray-500">Total Users: <span className="font-medium text-gray-700">{users.length}</span></p>
//               <p className="text-sm text-gray-500">
//                 Showing <span className="font-medium text-gray-700">{filtered.length}</span> of {users.length} users
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//           {loading ? (
//             <div className="p-6">
//               {[...Array(usersPerPage)].map((_, i) => (
//                 <div key={i} className="animate-pulse flex items-center p-4 border-b border-gray-100">
//                   <div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div>
//                   <div className="flex-1">
//                     <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
//                     <div className="h-3 bg-gray-100 rounded w-3/4"></div>
//                   </div>
//                   <div className="h-3 bg-gray-200 rounded w-16"></div>
//                 </div>
//               ))}
//             </div>
//           ) : currentUsers.length > 0 ? (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         User
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Contact
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Role
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {currentUsers.map((user) => {
//                       const isAdmin = user.role === "ADMIN";
//                       return (
//                         <tr key={user._id} className="hover:bg-gray-50 transition">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <div className="flex-shrink-0 h-10 w-10">
//                                 <img
//                                   src={user.avatar || defaultImg}
//                                   alt={user.name || "User"}
//                                   className="h-10 w-10 rounded-full object-cover"
//                                 />
//                               </div>
//                               <div className="ml-4">
//                                 <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                                 <div className="text-sm text-gray-500">@{user.name?.toLowerCase().replace(/\s+/g, '') || 'user'}</div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm text-gray-900">{user.email}</div>
//                             <div className="text-sm text-gray-500">{user.mobile || 'Not provided'}</div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                               isAdmin ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
//                             }`}>
//                               {user.role}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                             <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
//                             <button className="text-red-600 hover:text-red-900">Delete</button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           ) : (
//             <div className="p-8 text-center">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 No users match your search criteria for "{searchInput}" in {searchField}.
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && !loading && (
//           <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-b-lg">
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Showing <span className="font-medium">{indexOfFirst + 1}</span> to{' '}
//                   <span className="font-medium">{Math.min(indexOfLast, filtered.length)}</span> of{' '}
//                   <span className="font-medium">{filtered.length}</span> results
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <span className="sr-only">Previous</span>
//                     <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                       <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                     </svg>
//                   </button>
                  
//                   {[...Array(totalPages)].map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => handlePageChange(i + 1)}
//                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                         currentPage === i + 1
//                           ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
//                           : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
//                       }`}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}

//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <span className="sr-only">Next</span>
//                     <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                       <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllUser;

import React, { useEffect, useState, useRef } from 'react';
import axios from "../utils/axios";
import SummaryApi from "../comman/summaryApi";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const defaultImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const pageQuery = parseInt(searchParams.get("page") || "1");
  const filterType = searchParams.get("filter") || "name";

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [searchField, setSearchField] = useState(filterType);
  const [currentPage, setCurrentPage] = useState(pageQuery);
  const usersPerPage = 10;

  const [showDropdown, setShowDropdown] = useState(false);
  const filterOptions = [
    { label: "Name", value: "name" },
    { label: "Email", value: "email" },
    { label: "Phone", value: "phone" },
    { label: "Role", value: "role" },
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
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(SummaryApi.getAllUsers.url, { withCredentials: true });
      setUsers(res.data.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

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
  }, [searchInput, searchField]);

  // Sync page param to state
  useEffect(() => {
    setSearchParams(prev => ({
      search: prev.get("search") || "",
      filter: searchField,
      page: currentPage.toString(),
    }));
  }, [currentPage]);

  // Filter users
  useEffect(() => {
    const filteredData = users.filter(user => {
      const val = user[searchField]?.toLowerCase() || '';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
          <h2 className="font-semibold text-xl text-gray-800">User Management</h2>
          <div className="flex flex-col sm:flex-row gap-3 mt-3 sm:mt-0 w-full sm:w-auto">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={`Search by ${searchField}...`}
              className="text-sm border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition w-full sm:w-64"
            />
            <div className="relative w-full sm:w-40" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(prev => !prev)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white hover:border-gray-400 transition text-left"
              >
                {filterOptions.find(opt => opt.value === searchField)?.label}
              </button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
                  >
                    {filterOptions.map(opt => (
                      <div
                        key={opt.value}
                        onClick={() => { setSearchField(opt.value); setShowDropdown(false); }}
                        className={`px-4 py-2 cursor-pointer hover:bg-amber-50 ${searchField === opt.value ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-700'}`}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 max-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Role</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: usersPerPage }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-32"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-28"></div></td>
                    </tr>
                  ))
                ) : currentUsers.length > 0 ? (
                  currentUsers.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 flex items-center gap-3 max-w-[150px] truncate">
                        <img src={user.avatar || defaultImg} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                        <span className="font-medium text-gray-900 truncate">{user.name}</span>
                      </td>
                      <td className="px-6 py-4 max-w-[200px] truncate">{user.email}</td>
                      <td className="px-6 py-4 max-w-[120px] truncate">{user.mobile || "N/A"}</td>
                      <td className="px-6 py-4 max-w-[100px] truncate">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === "ADMIN" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition mr-2">
                          Edit
                        </button>
                        <button className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === i + 1 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUser;
