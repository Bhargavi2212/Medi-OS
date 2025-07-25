const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

// Test data
const testAgent = {
    name: "Healthcare Insights Agent",
    description: "AI agent for analyzing healthcare data and generating insights",
    type: "insights",
    capabilities: ["data_analysis", "pattern_recognition", "predictive_modeling"],
    configuration: {
        model: "gpt-4",
        parameters: {
            temperature: 0.7,
            maxTokens: 1000
        },
        trainingData: ["patient_records", "medical_literature"],
        apiEndpoints: ["/api/insights", "/api/analytics"]
    }
};

const trainingConfig = {
    modelType: "transformer",
    hyperparameters: {
        learningRate: 0.001,
        batchSize: 32,
        epochs: 100
    },
    dataSources: ["patient_data", "clinical_notes"],
    validationSplit: 0.2,
    epochs: 50,
    batchSize: 32,
    learningRate: 0.001
};

async function testAgentSystem() {
    console.log('🤖 Testing Agent Management System...\n');

    try {
        // 1. Login to get token
        console.log('1️⃣ Logging in...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@healthos.com',
            password: 'admin123'
        });
        
        authToken = loginResponse.data.token;
        console.log('✅ Login successful\n');

        // 2. Create an agent
        console.log('2️⃣ Creating agent...');
        const createResponse = await axios.post(`${BASE_URL}/agents`, testAgent, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const agentId = createResponse.data.data.id;
        console.log('✅ Agent created successfully');
        console.log(`🔑 Agent ID: ${agentId}\n`);

        // 3. Get all agents
        console.log('3️⃣ Fetching all agents...');
        const agentsResponse = await axios.get(`${BASE_URL}/agents`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log(`✅ Found ${agentsResponse.data.data.length} agents\n`);

        // 4. Start training
        console.log('4️⃣ Starting agent training...');
        const trainingResponse = await axios.post(`${BASE_URL}/agents/${agentId}/training`, {
            trainingConfig
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('✅ Training started successfully');
        console.log(`🔑 Training ID: ${trainingResponse.data.data.id}\n`);

        // 5. Test agent execution - Insights Agent
        console.log('5️⃣ Testing Insights Agent execution...');
        const insightsResponse = await axios.post(`${BASE_URL}/agents/${agentId}/execute/insights`, {
            operation: "generate_dashboard",
            data: { hospitalId: 1, dateRange: "last_30_days" }
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('✅ Insights Agent execution successful');
        console.log(`📊 Dashboard: ${JSON.stringify(insightsResponse.data.data, null, 2)}\n`);

        // 6. Test Manage Agent (create a new one)
        console.log('6️⃣ Creating Manage Agent...');
        const manageAgent = {
            ...testAgent,
            name: "Clinic Operations Manager",
            description: "AI agent for managing clinic operations and patient flow",
            type: "manage",
            capabilities: ["automation", "integration", "queue_management"]
        };
        
        const manageAgentResponse = await axios.post(`${BASE_URL}/agents`, manageAgent, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const manageAgentId = manageAgentResponse.data.data.id;
        console.log('✅ Manage Agent created successfully');
        console.log(`🔑 Manage Agent ID: ${manageAgentId}\n`);

        // 7. Test Manage Agent execution
        console.log('7️⃣ Testing Manage Agent execution...');
        const manageResponse = await axios.post(`${BASE_URL}/agents/${manageAgentId}/execute/manage`, {
            operation: "digital_checkin",
            data: { patientId: 123, appointmentId: 456 }
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('✅ Manage Agent execution successful');
        console.log(`🏥 Check-in: ${JSON.stringify(manageResponse.data.data, null, 2)}\n`);

        // 8. Test Make Agent
        console.log('8️⃣ Creating Make Agent...');
        const makeAgent = {
            ...testAgent,
            name: "AI Medical Scribe",
            description: "AI agent for digitizing medical records and auto-filling forms",
            type: "make",
            capabilities: ["nlp", "image_processing", "automation"]
        };
        
        const makeAgentResponse = await axios.post(`${BASE_URL}/agents`, makeAgent, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const makeAgentId = makeAgentResponse.data.data.id;
        console.log('✅ Make Agent created successfully');
        console.log(`🔑 Make Agent ID: ${makeAgentId}\n`);

        // 9. Test Make Agent execution
        console.log('9️⃣ Testing Make Agent execution...');
        const makeResponse = await axios.post(`${BASE_URL}/agents/${makeAgentId}/execute/make`, {
            operation: "ocr_document",
            data: { documentUrl: "https://example.com/medical_record.pdf" }
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('✅ Make Agent execution successful');
        console.log(`📄 OCR Result: ${JSON.stringify(makeResponse.data.data, null, 2)}\n`);

        // 10. Test Market Agent
        console.log('🔟 Creating Market Agent...');
        const marketAgent = {
            ...testAgent,
            name: "Patient Engagement Bot",
            description: "AI agent for patient communication and engagement",
            type: "market",
            capabilities: ["automation", "nlp", "reporting"]
        };
        
        const marketAgentResponse = await axios.post(`${BASE_URL}/agents`, marketAgent, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const marketAgentId = marketAgentResponse.data.data.id;
        console.log('✅ Market Agent created successfully');
        console.log(`🔑 Market Agent ID: ${marketAgentId}\n`);

        // 11. Test Market Agent execution
        console.log('1️⃣1️⃣ Testing Market Agent execution...');
        const marketResponse = await axios.post(`${BASE_URL}/agents/${marketAgentId}/execute/market`, {
            operation: "send_reminder",
            data: { patientId: 123, appointmentTime: "2024-01-15T14:00:00Z", channel: "SMS" }
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('✅ Market Agent execution successful');
        console.log(`📱 Reminder: ${JSON.stringify(marketResponse.data.data, null, 2)}\n`);

        // 12. Test Integration Agent
        console.log('1️⃣2️⃣ Creating Integration Agent...');
        const integrationAgent = {
            ...testAgent,
            name: "Healthcare Ecosystem Connector",
            description: "AI agent for integrating with external healthcare systems",
            type: "integration",
            capabilities: ["integration", "automation", "data_exchange"]
        };
        
        const integrationAgentResponse = await axios.post(`${BASE_URL}/agents`, integrationAgent, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const integrationAgentId = integrationAgentResponse.data.data.id;
        console.log('✅ Integration Agent created successfully');
        console.log(`🔑 Integration Agent ID: ${integrationAgentId}\n`);

        // 13. Test Integration Agent execution
        console.log('1️⃣3️⃣ Testing Integration Agent execution...');
        const integrationResponse = await axios.post(`${BASE_URL}/agents/${integrationAgentId}/execute/integration`, {
            operation: "abha_integration",
            data: { patientId: 123, abhaNumber: "ABHA123456789" }
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('✅ Integration Agent execution successful');
        console.log(`🔗 Integration: ${JSON.stringify(integrationResponse.data.data, null, 2)}\n`);

        // 14. Get agent performance
        console.log('1️⃣4️⃣ Getting agent performance...');
        const performanceResponse = await axios.get(`${BASE_URL}/agents/${agentId}/performance`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        console.log('✅ Performance data retrieved');
        console.log(`📈 Performance: ${JSON.stringify(performanceResponse.data.data, null, 2)}\n`);

        console.log('🎉 All agent tests passed successfully!');
        console.log('\n📋 Summary:');
        console.log(`- Created ${agentsResponse.data.data.length} agents`);
        console.log('- All agent types tested (Insights, Manage, Make, Market, Integration)');
        console.log('- Training system working');
        console.log('- Execution system working');
        console.log('- Performance tracking working');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testAgentSystem(); 