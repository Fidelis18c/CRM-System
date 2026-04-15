# Mini CRM API Documentation

Welcome to the Mini CRM API documentation. This API provides endpoints for authentication and lead management.

## Base URL
`http://localhost:5000/api/v1`

---

## Authentication

Most administrative routes require a Bearer Token. To access these routes, include the following header in your requests:

`Authorization: Bearer <your_token>`

---

## 1. Authentication Endpoints

### Register User
Create a new admin account.

- **URL:** `/auth/register`
- **Method:** `POST`
- **Auth required:** No
- **Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "token": "JWT_TOKEN_HERE",
  "data": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

### Login User
Authenticate an existing admin.

- **URL:** `/auth/login`
- **Method:** `POST`
- **Auth required:** No
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Success Response (200):**
```json
{
  "success": true,
  "token": "JWT_TOKEN_HERE",
  "data": { ... user object ... }
}
```

---

## 2. Lead Management Endpoints

### Create Public Lead
Capture a lead from a public contact form.

- **URL:** `/leads/public`
- **Method:** `POST`
- **Auth required:** No
- **Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "message": "I am interested in your services.",
  "source": "Website" 
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "data": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "message": "I am interested in your services.",
    "status": "NEW",
    "source": "Website",
    "_id": "lead_id",
    "createdAt": "..."
  }
}
```

### Get All Leads
Fetch lead list with pagination and filtering.

- **URL:** `/leads`
- **Method:** `GET`
- **Auth required:** Yes (Admin)
- **Query Parameters:**
  - `search` (string): Search by name or email.
  - `sort` (string): Options include `newest` (default), `oldest`, `name`, `status`.
  - `status` (string): Filter by status (e.g., `NEW`, or comma-separated `NEW,CONTACTED`).
  - `page` (number): Page number (default: 1).
  - `limit` (number): Number of items per page (default: 10).
- **Success Response (200):**
```json
{
  "success": true,
  "count": 1,
  "page": 1,
  "data": [
    {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "status": "NEW",
      ...
    }
  ]
}
```

### Get Analytics
Get lead conversion statistics for the dashboard.

- **URL:** `/leads/analytics`
- **Method:** `GET`
- **Auth required:** Yes (Admin)
- **Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalLeads": 150,
    "convertedLeads": 40,
    "conversionRate": "26.67",
    "statusCounts": [
      { "_id": "NEW", "count": 45 },
      { "_id": "CONTACTED", "count": 30 },
      ...
    ],
    "dailyLeads": [
      { "_id": "2024-04-06", "count": 5 },
      { "_id": "2024-04-07", "count": 8 },
      ...
    ]
  }
}
```

### Update Lead Status
Change the status of a specific lead.

- **URL:** `/leads/:id/status`
- **Method:** `PATCH`
- **Auth required:** Yes (Admin)
- **Request Body:**
```json
{
  "status": "QUALIFIED" 
}
```
- **Allowed Statuses:** `NEW`, `CONTACTED`, `QUALIFIED`, `CONVERTED`, `LOST`
- **Success Response (200):**
```json
{
  "success": true,
  "data": { ... updated lead object ... }
}
```

### Add Lead Note
Add a follow-up note to a lead.

- **URL:** `/leads/:id/notes`
- **Method:** `POST`
- **Auth required:** Yes (Admin)
- **Request Body:**
```json
{
  "content": "Called the customer, they are interested in a demo next week."
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "data": {
    "lead": "lead_id",
    "user": "admin_id",
    "content": "...",
    "_id": "note_id"
  }
}
```

### Get Single Lead Details
Fetch the full lead profile along with its notes and activity logs.

- **URL:** `/leads/:id`
- **Method:** `GET`
- **Auth required:** Yes (Admin)
- **Success Response (200):**
```json
{
  "success": true,
  "data": {
    "lead": { ... },
    "notes": [ ... ],
    "activities": [ ... ]
  }
}
```

### Get Lead Notes
Fetch only notes belonging to a specific lead.

- **URL:** `/leads/:id/notes`
- **Method:** `GET`
- **Auth required:** Yes (Admin)
- **Success Response (200):**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "content": "...", "adminId": { "name": "...", "email": "..." } }
  ]
}
```

### Get Lead Activities
Fetch activity logs for a specific lead.

- **URL:** `/leads/:id/activities`
- **Method:** `GET`
- **Auth required:** Yes (Admin)
- **Success Response (200):**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "action": "STATUS_UPDATED", "details": "...", "timestamp": "..." }
  ]
}
```
