# Patient Registration System - HealthOS

## Overview

The Patient Registration System is the foundational component of HealthOS, designed to handle patient registration, management, and ABHA integration for Indian healthcare facilities.

## Features

### ✅ Core Patient Management
- **Patient Registration**: Complete patient profile creation with all required fields
- **Patient Search**: Search by name, contact number, or ABHA ID
- **Patient Updates**: Modify patient information with validation
- **Soft Delete**: Safe patient deletion with active appointment checks
- **Pagination**: Efficient data loading with pagination support

### ✅ ABHA Integration
- **Optional ABHA**: ABHA ID is optional during registration
- **ABHA Linking**: Link ABHA ID to existing patients
- **ABHA Search**: Find patients by ABHA ID
- **ABHA Status Tracking**: Track ABHA linkage status

### ✅ Hospital-Specific Management
- **Hospital Isolation**: Patients are scoped to specific hospitals
- **Hospital Statistics**: Patient counts and ABHA linkage rates
- **Multi-hospital Support**: Support for multiple hospital branches

### ✅ Data Validation
- **Indian Mobile Numbers**: Validates 10-digit Indian mobile numbers
- **Email Validation**: Proper email format validation
- **Date Validation**: YYYY-MM-DD format validation
- **Gender Validation**: Male/Female/Other options
- **Duplicate Prevention**: Prevents duplicate contact numbers within hospital

## Database Schema

### Patient Entity Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | ✅ | Primary key |
| `first_name` | string | ✅ | Patient's first name |
| `last_name` | string | ✅ | Patient's last name |
| `dob` | date | ✅ | Date of birth (YYYY-MM-DD) |
| `gender` | string | ✅ | male/female/other |
| `contact_number` | string | ✅ | 10-digit Indian mobile |
| `email` | string | ❌ | Email address |
| `address` | string | ❌ | Residential address |
| `blood_group` | string | ❌ | Blood group |
| `emergency_contact_name` | string | ❌ | Emergency contact name |
| `emergency_contact_relationship` | string | ❌ | Relationship to patient |
| `emergency_contact_phone` | string | ❌ | Emergency contact phone |
| `allergies` | string[] | ❌ | Array of allergies |
| `existing_conditions` | string[] | ❌ | Array of medical conditions |
| `abha_id` | string | ❌ | ABHA ID (optional) |
| `abha_linked` | boolean | ✅ | ABHA linkage status |
| `hospital_id` | number | ✅ | Associated hospital |
| `is_deleted` | boolean | ✅ | Soft delete flag |
| `deleted_at` | timestamp | ❌ | Deletion timestamp |
| `created_at` | timestamp | ✅ | Creation timestamp |
| `updated_at` | timestamp | ✅ | Last update timestamp |

## API Endpoints

### Patient Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/patients` | Create new patient | ✅ |
| `GET` | `/api/patients/hospital/:hospitalId` | Get patients by hospital | ✅ |
| `GET` | `/api/patients/:id` | Get patient by ID | ✅ |
| `PUT` | `/api/patients/:id` | Update patient | ✅ |
| `DELETE` | `/api/patients/:id` | Delete patient | ✅ |

### Search & Statistics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/patients/search/:hospitalId` | Search patients | ✅ |
| `GET` | `/api/patients/stats/:hospitalId` | Get patient statistics | ✅ |

### ABHA Integration

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/patients/abha/:abhaId` | Get patient by ABHA ID | ✅ |
| `POST` | `/api/patients/:id/link-abha` | Link ABHA ID to patient | ✅ |

## Request/Response Examples

### Create Patient

**Request:**
```json
POST /api/patients
{
  "first_name": "John",
  "last_name": "Doe",
  "dob": "1990-01-01",
  "gender": "male",
  "contact_number": "9876543210",
  "email": "john.doe@example.com",
  "address": "123 Main Street, City",
  "blood_group": "O+",
  "emergency_contact_name": "Jane Doe",
  "emergency_contact_relationship": "Spouse",
  "emergency_contact_phone": "9876543211",
  "allergies": ["Penicillin"],
  "existing_conditions": ["Hypertension"],
  "abha_id": "1234567890123456",
  "hospital_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Patient registered successfully",
  "patient": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "dob": "1990-01-01",
    "gender": "male",
    "contact_number": "9876543210",
    "email": "john.doe@example.com",
    "address": "123 Main Street, City",
    "blood_group": "O+",
    "emergency_contact_name": "Jane Doe",
    "emergency_contact_relationship": "Spouse",
    "emergency_contact_phone": "9876543211",
    "allergies": ["Penicillin"],
    "existing_conditions": ["Hypertension"],
    "abha_id": "1234567890123456",
    "abha_linked": true,
    "hospital": { "id": 1, "name": "Test Hospital" },
    "created_at": "2024-01-01T10:00:00.000Z",
    "updated_at": "2024-01-01T10:00:00.000Z"
  }
}
```

### Get Patients by Hospital

**Request:**
```json
GET /api/patients/hospital/1?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "patients": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Patient Statistics

**Request:**
```json
GET /api/patients/stats/1
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalPatients": 150,
    "abhaLinkedPatients": 120,
    "todayPatients": 5,
    "abhaLinkageRate": 80.0
  }
}
```

## Validation Rules

### Required Fields
- `first_name`: Non-empty string
- `last_name`: Non-empty string
- `dob`: YYYY-MM-DD format
- `gender`: "male", "female", or "other"
- `contact_number`: 10-digit Indian mobile number (6-9 starting)
- `hospital_id`: Valid hospital ID

### Optional Fields
- `email`: Valid email format
- `abha_id`: Any string (validated for uniqueness)
- `address`: Any string
- `blood_group`: Any string
- `emergency_contact_*`: Any strings
- `allergies`: Array of strings
- `existing_conditions`: Array of strings

### Business Rules
- Contact number must be unique within a hospital
- ABHA ID must be unique across all patients
- Cannot delete patients with active appointments
- Patients are soft-deleted (marked as deleted, not removed)

## Error Handling

### Common Error Responses

**Validation Error:**
```json
{
  "success": false,
  "message": "Contact number must be a valid 10-digit Indian mobile number"
}
```

**Duplicate Error:**
```json
{
  "success": false,
  "message": "Patient with this contact number already exists in this hospital"
}
```

**Not Found Error:**
```json
{
  "success": false,
  "message": "Patient not found"
}
```

**Business Rule Error:**
```json
{
  "success": false,
  "message": "Cannot delete patient with active appointments"
}
```

## Security

- All endpoints require authentication
- Hospital-scoped data access
- Input validation and sanitization
- SQL injection protection via TypeORM
- Soft delete for data integrity

## Performance

- Pagination for large datasets
- Indexed queries on frequently searched fields
- Efficient relationship loading
- Query optimization for search operations

## Testing

Run the test script to verify functionality:

```bash
npm run build
npx ts-node src/scripts/test-patient-api.ts
```

## Next Steps

1. **Frontend Integration**: Create patient registration forms
2. **Queue Management**: Integrate with ManageAgent for check-in
3. **Document Management**: Add patient document upload
4. **Appointment Integration**: Connect with appointment system
5. **ABHA API Integration**: Real ABHA API integration
6. **Analytics Dashboard**: Patient analytics and insights

## Architecture Integration

This patient system integrates with:

- **ManageAgent**: For queue and check-in management
- **MakeAgent**: For document digitization
- **InsightsAgent**: For patient analytics
- **IntegrationAgent**: For ABHA and other integrations

The system is designed to be the foundation for all patient-related workflows in HealthOS. 