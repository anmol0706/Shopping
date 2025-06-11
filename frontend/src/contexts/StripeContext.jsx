import { createContext, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const StripeContext = createContext();

// Initialize Stripe with publishable key
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey && stripeKey !== 'your_stripe_publishable_key'
  ? loadStripe(stripeKey)
  : null;

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};

export const StripeProvider = ({ children }) => {
  const value = {
    stripePromise
  };

  return (
    <StripeContext.Provider value={value}>
      {stripePromise ? (
        <Elements stripe={stripePromise}>
          {children}
        </Elements>
      ) : (
        children
      )}
    </StripeContext.Provider>
  );
};
