import React, { useEffect, useState, useCallback, memo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Axios from "../utils/axios";
import SummaryApi from "../comman/summaryApi";
import { toast } from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import { 
  CheckCircle, 
  MapPin, 
  Phone, 
  Clock, 
  Package, 
  QrCode, 
  Truck, 
  Download,
  Share2,
  Navigation,
  Star,
  Shield,
  RotateCcw,
  ChevronRight,
  Store,
  UserCheck,
  AlertCircle,
  Sparkles,
  CalendarDays,
  BadgePercent
} from "lucide-react";

// Custom hooks
const useProductDetails = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await Axios({
          ...SummaryApi.getProductDetails,
          data: { productId },
        });

        if (res.data.success) {
          setProduct(res.data.data);
        } else {
          setError("Failed to load product details");
          toast.error("Failed to load product details");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Unable to load product details");
        toast.error("Unable to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  return { product, loading, error };
};

const useOrderTracking = (orderId) => {
  const [trackingStatus, setTrackingStatus] = useState('confirmed');
  const [estimatedReadyTime, setEstimatedReadyTime] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const timer = setTimeout(() => {
      setTrackingStatus('ready');
      setEstimatedReadyTime(new Date(Date.now() + 25 * 60 * 1000));
    }, 3000);

    return () => clearTimeout(timer);
  }, [orderId]);

  return { trackingStatus, estimatedReadyTime };
};

// Sparkling Animation Component
const SparkleAnimation = memo(({ isActive }) => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const newSparkle = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 1 + 0.5
      };
      setSparkles(prev => [...prev.slice(-15), newSparkle]);
    }, 200);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute animate-ping"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDuration: `${sparkle.duration}s`
          }}
        >
          <Sparkles className="w-full h-full text-amber-400" />
        </div>
      ))}
    </div>
  );
});

