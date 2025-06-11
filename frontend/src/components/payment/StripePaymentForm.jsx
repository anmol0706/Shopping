import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { Lock, CreditCard, Shield, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const StripePaymentForm = ({ 
  clientSecret, 
  amount, 
  onSuccess, 
  onError, 
  isProcessing, 
  setIsProcessing 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (stripe && elements) {
      setIsReady(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message);
        setIsProcessing(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required'
      });

      if (confirmError) {
        setError(confirmError.message);
        onError?.(confirmError);
        toast.error(confirmError.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess?.(paymentIntent);
        toast.success('Payment successful!');
      }
    } catch (err) {
      setError(err.message);
      onError?.(err);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading payment form...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment Details
          </h3>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ₹{amount?.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Element */}
        <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
          <PaymentElement 
            options={{
              layout: 'tabs',
              paymentMethodOrder: ['card', 'ideal', 'sepa_debit'],
              fields: {
                billingDetails: {
                  name: 'auto',
                  email: 'auto',
                  phone: 'auto',
                  address: {
                    country: 'auto',
                    line1: 'auto',
                    line2: 'auto',
                    city: 'auto',
                    state: 'auto',
                    postalCode: 'auto'
                  }
                }
              }
            }}
          />
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
          </motion.div>
        )}

        {/* Security Notice */}
        <div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div className="text-sm">
            <p className="font-medium text-green-800 dark:text-green-200">
              Secure Payment
            </p>
            <p className="text-green-600 dark:text-green-300">
              Your payment information is encrypted and secure
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Lock className="w-5 h-5" />
          <span>
            {isProcessing 
              ? 'Processing Payment...' 
              : `Pay ₹${amount?.toLocaleString('en-IN')}`
            }
          </span>
        </button>

        {/* Payment Methods Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>We accept Visa, Mastercard, RuPay, UPI, and Net Banking</p>
          <p className="mt-1">Powered by Stripe • PCI DSS Compliant</p>
        </div>
      </form>
    </motion.div>
  );
};

export default StripePaymentForm;
