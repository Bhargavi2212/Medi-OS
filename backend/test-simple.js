const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testSimple() {
  console.log('🧪 Testing HealthOS API...\n');

  try {
    // Test health check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed');
    console.log('Available agents:', healthResponse.data.agents);
    console.log('');

    // Test API documentation
    console.log('2. Testing API Documentation...');
    const apiResponse = await axios.get(`${BASE_URL}/api`);
    console.log('✅ API documentation accessible');
    console.log('Endpoints:', Object.keys(apiResponse.data.endpoints));
    console.log('');

    // Test insights agent
    console.log('3. Testing Insights Agent...');
    const insightsResponse = await axios.get(`${BASE_URL}/api/insights-agent/analytics/overview`);
    console.log('✅ Insights agent working');
    console.log('Data:', insightsResponse.data.data);
    console.log('');

    // Test market agent
    console.log('4. Testing Market Agent...');
    const marketResponse = await axios.get(`${BASE_URL}/api/market-agent/analysis/overview`);
    console.log('✅ Market agent working');
    console.log('Data:', marketResponse.data.data);
    console.log('');

    // Test integration agent
    console.log('5. Testing Integration Agent...');
    const integrationResponse = await axios.get(`${BASE_URL}/api/integration-agent/connections`);
    console.log('✅ Integration agent working');
    console.log('Data:', integrationResponse.data.data);
    console.log('');

    // Test make agent
    console.log('6. Testing Make Agent...');
    const makeResponse = await axios.get(`${BASE_URL}/api/make-agent/speech/transcriptions`);
    console.log('✅ Make agent working');
    console.log('Data:', makeResponse.data.data);
    console.log('');

    console.log('🎉 All API endpoints are working correctly!');
    console.log('🚀 HealthOS API is ready for frontend integration!');

  } catch (error) {
    console.error('❌ API testing failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running on port 3000');
    }
  }
}

testSimple(); 