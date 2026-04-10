# Mini CRM Backend - System Architecture & Design

This project is a backend system for a Client Lead Management System (Mini CRM) built with **Node.js (Express)** and **MongoDB**. Focus is on scalability, security, and clean business logic.

## 🎯 1. High-Level Architecture

### Overall Structure
- **Client:** Public contact forms and an Admin Dashboard.
- **Backend:** Express.js REST API.
- **Database:** MongoDB for flexible lead data.

### Request Flow
1. **Lead Capture:** Public POST request to `/api/v1/leads/public`.
2. **Validation:** Manual checks in the controller layer (no external libraries like Zod).
3. **Database:** Lead stored as `NEW`.
4. **Admin Access:** Login via JWT to manage leads.

---

## 🗄️ 2. Database Design (MongoDB)

### Collections:

#### `Users` (Admin Auth)
- `firstName`, `lastName`: String
- `email`: String (Unique, Indexed)
- `password`: String (Hashed)
- `createdAt`: Date

#### `Leads` (Core Data)
- `name`: String
- `email`: String (Indexed)
- `phone`: String
- `status`: String [NEW, CONTACTED, QUALIFIED, CONVERTED, LOST] (Indexed)
- `source`: String (e.g., \"Website\")
- `createdAt`: Date (Indexed for sorting)

#### `Notes` (Follow-ups)
- `leadId`: ObjectId (Ref: Lead, Indexed)
- `adminId`: ObjectId (Ref: User)
- `content`: String
- `createdAt`: Date

#### `ActivityLogs` (Audit Trail)
- `leadId`: ObjectId
- `action`: String (e.g., \"Status Updated\")
- `details`: String
- `timestamp`: Date

---

## 🔐 3. Authentication & Security

- **JWT:** Admin access restricted using tokens.
- **Bcrypt:** Password hashing (salt factor 12).
- **Security Middleware:** CORS, Helmet, and Rate Limiting for the public form.

---

## ⚙️ 4. Backend Structure

```text
src/
 ├── config/         # Database connection
 ├── controllers/    # Request handling & Manual validation
 ├── services/       # Core business logic
 ├── models/         # Mongoose schemas
 ├── routes/         # API path definitions
 ├── middleware/     # Auth and Error handling
 └── app.js          # Entry point
```

---

## 🔄 5. Business Logic & Filtering

- **Manual Validation:** Every field checked with `if (!field) ...` logic before processing.
- **Filtering:** Supports querying by `status` and `dateRange`.
- **Search:** Case-insensitive search on `name` or `email` using MongoDB `$regex`.
- **Pagination:** Uses `limit` and `page` query parameters.

---

## 📊 6. Analytics Logic

Using MongoDB Aggregation:
- **Total Leads:** Count by grouping.
- **Conversion Rate:** (Converted Leads / Total Leads) * 100.
- **Trends:** Lead counts grouped by day/month for charts.

---

## 🔗 7. API Design

| Method | Route | Description |
| :--- | :--- | :--- |
| **POST** | `/api/v1/auth/login` | Admin login |
| **POST** | `/api/v1/leads/public` | Contact form submission |
| **GET** | `/api/v1/leads` | List leads (Protected) |
| **GET** | `/api/v1/leads/:id` | Single lead detail |
| **PATCH** | `/api/v1/leads/:id` | Update lead status |
| **POST** | `/api/v1/leads/:id/notes` | Add a note to a lead |
| **GET** | `/api/v1/analytics` | Dashboard stats |

---

## 🎯 Verification Plan

### Automated Tests
- Integration tests for public and private endpoints.

### Manual Verification
1. Submit a form via Postman.
2. Log in as admin and verify the lead appears.
3. Change status and verify the activity log.
