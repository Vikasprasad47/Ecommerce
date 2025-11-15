// // components/SellerOnboarding.jsx
// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import Axios from "../utils/network/axios";
// import SummaryApi from "../comman/summaryApi";
// import uploadSellerDocument, {
//   MAX_FILE_SIZE_MB,
// } from "../utils/helpers/uploadSellerDocument";
// import { toast } from "react-hot-toast";
// import { TiTick } from "react-icons/ti";
// import { TiDelete } from "react-icons/ti";


// import {
//   FiCheckCircle,
//   FiFileText,
//   FiShield,
//   FiUploadCloud,
//   FiArrowRight,
//   FiArrowLeft,
//   FiBriefcase,
//   FiLayers,
//   FiAlertCircle,
//   FiX,
//   FiEye,
//   FiLoader,
// } from "react-icons/fi";

// /* ------------------ STEP META ------------------ */

// const STEPS = [
//   { id: 1, label: "Business Details", icon: FiBriefcase },
//   { id: 2, label: "KYC Documents", icon: FiUploadCloud },
//   { id: 3, label: "Review & Status", icon: FiFileText },
//   { id: 4, label: "Subscription", icon: FiLayers },
// ];

// /* ------------------ UTIL UI ------------------ */

// const StepHeader = ({ currentStep, application }) => {
//   const progress = useMemo(
//     () => ((currentStep + 1) / STEPS.length) * 100,
//     [currentStep]
//   );

//   const statusText = application?.status || "Not started";

//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md mb-8">
//       <div className="flex items-center justify-between mb-3">
//         <div>
//           <p className="text-xs uppercase tracking-wide text-amber-600 font-semibold">
//             Seller Onboarding
//           </p>
//           <h1 className="text-xl font-semibold text-gray-900">
//             Step {currentStep + 1} / {STEPS.length} — {STEPS[currentStep].label}
//           </h1>
//           <p className="text-xs text-gray-500 mt-1">
//             Application status:{" "}
//             <span className="font-semibold">{statusText}</span>
//           </p>
//         </div>

//         <div className="hidden lg:flex items-center space-x-2 text-xs text-gray-600">
//           {STEPS.map((step, index) => {
//             const Icon = step.icon;
//             const isDone = index < currentStep;
//             const isActive = index === currentStep;

//             return (
//               <div
//                 key={step.id}
//                 className={`flex items-center px-3 py-1 rounded-full border text-[11px] transition ${
//                   isActive
//                     ? "border-amber-500 bg-amber-50 text-amber-700 font-medium"
//                     : isDone
//                     ? "border-green-500 bg-green-50 text-green-700"
//                     : "border-gray-200 bg-gray-50 text-gray-500"
//                 }`}
//               >
//                 {isDone ? (
//                   <FiCheckCircle className="mr-1.5" />
//                 ) : (
//                   <Icon className="mr-1.5" />
//                 )}
//                 {step.label}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <div className="w-full bg-gray-200 rounded-full h-1.5">
//         <div
//           className="h-1.5 bg-amber-500 rounded-full transition-all duration-300"
//           style={{ width: `${progress}%` }}
//         ></div>
//       </div>
//     </div>
//   );
// };

// const Card = ({ title, subtitle, rightSlot, children }) => (
//   <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
//     <div className="flex justify-between mb-4">
//       <div>
//         <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
//         {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
//       </div>
//       {rightSlot}
//     </div>
//     {children}
//   </div>
// );

// const Input = ({
//   label,
//   value,
//   onChange,
//   placeholder,
//   required,
//   type = "text",
// }) => (
//   <div className="mb-4">
//     <label className="text-sm font-medium text-gray-700 flex items-center">
//       {label}
//       {required && <span className="text-red-500 ml-1">*</span>}
//     </label>
//     <input
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-colors"
//     />
//   </div>
// );

// const FileField = ({
//   label,
//   hint,
//   onChange,
//   existingUrl,
//   onPreview,
//   disabled,
//   acceptedTypes = ".jpg,.jpeg,.png,.webp,.pdf",
// }) => (
//   <div className="mb-4">
//     <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
//       <span>{label}</span>
//       {existingUrl && (
//         <span className="flex items-center gap-1">
//           <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[11px] border border-green-300">
//             Uploaded
//           </span>
//           <button
//             type="button"
//             onClick={() => onPreview && onPreview(existingUrl)}
//             className="flex items-center text-[11px] text-blue-600 hover:underline"
//           >
//             <FiEye className="mr-1" />
//             View
//           </button>
//         </span>
//       )}
//     </label>
//     {hint && <p className="text-xs text-gray-500 mb-2">{hint}</p>}
//     <input
//       type="file"
//       accept={acceptedTypes}
//       disabled={disabled}
//       onChange={(e) => {
//         const file = e.target.files?.[0] || null;
//         if (file) {
//           onChange(file);
//         }
//       }}
//       className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-colors"
//     />
//     <p className="text-[11px] text-gray-400 mt-1">
//       Max size: {MAX_FILE_SIZE_MB}MB. Supported: JPG, PNG, WEBP, PDF.
//     </p>
//   </div>
// );

// /* ------------------ IMAGE / DOC PREVIEW MODAL ------------------ */

// const ImagePreviewModal = ({ url, onClose }) => {
//   if (!url) return null;

//   const isPdf = url.toLowerCase().endsWith(".pdf");

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//       <div className="bg-white rounded-lg max-w-3xl w-full mx-4 relative p-4 max-h-[90vh] overflow-hidden">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 z-10 transition-colors"
//         >
//           <FiX className="text-gray-600 text-lg" />
//         </button>
//         <div className="mt-2 flex justify-center items-center h-full">
//           {isPdf ? (
//             <iframe
//               src={url}
//               title="Document preview"
//               className="w-full h-[70vh] border rounded-md"
//             />
//           ) : (
//             <img
//               src={url}
//               alt="Document preview"
//               className="max-h-[70vh] max-w-full rounded-md object-contain"
//               onError={(e) => {
//                 e.target.src = "/api/placeholder/400/300";
//               }}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ------------------ STEP 1: BUSINESS ------------------ */

// const StepBusiness = ({ application, goNext, onSaved }) => {
//   const [form, setForm] = useState({
//     businessName: application?.businessName || "",
//     businessType: application?.businessType || "",
//     gstNumber: application?.gstNumber || "",
//     panNumber: application?.panNumber || "",
//     turnover: application?.turnover || "",
//     description: application?.description || "",
//   });

//   const [saving, setSaving] = useState(false);

//   const isValid = useMemo(
//     () =>
//       form.businessName.trim().length > 2 &&
//       form.businessName.trim().length <= 100,
//     [form.businessName]
//   );

//   const handleSave = async () => {
//     if (!isValid) {
//       return toast.error(
//         "Please enter a valid business name (3-100 characters)."
//       );
//     }

//     setSaving(true);

//     try {
//       const res = await Axios({
//         url: SummaryApi.registerSeller.url,
//         method: "POST",
//         data: form,
//         timeout: 10000,
//       });

//       if (res.data.success) {
//         toast.success("Business details saved successfully!");
//         await onSaved();
//         goNext();
//       } else {
//         toast.error(res.data.message || "Failed to save business details");
//       }
//     } catch (error) {
//       console.error("Save error:", error);
//       toast.error(error.message || "Network error. Please try again.");
//     }

//     setSaving(false);
//   };

