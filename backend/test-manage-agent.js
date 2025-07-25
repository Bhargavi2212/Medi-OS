const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

// Test data
const testQueueState = {
    queueLength: 8,
    currentWaitTime: 20,
    staffAvailable: 5,
    roomsAvailable: 8,
    hourOfDay: 14,
    dayOfWeek: 2
};

const testPatientInfo = {
    patientId: "P001234",
    age: 45,
    urgencyLevel: 3,
    department: "General Medicine",
    medicalComplexity: 2.5,
    symptoms: ["fever", "cough", "fatigue"]
};

const testPatientData = {
    patientId: "P001234",
    age: 45,
    urgencyLevel: 3,
    department: "Cardiology",
    medicalComplexity: 2.5,
    symptoms: ["chest pain", "shortness of breath"]
};

async function testManageAgent() {
    console.log('🏥 Testing ManageAgent (Clinic Operations Manager)...\n');

    try {
        // 1. Login to get token
        console.log('1️⃣ Logging in...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            username: 'admin',
            password: 'admin123'
        });
        console.log('Login response:', JSON.stringify(loginResponse.data, null, 2));
        authToken = loginResponse.data.token;
        console.log('✅ Login successful\n');

        // 2. Test wait time prediction
        console.log('2️⃣ Testing wait time prediction...');
        const waitTimeResponse = await axios.post(`${BASE_URL}/manage-agent/predict-wait-time`, testQueueState, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('✅ Wait time prediction successful');
        console.log(`⏰ Prediction: ${JSON.stringify(waitTimeResponse.data.data, null, 2)}\n`);

        // 3. Test triage classification
        console.log('3️⃣ Testing triage classification...');
        const triageResponse = await axios.post(`${BASE_URL}/manage-agent/classify-triage`, testPatientInfo, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('✅ Triage classification successful');
        console.log(`🏥 Triage: ${JSON.stringify(triageResponse.data.data, null, 2)}\n`);

        // 4. Test resource optimization
        console.log('4️⃣ Testing resource optimization...');
        const optimizationResponse = await axios.post(`${BASE_URL}/manage-agent/optimize-resources`, testQueueState, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('✅ Resource optimization successful');
        console.log(`⚙️ Optimization: ${JSON.stringify(optimizationResponse.data.data, null, 2)}\n`);

        // 5. Test digital check-in
        console.log('5️⃣ Testing digital check-in...');
        const checkinResponse = await axios.post(`${BASE_URL}/manage-agent/digital-checkin`, testPatientData, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('✅ Digital check-in successful');
        console.log(`📱 Check-in: ${JSON.stringify(checkinResponse.data.data, null, 2)}\n`);

        // 6. Test queue dashboard
        console.log('6️⃣ Testing queue dashboard...');
        const dashboardResponse = await axios.get(`${BASE_URL}/manage-agent/queue-dashboard`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('✅ Queue dashboard successful');
        console.log(`📊 Dashboard: ${JSON.stringify(dashboardResponse.data.data, null, 2)}\n`);

        // 7. Test patient flow analytics
        console.log('7️⃣ Testing patient flow analytics...');
        const analyticsResponse = await axios.get(`${BASE_URL}/manage-agent/patient-flow-analytics`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('✅ Patient flow analytics successful');
        console.log(`📈 Analytics: ${JSON.stringify(analyticsResponse.data.data, null, 2)}\n`);

        // 8. Test performance metrics
        console.log('8️⃣ Testing performance metrics...');
        const metricsResponse = await axios.get(`${BASE_URL}/manage-agent/performance-metrics`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('✅ Performance metrics successful');
        console.log(`📊 Metrics: ${JSON.stringify(metricsResponse.data.data, null, 2)}\n`);

        // 9. Test queue state update
        console.log('9️⃣ Testing queue state update...');
        const updateResponse = await axios.put(`${BASE_URL}/manage-agent/queue-state/Cardiology`, {
            queueLength: 12,
            staffAvailable: 6,
            roomsAvailable: 10
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('✅ Queue state update successful');
        console.log(`🔄 Update: ${JSON.stringify(updateResponse.data.data, null, 2)}\n`);

        console.log('🎉 All ManageAgent tests passed successfully!');
        console.log('\n📋 ManageAgent Features Tested:');
        console.log('✅ Wait time prediction (LSTM-like algorithm)');
        console.log('✅ Smart triage classification (XGBoost-like algorithm)');
        console.log('✅ Resource optimization (Multi-armed bandits-like algorithm)');
        console.log('✅ Digital check-in processing');
        console.log('✅ Queue dashboard generation');
        console.log('✅ Patient flow analytics');
        console.log('✅ Performance metrics tracking');
        console.log('✅ Real-time queue state updates');

        console.log('\n🎯 Next Steps:');
        console.log('1. Integrate with real ML models (TensorFlow/PyTorch)');
        console.log('2. Connect to real hospital databases');
        console.log('3. Implement real-time WebSocket updates');
        console.log('4. Add more sophisticated ML algorithms');
        console.log('5. Deploy to production environment');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testManageAgent(); 