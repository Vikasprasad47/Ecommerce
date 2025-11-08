import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

const ImageGallery = ({ images, reviews }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openModal = (index) => {
    setActiveIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const getImageUrl = (img) => (typeof img === 'string' ? img : img.url);


  return (
    <div>
      {/* Thumbnails */}
      <div className="flex gap-2 mt-2">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={getImageUrl(img)}
            alt={`thumb-${idx}`}
            className="w-16 h-16 object-cover rounded cursor-pointer border hover:scale-105 transition"
            onClick={() => openModal(idx)}
          />
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative max-w-full max-h-full p-4">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-white text-xl"
                onClick={closeModal}
              >
                <FaTimes />
              </button>

              {/* Left Arrow */}
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-2xl"
                onClick={goToPrev}
              >
                <FaChevronLeft />
              </button>

              {/* Right Arrow */}
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-2xl"
                onClick={goToNext}
              >
                <FaChevronRight />
              </button>

              {/* Main Image */}
              <img
                src={getImageUrl(images[activeIndex])}
                alt={`main-${activeIndex}`}
                className="max-h-[80vh] max-w-full rounded-lg shadow-lg object-contain"
              />

              {/* Count */}
              <div className="text-center text-white mt-2 text-sm">
                {activeIndex + 1} / {images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default ImageGallery;