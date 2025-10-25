// import React, { useEffect, useState, useMemo } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import Confetti from 'react-confetti';
// import { useWindowSize } from 'react-use';
// import { 
//   CheckCircle2, 
//   Clock, 
//   Package, 
//   ShieldCheck, 
//   Truck, 
//   Mail,
//   Phone,
//   Star,
//   Users,
//   Award,
//   Lock
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useSelector } from 'react-redux';

// // Trust Badges Component
// const TrustBadges = () => {
//   const trustFeatures = [
//     { icon: <ShieldCheck className="w-5 h-5" />, text: "Secure Payment", subtext: "100% Protected" },
//     { icon: <Package className="w-5 h-5" />, text: "Quality Assured", subtext: "Premium Products" },
//     { icon: <Truck className="w-5 h-5" />, text: "Reliable Delivery", subtext: "On-time Promise" },
//     { icon: <Users className="w-5 h-5" />, text: "24/7 Support", subtext: "Always Here" },
//   ];

//   return (
//     <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {trustFeatures.map((feature, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 + 1 }}
//             className="text-center p-3 rounded-xl bg-gray-50 hover:bg-amber-50 transition-colors"
//           >
//             <div className="text-amber-600 flex justify-center mb-2">
//               {feature.icon}
//             </div>
//             <p className="text-sm font-medium text-gray-800">{feature.text}</p>
//             <p className="text-xs text-gray-500 mt-1">{feature.subtext}</p>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Customer Support Card
// const CustomerSupport = () => (
//   <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
//     <h3 className="text-lg font-semibold text-amber-800 mb-3">Need Help?</h3>
//     <div className="space-y-3">
//       <div className="flex items-center gap-3">
//         <div className="p-2 bg-amber-100 rounded-xl">
//           <Mail className="w-4 h-4 text-amber-600" />
//         </div>
//         <div>
//           <p className="text-sm font-medium text-amber-800">Email Support</p>
//           <p className="text-xs text-amber-600">support@quickoo-co.com</p>
//         </div>
//       </div>
//       <div className="flex items-center gap-3">
//         <div className="p-2 bg-amber-100 rounded-xl">
//           <Phone className="w-4 h-4 text-amber-600" />
//         </div>
//         <div>
//           <p className="text-sm font-medium text-amber-800">Call Us</p>
//           <p className="text-xs text-amber-600">+91 706 689 3615</p>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Order Timeline
// const OrderTimeline = () => {
//   const steps = [
//     { status: 'confirmed', label: 'Order Confirmed', description: 'Your order has been received' },
//     { status: 'processing', label: 'Processing', description: 'Preparing your items' },
//     { status: 'shipped', label: 'Shipped', description: 'On its way to you' },
//     { status: 'delivered', label: 'Delivered', description: 'Expected delivery' },
//   ];

//   return (
//     <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Journey</h3>
//       <div className="space-y-4">
//         {steps.map((step, index) => (
//           <div key={step.status} className="flex items-start gap-4">
//             <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
//               index === 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
//             }`}>
//               {index === 0 ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
//             </div>
//             <div className="flex-1">
//               <p className={`font-medium ${
//                 index === 0 ? 'text-green-600' : 'text-gray-600'
//               }`}>
//                 {step.label}
//               </p>
//               <p className="text-sm text-gray-500 mt-1">{step.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Security Assurance
// const SecurityAssurance = () => (
//   <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
//     <div className="flex items-center gap-3 mb-4">
//       <div className="p-2 bg-green-100 rounded-xl">
//         <Lock className="w-5 h-5 text-green-600" />
//       </div>
//       <h3 className="text-lg font-semibold text-gray-800">Your Order is Secure</h3>
//     </div>
//     <div className="space-y-2 text-sm text-gray-600">
//       <p>✓ All transactions are encrypted and secure</p>
//       <p>✓ We never store your payment details</p>
//       <p>✓ 256-bit SSL encryption protection</p>
//       <p>✓ PCI DSS compliant payment processing</p>
//     </div>
//   </div>
// );


// const Success = () => {
//   const { width, height } = useWindowSize();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const user = useSelector(state => state.user);

//   const [startAnimation, setStartAnimation] = useState(false);
//   const [confetti, setConfetti] = useState(false);

//   // Generate order ID from user data or random
//   const orderId = useMemo(() => {
//     const timestamp = Date.now().toString().slice(-6);
//     const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
//     return `ORD-${timestamp}${random}`;
//   }, []);

//   // Delivery date calculation
//   const deliveryRange = useMemo(() => {
//     const now = new Date();
//     const startDelivery = new Date(now);
//     const endDelivery = new Date(now);
//     startDelivery.setDate(now.getDate() + 2);
//     endDelivery.setDate(now.getDate() + 6);
    
