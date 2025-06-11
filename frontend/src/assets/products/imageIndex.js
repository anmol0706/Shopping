// Product Images Index
// This file contains all organized product images for easy import and reference

// Electronics - Smartphones
import samsungS24 from './electronics/smartphones/samsung-s24.png';
import iphone16ProMax1 from './electronics/smartphones/iphone-16-pro-max-1.jpg';
import iphone16ProMax2 from './electronics/smartphones/iphone-16-pro-max-2.jpg';
import iphone16ProMax3 from './electronics/smartphones/iphone-16-pro-max-3.jpg';
import googlePixel9Pro1 from './electronics/smartphones/google-pixel-9-pro-1.jpg';
import googlePixel9Pro2 from './electronics/smartphones/google-pixel-9-pro-2.jpg';
import googlePixel9Pro3 from './electronics/smartphones/google-pixel-9-pro-3.jpg';

// Electronics - Accessories
import airpods from './electronics/accessories/airpods.png';
import appleWatch from './electronics/accessories/apple-watch.png';

// Electronics - Gaming
import playstation51 from './electronics/gaming/playstation-5-1.jpg';
import playstation52 from './electronics/gaming/playstation-5-2.jpg';

// Electronics - Cameras
import canonR6Mark21 from './electronics/cameras/canon-eos-r6-mark2-1.jpg';
import canonR6Mark22 from './electronics/cameras/canon-eos-r6-mark2-2.jpg';

// Clothing - Shoes
import nikeJordan41 from './clothing/shoes/nike-air-jordan-4-travis-scott-1.jpg';
import nikeJordan42 from './clothing/shoes/nike-air-jordan-4-travis-scott-2.jpg';
import nikeJordan43 from './clothing/shoes/nike-air-jordan-4-travis-scott-3.jpg';
import yeezy3501 from './clothing/shoes/yeezy-boost-350-v2-1.jpg';
import yeezy3502 from './clothing/shoes/yeezy-boost-350-v2-2.jpg';
import yeezy3503 from './clothing/shoes/yeezy-boost-350-v2-3.jpg';

// Clothing - Apparel
import supremeHoodie1 from './clothing/apparel/supreme-box-logo-hoodie-1.jpg';
import supremeHoodie2 from './clothing/apparel/supreme-box-logo-hoodie-2.jpg';

// Books
import atomicHabits1 from './books/atomic-habits-1.jpg';
import atomicHabits2 from './books/atomic-habits-2.jpg';
import harryPotterSet1 from './books/harry-potter-set-1.jpg';
import harryPotterSet2 from './books/harry-potter-set-2.jpg';

// Beauty
import teaTreeFaceWash1 from './beauty/tea-tree-face-wash-1.jpg';
import teaTreeFaceWash2 from './beauty/tea-tree-face-wash-2.jpg';

// Food & Beverages
import organicGreenTea1 from './food-beverages/organic-green-tea-1.jpg';
import organicGreenTea2 from './food-beverages/organic-green-tea-2.jpg';

// Toys
import barbieDreamhouse1 from './toys/barbie-dreamhouse-1.jpg';

// Export organized product images
export const productImages = {
  electronics: {
    smartphones: {
      samsungS24,
      iphone16ProMax: [iphone16ProMax1, iphone16ProMax2, iphone16ProMax3],
      googlePixel9Pro: [googlePixel9Pro1, googlePixel9Pro2, googlePixel9Pro3]
    },
    accessories: {
      airpods,
      appleWatch
    },
    gaming: {
      playstation5: [playstation51, playstation52]
    },
    cameras: {
      canonR6Mark2: [canonR6Mark21, canonR6Mark22]
    }
  },
  clothing: {
    shoes: {
      nikeJordan4TravisScott: [nikeJordan41, nikeJordan42, nikeJordan43],
      yeezyBoost350V2: [yeezy3501, yeezy3502, yeezy3503]
    },
    apparel: {
      supremeBoxLogoHoodie: [supremeHoodie1, supremeHoodie2]
    }
  },
  books: {
    atomicHabits: [atomicHabits1, atomicHabits2],
    harryPotterSet: [harryPotterSet1, harryPotterSet2]
  },
  beauty: {
    teaTreeFaceWash: [teaTreeFaceWash1, teaTreeFaceWash2]
  },
  foodBeverages: {
    organicGreenTea: [organicGreenTea1, organicGreenTea2]
  },
  toys: {
    barbieDreamhouse: [barbieDreamhouse1]
  }
};

// Helper function to get product images by category and product name
export const getProductImages = (category, subcategory, productName) => {
  try {
    if (subcategory) {
      return productImages[category]?.[subcategory]?.[productName] || [];
    }
    return productImages[category]?.[productName] || [];
  } catch (error) {
    console.warn('Product image not found:', { category, subcategory, productName });
    return [];
  }
};

// Export individual images for direct import
export {
  // Electronics
  samsungS24,
  iphone16ProMax1,
  iphone16ProMax2,
  iphone16ProMax3,
  googlePixel9Pro1,
  googlePixel9Pro2,
  googlePixel9Pro3,
  airpods,
  appleWatch,
  playstation51,
  playstation52,
  canonR6Mark21,
  canonR6Mark22,
  
  // Clothing
  nikeJordan41,
  nikeJordan42,
  nikeJordan43,
  yeezy3501,
  yeezy3502,
  yeezy3503,
  supremeHoodie1,
  supremeHoodie2,
  
  // Books
  atomicHabits1,
  atomicHabits2,
  harryPotterSet1,
  harryPotterSet2,
  
  // Beauty
  teaTreeFaceWash1,
  teaTreeFaceWash2,
  
  // Food & Beverages
  organicGreenTea1,
  organicGreenTea2,
  
  // Toys
  barbieDreamhouse1
};
