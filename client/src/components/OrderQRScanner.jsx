import React, { useEffect, useRef, useState, useCallback } from 'react';
import QrScanner from 'qr-scanner';
import { LuScan } from 'react-icons/lu';
import Axios from '../utils/axios';
import SummaryApi from '../comman/summaryApi';
import toast from 'react-hot-toast';

const OrderQRScanner = ({ onClose, orders, onOrderUpdate }) => {
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [isProcessingScan, setIsProcessingScan] = useState(false);
  const [isScanLoading, setIsScanLoading] = useState(false);

  const isValidOrderQR = (data) => {
    try {
      const parsed = JSON.parse(data);
      return parsed && typeof parsed === 'object' && 
            parsed.orderId && parsed._id;
    } catch (e) {
      return false;
    }
  };

  const handleUpdateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: { 
          orderId, 
          status: newStatus,
          version: orders.find(o => o._id === orderId)?._v 
        }
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to update status');
      }
      return true;
    } catch (error) {
      console.error('Order status update error:', error);
      throw error;
    }
  }, [orders]);

  const handleScan = useCallback(async (result) => {
    if (isProcessingScan) return;
    setIsProcessingScan(true);
    setIsScanLoading(true);

    try {
      if (!result?.data) throw new Error('No QR code data detected');
      if (result.data.startsWith('http')) throw new Error('Website QR detected. Please scan an order QR code.');
      if (!isValidOrderQR(result.data)) throw new Error('Invalid order QR format');

      const orderData = JSON.parse(result.data);
      const matchedOrder = orders.find(o => o.orderId === orderData.orderId);
      if (!matchedOrder) throw new Error('Order not found. Please refresh orders and try again.');

      setScannedData(orderData);
      setCameraError(null);

      qrScannerRef.current?.stop();

      await handleUpdateOrderStatus(matchedOrder._id, 'delivered');
      await onOrderUpdate();

      toast.success(`Order ${orderData.orderId} marked as delivered`);

      setTimeout(() => {
        onClose();
        setScannedData(null);
      }, 1000);
    } catch (error) {
      console.error('QR scan error:', error);
      toast.error(error.message);
      setCameraError(error.message);
    } finally {
      setIsProcessingScan(false);
      setIsScanLoading(false);
    }
  }, [isProcessingScan, orders, handleUpdateOrderStatus, onOrderUpdate, onClose]);

  useEffect(() => {
    if (!videoRef.current) return;

    const initializeScanner = async () => {
      try {
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          handleScan,
          {
            preferredCamera: 'environment',
            highlightScanRegion: true,
            highlightCodeOutline: true,
            maxScansPerSecond: 5,
          }
        );

        await qrScannerRef.current.start();
        setCameraError(null);
      } catch (err) {
        console.error('Scanner initialization error:', err);
        setCameraError(err.message || 'Failed to access camera. Please check permissions.');
        toast.error('Camera access denied');
      }
    };

    initializeScanner();

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current = null;
      }
    };
  }, [handleScan]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <LuScan className="text-amber-500 text-xl" />
          <h2 className="text-lg font-semibold text-gray-800">QR Code Scanner</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors"
        >
          ×
        </button>
      </div>

      {cameraError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600 font-medium mb-2">{cameraError}</p>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm hover:bg-red-200 transition-colors"
          >
            Close Scanner
          </button>
        </div>
      ) : (
        <>
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4 border-2 border-amber-200">
            {isScanLoading ? (
              <div className="w-full h-full flex items-center justify-center text-white text-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </div>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover"
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-4 border-white border-dashed w-48 h-48 rounded-lg animate-pulse"></div>
                </div>
              </>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              Point your camera at an order QR code to scan
            </p>
            {scannedData && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mt-2">
                <p className="font-medium text-green-800">Scanned Order: #{scannedData.orderId}</p>
                <p className="text-sm text-green-600 mt-1">
                  Status automatically updated to delivered
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderQRScanner;