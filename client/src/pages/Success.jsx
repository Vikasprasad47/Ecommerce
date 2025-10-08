// import React, { useEffect, useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import Confetti from 'react-confetti';
// import { useWindowSize } from 'react-use';
// import { CheckCircle, ChevronRight, Clock, Package, ShieldCheck, Truck } from 'lucide-react';

// const Success = () => {
//   const { width, height } = useWindowSize();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [start, setStart] = useState(false);
//   const [confetti, setConfetti] = useState(false);
//   const [orderId] = useState(`ORD-${Math.floor(Math.random() * 1000000)}`);

//   // Replace checkout page in history
//   useEffect(() => {
//     window.history.pushState(null, '', window.location.href);

//     const handlePopState = () => {
//       navigate('/', { replace: true });
//     };

//     window.addEventListener('popstate', handlePopState);
//     return () => window.removeEventListener('popstate', handlePopState);
//   }, [navigate]);

//   useEffect(() => {
//     const startTimeout = setTimeout(() => setStart(true), 400);
//     const confettiStart = setTimeout(() => setConfetti(true), 1000);
//     const confettiStop = setTimeout(() => setConfetti(false), 10000);

//     return () => {
//       clearTimeout(startTimeout);
//       clearTimeout(confettiStart);
//       clearTimeout(confettiStop);
//     };
//   }, []);

//   const now = new Date();
//   const startDelivery = new Date(now);
//   const endDelivery = new Date(now);
//   startDelivery.setDate(now.getDate() + 2);
//   endDelivery.setDate(now.getDate() + 6);

//   const formatDate = (date) =>
//     date.toLocaleDateString(undefined, {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric',
//     });

//   const deliveryRange = `${formatDate(startDelivery)} - ${formatDate(endDelivery)}`;

//   // Future products data
//   const futureProducts = [
//     {
//       id: 1,
//       name: 'Quantum Smartwatch Pro',
//       description: 'Next-gen health monitoring with AI analysis',
//       image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
//       releaseDate: 'Coming June 2024',
//     },
//     {
//       id: 2,
//       name: 'Neural AirPods X',
//       description: 'Adaptive noise cancellation with brainwave sync',
//       image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
//       releaseDate: 'Pre-order for Q3 2024',
//     },
//     {
//       id: 3,
//       name: 'HoloProject Home',
//       description: 'Augmented reality home theater system',
//       image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=500',
//       releaseDate: 'Early Access Q4 2024',
//     },
//   ];

//   return (
//     <div
//       className={`min-h-screen pt-5 flex flex-col gap-1 items-center justify-center relative transition-colors duration-1000 ease-in-out ${
//         start ? 'bg-gradient-to-br from-green-50 to-green-100' : 'bg-white'
//       } overflow-hidden px-4 py-6`}
//     >
//       {/* Confetti */}
//       {confetti && (
//         <>
//           <Confetti
//             width={width}
//             height={height}
//             numberOfPieces={400}
//             recycle={false}
//             gravity={0.3}
//             confettiSource={{ x: 0, y: height - 10, w: 20, h: 20 }}
//             initialVelocityX={5}
//             initialVelocityY={30}
//             dragFriction={0.03}
//             colors={['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#F53844', '#9D4EDD', '#00C9A7']}
//           />
//           <Confetti
//             width={width}
//             height={height}
//             numberOfPieces={400}
//             recycle={false}
//             gravity={0.3}
//             confettiSource={{ x: width - 20, y: height - 10, w: 20, h: 20 }}
//             initialVelocityX={-5}
//             initialVelocityY={30}
//             dragFriction={0.03}
//             colors={['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#F53844', '#9D4EDD', '#00C9A7']}
//           />
//         </>
//       )}

//       <div className="max-w-4xl w-full mx-auto">
//         {/* Success Header */}
//         <div
//           className={`flex flex-col items-center gap-3 transition-all duration-1000 ease-out ${
//             start ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
//           }`}
//         >
//           <div className="relative">
//             <CheckCircle
//               className="w-20 h-20 text-green-600 animate-check-bounce"
//               strokeWidth={1.5}
//             />
//             <div className="absolute -inset-4 rounded-full bg-green-100 opacity-0 animate-ping-slow" />
//           </div>
//           <h1 className="text-2xl md:text-5xl font-bold text-green-700 text-center">
//             Order Placed Successfully!
//           </h1>
//         </div>

//         <p className="text-gray-700 mt-4 text-sm md:text-xl text-center max-w-2xl mx-auto animate-fade-in delay-300">
//           {location?.state?.text || 'Thank you for your purchase! Your order has been confirmed.'}
//         </p>

//         {/* Order Summary Card */}
//         <div className="mt-8 bg-white border border-green-200 shadow-lg rounded-2xl p-6 w-full max-w-2xl mx-auto space-y-4 animate-fade-in delay-500">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-green-100 rounded-full">
//               <Package className="w-5 h-5 text-green-600" />
//             </div>
//             <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="flex items-start gap-3">
//               <Truck className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-sm text-gray-500">Estimated Delivery</p>
//                 <p className="text-green-600 font-semibold">{deliveryRange}</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-3">
//               <ShieldCheck className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-sm text-gray-500">Order Status</p>
//                 <p className="text-green-600 font-semibold">Confirmed</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-3">
//               <Clock className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-sm text-gray-500">Order ID</p>
//                 <p className="font-medium text-gray-800">{orderId}</p>
//               </div>
//             </div>

//             <div className="flex items-start gap-3">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
//                 />
//               </svg>
//               <div>
//                 <p className="text-sm text-gray-500">Payment Method</p>
//                 <p className="font-medium text-gray-800">Cash on Delivery</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Next Steps */}
//         <div className="mt-8 bg-white border border-blue-200 shadow-lg rounded-2xl p-6 w-full max-w-2xl mx-auto space-y-4 animate-fade-in delay-600">
//           <h3 className="text-xl font-bold text-gray-800">What's Next?</h3>
//           <div className="space-y-3">
//             <div className="flex items-start gap-3">
//               <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full mt-0.5 flex-shrink-0">
//                 1
//               </div>
//               <p className="text-gray-700">
//                 You'll receive an order confirmation email with details shortly.
//               </p>
//             </div>
//             <div className="flex items-start gap-3">
//               <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full mt-0.5 flex-shrink-0">
//                 2
//               </div>
//               <p className="text-gray-700">
//                 We'll notify you when your order ships with tracking information.
//               </p>
//             </div>
//             <div className="flex items-start gap-3">
//               <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full mt-0.5 flex-shrink-0">
//                 3
//               </div>
//               <p className="text-gray-700">
//                 Our delivery partner will contact you before arrival.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Future Products */}
//         <div className="mt-8 w-full max-w-2xl mx-auto animate-fade-in delay-700">
//           <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
//             Coming Soon - Be the First to Know
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {futureProducts.map((product) => (
//               <div
//                 key={product.id}
//                 className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
//               >
//                 <div className="h-40 bg-gray-100 overflow-hidden">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="p-4">
//                   <h4 className="font-bold text-gray-800">{product.name}</h4>
//                   <p className="text-sm text-gray-600 mt-1">{product.description}</p>
//                   <div className="mt-3 flex items-center justify-between">
//                     <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
//                       {product.releaseDate}
//                     </span>
//                     <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
//                       Notify me <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* CTA Buttons */}
//         <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-800">
//           <Link
//             to="/"
//             className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
//           >
//             Continue Shopping
//           </Link>
//           <Link
//             to="/dashboard/myorder"
//             className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-sm font-medium rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-all duration-300 w-full sm:w-auto"
//           >
//             View Order Details
//           </Link>
//         </div>
//       </div>

//       <style>{`
//         @keyframes check-bounce {
//           0% { transform: scale(0.4) rotate(-20deg); opacity: 0; }
//           40% { transform: scale(1.2) rotate(10deg); opacity: 1; }
//           60% { transform: scale(0.95) rotate(-5deg); }
//           80% { transform: scale(1.05) rotate(3deg); }
//           100% { transform: scale(1) rotate(0); }
//         }
//         @keyframes ping-slow {
//           0% { transform: scale(0.8); opacity: 0.8; }
//           70% { transform: scale(1.4); opacity: 0; }
//           100% { transform: scale(1.4); opacity: 0; }
//         }
//         .animate-check-bounce {
//           animation: check-bounce 0.7s ease-out forwards;
//         }
//         .animate-ping-slow {
//           animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
//           animation-delay: 1s;
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           animation: fadeIn 0.6s ease-out forwards;
//         }
//         .delay-300 { animation-delay: 0.3s; }
//         .delay-500 { animation-delay: 0.5s; }
//         .delay-600 { animation-delay: 0.6s; }
//         .delay-700 { animation-delay: 0.7s; }
//         .delay-800 { animation-delay: 0.8s; }
//       `}</style>
//     </div>
//   );
// };

// export default Success;


import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { CheckCircle2, Clock, Package, ShieldCheck, Truck } from 'lucide-react';
import axios from '../utils/axios'; // your Axios instance
import toast from 'react-hot-toast';

// --- Modular Components ---

// Order Summary Card
const OrderSummary = ({ deliveryRange, orderId }) => (
  <div className="mt-8 bg-white border border-green-200 shadow-lg rounded-2xl p-6 w-full max-w-2xl mx-auto space-y-4">
    <h2 className="text-xl font-bold text-gray-800 mb-3">Order Summary</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SummaryItem icon={<Truck className="w-5 h-5 text-gray-500 mt-0.5" />} label="Estimated Delivery" value={deliveryRange} valueClass="text-green-600 font-semibold" />
      <SummaryItem icon={<ShieldCheck className="w-5 h-5 text-gray-500 mt-0.5" />} label="Order Status" value="Confirmed" valueClass="text-green-600 font-semibold" />
      <SummaryItem icon={<Clock className="w-5 h-5 text-gray-500 mt-0.5" />} label="Order ID" value={orderId} />
      <SummaryItem icon={<Package className="w-5 h-5 text-gray-500 mt-0.5" />} label="Payment Method" value="Cash on Delivery" />
    </div>
  </div>
);

const SummaryItem = ({ icon, label, value, valueClass = '' }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-sm md:text-base ${valueClass}`}>{value}</p>
    </div>
  </div>
);

// Next Steps Component
const NextSteps = () => {
  const steps = [
    'You will receive an order confirmation email shortly.',
    'We’ll notify you when your order ships with tracking info.',
    'Our delivery partner will contact you before arrival.',
  ];

  return (
    <div className="mt-8 bg-white border border-blue-200 shadow-lg rounded-2xl p-6 w-full max-w-2xl mx-auto space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-3">What’s Next?</h3>
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full mt-0.5 flex-shrink-0">
              {idx + 1}
            </div>
            <p className="text-gray-700">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Future Products Component
const FutureProducts = ({ products }) => (
  <div className="mt-8 w-full max-w-5xl mx-auto">
    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Coming Soon - Be the First to Know</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="h-40 bg-gray-100 overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-4 flex flex-col justify-between h-40">
            <div>
              <h4 className="font-bold text-gray-800">{product.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{product.releaseDate}</span>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                Notify me
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Main Success Page ---

const Success = () => {
  const { width, height } = useWindowSize();
  const location = useLocation();
  const navigate = useNavigate();

  const [startAnimation, setStartAnimation] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [orderId] = useState(`ORD-${Math.floor(Math.random() * 1000000)}`);
  const [futureProducts, setFutureProducts] = useState([]);

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
    const confettiStop = setTimeout(() => setConfetti(false), 8000);
    return () => {
      clearTimeout(startTimeout);
      clearTimeout(confettiStart);
      clearTimeout(confettiStop);
    };
  }, []);

  // Fetch future products dynamically
  // useEffect(() => {
  //   const fetchFutureProducts = async () => {
  //     try {
  //       const { data } = await axios.get('/future-products'); // Replace with your API
  //       setFutureProducts(data.products || []);
  //     } catch (error) {
  //       toast.error('Failed to fetch upcoming products.');
  //     }
  //   };
  //   fetchFutureProducts();
  // }, []);

  const now = new Date();
  const startDelivery = new Date(now);
  const endDelivery = new Date(now);
  startDelivery.setDate(now.getDate() + 2);
  endDelivery.setDate(now.getDate() + 6);

  const formatDate = (date) => date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const deliveryRange = `${formatDate(startDelivery)} - ${formatDate(endDelivery)}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-8 px-4 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
      {/* Confetti */}
      {confetti && <Confetti width={width} height={height} numberOfPieces={400} recycle={false} gravity={0.3} />}

      {/* Success Header */}
      <div className={`flex flex-col items-center gap-3 mb-6 transition-all duration-700 ${startAnimation ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <CheckCircle2 className="w-24 h-24 text-green-600 animate-bounce" />
        <h1 className="text-3xl md:text-5xl font-bold text-green-700 text-center">Order Confirmed</h1>
        <p className="text-gray-700 text-center max-w-xl">{location?.state?.text || 'Thank you! Your order has been confirmed.'}</p>
      </div>

      {/* Modular Sections */}
      <OrderSummary deliveryRange={deliveryRange} orderId={orderId} />
      <NextSteps />
      {futureProducts.length > 0 && <FutureProducts products={futureProducts} />}

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl w-full">
        <Link to="/" className="w-full sm:w-auto inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300">
          Continue Shopping
        </Link>
        <Link to="/dashboard/myorder" className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-sm font-medium rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-all duration-300">
          View Order Details
        </Link>
      </div>
    </div>
  );
};

export default Success;
