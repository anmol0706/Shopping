import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, CreditCard, Shield, AlertCircle, Smartphone, Building, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import razorpayService from '../../services/razorpayService';

const RazorpayPaymentForm = ({ 
  orderData, 
  onSuccess, 
  onError, 
  isProcessing, 
  setIsProcessing 
}) => {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const [error, setError] = useState(null);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript().then((loaded) => {
      if (!loaded) {
        setError('Failed to load Razorpay SDK');
      }
    });
  }, []);

  // Create Razorpay order
  const createRazorpayOrder = async () => {
    setIsCreatingOrder(true);
    setError(null);

    try {
      const response = await razorpayService.createOrder(orderData);
      setRazorpayOrder(response);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (!razorpayOrder || !window.Razorpay) {
      toast.error('Payment system not ready');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const paymentOptions = {
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'ShopEase',
        description: 'Order Payment',
        order_id: razorpayOrder.orderId,
        prefill: {
          name: orderData.shippingAddress?.name || orderData.guestInfo?.name || '',
          email: orderData.guestInfo?.email || '',
          contact: orderData.shippingAddress?.phone || orderData.guestInfo?.phone || ''
        },
        theme: {
          color: '#3B82F6'
        },
        notes: {
          address: `${orderData.shippingAddress?.street}, ${orderData.shippingAddress?.city}`
        }
      };

      const paymentResponse = await razorpayService.initializePayment(paymentOptions);

      // Verify payment on backend
      const verificationData = {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        subtotal: razorpayOrder.calculatedAmount,
        gstAmount: razorpayOrder.gstAmount,
        shippingCost: razorpayOrder.shippingCost,
        totalAmount: razorpayOrder.totalAmount,
        orderNotes: orderData.orderNotes,
        guestInfo: orderData.guestInfo
      };

      const verificationResponse = await razorpayService.verifyPayment(verificationData);
      
      onSuccess?.(verificationResponse.order);
      toast.success('Payment successful!');

    } catch (error) {
      setError(error.message);
      onError?.(error);
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { icon: CreditCard, name: 'Credit/Debit Cards', desc: 'Visa, Mastercard, RuPay' },
    { icon: Smartphone, name: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
    { icon: Building, name: 'Net Banking', desc: 'All major banks' },
    { icon: Wallet, name: 'Wallets', desc: 'Paytm, Mobikwik, etc.' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Secure Payment with Razorpay
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Pay securely using multiple payment methods
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start space-x-3 mb-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 dark:text-red-200 text-sm font-medium">Payment Service Unavailable</p>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-3">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium mb-1">
              💡 Alternative Payment Option
            </p>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              You can still complete your order using <strong>Cash on Delivery</strong>.
              Go back and select "Cash on Delivery" to proceed with your ₹{(orderData.amount / 100)?.toFixed(2)} order.
            </p>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Supported Payment Methods
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {paymentMethods.map((method, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <method.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {method.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {method.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      {razorpayOrder && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Order Summary
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="text-gray-900 dark:text-white">
                ₹{razorpayOrder.calculatedAmount?.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">GST (18%):</span>
              <span className="text-gray-900 dark:text-white">
                ₹{razorpayOrder.gstAmount?.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
              <span className="text-gray-900 dark:text-white">
                ₹{razorpayOrder.shippingCost?.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 pt-1 mt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-gray-900 dark:text-white">
                  ₹{razorpayOrder.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {error ? (
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>← Go Back & Choose Cash on Delivery</span>
            </button>
            <button
              onClick={() => {
                setError(null);
                createRazorpayOrder();
              }}
              disabled={isCreatingOrder}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>
                {isCreatingOrder ? 'Retrying...' : 'Try Again'}
              </span>
            </button>
          </div>
        ) : !razorpayOrder ? (
          <button
            onClick={createRazorpayOrder}
            disabled={isCreatingOrder}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>
              {isCreatingOrder ? 'Preparing Payment...' : 'Proceed to Payment'}
            </span>
          </button>
        ) : (
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Lock className="w-5 h-5" />
            <span>
              {isProcessing
                ? 'Processing Payment...'
                : `Pay ₹${razorpayOrder.totalAmount?.toLocaleString('en-IN')}`
              }
            </span>
          </button>
        )}

        {/* Security Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Secured by Razorpay • 256-bit SSL Encryption</p>
          <p className="mt-1">Your payment information is safe and secure</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RazorpayPaymentForm;