//     const formatDate = (date) => date.toLocaleDateString(undefined, { 
//       weekday: 'short', 
//       month: 'short', 
//       day: 'numeric' 
//     });
    
//     return `${formatDate(startDelivery)} - ${formatDate(endDelivery)}`;
//   }, []);

//   // Prevent back navigation
//   useEffect(() => {
//     window.history.pushState(null, '', window.location.href);
//     const handlePopState = () => navigate('/', { replace: true });
//     window.addEventListener('popstate', handlePopState);
//     return () => window.removeEventListener('popstate', handlePopState);
//   }, [navigate]);

//   // Trigger animations
//   useEffect(() => {
//     const startTimeout = setTimeout(() => setStartAnimation(true), 400);
//     const confettiStart = setTimeout(() => setConfetti(true), 1000);
//     const confettiStop = setTimeout(() => setConfetti(false), 6000);
    
//     return () => {
//       clearTimeout(startTimeout);
//       clearTimeout(confettiStart);
//       clearTimeout(confettiStop);
//     };
//   }, []);

//   return (
//     <div className="min-h-screen">
//       <div className="max-w-full mx-auto p-4">
//         {/* Confetti */}
//         <AnimatePresence>
//           {true && (
//             <Confetti 
//               width={500} 
//               height={height} 
//               numberOfPieces={300}
//               recycle={false}
//               gravity={0.2}
//             />
//           )}
//         </AnimatePresence>

//         {/* Header - Consistent with other pages */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm"
//         >
//           <div className="flex items-center gap-3 mb-3 sm:mb-0">
//             <div className="p-2 bg-green-50 rounded-xl">
//               <CheckCircle2 className="text-green-600 text-xl" />
//             </div>
//             <div>
//               <h2 className="font-semibold text-xl text-gray-800">Order Confirmed!</h2>
//               <p className="text-sm text-gray-600">Thank you for your purchase</p>
//             </div>
//           </div>
          
//           <div className="text-sm text-gray-500 bg-green-50 px-3 py-2 rounded-xl">
//             Order ID: <span className="font-mono font-medium text-green-700">{orderId}</span>
//           </div>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           {/* Left Column - Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Success Message */}
//             <motion.div 
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center"
//             >
//               <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
//               <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-2">
//                 Order Confirmed!
//               </h1>
//               <p className="text-gray-600 text-lg mb-4">
//                 Thank you for your order, {user?.name || 'Valued Customer'}!
//               </p>
//               <p className="text-gray-500">
//                 We've sent the order confirmation to your email
//               </p>
//             </motion.div>

//             {/* Order Timeline */}
//             <OrderTimeline />

//             {/* Trust Badges */}
//             <TrustBadges />
//           </div>

//           {/* Right Column - Sidebar */}
//           <div className="space-y-6">
//             {/* Order Summary */}
//             <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
//               <div className="space-y-3 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Order ID</span>
//                   <span className="font-mono font-medium">{orderId}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Estimated Delivery</span>
//                   <span className="font-medium text-green-600">{deliveryRange}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Status</span>
//                   <span className="font-medium text-green-600">Confirmed</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Payment Method</span>
//                   <span className="font-medium">Cash on Delivery</span>
//                 </div>
//               </div>
//             </div>

//             {/* Security Assurance */}
//             <SecurityAssurance />

//             {/* Customer Support */}
//             <CustomerSupport />

//             {/* Action Buttons */}
//             <div className="space-y-3">
//               <Link 
//                 to="/products"
//                 className="w-full inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-colors shadow-md hover:shadow-lg"
//               >
//                 Continue Shopping
//               </Link>
//               <Link 
//                 to="/dashboard/myorder"
//                 className="w-full inline-flex items-center justify-center bg-white text-gray-700 font-semibold py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
//               >
//                 View Order Details
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default React.memo(Success);
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import Axios from '../utils/axios';
import {
  CheckCircle2,
  ShieldCheck,
  Package,
  Truck,
  Mail,
  Phone,
  Lock,
  Users
} from 'lucide-react';

