import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, ShoppingBag } from 'lucide-react';

const LifestyleBanner = ({
  title,
  subtitle,
  description,
  ctaText = 'Explore Collection',
  ctaLink = '/products',
  backgroundImage,
  modelImage,
  productImage,
  product,
  layout = 'split', // 'split', 'overlay', 'side'
  theme = 'light', // 'light', 'dark'
  className = ''
}) => {
  const themeClasses = {
    light: {
      bg: 'from-gray-50 to-blue-50',
      text: 'text-gray-900',
      subtext: 'text-gray-600',
      overlay: 'bg-white/80'
    },
    dark: {
      bg: 'from-gray-900 to-blue-900',
      text: 'text-white',
      subtext: 'text-gray-300',
      overlay: 'bg-black/60'
    }
  };

  const currentTheme = themeClasses[theme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl min-h-[400px] lg:min-h-[500px] ${className}`}
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.bg}`}>
        {backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        <div className={`absolute inset-0 ${currentTheme.overlay} backdrop-blur-sm`} />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 right-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-16 h-16 bg-purple-400/20 rounded-full blur-lg"
          animate={{
            y: [0, 15, 0],
            x: [0, -8, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {layout === 'split' ? (
        <div className="relative h-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8 lg:p-12">
          {/* Content Side */}
          <div className="flex flex-col justify-center space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black ${currentTheme.text} leading-tight mb-4`}>
                {title || 'Lifestyle Collection'}
              </h2>
              <h3 className={`text-xl sm:text-2xl font-bold ${currentTheme.subtext} mb-4`}>
                {subtitle || 'Premium Quality & Style'}
              </h3>
              <p className={`text-base sm:text-lg ${currentTheme.subtext} leading-relaxed mb-6 max-w-md`}>
                {description || 'Discover our curated collection of premium products designed for modern lifestyle.'}
              </p>
            </motion.div>

            {/* Product Info (if product provided) */}
            {product && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center space-x-4">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-contain rounded-lg bg-white/20"
                    />
                  )}
                  <div>
                    <h4 className={`font-semibold ${currentTheme.text} mb-1`}>{product.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${currentTheme.text}`}>
                        ₹{product.price?.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className={`text-sm ${currentTheme.subtext} line-through`}>
                          ₹{product.originalPrice?.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    {product.rating && (
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className={`text-sm ${currentTheme.subtext} ml-1`}>
                          {product.rating} ({product.reviews || 0} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to={ctaLink}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>{ctaText}</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              {product && (
                <button className="inline-flex items-center justify-center px-6 py-4 bg-white/20 backdrop-blur-sm text-gray-900 font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30">
                  <Heart className="mr-2 w-5 h-5" />
                  <span>Add to Wishlist</span>
                </button>
              )}
            </motion.div>
          </div>

          {/* Visual Side */}
          <div className="relative flex items-center justify-center">
            {/* Model/Product Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {modelImage ? (
                <img
                  src={modelImage}
                  alt="Lifestyle model"
                  className="w-full max-w-md h-auto object-cover rounded-2xl shadow-2xl"
                />
              ) : productImage ? (
                <div className="relative">
                  <div className="w-80 h-80 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <img
                      src={productImage}
                      alt="Featured product"
                      className="w-64 h-64 object-contain drop-shadow-2xl"
                    />
                  </div>
                  {/* Floating elements around product */}
                  <motion.div
                    className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    New
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-4 -left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    Sale
                  </motion.div>
                </div>
              ) : (
                <div className="w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <ShoppingBag className="w-24 h-24 text-white/60" />
                </div>
              )}
            </motion.div>

            {/* Background decoration */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl scale-150"
              animate={{
                scale: [1.4, 1.6, 1.4],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      ) : (
        // Overlay layout
        <div className="relative h-full flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="text-center max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`text-4xl sm:text-5xl lg:text-6xl font-black ${currentTheme.text} leading-tight mb-6`}
            >
              {title || 'Lifestyle Collection'}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-lg sm:text-xl ${currentTheme.subtext} leading-relaxed mb-8`}
            >
              {description || 'Discover our curated collection of premium products designed for modern lifestyle.'}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                to={ctaLink}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>{ctaText}</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LifestyleBanner;