//   return (
//     <>
//       <Card
//         title="Business Profile"
//         subtitle="Your official business information used for compliance, KYC and invoices."
//         rightSlot={
//           <span className="text-xs text-gray-500 hidden sm:inline">
//             Takes 2–3 minutes
//           </span>
//         }
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Input
//             required
//             label="Business Name"
//             placeholder="e.g., QuickKart Retail"
//             value={form.businessName}
//             onChange={(v) => setForm({ ...form, businessName: v })}
//           />

//           <Input
//             label="Business Type"
//             placeholder="Proprietorship / Pvt Ltd"
//             value={form.businessType}
//             onChange={(v) => setForm({ ...form, businessType: v })}
//           />

//           <Input
//             label="GST Number"
//             placeholder="Optional"
//             value={form.gstNumber}
//             onChange={(v) => setForm({ ...form, gstNumber: v })}
//           />

//           <Input
//             label="PAN Number"
//             placeholder="ABCDE1234F"
//             value={form.panNumber}
//             onChange={(v) => setForm({ ...form, panNumber: v })}
//           />

//           <Input
//             label="Annual Turnover"
//             placeholder="e.g., 10L–50L"
//             value={form.turnover}
//             onChange={(v) => setForm({ ...form, turnover: v })}
//           />
//         </div>

//         <div className="mt-4">
//           <label className="text-sm font-medium text-gray-700">
//             About Your Business
//           </label>
//           <textarea
//             rows={4}
//             value={form.description}
//             onChange={(e) =>
//               setForm({ ...form, description: e.target.value })
//             }
//             placeholder="Describe your products, niche, target audience, and business operations..."
//             className="mt-1 border w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-amber-500 text-sm resize-none transition-colors"
//             maxLength={500}
//           />
//           <p className="text-xs text-gray-400 text-right mt-1">
//             {form.description.length}/500 characters
//           </p>
//         </div>
//       </Card>

//       <div className="flex justify-end">
//         <button
//           onClick={handleSave}
//           disabled={!isValid || saving}
//           className={`px-5 py-2.5 rounded-md text-sm font-semibold shadow inline-flex items-center transition-all ${
//             saving || !isValid
//               ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//               : "bg-amber-600 text-white hover:bg-amber-700 shadow-md"
//           }`}
//         >
//           {saving ? (
//             <>
//               <FiLoader className="animate-spin mr-2" />
//               Saving...
//             </>
//           ) : (
//             <>
//               Save & Continue
//               <FiArrowRight className="ml-2" />
//             </>
//           )}
//         </button>
//       </div>
//     </>
//   );
// };

// /* ------------------ STEP 2: KYC ------------------ */

// const StepKyc = ({ application, goNext, goBack, onUpdated }) => {
//   const [gstFile, setGstFile] = useState(null);
//   const [panFile, setPanFile] = useState(null);
//   const [addressProof, setAddressProof] = useState(null);

//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [previewUrl, setPreviewUrl] = useState(null);

//   const docs = application?.documents || {};
//   const status = application?.status;

//   const canReupload = status === "REJECTED";
//   const isLocked = status === "PENDING_REVIEW" || status === "APPROVED";
//   const disableFields = isLocked && !canReupload;

//   const validateFileLocal = useCallback((file) => {
//     if (!file) return true;

//     const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
//     if (file.size > maxBytes) {
//       toast.error(
//         `"${file.name}" is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`
//       );
//       return false;
//     }

//     const allowedTypes = [
//       "image/jpeg",
//       "image/jpg",
//       "image/png",
//       "image/webp",
//       "application/pdf",
//     ];

//     if (!allowedTypes.includes(file.type)) {
//       toast.error(
//         `"${file.name}" is not supported. Only JPG, PNG, WEBP, PDF allowed.`
//       );
//       return false;
//     }

//     return true;
//   }, []);

//   const handleGstChange = (file) => {
//     if (!validateFileLocal(file)) return;
//     setGstFile(file);
//   };

//   const handlePanChange = (file) => {
//     if (!validateFileLocal(file)) return;
//     setPanFile(file);
//   };

//   const handleAddressChange = (file) => {
//     if (!validateFileLocal(file)) return;
//     setAddressProof(file);
//   };

//   const submitKyc = async () => {
//     if (isLocked && !canReupload) {
//       return toast.error("KYC already submitted. Wait for admin review.");
//     }

//     const hasNewDocs = gstFile || panFile || addressProof;

//     // Require at least one new file if REJECTED
//     if (status === "REJECTED" && !hasNewDocs) {
//       return toast.error(
//         "Your KYC was rejected. Please re-upload at least one corrected document."
//       );
//     }

//     // Must have all docs (existing or newly selected)
//     const hasAllDocs =
//       (gstFile || docs.gstFile) &&
//       (panFile || docs.panFile) &&
//       (addressProof || docs.addressProof);

//     if (!hasAllDocs) {
//       return toast.error(
//         "All 3 documents (GST, PAN, Address Proof) are required."
//       );
//     }

//     if (!hasNewDocs) {
//       // Nothing to upload — this situation should be rare, but handle gracefully
//       return toast.error("Please select at least one document to upload.");
//     }

//     setUploading(true);
//     setUploadProgress(0);

//     const result = await uploadSellerDocument({
//       gstFile,
//       panFile,
//       addressProof,
//       enableCompression: true,
//       onUploadProgress: (percent) => setUploadProgress(percent),
//     });

//     setUploading(false);

//     if (result.success) {
//       toast.success(
//         result.status === "PENDING_REVIEW"
//           ? "Documents submitted for verification!"
//           : "Documents uploaded successfully!"
//       );
//       setGstFile(null);
//       setPanFile(null);
//       setAddressProof(null);
//       setUploadProgress(0);
//       await onUpdated();
//       goNext();
//     } else {
//       toast.error(result.message || "Failed to upload documents");
//     }
//   };

//   return (
//     <>
//       <Card
//         title="KYC Verification"
//         subtitle="Upload clear and valid documents. We typically verify within 24–48 hours."
//         rightSlot={
//           <div className="text-xs text-gray-500 flex items-center space-x-1">
//             <FiShield className="text-green-600" />
//             <span className="hidden sm:inline">Secure & Encrypted</span>
//           </div>
//         }
//       >
//         {status === "REJECTED" && (
//           <div className="mb-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
//             Your KYC was <span className="font-semibold">REJECTED</span>. Please
//             fix the issues and re-upload corrected documents.
//           </div>
//         )}

//         {isLocked && !canReupload && (
//           <div className="mb-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
//             Your KYC is already submitted and is in{" "}
//             <span className="font-semibold">{status}</span> state. You can view
//             documents but cannot re-upload until admin updates the status.
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <FileField
//             label="GST Certificate"
//             existingUrl={docs.gstFile}
//             hint="Upload clear photo or PDF of GST registration certificate"
//             onChange={handleGstChange}
//             onPreview={setPreviewUrl}
//             disabled={uploading || disableFields}
//           />
//           <FileField
//             label="PAN Card"
//             existingUrl={docs.panFile}
//             hint="Upload PAN card (Proprietor / Business)"
//             onChange={handlePanChange}
//             onPreview={setPreviewUrl}
//             disabled={uploading || disableFields}
//           />
//           <FileField
//             label="Address Proof"
//             existingUrl={docs.addressProof}
//             hint="Electricity bill / Rent agreement / Bank statement (image or PDF)"
//             onChange={handleAddressChange}
//             onPreview={setPreviewUrl}
//             disabled={uploading || disableFields}
//           />
//         </div>

