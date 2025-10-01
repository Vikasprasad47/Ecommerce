import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import isAdmin from '../utils/IsAdmin';
import IsDeliveryAgent from '../utils/IsDeliveryAgent'

const AdminPermission = ({ children }) => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(4); // Start from 4 seconds

  const hasPermission = isAdmin(user.role) || IsDeliveryAgent(user.role);

  useEffect(() => {
    if (!hasPermission) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        navigate('/'); // Redirect after countdown ends
      }, 4000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [hasPermission, navigate]);

  return (
    <>
      {hasPermission ? (
        children
      ) : (
        <p className="text-red-600 bg-red-100 p-4">
          You do not have access. Redirecting to home in {countdown} seconds...
        </p>
      )}
    </>
  );
};

export default AdminPermission;
