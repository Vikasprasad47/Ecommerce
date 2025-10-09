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