// Central Confirmation Component
const CentralConfirmation = memo(({ onAnimationComplete }) => {
  const [showContent, setShowContent] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const contentTimer = setTimeout(() => setShowContent(true), 300);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onAnimationComplete, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => {
      clearTimeout(contentTimer);
      clearInterval(progressInterval);
    };
  }, [onAnimationComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center z-[998]">
      <SparkleAnimation isActive={true} />
      
      <div className="relative bg-slate-100 backdrop-blur-lg rounded-3xl p-12 mx-4 max-w-md w-full border border-white/20 shadow-2xl">
        {/* Animated Checkmark */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <div className="absolute inset-0 border-4 border-green-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Content */}
        {showContent && (
          <div className="text-center text-gray-800 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
            <p className="text-lg opacity-90 mb-2">Your store pickup has been scheduled</p>
            <p className="text-sm opacity-80 mb-6">Get ready to collect your order</p>
            
            {/* Progress Bar */}
            <div className="bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
              <div 
                className="bg-green-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm opacity-80">Preparing your order dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
});

// Simplified Product Card
const ProductCard = memo(({ product, orderDetails }) => {
  const totalAmount = product?.price - (orderDetails?.couponDiscount || 0) + (product?.tax || 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <Package className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800 text-lg">Order Summary</h2>
          <p className="text-sm text-gray-600">Essential order information</p>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100 mb-6">
        <img
          src={product?.image?.[0]}
          alt={product?.name}
          className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-sm"
          loading="lazy"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-base mb-2">{product?.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-800">₹{product?.price}</span>
            {product?.discount > 0 && (
              <span className="text-sm text-amber-600 font-medium bg-amber-100 px-2 py-1 rounded-full flex items-center gap-1">
                <BadgePercent className="w-3 h-3" />
                {product?.discount}% OFF
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Essential Order Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Order ID</p>
            <p className="font-mono font-semibold text-gray-800 text-sm">{orderDetails?.orderId}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
            <p className="font-bold text-gray-800">₹{totalAmount}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            Invoice
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
});

// Enhanced Store Info Card
const StoreInfoCard = memo(({ orderDetails, onGetDirections, onContinueShopping }) => {
  const storeInfo = {
    name: "Quickoo Store",
    address: "Warje, Pune, Maharashtra - 411058",
    phone: "+91 98765 43210",
    hours: "9:00 AM – 9:00 PM",
    rating: 4.7,
    manager: "Rajesh Kumar"
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <Store className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800 text-lg">Pickup Location</h2>
          <p className="text-sm text-gray-600">Store details & directions</p>
        </div>
      </div>

      {/* Store Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-base">{storeInfo.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 text-amber-500 fill-current" />
              <span className="text-xs font-semibold text-amber-700">{storeInfo.rating}</span>
              <span className="text-xs text-gray-500">(1.2k reviews)</span>
            </div>
          </div>
          <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
            OPEN NOW
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <p className="text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            {storeInfo.address}
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-500" />
            {storeInfo.phone}
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            {storeInfo.hours}
          </p>
        </div>
      </div>

      {/* QR Code - More Prominent */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-1 mb-6 text-center">
        <div className="bg-white rounded-lg p-4">
          <QrCode className="w-20 h-20 mx-auto text-gray-800 mb-3" />
          <p className="font-semibold text-gray-800 text-sm">Pickup QR Code</p>
          <p className="text-xs text-gray-600 mb-2">Show at counter</p>
          <div className="bg-amber-50 border border-amber-200 rounded px-2 py-1 inline-block">
            <p className="text-xs font-mono text-amber-700">ORDER: {orderDetails?.orderId}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onGetDirections}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Navigation className="w-5 h-5" />
          Get Directions
        </button>
        <button
          onClick={onContinueShopping}
          className="w-full border-2 border-amber-200 text-amber-600 hover:bg-amber-50 py-3 rounded-xl font-semibold transition-all duration-200"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
});

// Status Tracker with Amber Theme
const StatusTracker = memo(({ status, estimatedTime }) => {
  const steps = [
    { 
      key: 'confirmed', 
      label: 'Order Confirmed', 
      description: 'Payment received & order confirmed',
      icon: CheckCircle, 
      completed: true 
    },
    { 
      key: 'preparing', 
      label: 'Preparing Order', 
      description: 'Items being collected & packed',
      icon: Package, 
      completed: status === 'preparing' || status === 'ready' || status === 'pickedup' 
    },
    { 
      key: 'ready', 
      label: 'Ready for Pickup', 
      description: 'Order is ready at store',
      icon: Truck, 
      completed: status === 'ready' || status === 'pickedup' 
    },
    { 
      key: 'pickedup', 
      label: 'Order Collected', 
      description: 'Successfully picked up',
      icon: UserCheck, 
      completed: status === 'pickedup' 
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === status);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <Clock className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">Order Status</h3>
          <p className="text-sm text-gray-600">Track your pickup progress</p>
        </div>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          const isCompleted = step.completed;
          const isCurrent = step.key === status;

          return (
            <div key={step.key} className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                isCompleted 
                  ? 'bg-amber-200 border-amber-200 text-white' 
                  : isCurrent
                  ? 'border-amber-200 bg-white text-amber-500'
                  : 'border-gray-100 bg-gray-50 text-gray-400'
              }`}>
                <IconComponent className="w-4 h-4" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`font-semibold ${
                      isCompleted || isCurrent ? 'text-gray-800' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                  </div>
                  {isCompleted && (
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  )}
                </div>
                
                {isCurrent && step.key === 'ready' && estimatedTime && (
                  <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-700 font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Ready by {estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// Quick Instructions Card
const InstructionsCard = memo(() => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">Pickup Instructions</h3>
          <p className="text-sm text-gray-600">What you need to know</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <QrCode className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-800 text-sm">Bring QR Code</p>
            <p className="text-xs text-blue-600 mt-1">Show the QR code at pickup counter for verification</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <CalendarDays className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-800 text-sm">3-Day Pickup Window</p>
            <p className="text-xs text-green-600 mt-1">Collect within 3 days of readiness notification</p>
          </div>
        </div>
      </div>
    </div>
  );
});

// Main Component
const StorePickupPage = () => {
  const { productId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const { product, loading, error } = useProductDetails(productId);
  const { trackingStatus, estimatedReadyTime } = useOrderTracking(state?.orderId);
  const [showConfirmation, setShowConfirmation] = useState(true);

  const handleAnimationComplete = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  const handleGetDirections = useCallback(() => {
    window.open("https://maps.google.com/?q=Warje+Pune+Quickoo+Store", "_blank");
  }, []);

  const handleContinueShopping = useCallback(() => {
    navigate("/");
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Central Confirmation Overlay */}
      {showConfirmation && (
        <CentralConfirmation onAnimationComplete={handleAnimationComplete} />
      )}

      {/* Main Content */}
      <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-1000 ${
        showConfirmation ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Store Pickup</h1>
                  <p className="text-sm text-gray-600">Order #{state?.orderId}</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/")}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
              >
                Back to Shop
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Success Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <h3 className="font-bold">Ready for Pickup!</h3>
                  <p className="text-amber-100 text-sm">Your order will be ready soon</p>
                </div>
              </div>
              {estimatedReadyTime && (
                <div className="text-right">
                  <p className="text-sm font-medium text-amber-100">Estimated Ready</p>
                  <p className="text-lg font-bold">{estimatedReadyTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Left Column - Essential Info */}
            <div className="lg:col-span-1 xl:col-span-2 space-y-8">
              <ProductCard product={product} orderDetails={state} />
              <StatusTracker 
                status={trackingStatus} 
                estimatedTime={estimatedReadyTime} 
              />
            </div>

            {/* Right Column - Store & Actions */}
            <div className="lg:col-span-1 space-y-8">
              <StoreInfoCard 
                orderDetails={state}
                onGetDirections={handleGetDirections}
                onContinueShopping={handleContinueShopping}
              />
              <InstructionsCard />
            </div>
          </div>
        </main>

        {/* Support Footer */}
        <footer className="border-t border-gray-200 bg-white mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Need help? Contact us at <a href="tel:+919876543210" className="text-amber-600 hover:underline font-medium">+91 98765 43210</a>
              </p>
              <p className="text-xs text-gray-500 mt-2">© 2024 Quickoo. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default memo(StorePickupPage);