//         {uploading && (
//           <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//             <p className="text-xs text-blue-700 mb-2 flex items-center">
//               <FiLoader className="animate-spin mr-2" />
//               Uploading and optimizing documents... {uploadProgress}%
//             </p>
//             <div className="w-full bg-blue-200 rounded-full h-2">
//               <div
//                 className="h-2 bg-blue-600 rounded-full transition-all duration-300"
//                 style={{ width: `${uploadProgress}%` }}
//               ></div>
//             </div>
//             <p className="text-[11px] text-blue-600 mt-2">
//               Please don't close this window during upload.
//             </p>
//           </div>
//         )}
//       </Card>

//       <div className="flex justify-between">
//         <button
//           onClick={goBack}
//           disabled={uploading}
//           className="px-4 py-2.5 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-colors"
//         >
//           <FiArrowLeft className="inline mr-2" /> Back
//         </button>

//         <button
//           onClick={submitKyc}
//           disabled={uploading}
//           className={`px-5 py-2.5 rounded-md text-sm font-semibold inline-flex items-center transition-all ${
//             uploading
//               ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//               : "bg-green-600 text-white hover:bg-green-700 shadow-md"
//           }`}
//         >
//           {uploading ? (
//             <>
//               <FiLoader className="animate-spin mr-2" />
//               Uploading... {uploadProgress}%
//             </>
//           ) : (
//             "Submit for Review"
//           )}
//         </button>
//       </div>

//       <ImagePreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
//     </>
//   );
// };

// /* ------------------ STEP 3: REVIEW & STATUS ------------------ */

// const StepReviewStatus = ({ application, goNext, goBack }) => {
//   if (!application) {
//     return (
//       <Card title="No Application Found">
//         <p className="text-sm text-gray-600">
//           Please start by adding your business details in Step 1.
//         </p>
//       </Card>
//     );
//   }

//   const status = application.status;
//   const docs = application.documents || {};

//   const statusStyles = {
//     DRAFT: "bg-gray-100 text-gray-700 border-gray-300",
//     PENDING_REVIEW: "bg-yellow-50 text-yellow-700 border-yellow-300",
//     APPROVED: "bg-green-50 text-green-700 border-green-300",
//     REJECTED: "bg-red-50 text-red-700 border-red-300",
//   };

//   const StatusIcon =
//     status === "APPROVED"
//       ? FiCheckCircle
//       : status === "REJECTED"
//       ? FiAlertCircle
//       : FiShield;

//   const canProceedToSubscription = status === "APPROVED";

//   const getDocumentStatus = (docUrl) =>
//     docUrl ? "Uploaded" : "Not uploaded";

//   return (
//     <>
//       <Card
//         title="Review Your Application"
//         subtitle="Submitted details are considered legally binding and cannot be altered."
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <h3 className="font-semibold mb-3 text-gray-900">
//               Business Details
//             </h3>
//             <div className="space-y-2 text-sm">
//               <p>
//                 <strong>Name:</strong> {application.businessName || "-"}
//               </p>
//               <p>
//                 <strong>Type:</strong> {application.businessType || "-"}
//               </p>
//               <p>
//                 <strong>GST:</strong> {application.gstNumber || "-"}
//               </p>
//               <p>
//                 <strong>PAN:</strong> {application.panNumber || "-"}
//               </p>
//               <p>
//                 <strong>Turnover:</strong> {application.turnover || "-"}
//               </p>
//             </div>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-3 text-gray-900">
//               Document Status
//             </h3>
//             <div className="space-y-2 text-sm">
//               <p
//                 className={
//                   docs.gstFile ? "text-green-600" : "text-red-600"
//                 }
//               >
//                 <span className="flex items-center gap-1">
//                   GST Certificate: {getDocumentStatus(docs.gstFile)}
//                   <span>
//                     {
//                       getDocumentStatus(docs.gstFile) === "Uploaded"
//                         ? <TiTick size={20} className="inline text-green-600 mr-1" />
//                         : <TiDelete size={20} className="inline text-red-600 mr-1" />
//                     }
//                   </span>
//                 </span>
//               </p>
//               <p
//                 className={
//                   docs.panFile ? "text-green-600" : "text-gray-600"
//                 }
//               >
//                 <span className="flex items-center gap-1">

//                   PAN Card: {getDocumentStatus(docs.panFile)}
//                   <span>
//                     {
//                       getDocumentStatus(docs.panFile) === "Uploaded"
//                         ? <TiTick size={20} className="inline text-green-600 mr-1" />
//                         : <TiDelete size={20} className="inline text-red-600 mr-1" />
//                     }
//                   </span>
//                 </span>
//               </p>
//               <p
//                 className={
//                   docs.addressProof ? "text-green-600" : "text-gray-600"
//                 }
//               > <span className="">
//                   Address Proof: {getDocumentStatus(docs.addressProof)}
//                   <span>
//                     {
//                       getDocumentStatus(docs.addressProof) === "Uploaded"
//                         ? <TiTick size={20} className="inline text-green-600 mr-1" />
//                         : <TiDelete size={20} className="inline text-red-600 mr-1" />
//                     }
//                   </span>
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>
//       </Card>

//       <Card title="Your Application Status">
//         <div
//           className={`inline-flex px-4 py-1.5 rounded-md border text-sm items-center gap-2 mb-3 ${
//             statusStyles[status] || statusStyles.DRAFT
//           }`}
//         >
//           <StatusIcon />
//           <span className="font-medium">
//             {status.replace("_", " ")}
//           </span>
//         </div>

//         {application.adminRemark && (
//           <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
//             <p className="text-sm text-red-700">
//               <strong>Admin Remark:</strong> {application.adminRemark}
//             </p>
//           </div>
//         )}

//         <p className="mt-3 text-xs text-gray-500">
//           {status === "PENDING_REVIEW"
//             ? "Your application is under review. You will be notified once verified by the admin team."
//             : status === "APPROVED"
//             ? "Your application has been approved! You can now proceed to choose a subscription plan."
//             : status === "REJECTED"
//             ? "Please address the admin remarks and fix your details/documents, then re-submit."
//             : "Complete your application by submitting all required documents."}
//         </p>
//       </Card>

//       <div className="flex justify-between">
//         <button
//           onClick={goBack}
//           className="px-4 py-2.5 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
//         >
//           <FiArrowLeft className="inline mr-2" /> Back
//         </button>

//         <button
//           onClick={goNext}
//           disabled={!canProceedToSubscription}
//           className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-all ${
//             canProceedToSubscription
//               ? "bg-amber-600 text-white hover:bg-amber-700 shadow-md"
//               : "bg-gray-200 text-gray-400 cursor-not-allowed"
//           }`}
//         >
//           Continue to Subscription
//         </button>
//       </div>
//     </>
//   );
// };

// /* ------------------ STEP 4: SUBSCRIPTION ------------------ */

// const StepSubscription = ({ goBack }) => {
//   const [plans, setPlans] = useState([]);
//   const [plansLoading, setPlansLoading] = useState(true);
//   const [plansError, setPlansError] = useState("");
//   const [selectedPlanId, setSelectedPlanId] = useState("");
//   const [duration, setDuration] = useState("month_1");
//   const [loading, setLoading] = useState(false);

//   const fetchPlans = useCallback(async () => {
//     setPlansLoading(true);
//     setPlansError("");

//     try {
//       const res = await Axios({
//         url: SummaryApi.getAllSubscriptionPlans.url,
//         method: SummaryApi.getAllSubscriptionPlans.method,
//         timeout: 10000,
//       });

