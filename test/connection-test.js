/**
 * Simple connection test to verify backend connectivity
 * Run this with: node test/connection-test.js
 */

import axios from 'axios';

const BACKEND_URL = 'https://shopping-backend-7mgn.onrender.com';
const API_URL = 'https://shopping-backend-7mgn.onrender.com/api';

console.log('🧪 Testing ShopEase Backend Connectivity...\n');

// Test 1: Health Check
async function testHealthCheck() {
  console.log('1️⃣ Testing Health Check Endpoint...');
  try {
    const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 10000 });
    console.log('✅ Health Check: SUCCESS');
    console.log('   Status:', response.status);
    console.log('   Message:', response.data.message);
    console.log('   Environment:', response.data.environment);
    return true;
  } catch (error) {
    console.log('❌ Health Check: FAILED');
    console.log('   Error:', error.message);
    return false;
  }
}

// Test 2: API Health Check
async function testAPIHealthCheck() {
  console.log('\n2️⃣ Testing API Health Check Endpoint...');
  try {
    const response = await axios.get(`${API_URL}/health`, { timeout: 10000 });
    console.log('✅ API Health Check: SUCCESS');
    console.log('   Status:', response.status);
    console.log('   Message:', response.data.message);
    console.log('   Version:', response.data.version);
    return true;
  } catch (error) {
    console.log('❌ API Health Check: FAILED');
    console.log('   Error:', error.message);
    return false;
  }
}

// Test 3: Products Endpoint (Public)
async function testProductsEndpoint() {
  console.log('\n3️⃣ Testing Products Endpoint...');
  try {
    const response = await axios.get(`${API_URL}/products?limit=1`, { timeout: 10000 });
    console.log('✅ Products Endpoint: SUCCESS');
    console.log('   Status:', response.status);
    console.log('   Products Found:', response.data.products?.length || 0);
    return true;
  } catch (error) {
    console.log('❌ Products Endpoint: FAILED');
    console.log('   Error:', error.message);
    return false;
  }
}

// Test 4: CORS Check
async function testCORS() {
  console.log('\n4️⃣ Testing CORS Configuration...');
  try {
    const response = await axios.get(`${API_URL}/health`, {
      timeout: 10000,
      headers: {
        'Origin': 'https://shopease-wlmj.onrender.com',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ CORS: SUCCESS');
    console.log('   Status:', response.status);
    return true;
  } catch (error) {
    console.log('❌ CORS: FAILED');
    console.log('   Error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Backend Connectivity Tests...\n');
  
  const results = {
    health: await testHealthCheck(),
    apiHealth: await testAPIHealthCheck(),
    products: await testProductsEndpoint(),
    cors: await testCORS()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`Health Check:     ${results.health ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`API Health:       ${results.apiHealth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Products API:     ${results.products ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`CORS:             ${results.cors ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Backend is fully operational.');
  } else {
    console.log('⚠️  Some tests failed. Check the backend deployment.');
  }
  
  return results;
}

// Run the tests
runAllTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});
