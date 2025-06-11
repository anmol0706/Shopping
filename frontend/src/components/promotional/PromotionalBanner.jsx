import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Gift, Percent, TrendingUp, Award, Sparkles } from 'lucide-react';

const PromotionalBanner = ({ 
  type = 'default',
  title,
  subtitle,
  description,
  ctaText,
  ctaLink,
  backgroundImage,
  backgroundColor = 'from-blue-600 to-indigo-600',
  textColor = 'text-white',
  icon: Icon,
  badge,
  discount,
  className = ''
}) => {
  const bannerTypes = {
    sale: {
      icon: Percent,
      defaultTitle: 'MEGA SALE',
      defaultSubtitle: 'Up to 70% OFF',
      defaultDescription: 'Limited time offer on selected items',
      defaultBadge: 'HOT DEAL',
      backgroundColor: 'from-red-500 to-pink-600'
    },
    new: {
      icon: Sparkles,
      defaultTitle: 'NEW ARRIVALS',
      defaultSubtitle: 'Fresh Collection',
      defaultDescription: 'Discover the latest trends and products',
      defaultBadge: 'NEW',
      backgroundColor: 'from-green-500 to-emerald-600'
    },
    trending: {
      icon: TrendingUp,
      defaultTitle: 'TRENDING NOW',
      defaultSubtitle: 'Most Popular',
      defaultDescription: 'What everyone is buying right now',
      defaultBadge: 'TRENDING',
      backgroundColor: 'from-purple-500 to-violet-600'
    },
    premium: {
      icon: Award,
      defaultTitle: 'PREMIUM QUALITY',
      defaultSubtitle: 'Luxury Collection',
      defaultDescription: 'Experience the finest products',
      defaultBadge: 'PREMIUM',
      backgroundColor: 'from-amber-500 to-orange-600'
    },
    flash: {
      icon: Zap,
      defaultTitle: 'FLASH SALE',
      defaultSubtitle: '24 Hours Only',
      defaultDescription: 'Grab these deals before they\'re gone',
      defaultBadge: 'FLASH',
      backgroundColor: 'from-yellow-500 to-orange-500'
    },
    gift: {
      icon: Gift,
      defaultTitle: 'SPECIAL OFFERS',
      defaultSubtitle: 'Free Gifts',
      defaultDescription: 'Get amazing gifts with your purchase',
      defaultBadge: 'GIFT',
      backgroundColor: 'from-pink-500 to-rose-600'
    }
  };

  const config = bannerTypes[type] || bannerTypes.default;
  const BannerIcon = Icon || config.icon || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl ${className}`}
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${backgroundColor || config.backgroundColor}`}>
        {backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/15 rounded-full blur-lg"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Content */}
      <div className="relative p-6 sm:p-8 lg:p-12">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Badge */}
            {(badge || config.defaultBadge) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold text-white mb-4"
              >
                <BannerIcon className="w-3 h-3 mr-1" />
                {badge || config.defaultBadge}
              </motion.div>
            )}

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`text-2xl sm:text-3xl lg:text-4xl font-black ${textColor} mb-2 leading-tight`}
            >
              {title || config.defaultTitle}
            </motion.h2>

            {/* Subtitle */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`text-lg sm:text-xl lg:text-2xl font-bold ${textColor} opacity-90 mb-3`}
            >
              {subtitle || config.defaultSubtitle}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className={`text-sm sm:text-base ${textColor} opacity-80 mb-6 max-w-md`}
            >
              {description || config.defaultDescription}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                to={ctaLink || '/products'}
                className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>{ctaText || 'Shop Now'}</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Icon/Discount Display */}
          <div className="flex flex-col items-center ml-4">
            {discount && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-center mb-4"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                  {discount}%
                </div>
                <div className="text-sm text-white/80 font-medium">OFF</div>
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8
              }}
            >
              <BannerIcon className="w-12 h-12 sm:w-16 sm:h-16 text-white/80" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PromotionalBanner;