//       if (res.data.success) {
//         setPlans(res.data.plans || []);
//       } else {
//         setPlansError(res.data.message || "Failed to load plans");
//       }
//     } catch (err) {
//       console.error("Plans load error:", err);
//       setPlansError("Failed to load subscription plans");
//     } finally {
//       setPlansLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchPlans();
//   }, [fetchPlans]);

//   const selectedPlan = useMemo(
//     () => plans.find((p) => p._id === selectedPlanId) || null,
//     [plans, selectedPlanId]
//   );

//   const selectedPrice = useMemo(() => {
//     if (!selectedPlan || !selectedPlan.pricing) return null;
//     return selectedPlan.pricing[duration] ?? null;
//   }, [selectedPlan, duration]);

//   const subscribe = async () => {
//     if (!selectedPlanId) {
//       return toast.error("Please select a subscription plan.");
//     }

//     setLoading(true);

//     try {
//       const res = await Axios({
//         url: SummaryApi.subscribeToPlan.url,
//         method: SummaryApi.subscribeToPlan.method,
//         data: { planId: selectedPlanId, duration },
//         timeout: 15000,
//       });

//       if (res.data.success) {
//         toast.success("Subscription activated successfully!");
//         // Optionally: redirect or refresh seller profile
//       } else {
//         toast.error(res.data.message || "Failed to activate subscription");
//       }
//     } catch (err) {
//       console.error("Subscription error:", err);
//       toast.error(err.message || "Network error. Please try again.");
//     }

//     setLoading(false);
//   };

//   return (
//     <>
//       <Card
//         title="Choose Subscription Plan"
//         subtitle="Select a plan that matches your business needs and product volume."
//       >
//         {plansLoading ? (
//           <div className="flex items-center text-sm text-gray-600">
//             <FiLoader className="animate-spin mr-2" />
//             Loading subscription plans...
//           </div>
//         ) : plansError ? (
//           <div className="text-sm text-red-600">
//             {plansError}{" "}
//             <button
//               onClick={fetchPlans}
//               className="underline text-amber-700 ml-1"
//             >
//               Retry
//             </button>
//           </div>
//         ) : plans.length === 0 ? (
//           <p className="text-sm text-gray-500">
//             No subscription plans available right now. Please contact support.
//           </p>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               {plans.map((plan) => {
//                 const isActive = selectedPlanId === plan._id;
//                 const CardIcon = plan.isPopular ? FiLayers : FiBriefcase;

//                 return (
//                   <button
//                     key={plan._id}
//                     type="button"
//                     onClick={() => setSelectedPlanId(plan._id)}
//                     className={`text-left border rounded-lg p-4 transition-all hover:shadow-sm ${
//                       isActive
//                         ? "border-amber-500 bg-amber-50 shadow-md"
//                         : "border-gray-200 bg-white hover:border-amber-200"
//                     }`}
//                   >
//                     <div className="flex items-start justify-between mb-2">
//                       <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                         <CardIcon className="text-amber-600" />
//                         {plan.name}
//                       </h3>
//                       {plan.badgeText && (
//                         <span className="bg-amber-600 text-white text-[10px] px-2 py-0.5 rounded-full">
//                           {plan.badgeText}
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-xs text-gray-600 mb-3">
//                       {plan.description || "Flexible plan for your business"}
//                     </p>
//                     <p className="text-xs text-gray-500 mb-1">
//                       Products limit:{" "}
//                       <span className="font-semibold">
//                         {plan.productLimit ?? "—"}
//                       </span>
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       Storage:{" "}
//                       <span className="font-semibold">
//                         {plan.storageLimitGB ?? 0} GB
//                       </span>
//                     </p>
//                   </button>
//                 );
//               })}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="text-sm font-medium text-gray-700">
//                   Billing Duration
//                 </label>
//                 <select
//                   className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-colors"
//                   value={duration}
//                   onChange={(e) => setDuration(e.target.value)}
//                 >
//                   <option value="month_1">Monthly</option>
//                   <option value="month_3">Quarterly (Save 5%)</option>
//                   <option value="month_6">Half Yearly (Save 10%)</option>
//                   <option value="month_12">Yearly (Save 15%)</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700">
//                   Estimated Price
//                 </label>
//                 <div className="mt-1 text-sm">
//                   {selectedPlan && selectedPrice != null ? (
//                     <span className="font-semibold text-amber-700">
//                       ₹{selectedPrice.toLocaleString("en-IN")} /{" "}
//                       {duration === "month_1"
//                         ? "month"
//                         : duration === "month_3"
//                         ? "3 months"
//                         : duration === "month_6"
//                         ? "6 months"
//                         : "12 months"}
//                     </span>
//                   ) : (
//                     <span className="text-gray-400">
//                       Select a plan to see price
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </Card>

//       <div className="flex justify-between">
//         <button
//           onClick={goBack}
//           className="px-4 py-2.5 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
//         >
//           <FiArrowLeft className="inline mr-2" /> Back
//         </button>

//         <button
//           onClick={subscribe}
//           disabled={loading || !selectedPlanId}
//           className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-all ${
//             loading || !selectedPlanId
//               ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//               : "bg-green-600 text-white hover:bg-green-700 shadow-md"
//           }`}
//         >
//           {loading ? (
//             <>
//               <FiLoader className="animate-spin mr-2" />
//               Processing...
//             </>
//           ) : (
//             "Activate Subscription"
//           )}
//         </button>
//       </div>
//     </>
//   );
// };

// /* ------------------ MAIN COMPONENT ------------------ */

// export default function SellerOnboarding() {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [application, setApplication] = useState(null);
//   const [loadingApp, setLoadingApp] = useState(true);

//   const loadApp = useCallback(async () => {
//     setLoadingApp(true);
//     try {
//       const res = await Axios({
//         url: SummaryApi.getMySellerApplication.url,
//         method: SummaryApi.getMySellerApplication.method,
//         timeout: 8000,
//       });

//       if (res.data.success) {
//         setApplication(res.data.application || null);
//       } else {
//         setApplication(null);
//       }
//     } catch (err) {
//       console.error("Load application error:", err);
//       if (err.code !== "ECONNABORTED") {
//         toast.error("Failed to load application data");
//       }
//       setApplication(null);
//     }
//     setLoadingApp(false);
//   }, []);

//   useEffect(() => {
//     loadApp();
//   }, [loadApp]);

//   useEffect(() => {
//     if (!application) {
//       setCurrentStep(0);
//       return;
//     }

//     const status = application.status;
//     const docs = application.documents || {};

//     if (status === "APPROVED") {
//       setCurrentStep(3); // Subscription
//     } else if (status === "PENDING_REVIEW" || status === "REJECTED") {
//       setCurrentStep(2); // Review & Status
//     } else if (status === "DRAFT") {
//       const hasAllDocs =
//         docs.gstFile && docs.panFile && docs.addressProof;
//       if (hasAllDocs) {
//         setCurrentStep(2); // Ready to review
//       } else {
//         // Business details likely saved, move to KYC
//         setCurrentStep(1);
//       }
//     } else {
//       setCurrentStep(0);
//     }
//   }, [application]);

//   const next = useCallback(
//     () => setCurrentStep((p) => Math.min(p + 1, STEPS.length - 1)),
//     []
//   );

//   const back = useCallback(
//     () => setCurrentStep((p) => Math.max(p - 1, 0)),
//     []
//   );

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
//       <StepHeader currentStep={currentStep} application={application} />

