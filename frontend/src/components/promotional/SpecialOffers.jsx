import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Zap, 
  Gift, 
  Truck, 
  Shield, 
  ArrowRight,
  Percent,
  Star,
  Award
} from 'lucide-react';

const SpecialOffers = ({ className = '' }) => {
  const offers = [
    {
      id: 1,
      title: 'Flash Sale',
      subtitle: '24 Hours Only',
      description: 'Up to 60% off on electronics',
      discount: '60',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      textColor: 'text-white',
      badge: 'LIMITED TIME',
      link: '/products?category=Electronics&sale=true',
      timeLeft: '23:45:12'
    },
    {
      id: 2,
      title: 'Free Shipping',
      subtitle: 'On Orders ₹500+',
      description: 'No delivery charges nationwide',
      icon: Truck,
      color: 'from-green-500 to-emerald-500',
      textColor: 'text-white',
      badge: 'FREE DELIVERY',
      link: '/products',
      permanent: true
    },
    {
      id: 3,
      title: 'Premium Members',
      subtitle: 'Exclusive Deals',
      description: 'Extra 15% off + early access',
      discount: '15',
      icon: Award,
      color: 'from-purple-500 to-violet-500',
      textColor: 'text-white',
      badge: 'VIP ONLY',
      link: '/register',
      special: true
    },
    {
      id: 4,
      title: 'Gift Cards',
      subtitle: 'Perfect for Everyone',
      description: 'Buy ₹1000, get ₹100 bonus',
      icon: Gift,
      color: 'from-pink-500 to-rose-500',
      textColor: 'text-white',
      badge: 'BONUS',
      link: '/gift-cards',
      bonus: '₹100'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: '100% Secure',
      description: 'Safe & secure payments'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Same day delivery available'
    },
    {
      icon: Star,
      title: 'Top Rated',
      description: '4.8/5 customer satisfaction'
    }
  ];

  return (
    <section className={`py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden ${className}`}>
      {/* Background decoration */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Special Offers
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Don't miss out on these amazing deals and exclusive offers
          </p>
        </motion.div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {offers.map((offer, index) => {
            const IconComponent = offer.icon;
            
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link to={offer.link} className="block">
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${offer.color} p-6 shadow-xl hover:shadow-2xl transition-all duration-300`}>
                    {/* Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                        {offer.badge}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className={`text-xl font-bold ${offer.textColor}`}>
                        {offer.title}
                      </h3>
                      <p className={`text-sm ${offer.textColor} opacity-90`}>
                        {offer.subtitle}
                      </p>
                      <p className={`text-xs ${offer.textColor} opacity-75`}>
                        {offer.description}
                      </p>
                    </div>

                    {/* Special elements */}
                    <div className="mt-4 flex items-center justify-between">
                      {offer.discount && (
                        <div className="text-right">
                          <div className="text-2xl font-black text-white">
                            {offer.discount}%
                          </div>
                          <div className="text-xs text-white/80">OFF</div>
                        </div>
                      )}
                      
                      {offer.bonus && (
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">
                            {offer.bonus}
                          </div>
                          <div className="text-xs text-white/80">BONUS</div>
                        </div>
                      )}

                      {offer.timeLeft && (
                        <div className="text-right">
                          <div className="flex items-center text-white/90 text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {offer.timeLeft}
                          </div>
                        </div>
                      )}

                      <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Animated background elements */}
                    <motion.div
                      className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5
                      }}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Features Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mb-4 shadow-lg">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default SpecialOffers;
