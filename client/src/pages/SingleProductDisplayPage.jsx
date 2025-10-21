import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../comman/summaryApi'
import Axios from '../utils/axios'
import AxiosToastError from '../utils/AxiosToastErroe'
import { FaAngleLeft, FaAngleRight, FaStar, FaTruck, FaShieldAlt, FaExchangeAlt, FaWeight, FaRulerCombined } from "react-icons/fa"
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import { useSwipeable } from 'react-swipeable'
import { priceWithDiscount } from '../utils/PriceWithDiscount'
import { RxCross2 } from "react-icons/rx"
import AddToCartButton from '../components/AddToCartButton'
import ProductReviewPage from './ProductReviewPage'
import { motion, AnimatePresence } from 'framer-motion' 
import { MdLocalShipping } from "react-icons/md"
import { FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { IoMdShareAlt } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";


const SingleProductDisplayPage = () => {
  const params = useParams()
  const productId = params?.product?.split("-")?.slice(-1)[0]
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ name: "", image: [] })
  const [imageIndex, setImageIndex] = useState(0)
  const imageContainerRef = useRef()
  const [showPopup, setShowPopup] = useState(false)
  const OFFER_KEY = "special_offer_end_time"
  const offerDuration = 160 // total hours for offer
  const [timeLeft, setTimeLeft] = useState(null)
  const [selectedTab, setSelectedTab] = useState('details') // For mobile tabs
  const [selectedVariant, setSelectedVariant] = useState(null)

  // Countdown timer setup
  useEffect(() => {
    let endTime = localStorage.getItem(OFFER_KEY)
  
    if (!endTime) {
      const newEndTime = new Date(Date.now() + offerDuration * 60 * 60 * 1000)
      localStorage.setItem(OFFER_KEY, newEndTime.toISOString())
      endTime = newEndTime.toISOString()
    }
  
    const calculateTimeLeft = () => {
      const difference = +new Date(endTime) - +new Date()
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }
      return null
    }
  
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
  
    setTimeLeft(calculateTimeLeft())
  
    return () => clearInterval(timer)
  }, [])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { productId }
      })
      const { data: responseData } = response
      if (responseData.success) {
        setData(responseData.data)
        // Set first variant as selected by default if variants exist
        if (responseData.data.variants?.length > 0) {
          setSelectedVariant(0)
        }
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [params]);


  // Thumbnail scroll handlers
  const handleScroll = (direction) => { 
    if (imageContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200
      imageContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  // Swipe handlers for mobile image navigation
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setImageIndex((prev) => (prev + 1) % data.image.length),
    onSwipedRight: () => setImageIndex((prev) => (prev - 1 + data.image.length) % data.image.length),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="animate-pulse bg-gray-200 rounded-xl aspect-square w-full"></div>
      <div className="flex gap-3 overflow-hidden">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="min-w-[80px] aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
        ))}
      </div>
    </div>
  )

  // Helper to display rating stars
  const renderRatingStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FaStar key={i} className="w-4 h-4 text-amber-400" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="w-4 h-4 text-amber-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="w-4 h-4 text-gray-300" />);
    }
  }

  return stars;
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Main Product Section */}
      <section className="container mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl">
        {/* Left Column - Product Media */}
        <div className="flex flex-col gap-6">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* Main Product Image */}
              <div className="relative group">
                {/* Discount Badge */}
                {data.discount !== 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 left-4 z-10"
                  >
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 text-sm font-bold rounded-lg shadow-lg">
                      {data.discount}% OFF
                    </div>
                  </motion.div>
                )}
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 right-4 z-10 flex items-center justify-between gap-3"
                >
                  <button><IoMdHeartEmpty size={24}/></button>
                  <button><IoMdShareAlt size={24}/></button>
                </motion.div>

                {/* Swipeable Image Container */}
                <motion.div 
                  {...swipeHandlers}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl overflow-hidden aspect-square w-full flex items-center justify-center p-8 shadow-sm hover:shadow-md transition-all duration-300 relative"
                >
                  <img
                    src={selectedVariant !== null && data.variants[selectedVariant]?.images?.length > 0 
                      ? data.variants[selectedVariant].images[imageIndex] 
                      : data.image[imageIndex]}
                    alt={data.name}
                    className="w-full h-full object-contain transition-opacity duration-300"
                    loading="eager"
                  />
                  
                  {/* Image Navigation Dots */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {(selectedVariant !== null && data.variants[selectedVariant]?.images?.length > 0 
                      ? data.variants[selectedVariant].images 
                      : data.image).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          idx === imageIndex ? "bg-amber-500 scale-125" : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`View image ${idx + 1}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="relative">
                <div
                  ref={imageContainerRef}
                  className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-2 px-1"
                >
                  {(selectedVariant !== null && data.variants[selectedVariant]?.images?.length > 0 
                    ? data.variants[selectedVariant].images 
                    : data.image).map((img, idx) => (
                    <button
                      key={`thumb-${idx}`}
                      onClick={() => setImageIndex(idx)}
                      className={`flex-shrink-0 w-17 aspect-square bg-white rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        idx === imageIndex ? "border-amber-500 scale-105" : "border-transparent hover:border-gray-200"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain p-1"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
                
                {/* Scroll buttons for desktop */}
                <div className="hidden md:flex justify-between items-center absolute inset-y-0 w-full pointer-events-none">
                  <button
                    onClick={() => handleScroll('left')}
                    className="pointer-events-auto bg-white/90 hover:bg-white w-2 h-2 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110"
                    aria-label="Scroll thumbnails left"
                  >
                    <FaAngleLeft className="text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleScroll('right')}
                    className="pointer-events-auto bg-white/90 hover:bg-white w-2 h-2 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110"
                    aria-label="Scroll thumbnails right"
                  >
                    <FaAngleRight className="text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Special Offer Countdown */}
              {data.discount > 0 && timeLeft && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-amber-100 to-amber-50 p-5 rounded-2xl border border-amber-200"
                >
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-amber-800 mb-1">Limited Time Offer</h3>
                    <p className="text-sm text-amber-700 mb-3">Hurry! This deal won't last long</p>
                    
                    <div className="flex justify-center gap-2">
                      {timeLeft.days > 0 && (
                        <div className="bg-white px-3 py-1 rounded-lg shadow-inner">
                          <span className="font-bold text-amber-600">{String(timeLeft.days).padStart(2, "0")}</span>
                          <span className="text-xs text-amber-500 ml-1">d</span>
                        </div>
                      )}
                      <div className="bg-white px-3 py-1 rounded-lg shadow-inner">
                        <span className="font-bold text-amber-600">{String(timeLeft.hours).padStart(2, "0")}</span>
                        <span className="text-xs text-amber-500 ml-1">h</span>
                      </div>
                      <div className="bg-white px-3 py-1 rounded-lg shadow-inner">
                        <span className="font-bold text-amber-600">{String(timeLeft.minutes).padStart(2, "0")}</span>
                        <span className="text-xs text-amber-500 ml-1">m</span>
                      </div>
                      <div className="bg-white px-3 py-1 rounded-lg shadow-inner">
                        <span className="font-bold text-amber-600">{String(timeLeft.seconds).padStart(2, "0")}</span>
                        <span className="text-xs text-amber-500 ml-1">s</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div className="flex flex-col gap-2">
          {loading ? (
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded-full w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-px bg-gray-200 my-4"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Delivery Badge */}
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-1.5 rounded-full w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium">Fast Delivery: 10-15 Min</span>
              </div>

              {/* Product Title */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{data.name}</h1>
                <p className="text-gray-500 mt-1">{data.unit}</p>
              </motion.div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderRatingStars(data.ratings?.average || 0)}
                </div>
                <span className="text-sm text-gray-600">
                  {data.ratings?.average?.toFixed(1) || 0} ({data.ratings?.count || 0} reviews)
                </span>
              </div>

              {/* Tags */}
              {data.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Divider */}
              <Divider />

              {/* Variant Selection */}
              {data.variants?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">Variants</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.variants.map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedVariant(index)
                          setImageIndex(0)
                        }}
                        className={`px-3 py-1.5 rounded-lg border transition-all ${
                          selectedVariant === index
                            ? 'bg-amber-100 border-amber-500 text-amber-800'
                            : 'bg-white border-gray-300 hover:border-amber-300'
                        }`}
                      >
                        {variant.color && <span className="capitalize">{variant.color}</span>}
                        {variant.size && variant.color && ' - '}
                        {variant.size && <span>{variant.size}</span>}
                        {(!variant.color && !variant.size) && `Variant ${index + 1}`}
                      </button>
                    ))}
                  </div>
                  {selectedVariant !== null && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="font-medium">
                            {DisplayPriceInRupees(
                              priceWithDiscount(
                                data.variants[selectedVariant].price || data.price,
                                data.discount
                              )
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Stock</p>
                          <p className={`font-medium ${
                            data.variants[selectedVariant].stock > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {data.variants[selectedVariant].stock > 0 
                              ? `${data.variants[selectedVariant].stock} available` 
                              : 'Out of stock'}
                          </p>
                        </div>
                        {data.variants[selectedVariant].sku && (
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500">SKU</p>
                            <p className="font-medium">{data.variants[selectedVariant].sku}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description with Read More */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-semibold text-lg mb-2 text-gray-800">Description</h2>
                <p className="text-gray-600 line-clamp-3 leading-relaxed">
                  {data.description}
                </p>
                <button
                  onClick={() => setShowPopup(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium mt-2 transition-colors"
                >
                  Read more
                </button>
              </motion.div>

              {/* Full Description Modal */}
              <AnimatePresence>
                {showPopup && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  >
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/30"
                      onClick={() => setShowPopup(false)}
                    />
                    
                    <div className="fixed top-35% p-5 -bottom-60% left-0 right-0 m-auto flex items-center justify-center">
                      <div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative bg-white rounded-2xl max-w-xl w-full max-h-[100vh] overflow-hidden shadow-xl popupmodel"
                      >
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                          <h3 className="font-bold text-lg">Product Description</h3>
                          <button 
                            onClick={() => setShowPopup(false)}
                            className="p-1 rounded-full hover:bg-gray-100 transition"
                          >
                            <RxCross2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-70">
                          <p className="text-gray-700 whitespace-pre-line">{data.description}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pricing Section */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className=""
              >
                <h2 className="font-semibold text-lg mb-3 text-gray-800">Pricing</h2>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-bold text-amber-600">
                    {DisplayPriceInRupees(priceWithDiscount(
                      selectedVariant !== null && data.variants[selectedVariant]?.price 
                        ? data.variants[selectedVariant].price 
                        : data.price, 
                      data.discount
                    ))}
                  </span>
                  
                  {data.discount > 0 && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        {DisplayPriceInRupees(
                          selectedVariant !== null && data.variants[selectedVariant]?.price 
                            ? data.variants[selectedVariant].price 
                            : data.price
                        )}
                      </span>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Shipping Information */}
              {data.shipping && (
                <div className="bg-blue-50 p-4 rounded-xl space-y-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <MdLocalShipping className="text-blue-500" />
                    Shipping Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {data.shipping.freeShipping !== undefined && (
                      <div className="flex items-center gap-2">
                        <div className="bg-white p-1 rounded-full">
                          <MdLocalShipping className="text-blue-500 w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Shipping</p>
                          <p className="font-medium">
                            {data.shipping.freeShipping ? 'Free Shipping' : 'Shipping charges apply'}
                          </p>
                        </div>
                      </div>
                    )}
                    {data.shipping.weight && (
                      <div className="flex items-center gap-2">
                        <div className="bg-white p-1 rounded-full">
                          <FaWeight className="text-blue-500 w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Weight</p>
                          <p className="font-medium">{data.shipping.weight} kg</p>
                        </div>
                      </div>
                    )}
                    {data.shipping.dimensions && (
                      <div className="flex items-center gap-2">
                        <div className="bg-white p-1 rounded-full">
                          <FaRulerCombined className="text-blue-500 w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Dimensions</p>
                          <p className="font-medium">
                            {data.shipping.dimensions.length} × {data.shipping.dimensions.width} × {data.shipping.dimensions.height} cm
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Stock Information */}
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  (selectedVariant !== null 
                    ? data.variants[selectedVariant].stock 
                    : data.stock) > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span className="text-sm text-gray-600">
                  {(selectedVariant !== null 
                    ? data.variants[selectedVariant].stock 
                    : data.stock) > 0 
                    ? 'In Stock' 
                    : 'Out of Stock'}
                </span>
              </div>

              {/* Add to Cart Button */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-2"
              >
                {(selectedVariant !== null 
                  ? data.variants[selectedVariant].stock 
                  : data.stock) > 0 ? (
                  <AddToCartButton 
                    data={{
                      ...data,
                      price: selectedVariant !== null && data.variants[selectedVariant]?.price 
                        ? data.variants[selectedVariant].price 
                        : data.price,
                      stock: selectedVariant !== null 
                        ? data.variants[selectedVariant].stock 
                        : data.stock,
                      variant: selectedVariant !== null 
                        ? data.variants[selectedVariant]
                        : null
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.01] shadow-md hover:shadow-lg active:scale-95" 
                  />
                ) : (
                  <div className='flex flex-col gap-2'>
                    <button 
                      disabled 
                      className="w-full bg-gray-400 text-white py-2 px-6 rounded-xl font-semibold text-lg cursor-not-allowed"
                    >
                      Out of Stock
                    </button>

                    <button  
                      className="w-full border-2 box-border text-orange-400 border-amber-600 py-2 px-6 rounded-xl font-semibold text-lg cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.dismiss()
                        toast.success("We’ll alert you when it’s back");
                      }}
                    >
                      Notify Me
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Mobile Tabs */}
              <div className="lg:hidden mt-6">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setSelectedTab('details')}
                    className={`px-4 py-2 font-medium ${selectedTab === 'details' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500'}`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setSelectedTab('features')}
                    className={`px-4 py-2 font-medium ${selectedTab === 'features' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500'}`}
                  >
                    Features
                  </button>
                  <button
                    onClick={() => setSelectedTab('specs')}
                    className={`px-4 py-2 font-medium ${selectedTab === 'specs' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500'}`}
                  >
                    Specifications
                  </button>
                </div>
                
                <div className="mt-4">
                  {selectedTab === 'details' && (
                    <div className="bg-white p-5 rounded-2xl shadow-sm">
                      <h3 className="font-semibold text-lg mb-3">Product Details</h3>
                      <div className="space-y-4">
                        {data?.more_details && Object.keys(data.more_details).length > 0 ? (
                          Object.entries(data.more_details).map(([key, value]) => (
                            <div key={key} className="border-b border-gray-100 pb-3 last:border-0">
                              <p className="font-medium text-gray-700">{key}</p>
                              <p className="text-gray-600">{value}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No details available.</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {selectedTab === 'features' && (
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                          <FaTruck className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Fast Delivery</h4>
                          <p className="text-gray-600 text-sm mt-1">Get your order delivered in record time</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                          <FaShieldAlt className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Quality Guaranteed</h4>
                          <p className="text-gray-600 text-sm mt-1">Premium materials with rigorous quality checks</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                          <FaExchangeAlt className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Easy Returns</h4>
                          <p className="text-gray-600 text-sm mt-1">30-day return policy, no questions asked</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedTab === 'specs' && data.specifications && (
                    <div className="bg-white p-5 rounded-2xl shadow-sm">
                      <h3 className="font-semibold text-lg mb-3">Specifications</h3>
                      <div className="space-y-4">
                        {Object.entries(data.specifications).map(([key, value]) => (
                          <div key={key} className="border-b border-gray-100 pb-3 last:border-0">
                            <p className="font-medium text-gray-700">{key}</p>
                            <p className="text-gray-600">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Product Details & Features */}
              <div className="hidden lg:block space-y-6">
                {/* Product Details */}
                {data?.more_details && Object.keys(data.more_details).length > 0 && (
                  <div className="bg-white p-5 rounded-2xl shadow-sm">
                    <h3 className="font-semibold text-lg mb-3">Product Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(data.more_details).map(([key, value]) => (
                        <div key={key}>
                          <p className="font-medium text-gray-700 text-sm">{key}</p>
                          <p className="text-gray-600">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications */}
                {data.specifications && Object.keys(data.specifications).length > 0 && (
                  <div className="bg-white p-5 rounded-2xl shadow-sm">
                    <h3 className="font-semibold text-lg mb-3">Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(data.specifications).map(([key, value]) => (
                        <div key={key}>
                          <p className="font-medium text-gray-700 text-sm">{key}</p>
                          <p className="text-gray-600">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <FaTruck className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Fast Delivery</h4>
                      <p className="text-gray-600 text-sm mt-1">Get your order delivered in record time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <FaShieldAlt className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Quality Guaranteed</h4>
                      <p className="text-gray-600 text-sm mt-1">Premium materials with rigorous quality checks</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <FaExchangeAlt className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Easy Returns</h4>
                      <p className="text-gray-600 text-sm mt-1">30-day return policy, no questions asked</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <div className="h-px bg-gray-200 w-full"></div>


      {/* Reviews Section */}
      <section className="py-3">
        <div className="container mx-auto max-w-7xl">
          <ProductReviewPage productId={productId} productData={data}  onReviewSubmitted={fetchProductDetails} />
        </div>
      </section>
    </div>
  )
}

export default SingleProductDisplayPage