//       {loadingApp ? (
//         <div className="bg-white border rounded-lg p-8 text-center">
//           <div className="flex justify-center mb-4">
//             <FiLoader className="animate-spin text-amber-600 text-2xl" />
//           </div>
//           <p className="text-gray-600">Loading your application...</p>
//         </div>
//       ) : (
//         <div className="transition-opacity duration-300">
//           {currentStep === 0 && (
//             <StepBusiness
//               application={application}
//               goNext={next}
//               onSaved={loadApp}
//             />
//           )}

//           {currentStep === 1 && (
//             <StepKyc
//               application={application}
//               goNext={next}
//               goBack={back}
//               onUpdated={loadApp}
//             />
//           )}

//           {currentStep === 2 && (
//             <StepReviewStatus
//               application={application}
//               goNext={next}
//               goBack={back}
//             />
//           )}

//           {currentStep === 3 && <StepSubscription goBack={back} />}
//         </div>
//       )}
//     </div>
//   );
// }

// components/SellerOnboarding.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Axios from "../utils/network/axios";
import SummaryApi from "../comman/summaryApi";
import uploadSellerDocument, {
  MAX_FILE_SIZE_MB,
} from "../utils/helpers/uploadSellerDocument";
import { toast } from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import { TiDelete } from "react-icons/ti";
import { FiStar } from "react-icons/fi";
import {
  FiCheckCircle,
  FiFileText,
  FiShield,
  FiUploadCloud,
  FiArrowRight,
  FiArrowLeft,
  FiBriefcase,
  FiLayers,
  FiAlertCircle,
  FiX,
  FiEye,
  FiLoader,
  FiTrendingUp,
  FiClock,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import SellerOnboardingLoader from "../components/SellerOnboardingSkeleton";
import SellerSubscriptionPlans from "../components/SellerSubscriptionPlans";

/* ------------------ STEP META ------------------ */

const STEPS = [
  { id: 1, label: "Business Details", icon: FiBriefcase },
  { id: 2, label: "KYC Documents", icon: FiUploadCloud },
  { id: 3, label: "Review & Status", icon: FiFileText },
  { id: 4, label: "Subscription", icon: FiLayers },
];

/* ------------------ UTIL UI ------------------ */

const StepHeader = ({ currentStep, application }) => {
  const progress = useMemo(
    () => ((currentStep + 1) / STEPS.length) * 100,
    [currentStep]
  );

  const statusText = application?.status || "Not started";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-md mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-amber-600 font-semibold">
            Seller Onboarding
          </p>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2 mt-1">
            Step {currentStep + 1} / {STEPS.length} — {STEPS[currentStep].label}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Application status:{" "}
            <span className="font-semibold text-gray-800">{statusText}</span>
          </p>
        </div>

        <div className="hidden lg:flex items-center flex-wrap gap-2 text-xs text-gray-600">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isDone = index < currentStep;
            const isActive = index === currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-center px-3 py-1 rounded-full border text-[11px] transition-all ${
                  isActive
                    ? "border-amber-500 bg-amber-50 text-amber-700 font-medium shadow-sm"
                    : isDone
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 bg-gray-50 text-gray-500"
                }`}
              >
                {isDone ? (
                  <FiCheckCircle className="mr-1.5" />
                ) : (
                  <Icon className="mr-1.5" />
                )}
                {step.label}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-green-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const Card = ({ title, subtitle, rightSlot, children }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm mb-6">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {rightSlot}
    </div>
    {children}
  </div>
);

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}) => (
  <div className="mb-4">
    <label className="text-sm font-medium text-gray-700 flex items-center">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
    />
  </div>
);

const FileField = ({
  label,
  hint,
  onChange,
  existingUrl,
  onPreview,
  disabled,
  acceptedTypes = ".jpg,.jpeg,.png,.webp,.pdf",
}) => (
  <div className="mb-4">
    <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
      <span>{label}</span>
      {existingUrl && (
        <span className="flex items-center gap-1">
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[11px] border border-green-300">
            Uploaded
          </span>
          <button
            type="button"
            onClick={() => onPreview && onPreview(existingUrl)}
            className="flex items-center text-[11px] text-blue-600 hover:underline"
          >
            <FiEye className="mr-1" />
            View
          </button>
        </span>
      )}
    </label>
    {hint && <p className="text-xs text-gray-500 mb-2">{hint}</p>}
    <input
      type="file"
      accept={acceptedTypes}
      disabled={disabled}
      onChange={(e) => {
        const file = e.target.files?.[0] || null;
        if (file) {
          onChange(file);
        }
      }}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-colors"
    />
    <p className="text-[11px] text-gray-400 mt-1">
      Max size: {MAX_FILE_SIZE_MB}MB. Supported: JPG, PNG, WEBP, PDF.
    </p>
  </div>
);

/* ------------------ IMAGE / DOC PREVIEW MODAL ------------------ */

const ImagePreviewModal = ({ url, onClose }) => {
  if (!url) return null;

  const isPdf = url.toLowerCase().endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 relative p-4 max-h-[90vh] overflow-hidden shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 z-10 transition-colors"
        >
          <FiX className="text-gray-600 text-lg" />
        </button>
        <div className="mt-2 flex justify-center items-center h-full">
          {isPdf ? (
            <iframe
              src={url}
              title="Document preview"
              className="w-full h-[70vh] border rounded-md"
            />
          ) : (
            <img
              src={url}
              alt="Document preview"
              className="max-h-[70vh] max-w-full rounded-md object-contain"
              onError={(e) => {
                e.target.src = "/api/placeholder/400/300";
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ------------------ INTRO STEP (HYBRID UI) ------------------ */

const IntroStep = ({ plans, plansLoading, plansError, onStart, reloadPlans }) => {
  const topPlans = useMemo(() => {
    if (!Array.isArray(plans)) return [];
    const active = plans.filter((p) => p.status === "ACTIVE" || !p.status);
    return active
      .sort((a, b) => (b.priorityLevel || 0) - (a.priorityLevel || 0))
      .slice(0, 3);
  }, [plans]);

  return (
    <div className="mb-8 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-r from-amber-50 via-orange-50 to-green-50 p-6 sm:p-8 shadow-sm">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-200/40 rounded-full blur-3xl" />
        <div className="absolute -left-16 bottom-0 w-40 h-40 bg-green-200/40 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-amber-100 shadow-sm">
              <FiZap className="text-amber-500 text-sm" />
              <span className="text-[11px] uppercase tracking-[0.18em] text-amber-700 font-semibold">
                Start selling in days, not weeks
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-snug">
              Become a <span className="text-amber-600">Verified Seller</span> &
              grow with{" "}
              <span className="bg-amber-100 px-1.5 py-0.5 rounded-lg">
                seamless onboarding
              </span>
              .
            </h1>

            <p className="text-sm sm:text-base text-gray-600 max-w-xl">
              Complete your business profile, upload KYC documents and activate
              a subscription to start receiving orders with priority visibility
              and fast payouts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm mt-3">
              <div className="flex items-start gap-2 bg-white/80 backdrop-blur border border-gray-100 rounded-2xl px-3 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
                <div className="mt-0.5">
                  <FiClock className="text-amber-500 text-base" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    10–15 min onboarding
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Guided 4-step flow with autosave and KYC assistance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white/80 backdrop-blur border border-gray-100 rounded-2xl px-3 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
                <div className="mt-0.5">
                  <FiTrendingUp className="text-green-500 text-base" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Priority discovery
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Smart ranking & product boost based on your subscription.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white/80 backdrop-blur border border-gray-100 rounded-2xl px-3 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
                <div className="mt-0.5">
                  <FiUsers className="text-emerald-500 text-base" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Dedicated support
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Seller success team, payouts help and compliance support.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
              <button
                onClick={onStart}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm sm:text-[13px] font-semibold text-white bg-gradient-to-r from-amber-600 via-orange-500 to-green-600 hover:from-amber-700 hover:via-orange-600 hover:to-green-700 shadow-[0_12px_35px_rgba(248,180,0,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Start Seller Onboarding
                <FiArrowRight className="ml-2 text-sm" />
              </button>

              <p className="text-[11px] text-gray-500">
                No charges to create your seller profile. Subscription applies
                only after approval.
              </p>
            </div>
          </div>

          {/* Small Side Stats block */}
          <div className="w-full md:w-64 lg:w-72">
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-gray-100 px-4 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.16em] mb-2 flex items-center gap-1.5">
                <FiShield className="text-emerald-500 text-sm" />
                Protected & compliant
              </p>
              <div className="space-y-2 text-xs text-gray-600">
                <p className="flex justify-between">
                  <span>Secure KYC verification</span>
                  <span className="font-semibold text-gray-900">Yes</span>
                </p>
                <p className="flex justify-between">
                  <span>GST & PAN support</span>
                  <span className="font-semibold text-gray-900">Included</span>
                </p>
                <p className="flex justify-between">
                  <span>24x7 dashboard access</span>
                  <span className="font-semibold text-gray-900">Unlimited</span>
                </p>
              </div>

              <div className="mt-3 border-t border-dashed border-gray-200 pt-3">
                <p className="text-[11px] text-gray-500 mb-1">
                  KYC verification TAT
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  24–48 hours <span className="text-[11px] text-gray-500">(typical)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Preview Section */}
     <SellerSubscriptionPlans
        plans={plans}
        onSelect={(planId, duration) => {
          console.log("User selected:", planId, duration);
        }}
     />
    </div>
  );
};

/* ------------------ STEP 1: BUSINESS ------------------ */

const StepBusiness = ({ application, goNext, onSaved }) => {
  const [form, setForm] = useState({
    businessName: application?.businessName || "",
    businessType: application?.businessType || "",
    gstNumber: application?.gstNumber || "",
    panNumber: application?.panNumber || "",
    turnover: application?.turnover || "",
    description: application?.description || "",
  });

  const [saving, setSaving] = useState(false);

  const isValid = useMemo(
    () =>
      form.businessName.trim().length > 2 &&
      form.businessName.trim().length <= 100,
    [form.businessName]
  );

  const handleSave = async () => {
    if (!isValid) {
      return toast.error(
        "Please enter a valid business name (3-100 characters)."
      );
    }

    setSaving(true);

    try {
      const res = await Axios({
        url: SummaryApi.registerSeller.url,
        method: "POST",
        data: form,
        timeout: 10000,
      });

      if (res.data.success) {
        toast.success("Business details saved successfully!");
        await onSaved();
        goNext();
      } else {
        toast.error(res.data.message || "Failed to save business details");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Network error. Please try again.");
    }

    setSaving(false);
  };

  return (
    <>
      <Card
        title="Business Profile"
        subtitle="Your official business information used for compliance, KYC and invoices."
        rightSlot={
          <span className="text-xs text-gray-500 hidden sm:inline">
            Takes around 2–3 minutes
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            required
            label="Business Name"
            placeholder="e.g., QuickKart Retail"
            value={form.businessName}
            onChange={(v) => setForm({ ...form, businessName: v })}
          />

          <Input
            label="Business Type"
            placeholder="Proprietorship / Pvt Ltd"
            value={form.businessType}
            onChange={(v) => setForm({ ...form, businessType: v })}
          />

          <Input
            label="GST Number"
            placeholder="Optional"
            value={form.gstNumber}
            onChange={(v) => setForm({ ...form, gstNumber: v })}
          />

          <Input
            label="PAN Number"
            placeholder="ABCDE1234F"
            value={form.panNumber}
            onChange={(v) => setForm({ ...form, panNumber: v })}
          />

          <Input
            label="Annual Turnover"
            placeholder="e.g., 10L–50L"
            value={form.turnover}
            onChange={(v) => setForm({ ...form, turnover: v })}
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">
            About Your Business
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Describe your products, niche, target audience, and business operations..."
            className="mt-1 border w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm resize-none transition-colors"
            maxLength={500}
          />
          <p className="text-xs text-gray-400 text-right mt-1">
            {form.description.length}/500 characters
          </p>
        </div>
      </Card>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isValid || saving}
          className={`px-5 py-2.5 rounded-md text-sm font-semibold shadow inline-flex items-center transition-all ${
            saving || !isValid
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-amber-600 text-white hover:bg-amber-700 shadow-md"
          }`}
        >
          {saving ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              Save & Continue
              <FiArrowRight className="ml-2" />
            </>
          )}
        </button>
      </div>
    </>
  );
};

/* ------------------ STEP 2: KYC ------------------ */

const StepKyc = ({ application, goNext, goBack, onUpdated }) => {
  const [gstFile, setGstFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [addressProof, setAddressProof] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);

  const docs = application?.documents || {};
  const status = application?.status;

  const canReupload = status === "REJECTED";
  const isLocked = status === "PENDING_REVIEW" || status === "APPROVED";
  const disableFields = isLocked && !canReupload;

  const validateFileLocal = useCallback((file) => {
    if (!file) return true;

    const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error(
        `"${file.name}" is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`
      );
      return false;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        `"${file.name}" is not supported. Only JPG, PNG, WEBP, PDF allowed.`
      );
      return false;
    }

    return true;
  }, []);

  const handleGstChange = (file) => {
    if (!validateFileLocal(file)) return;
    setGstFile(file);
  };

  const handlePanChange = (file) => {
    if (!validateFileLocal(file)) return;
    setPanFile(file);
  };

  const handleAddressChange = (file) => {
    if (!validateFileLocal(file)) return;
    setAddressProof(file);
  };

  const submitKyc = async () => {
    if (isLocked && !canReupload) {
      return toast.error("KYC already submitted. Wait for admin review.");
    }

    const hasNewDocs = gstFile || panFile || addressProof;

    if (status === "REJECTED" && !hasNewDocs) {
      return toast.error(
        "Your KYC was rejected. Please re-upload at least one corrected document."
      );
    }

    const hasAllDocs =
      (gstFile || docs.gstFile) &&
      (panFile || docs.panFile) &&
      (addressProof || docs.addressProof);

    if (!hasAllDocs) {
      return toast.error(
        "All 3 documents (GST, PAN, Address Proof) are required."
      );
    }

    if (!hasNewDocs) {
      return toast.error("Please select at least one document to upload.");
    }

    setUploading(true);
    setUploadProgress(0);

    const result = await uploadSellerDocument({
      gstFile,
      panFile,
      addressProof,
      enableCompression: true,
      onUploadProgress: (percent) => setUploadProgress(percent),
    });

    setUploading(false);

    if (result.success) {
      toast.success(
        result.status === "PENDING_REVIEW"
          ? "Documents submitted for verification!"
          : "Documents uploaded successfully!"
      );
      setGstFile(null);
      setPanFile(null);
      setAddressProof(null);
      setUploadProgress(0);
      await onUpdated();
      goNext();
    } else {
      toast.error(result.message || "Failed to upload documents");
    }
  };

  return (
    <>
      <Card
        title="KYC Verification"
        subtitle="Upload clear and valid documents. We typically verify within 24–48 hours."
        rightSlot={
          <div className="text-xs text-gray-500 flex items-center space-x-1">
            <FiShield className="text-green-600" />
            <span className="hidden sm:inline">Secure & encrypted</span>
          </div>
        }
      >
        {status === "REJECTED" && (
          <div className="mb-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            Your KYC was <span className="font-semibold">REJECTED</span>.
            Please fix the issues and re-upload corrected documents.
          </div>
        )}

        {isLocked && !canReupload && (
          <div className="mb-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            Your KYC is already submitted and is in{" "}
            <span className="font-semibold">{status}</span> state. You can view
            documents but cannot re-upload until admin updates the status.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileField
            label="GST Certificate"
            existingUrl={docs.gstFile}
            hint="Upload clear photo or PDF of GST registration certificate"
            onChange={handleGstChange}
            onPreview={setPreviewUrl}
            disabled={uploading || disableFields}
          />
          <FileField
            label="PAN Card"
            existingUrl={docs.panFile}
            hint="Upload PAN card (Proprietor / Business)"
            onChange={handlePanChange}
            onPreview={setPreviewUrl}
            disabled={uploading || disableFields}
          />
          <FileField
            label="Address Proof"
            existingUrl={docs.addressProof}
            hint="Electricity bill / Rent agreement / Bank statement (image or PDF)"
            onChange={handleAddressChange}
            onPreview={setPreviewUrl}
            disabled={uploading || disableFields}
          />
        </div>

        {uploading && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-700 mb-2 flex items-center">
              <FiLoader className="animate-spin mr-2" />
              Uploading and optimizing documents... {uploadProgress}%
            </p>
            <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-blue-600 mt-2">
              Please don't close this window during upload.
            </p>
          </div>
        )}
      </Card>

      <div className="flex justify-between">
        <button
          onClick={goBack}
          disabled={uploading}
          className="px-4 py-2.5 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-colors"
        >
          <FiArrowLeft className="inline mr-2" /> Back
        </button>

        <button
          onClick={submitKyc}
          disabled={uploading}
          className={`px-5 py-2.5 rounded-md text-sm font-semibold inline-flex items-center transition-all ${
            uploading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 shadow-md"
          }`}
        >
          {uploading ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Uploading... {uploadProgress}%
            </>
          ) : (
            "Submit for Review"
          )}
        </button>
      </div>

      <ImagePreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
    </>
  );
};

/* ------------------ STEP 3: REVIEW & STATUS ------------------ */

const StepReviewStatus = ({ application, goNext, goBack }) => {
  if (!application) {
    return (
      <Card title="No Application Found">
        <p className="text-sm text-gray-600">
          Please start by adding your business details in Step 1.
        </p>
      </Card>
    );
  }

  const status = application.status;
  const docs = application.documents || {};

  const statusStyles = {
    DRAFT: "bg-gray-100 text-gray-700 border-gray-300",
    PENDING_REVIEW: "bg-yellow-50 text-yellow-700 border-yellow-300",
    APPROVED: "bg-green-50 text-green-700 border-green-300",
    REJECTED: "bg-red-50 text-red-700 border-red-300",
  };

  const StatusIcon =
    status === "APPROVED"
      ? FiCheckCircle
      : status === "REJECTED"
      ? FiAlertCircle
      : FiShield;

  const canProceedToSubscription = status === "APPROVED";

  const getDocumentStatus = (docUrl) =>
    docUrl ? "Uploaded" : "Not uploaded";

  return (
    <>
      <Card
        title="Review Your Application"
        subtitle="Submitted details are considered legally binding and cannot be altered."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 text-gray-900">
              Business Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {application.businessName || "-"}
              </p>
              <p>
                <strong>Type:</strong> {application.businessType || "-"}
              </p>
              <p>
                <strong>GST:</strong> {application.gstNumber || "-"}
              </p>
              <p>
                <strong>PAN:</strong> {application.panNumber || "-"}
              </p>
              <p>
                <strong>Turnover:</strong> {application.turnover || "-"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-gray-900">
              Document Status
            </h3>
            <div className="space-y-2 text-sm">
              <p
                className={
                  docs.gstFile ? "text-green-600" : "text-red-600"
                }
              >
                <span className="flex items-center gap-1">
                  GST Certificate: {getDocumentStatus(docs.gstFile)}
                  <span>
                    {getDocumentStatus(docs.gstFile) === "Uploaded" ? (
                      <TiTick
                        size={20}
                        className="inline text-green-600 mr-1"
                      />
                    ) : (
                      <TiDelete
                        size={20}
                        className="inline text-red-600 mr-1"
                      />
                    )}
                  </span>
                </span>
              </p>
              <p
                className={
                  docs.panFile ? "text-green-600" : "text-red-600"
                }
              >
                <span className="flex items-center gap-1">
                  PAN Card: {getDocumentStatus(docs.panFile)}
                  <span>
                    {getDocumentStatus(docs.panFile) === "Uploaded" ? (
                      <TiTick
                        size={20}
                        className="inline text-green-600 mr-1"
                      />
                    ) : (
                      <TiDelete
                        size={20}
                        className="inline text-red-600 mr-1"
                      />
                    )}
                  </span>
                </span>
              </p>
              <p
                className={
                  docs.addressProof ? "text-green-600" : "text-red-600"
                }
              >
                <span className="flex items-center gap-1">
                  Address Proof: {getDocumentStatus(docs.addressProof)}
                  <span>
                    {getDocumentStatus(docs.addressProof) === "Uploaded" ? (
                      <TiTick
                        size={20}
                        className="inline text-green-600 mr-1"
                      />
                    ) : (
                      <TiDelete
                        size={20}
                        className="inline text-red-600 mr-1"
                      />
                    )}
                  </span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Your Application Status">
        <div
          className={`inline-flex px-4 py-1.5 rounded-md border text-sm items-center gap-2 mb-3 ${
            statusStyles[status] || statusStyles.DRAFT
          }`}
        >
          <StatusIcon />
          <span className="font-medium">
            {status.replace("_", " ")}
          </span>
        </div>

        {application.adminRemark && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">
              <strong>Admin Remark:</strong> {application.adminRemark}
            </p>
          </div>
        )}

        <p className="mt-3 text-xs text-gray-500">
          {status === "PENDING_REVIEW"
            ? "Your application is under review. You will be notified once verified by the admin team."
            : status === "APPROVED"
            ? "Your application has been approved! You can now proceed to choose a subscription plan."
            : status === "REJECTED"
            ? "Please address the admin remarks and fix your details/documents, then re-submit."
            : "Complete your application by submitting all required documents."}
        </p>
      </Card>

      <div className="flex justify-between">
        <button
          onClick={goBack}
          className="px-4 py-2.5 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FiArrowLeft className="inline mr-2" /> Back
        </button>

        <button
          onClick={goNext}
          disabled={!canProceedToSubscription}
          className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-all ${
            canProceedToSubscription
              ? "bg-amber-600 text-white hover:bg-amber-700 shadow-md"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue to Subscription
        </button>
      </div>
    </>
  );
};

/* ------------------ STEP 4: SUBSCRIPTION ------------------ */

const StepSubscription = ({
  plans,
  plansLoading,
  plansError,
  reloadPlans,
  goBack,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [duration, setDuration] = useState("month_1");
  const [loading, setLoading] = useState(false);

  const selectedPlan = useMemo(
    () => plans.find((p) => p._id === selectedPlanId) || null,
    [plans, selectedPlanId]
  );

  const selectedPrice = useMemo(() => {
    if (!selectedPlan || !selectedPlan.pricing) return null;
    return selectedPlan.pricing[duration] ?? null;
  }, [selectedPlan, duration]);

  const subscribe = async () => {
    if (!selectedPlanId) {
      return toast.error("Please select a subscription plan.");
    }

    setLoading(true);

    try {
      const res = await Axios({
        url: SummaryApi.subscribeToPlan.url,
        method: SummaryApi.subscribeToPlan.method,
        data: { planId: selectedPlanId, duration },
        timeout: 15000,
      });

      if (res.data.success) {
        toast.success("Subscription activated successfully!");
        // Optionally: redirect or refresh seller profile
      } else {
        toast.error(res.data.message || "Failed to activate subscription");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error(err.message || "Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <Card
        title="Choose Subscription Plan"
        subtitle="Select a plan that matches your business needs and product volume."
        rightSlot={
          plansLoading ? (
            <span className="flex items-center text-xs text-gray-500">
              <FiLoader className="animate-spin mr-2" />
              Loading subscription plans...
            </span>
          ) : plansError ? (
            <button
              onClick={reloadPlans}
              className="text-xs text-amber-700 underline"
            >
              Retry loading plans
            </button>
          ) : null
        }
      >
        {plansLoading ? (
          <div className="flex items-center text-sm text-gray-600">
            <FiLoader className="animate-spin mr-2" />
            Loading subscription plans...
          </div>
        ) : plansError ? (
          <div className="text-sm text-red-600">
            {plansError}{" "}
            <button
              onClick={reloadPlans}
              className="underline text-amber-700 ml-1"
            >
              Retry
            </button>
          </div>
        ) : plans.length === 0 ? (
          <p className="text-sm text-gray-500">
            No subscription plans available right now. Please contact support.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {plans.map((plan) => {
                const isActive = selectedPlanId === plan._id;
                const CardIcon = plan.isPopular ? FiLayers : FiBriefcase;

                return (
                  <button
                    key={plan._id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan._id)}
                    className={`text-left border rounded-2xl p-4 transition-all hover:shadow-sm ${
                      isActive
                        ? "border-amber-500 bg-amber-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-amber-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <CardIcon className="text-amber-600" />
                        {plan.name}
                      </h3>
                      {plan.badgeText && (
                        <span className="bg-amber-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                          {plan.badgeText}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      {plan.description || "Flexible plan for your business"}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      Products limit:{" "}
                      <span className="font-semibold">
                        {plan.productLimit ?? "—"}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Storage:{" "}
                      <span className="font-semibold">
                        {plan.storageLimitGB ?? 0} GB
                      </span>
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Billing Duration
                </label>
                <select
                  className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-colors"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="month_1">Monthly</option>
                  <option value="month_3">Quarterly (Save 5%)</option>
                  <option value="month_6">Half Yearly (Save 10%)</option>
                  <option value="month_12">Yearly (Save 15%)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Estimated Price
                </label>
                <div className="mt-1 text-sm">
                  {selectedPlan && selectedPrice != null ? (
                    <span className="font-semibold text-amber-700">
                      ₹{selectedPrice.toLocaleString("en-IN")} /{" "}
                      {duration === "month_1"
                        ? "month"
                        : duration === "month_3"
                        ? "3 months"
                        : duration === "month_6"
                        ? "6 months"
                        : "12 months"}
                    </span>
                  ) : (
                    <span className="text-gray-400">
                      Select a plan to see price
                    </span>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      <div className="flex justify-between">
        <button
          onClick={goBack}
          className="px-4 py-2.5 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FiArrowLeft className="inline mr-2" /> Back
        </button>

        <button
          onClick={subscribe}
          disabled={loading || !selectedPlanId}
          className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-all ${
            loading || !selectedPlanId
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 shadow-md"
          }`}
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Processing...
            </>
          ) : (
            "Activate Subscription"
          )}
        </button>
      </div>
    </>
  );
};

/* ------------------ MAIN COMPONENT ------------------ */

export default function SellerOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [application, setApplication] = useState(null);
  const [loadingApp, setLoadingApp] = useState(true);

  // Intro state (for new sellers with no application yet)
  const [hasStartedOnboarding, setHasStartedOnboarding] = useState(false);

  // Plans shared between intro & subscription
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState("");

  const loadApp = useCallback(async () => {
    setLoadingApp(true);
    try {
      const res = await Axios({
        url: SummaryApi.getMySellerApplication.url,
        method: SummaryApi.getMySellerApplication.method,
        timeout: 8000,
      });

      if (res.data.success) {
        setApplication(res.data.application || null);
      } else {
        setApplication(null);
      }
    } catch (err) {
      console.error("Load application error:", err);
      if (err.code !== "ECONNABORTED") {
        toast.error("Failed to load application data");
      }
      setApplication(null);
    }
    setLoadingApp(false);
  }, []);

  const fetchPlans = useCallback(async () => {
    setPlansLoading(true);
    setPlansError("");

    try {
      const res = await Axios({
        url: SummaryApi.getAllSubscriptionPlans.url,
        method: SummaryApi.getAllSubscriptionPlans.method,
        timeout: 10000,
      });

      if (res.data.success) {
        const allPlans = res.data.plans || [];
        const activePlans = allPlans.filter(
          (p) => p.status === "ACTIVE" || !p.status
        );
        setPlans(activePlans);
      } else {
        setPlansError(res.data.message || "Failed to load plans");
      }
    } catch (err) {
      console.error("Plans load error:", err);
      setPlansError("Failed to load subscription plans");
    } finally {
      setPlansLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApp();
    fetchPlans();
  }, [loadApp, fetchPlans]);

  useEffect(() => {
    if (!application) {
      setCurrentStep(0);
      return;
    }

    const status = application.status;
    const docs = application.documents || {};

    if (status === "APPROVED") {
      setCurrentStep(3); // Subscription
    } else if (status === "PENDING_REVIEW" || status === "REJECTED") {
      setCurrentStep(2); // Review & Status
    } else if (status === "DRAFT") {
      const hasAllDocs = docs.gstFile && docs.panFile && docs.addressProof;
      if (hasAllDocs) {
        setCurrentStep(2); // Ready to review
      } else {
        setCurrentStep(1); // KYC
      }
    } else {
      setCurrentStep(0);
    }
  }, [application]);

  const next = useCallback(
    () => setCurrentStep((p) => Math.min(p + 1, STEPS.length - 1)),
    []
  );

  const back = useCallback(
    () => setCurrentStep((p) => Math.max(p - 1, 0)),
    []
  );

  const showIntro = !application && !hasStartedOnboarding;

  return (
    <div className="max-w-full mx-auto px-4 py-5 sm:py-6">
      {loadingApp ? (
        <SellerOnboardingLoader />
      ) : showIntro ? (
        <IntroStep
          plans={plans}
          plansLoading={plansLoading}
          plansError={plansError}
          reloadPlans={fetchPlans}
          onStart={() => setHasStartedOnboarding(true)}
        />
      ) : (
        <>
          <StepHeader currentStep={currentStep} application={application} />

          <div className="transition-opacity duration-300">
            {currentStep === 0 && (
              <StepBusiness
                application={application}
                goNext={next}
                onSaved={loadApp}
              />
            )}

            {currentStep === 1 && (
              <StepKyc
                application={application}
                goNext={next}
                goBack={back}
                onUpdated={loadApp}
              />
            )}

            {currentStep === 2 && (
              <StepReviewStatus
                application={application}
                goNext={next}
                goBack={back}
              />
            )}

            {currentStep === 3 && (
              <StepSubscription
                plans={plans}
                plansLoading={plansLoading}
                plansError={plansError}
                reloadPlans={fetchPlans}
                goBack={back}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
