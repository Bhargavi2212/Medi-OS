# HealthOS API Documentation

## Overview
HealthOS is an AI-powered healthcare platform with five specialized agents providing comprehensive healthcare management capabilities.

## Base URL
```
http://localhost:3000
```

## Authentication
All endpoints require JWT authentication except `/health` and `/api`.

## Health Check
```
GET /health
```
Returns system status and available agents.

## API Endpoints

### 1. Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /register` - User registration
- `POST /logout` - User logout
- `GET /profile` - Get user profile

### 2. Hospitals (`/api/hospitals`)
- `GET /` - Get all hospitals
- `GET /:id` - Get hospital by ID
- `POST /` - Create new hospital
- `PUT /:id` - Update hospital
- `DELETE /:id` - Delete hospital

### 3. ManageAgent (`/api/manage-agent`)
**Healthcare Operations Management**

#### Patient Management
- `POST /patients/create` - Create patient record
- `GET /patients/:id` - Get patient details
- `PUT /patients/:id` - Update patient record
- `DELETE /patients/:id` - Delete patient record
- `GET /patients/search` - Search patients

#### Appointment Management
- `POST /appointments/create` - Create appointment
- `GET /appointments/:id` - Get appointment details
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment
- `GET /appointments/schedule` - Get schedule

#### Resource Management
- `GET /resources/inventory` - Get inventory status
- `POST /resources/allocate` - Allocate resources
- `GET /resources/utilization` - Get utilization metrics

#### Staff Management
- `GET /staff/schedule` - Get staff schedule
- `POST /staff/assign` - Assign staff
- `GET /staff/availability` - Check availability

### 4. InsightsAgent (`/api/insights-agent`)
**Healthcare Analytics & Business Intelligence**

#### Analytics Overview
- `GET /analytics/overview` - Get analytics overview
- `GET /analytics/trends` - Get trend analysis
- `GET /analytics/performance` - Get performance metrics
- `GET /analytics/predictions` - Get predictive insights

#### Report Generation
- `POST /reports/generate` - Generate custom report
- `GET /reports/:reportId` - Get specific report
- `GET /reports` - Get all reports

#### Data Analysis
- `POST /analyze/patient-data` - Analyze patient data
- `POST /analyze/hospital-performance` - Analyze hospital performance
- `POST /analyze/clinical-outcomes` - Analyze clinical outcomes

#### Dashboard Data
- `GET /dashboard/summary` - Get dashboard summary
- `GET /dashboard/charts` - Get dashboard charts
- `GET /dashboard/kpis` - Get dashboard KPIs

#### Custom Analytics
- `POST /custom-analysis` - Perform custom analysis
- `GET /insights/recommendations` - Get recommendations

### 5. IntegrationAgent (`/api/integration-agent`)
**Healthcare System Integration**

#### System Integration
- `POST /connect/system` - Connect to external system
- `GET /connections` - Get all connections
- `DELETE /connections/:connectionId` - Disconnect system

#### Data Synchronization
- `POST /sync/data` - Sync data between systems
- `GET /sync/status/:syncId` - Get sync status
- `GET /sync/history` - Get sync history

#### API Management
- `POST /apis/register` - Register new API
- `GET /apis` - Get registered APIs
- `PUT /apis/:apiId` - Update API configuration
- `DELETE /apis/:apiId` - Delete API

#### Data Transformation
- `POST /transform/data` - Transform data format
- `POST /transform/mapping` - Create data mapping
- `GET /transform/mappings` - Get data mappings

#### Workflow Integration
- `POST /workflows/create` - Create integration workflow
- `GET /workflows` - Get all workflows
- `PUT /workflows/:workflowId` - Update workflow
- `DELETE /workflows/:workflowId` - Delete workflow

#### Monitoring & Health
- `GET /health/connections` - Check connection health
- `GET /health/systems` - Get system health
- `POST /health/test` - Test connection

#### Error Handling
- `GET /logs/errors` - Get error logs
- `GET /logs/sync` - Get sync logs
- `POST /logs/clear` - Clear logs

### 6. MarketAgent (`/api/market-agent`)
**Healthcare Market Analysis & Business Intelligence**

#### Market Analysis
- `GET /analysis/overview` - Get market overview
- `GET /analysis/trends` - Get market trends
- `GET /analysis/competitors` - Get competitor analysis
- `GET /analysis/opportunities` - Get market opportunities

#### Business Intelligence
- `GET /bi/dashboard` - Get BI dashboard
- `GET /bi/reports` - Get BI reports
- `POST /bi/generate-report` - Generate BI report

#### Competitive Intelligence
- `GET /competitive/analysis` - Get competitive analysis
- `GET /competitive/benchmarking` - Get competitive benchmarking
- `GET /competitive/monitoring` - Get competitive monitoring

#### Market Research
- `POST /research/conduct` - Conduct market research
- `GET /research/studies` - Get market studies
- `GET /research/insights` - Get research insights

#### Strategic Planning
- `POST /strategy/develop` - Develop strategy
- `GET /strategy/recommendations` - Get strategic recommendations
- `POST /strategy/validate` - Validate strategy

#### Performance Metrics
- `GET /metrics/roi` - Get ROI metrics
- `GET /metrics/growth` - Get growth metrics
- `GET /metrics/efficiency` - Get efficiency metrics

#### Market Forecasting
- `POST /forecast/generate` - Generate forecast
- `GET /forecast/models` - Get forecast models
- `GET /forecast/accuracy` - Get forecast accuracy

#### Customer Analysis
- `GET /customers/segmentation` - Get customer segmentation
- `GET /customers/behavior` - Get customer behavior
- `GET /customers/satisfaction` - Get customer satisfaction

### 7. MakeAgent (`/api/make-agent`)
**AI Scribe & Medical Records Processing**

#### Speech Recognition
- `POST /speech/transcribe` - Transcribe speech to text
- `POST /speech/process-audio` - Process audio files
- `GET /speech/transcriptions` - Get transcriptions

#### Medical Records Processing
- `POST /records/process` - Process medical records
- `POST /records/extract` - Extract medical data
- `GET /records/processed` - Get processed records

#### Document Processing
- `POST /documents/analyze` - Analyze documents
- `POST /documents/summarize` - Summarize documents
- `POST /documents/classify` - Classify documents

#### Named Entity Recognition
- `POST /ner/extract` - Extract medical entities
- `POST /ner/validate` - Validate extracted entities
- `GET /ner/entities` - Get extracted entities

#### Medical Text Processing
- `POST /text/process` - Process medical text
- `POST /text/validate` - Validate medical text
- `POST /text/summarize` - Summarize medical text

#### Quality Assurance
- `POST /qa/validate` - Validate medical records
- `GET /qa/quality-metrics` - Get quality metrics
- `POST /qa/improve` - Improve record quality

#### Workflow Management
- `POST /workflow/start` - Start processing workflow
- `GET /workflow/status/:workflowId` - Get workflow status
- `POST /workflow/complete` - Complete workflow

#### Batch Processing
- `POST /batch/process` - Process batch of records
- `GET /batch/status/:batchId` - Get batch status
- `GET /batch/results/:batchId` - Get batch results

#### Model Management
- `GET /models/status` - Get model status
- `POST /models/retrain` - Retrain models
- `GET /models/performance` - Get model performance

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": {...},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Format
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting
- 100 requests per minute per user
- 1000 requests per hour per user

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error 