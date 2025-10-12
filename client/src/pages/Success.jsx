// import React, { useEffect, useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import Confetti from 'react-confetti';
// import { useWindowSize } from 'react-use';
// import { CheckCircle2, Clock, Package, ShieldCheck, Truck } from 'lucide-react';
// import axios from '../utils/axios'; // your Axios instance
// import toast from 'react-hot-toast';


// // Order Summary Card
// const OrderSummary = ({ deliveryRange, orderId }) => (
//   <div className="mt-8 bg-white border border-green-200 shadow-lg rounded-2xl p-6 w-full max-w-2xl mx-auto space-y-4">
//     <h2 className="text-xl font-bold text-gray-800 mb-3">Order Summary</h2>
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <SummaryItem icon={<Truck className="w-5 h-5 text-gray-500 mt-0.5" />} label="Estimated Delivery" value={deliveryRange} valueClass="text-green-600 font-semibold" />
//       <SummaryItem icon={<ShieldCheck className="w-5 h-5 text-gray-500 mt-0.5" />} label="Order Status" value="Confirmed" valueClass="text-green-600 font-semibold" />
//       <SummaryItem icon={<Clock className="w-5 h-5 text-gray-500 mt-0.5" />} label="Order ID" value={orderId} />
//       <SummaryItem icon={<Package className="w-5 h-5 text-gray-500 mt-0.5" />} label="Payment Method" value="Cash on Delivery" />
//     </div>
//   </div>
// );

// const SummaryItem = ({ icon, label, value, valueClass = '' }) => (
//   <div className="flex items-start gap-3">
//     <div className="flex-shrink-0">{icon}</div>
//     <div>
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className={`text-sm md:text-base ${valueClass}`}>{value}</p>
//     </div>
//   </div>
// );

// // Next Steps Component
// const NextSteps = () => {
//   const steps = [
//     'You will receive an order confirmation email shortly.',
//     'We’ll notify you when your order ships with tracking info.',
//     'Our delivery partner will contact you before arrival.',
//   ];

//   return (
//     <div className="mt-8 bg-white border border-blue-200 shadow-lg rounded-2xl p-6 w-full max-w-2xl mx-auto space-y-4">
//       <h3 className="text-xl font-bold text-gray-800 mb-3">What’s Next?</h3>
//       <div className="space-y-3">
//         {steps.map((step, idx) => (
//           <div key={idx} className="flex items-start gap-3">
//             <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full mt-0.5 flex-shrink-0">
//               {idx + 1}
//             </div>
//             <p className="text-gray-700">{step}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Future Products Component
// const FutureProducts = ({ products }) => (
//   <div className="mt-8 w-full max-w-5xl mx-auto">
//     <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Coming Soon - Be the First to Know</h3>
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//       {products.map((product) => (
//         <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
//           <div className="h-40 bg-gray-100 overflow-hidden">
//             <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
//           </div>
//           <div className="p-4 flex flex-col justify-between h-40">
//             <div>
//               <h4 className="font-bold text-gray-800">{product.name}</h4>
//               <p className="text-sm text-gray-600 mt-1">{product.description}</p>
//             </div>
//             <div className="mt-3 flex items-center justify-between">
//               <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{product.releaseDate}</span>
//               <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
//                 Notify me
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// // --- Main Success Page ---

// const Success = () => {
//   const { width, height } = useWindowSize();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [startAnimation, setStartAnimation] = useState(false);
//   const [confetti, setConfetti] = useState(false);
//   const [orderId] = useState(`ORD-${Math.floor(Math.random() * 1000000)}`);
//   const [futureProducts, setFutureProducts] = useState([]);

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
//     const confettiStop = setTimeout(() => setConfetti(false), 8000);
//     return () => {
//       clearTimeout(startTimeout);
//       clearTimeout(confettiStart);
//       clearTimeout(confettiStop);
//     };
//   }, []);

//   // Fetch future products dynamically
//   // useEffect(() => {
//   //   const fetchFutureProducts = async () => {
//   //     try {
//   //       const { data } = await axios.get('/future-products'); // Replace with your API
//   //       setFutureProducts(data.products || []);
//   //     } catch (error) {
//   //       toast.error('Failed to fetch upcoming products.');
//   //     }
//   //   };
//   //   fetchFutureProducts();
//   // }, []);

//   const now = new Date();
//   const startDelivery = new Date(now);
//   const endDelivery = new Date(now);
//   startDelivery.setDate(now.getDate() + 2);
//   endDelivery.setDate(now.getDate() + 6);

//   const formatDate = (date) => date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
//   const deliveryRange = `${formatDate(startDelivery)} - ${formatDate(endDelivery)}`;

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-start pt-8 px-4 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
//       {/* Confetti */}
//       {confetti && <Confetti width={width} height={height} numberOfPieces={400} recycle={false} gravity={0.3} />}

//       {/* Success Header */}
//       <div className={`flex flex-col items-center gap-3 mb-6 transition-all duration-700 ${startAnimation ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
//         <CheckCircle2 className="w-24 h-24 text-green-600 animate-bounce" />
//         <h1 className="text-3xl md:text-5xl font-bold text-green-700 text-center">Order Confirmed</h1>
//         <p className="text-gray-700 text-center max-w-xl">{location?.state?.text || 'Thank you! Your order has been confirmed.'}</p>
//       </div>

