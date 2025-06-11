import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Validate environment configuration
 * @returns {Object} Validation results
 */
export const validateConfig = () => {
  const results = {
    valid: true,
    errors: [],
    warnings: [],
    summary: {}
  };

  // Required environment variables
  const requiredVars = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'FRONTEND_URL'
  ];

  // Optional but recommended variables
  const optionalVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLIC_KEY',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'EMAIL_HOST',
    'EMAIL_USER',
    'EMAIL_PASS'
  ];

  // Check required variables
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      results.valid = false;
      results.errors.push(`Missing required environment variable: ${varName}`);
    } else if (value.includes('your_') || value.includes('placeholder')) {
      results.warnings.push(`${varName} contains placeholder value`);
    }
  });

  // Check optional variables
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      results.warnings.push(`Optional environment variable not set: ${varName}`);
    } else if (value.includes('your_') || value.includes('placeholder')) {
      results.warnings.push(`${varName} contains placeholder value`);
    }
  });

  // Specific validations
  
  // MongoDB URI validation
  if (process.env.MONGODB_URI) {
    if (!process.env.MONGODB_URI.startsWith('mongodb://') && !process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
      results.errors.push('MONGODB_URI must start with mongodb:// or mongodb+srv://');
      results.valid = false;
    }
  }

  // JWT Secret validation
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    results.warnings.push('JWT_SECRET should be at least 32 characters long for security');
  }

  // Port validation
  if (process.env.PORT) {
    const port = parseInt(process.env.PORT);
    if (isNaN(port) || port < 1 || port > 65535) {
      results.errors.push('PORT must be a valid number between 1 and 65535');
      results.valid = false;
    }
  }

  // Email configuration validation
  const emailVars = ['EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASS'];
  const emailConfigured = emailVars.every(varName => process.env[varName]);
  const emailPlaceholders = emailVars.some(varName => 
    process.env[varName] && (process.env[varName].includes('your_') || process.env[varName] === 'your_app_password')
  );

  if (emailConfigured && !emailPlaceholders) {
    results.summary.email = 'Configured';
  } else if (emailConfigured && emailPlaceholders) {
    results.summary.email = 'Configured (with placeholders)';
  } else {
    results.summary.email = 'Not configured';
  }

  // Stripe configuration validation
  const stripeVars = ['STRIPE_SECRET_KEY', 'STRIPE_PUBLIC_KEY'];
  const stripeConfigured = stripeVars.every(varName => process.env[varName]);
  const stripePlaceholders = stripeVars.some(varName => 
    process.env[varName] && process.env[varName].includes('demo_key')
  );

  if (stripeConfigured && !stripePlaceholders) {
    results.summary.stripe = 'Configured';
  } else if (stripeConfigured && stripePlaceholders) {
    results.summary.stripe = 'Configured (demo keys)';
  } else {
    results.summary.stripe = 'Not configured';
  }

  // Razorpay configuration validation
  const razorpayVars = ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'];
  const razorpayConfigured = razorpayVars.every(varName => process.env[varName]);
  
  if (razorpayConfigured) {
    results.summary.razorpay = 'Configured';
  } else {
    results.summary.razorpay = 'Not configured';
  }

  // Cloudinary configuration validation
  const cloudinaryVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const cloudinaryConfigured = cloudinaryVars.every(varName => process.env[varName]);
  
  if (cloudinaryConfigured) {
    results.summary.cloudinary = 'Configured';
  } else {
    results.summary.cloudinary = 'Not configured';
  }

  return results;
};

/**
 * Print configuration validation results
 */
export const printConfigValidation = () => {
  const results = validateConfig();
  
  console.log('\n📋 Configuration Validation Results:');
  console.log('=====================================');
  
  if (results.valid) {
    console.log('✅ All required configurations are valid');
  } else {
    console.log('❌ Configuration validation failed');
  }
  
  if (results.errors.length > 0) {
    console.log('\n🚨 Errors:');
    results.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (results.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    results.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  console.log('\n📊 Service Status:');
  Object.entries(results.summary).forEach(([service, status]) => {
    const icon = status.includes('Configured') ? '✅' : '❌';
    console.log(`  ${icon} ${service.charAt(0).toUpperCase() + service.slice(1)}: ${status}`);
  });
  
  console.log('=====================================\n');
  
  return results;
};