// ---------- Trust Badges ----------
const TrustBadges = () => {
  const trustFeatures = [
    { icon: <ShieldCheck className="w-5 h-5" />, text: "Secure Payment", subtext: "100% Protected" },
    { icon: <Package className="w-5 h-5" />, text: "Quality Assured", subtext: "Premium Products" },
    { icon: <Truck className="w-5 h-5" />, text: "Reliable Delivery", subtext: "On-time Promise" },
    { icon: <Users className="w-5 h-5" />, text: "24/7 Support", subtext: "Always Here" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trustFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            className="text-center p-3 rounded-xl bg-gray-50 hover:bg-amber-50 transition-colors"
          >
            <div className="text-amber-600 flex justify-center mb-2">{feature.icon}</div>
            <p className="text-sm font-medium text-gray-800">{feature.text}</p>
            <p className="text-xs text-gray-500 mt-1">{feature.subtext}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ---------- Customer Support ----------
const CustomerSupport = () => (
  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
    <h3 className="text-lg font-semibold text-amber-800 mb-3">Need Help?</h3>
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-100 rounded-xl">
          <Mail className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-amber-800">Email Support</p>
          <p className="text-xs text-amber-600">support@quickoo-co.com</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-100 rounded-xl">
          <Phone className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-amber-800">Call Us</p>
          <p className="text-xs text-amber-600">+91 706 689 3615</p>
        </div>
      </div>
    </div>
  </div>
);

// ---------- Order Timeline ----------
const OrderTimeline = ({ currentStep = 0 }) => {
  const steps = [
    { label: 'Order Confirmed', description: 'Your order has been received' },
    { label: 'Processing', description: 'Preparing your items' },
    { label: 'Shipped', description: 'On its way to you' },
    { label: 'Delivered', description: 'Expected delivery' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Journey</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index <= currentStep ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${index <= currentStep ? 'text-green-600' : 'text-gray-600'}`}>
                {step.label}
              </p>
              <p className="text-sm text-gray-500 mt-1">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- Security Assurance ----------
const SecurityAssurance = () => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-green-100 rounded-xl">
        <Lock className="w-5 h-5 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">Your Order is Secure</h3>
    </div>
    <div className="space-y-2 text-sm text-gray-600">
      <p>✓ All transactions are encrypted and secure</p>
      <p>✓ We never store your payment details</p>
      <p>✓ 256-bit SSL encryption protection</p>
      <p>✓ PCI DSS compliant payment processing</p>
    </div>
  </div>
);

// ---------- Professional Loading Component ----------
const Loading = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-6">
    {/* Animated Pulse Circles */}
    <div className="flex space-x-3">
      <motion.div
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
        className="w-4 h-4 bg-amber-500 rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
        className="w-4 h-4 bg-amber-500 rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
        className="w-4 h-4 bg-amber-500 rounded-full"
      />
    </div>

    {/* Loading Text */}
    <p className="text-lg font-medium text-gray-700">
      Verifying your order...
    </p>

    {/* Optional Progress Bar */}
    <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-amber-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
    </div>
  </div>
);


// ---------- Main Success Component ----------
const Success = () => {
  const { width, height } = useWindowSize();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [order, setOrder] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const { orderId, orderAccessKey } = location.state || {};

  // Prevent Back Navigation
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => navigate('/', { replace: true });
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  // Verify Order with 2–4 sec delay
  useEffect(() => {
    if (!orderId || !orderAccessKey) {
      navigate('/');
      return;
    }

    const verify = async () => {
      try {
        // Simulate network delay
        await new Promise(res => setTimeout(res, 2000 + Math.random() * 2000));
        const res = await Axios.get(`/api/order/verify-order-access/${orderId}/${orderAccessKey}`);
        if (res.data.success) {
          setVerified(true);
          setOrder({ orderId });
          setCurrentStep(0);
        }
      } catch (err) {
        console.error('Order verification failed:', err.response?.data || err);
        alert('Order was Verified. Redirecting to home.');
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [orderId, orderAccessKey, navigate]);

  if (loading) return <Loading />;
  if (!verified) return null;

  return (
    <div className="min-h-screen">
      <AnimatePresence>
        <Confetti width={700} height={height} numberOfPieces={300} recycle={false} />
      </AnimatePresence>

      <div className="max-w-full mx-auto p-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3 sm:mb-0">
            <div className="p-2 bg-green-50 rounded-xl">
              <CheckCircle2 className="text-green-600 text-xl" />
            </div>
            <div>
              <h2 className="font-semibold text-xl text-gray-800">Order Confirmed!</h2>
              <p className="text-sm text-gray-600">Thank you for your purchase</p>
            </div>
          </div>
          <div className="text-sm text-gray-500 bg-green-50 px-3 py-2 rounded-xl">
            Order ID: <span className="font-mono font-medium text-green-700">{order.orderId}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-2">
                Order Confirmed!
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                Thank you for your order, {user?.name || 'Valued Customer'}!
              </p>
              <p className="text-gray-500">
                We've sent the order confirmation to your email
              </p>
            </motion.div>

            <OrderTimeline currentStep={currentStep} />
            <TrustBadges />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono font-medium">{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Delivery</span>
                  <span className="font-medium text-green-600">
                    {new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-green-600">Confirmed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">Cash on Delivery</span>
                </div>
              </div>
            </div>

            <SecurityAssurance />
            <CustomerSupport />

            <div className="space-y-3">
              <Link
                to="/products"
                className="w-full inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-colors shadow-md hover:shadow-lg"
              >
                Continue Shopping
              </Link>
              <Link
                to="/dashboard/myorder"
                className="w-full inline-flex items-center justify-center bg-white text-gray-700 font-semibold py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                View Order Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;