//       {/* Modular Sections */}
//       <OrderSummary deliveryRange={deliveryRange} orderId={orderId} />
//       <NextSteps />
//       {futureProducts.length > 0 && <FutureProducts products={futureProducts} />}

//       {/* CTA Buttons */}
//       <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl w-full">
//         <Link to="/" className="w-full sm:w-auto inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300">
//           Continue Shopping
//         </Link>
//         <Link to="/dashboard/myorder" className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-sm font-medium rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-all duration-300">
//           View Order Details
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Success;

import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { 
  CheckCircle2, 
  Clock, 
  Package, 
  ShieldCheck, 
  Truck, 
  Mail,
  Phone,
  Star,
  Users,
  Award,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

// Trust Badges Component
const TrustBadges = () => {
  const trustFeatures = [
    { icon: <ShieldCheck className="w-5 h-5" />, text: "Secure Payment", subtext: "100% Protected" },
    { icon: <Package className="w-5 h-5" />, text: "Quality Assured", subtext: "Premium Products" },
    { icon: <Truck className="w-5 h-5" />, text: "Reliable Delivery", subtext: "On-time Promise" },
    { icon: <Users className="w-5 h-5" />, text: "24/7 Support", subtext: "Always Here" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Why Customers Trust Us</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trustFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 1 }}
            className="text-center p-3 rounded-xl bg-gray-50 hover:bg-amber-50 transition-colors"
          >
            <div className="text-amber-600 flex justify-center mb-2">
              {feature.icon}
            </div>
            <p className="text-sm font-medium text-gray-800">{feature.text}</p>
            <p className="text-xs text-gray-500 mt-1">{feature.subtext}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Customer Support Card
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

// Order Timeline
const OrderTimeline = () => {
  const steps = [
    { status: 'confirmed', label: 'Order Confirmed', description: 'Your order has been received' },
    { status: 'processing', label: 'Processing', description: 'Preparing your items' },
    { status: 'shipped', label: 'Shipped', description: 'On its way to you' },
    { status: 'delivered', label: 'Delivered', description: 'Expected delivery' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Journey</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.status} className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              index === 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {index === 0 ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${
                index === 0 ? 'text-green-600' : 'text-gray-600'
              }`}>
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

// Security Assurance
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

// Social Proof
const SocialProof = () => {
  const testimonials = [
    { rating: 5, text: "Fast delivery and great packaging!", author: "Priya S." },
    { rating: 5, text: "Love the product quality. Will order again!", author: "Rahul M." },
    { rating: 5, text: "Excellent customer service experience", author: "Anita K." },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">What Our Customers Say</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 + 1.5 }}
            className="text-center p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-gray-600 italic mb-2">"{testimonial.text}"</p>
            <p className="text-xs text-gray-500 font-medium">{testimonial.author}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Success = () => {
  const { width, height } = useWindowSize();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);

  const [startAnimation, setStartAnimation] = useState(false);
  const [confetti, setConfetti] = useState(false);

  // Generate order ID from user data or random
  const orderId = useMemo(() => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}${random}`;
  }, []);

  // Delivery date calculation
  const deliveryRange = useMemo(() => {
    const now = new Date();
    const startDelivery = new Date(now);
    const endDelivery = new Date(now);
    startDelivery.setDate(now.getDate() + 2);
    endDelivery.setDate(now.getDate() + 6);
    
    const formatDate = (date) => date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    
    return `${formatDate(startDelivery)} - ${formatDate(endDelivery)}`;
  }, []);

  // Prevent back navigation
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => navigate('/', { replace: true });
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  // Trigger animations
  useEffect(() => {
    const startTimeout = setTimeout(() => setStartAnimation(true), 400);
    const confettiStart = setTimeout(() => setConfetti(true), 1000);
    const confettiStop = setTimeout(() => setConfetti(false), 6000);
    
    return () => {
      clearTimeout(startTimeout);
      clearTimeout(confettiStart);
      clearTimeout(confettiStop);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto p-4">
        {/* Confetti */}
        <AnimatePresence>
          {true && (
            <Confetti 
              width={1200} 
              height={height} 
              numberOfPieces={300}
              recycle={false}
              gravity={0.2}
            />
          )}
        </AnimatePresence>

        {/* Header - Consistent with other pages */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm"
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
            Order ID: <span className="font-mono font-medium text-green-700">{orderId}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Success Message */}
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

            {/* Order Timeline */}
            <OrderTimeline />

            {/* Trust Badges */}
            <TrustBadges />

            {/* Social Proof */}
            <SocialProof />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono font-medium">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Delivery</span>
                  <span className="font-medium text-green-600">{deliveryRange}</span>
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

            {/* Security Assurance */}
            <SecurityAssurance />

            {/* Customer Support */}
            <CustomerSupport />

            {/* Action Buttons */}
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

export default React.memo(Success);