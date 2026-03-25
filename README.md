# Whatbytes API Documentation

This is a Node.js Express API for managing users, patients, doctors, and their mappings. It uses **MongoDB** with **Mongoose** ODM for database operations.

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation & Setup

1. **Install Dependencies**

    ```bash
    npm install
    ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:

    ```
    PORT=3000
    JWT_SECRET=your_jwt_secret_key
    ```

3. **Ensure MongoDB is Running**

    ```bash
    mongod
    ```

4. **Start the Server**

    ```bash
    # Development mode with nodemon
    npm run dev

    # Production mode
    node server.js
    ```

## Database Schema

The application uses the following MongoDB collections:

- **Users**: Stores user information with hashed passwords
- **Patients**: Patient records linked to users
- **Doctors**: Doctor information linked to users
- **Mappings**: Relationships between patients and doctors

## Authentication

Most routes require authentication via JWT token. The token is sent in cookies after successful login. Tokens expire after 1 hour.

## API Routes

### Authentication Routes (`/api/auth`)

- **POST /api/auth/register**
    - Description: Register a new user
    - Body: `{ "name": "string", "email": "string", "password": "string" }`
    - Response: User object

- **POST /api/auth/login**
    - Description: Login user
    - Body: `{ "email": "string", "password": "string" }`
    - Response: `{ "message": "login successful", "token": "jwt_token" }`

### Patient Routes (`/api/patients`)

_Requires authentication_

- **POST /api/patients**
    - Description: Create a new patient
    - Body: `{ "name": "string", "age": number, "disease": "string" }`
    - Response: Patient object

- **GET /api/patients**
    - Description: Get all patients for the authenticated user
    - Response: `{ "count": number, "data": [patients] }`

- **PUT /api/patients/:id**
    - Description: Update a patient
    - Body: `{ "name": "string", "age": number, "disease": "string" }`
    - Response: Updated patient object

- **DELETE /api/patients/:id**
    - Description: Delete a patient
    - Response: `{ "message": "patient deleted successfully" }`

### Doctor Routes (`/api/doctors`)

- **POST /api/doctors**
    - Description: Create a new doctor (requires auth)
    - Body: `{ "name": "string", "specialization": "string", "experience": number }`
    - Response: Doctor object

- **GET /api/doctors**
    - Description: Get all doctors (no auth required)
    - Response: `{ "count": number, "data": [doctors] }`

- **GET /api/doctors/:id**
    - Description: Get a specific doctor by ID (no auth required)
    - Response: Doctor object

- **PUT /api/doctors/:id**
    - Description: Update a doctor (requires auth)
    - Body: `{ "name": "string", "specialization": "string", "experience": number }`
    - Response: Updated doctor object

- **DELETE /api/doctors/:id**
    - Description: Delete a doctor (requires auth)
    - Response: `{ "message": "doctor deleted successfully" }`

### Mapping Routes (`/api/mappings`)

- **POST /api/mappings**
    - Description: Assign a doctor to a patient (requires auth)
    - Body: `{ "patient_id": "mongodb_id", "doctor_id": "mongodb_id" }`
    - Response: Mapping object

- **GET /api/mappings**
    - Description: Get all mappings with patient and doctor details (no auth required)
    - Response: `{ "count": number, "data": [mappings] }`

- **GET /api/mappings/:patient_id**
    - Description: Get doctors assigned to a specific patient (no auth required)
    - Response: `{ "count": number, "data": [doctor details] }`

- **DELETE /api/mappings/:id**
    - Description: Unassign a doctor from a patient (requires auth)
    - Response: `{ "message": "doctor unassigned from patient successfully" }`

## Error Responses

- 400: Bad Request (validation errors)
- 401: Unauthorized (missing/invalid token)
- 404: Not Found
- 500: Internal Server Error

## Project Structure

```
whatbytes/
├── config/
│   └── db.js              # MongoDB connection configuration
├── middleware/
│   └── authMiddleware.js  # JWT authentication middleware
├── models/
│   ├── user.js            # User schema
│   ├── patient.js         # Patient schema
│   ├── doctor.js          # Doctor schema
│   ├── mapping.js         # Mapping schema
│   └── index.js           # Model exports
├── routes/
│   ├── userRoutes.js      # Authentication routes
│   ├── patientRoutes.js   # Patient CRUD routes
│   ├── doctorRoutes.js    # Doctor CRUD routes
│   └── mappingRoutes.js   # Mapping routes
├── server.js              # Main application file
├── .env                   # Environment variables
└── package.json           # Project dependencies
```

## Key Features

- **User Authentication**: Register and login with JWT tokens
- **Password Security**: Passwords are hashed using bcrypt
- **MongoDB Integration**: Uses Mongoose ODM for clean data modeling
- **Error Handling**: Comprehensive error responses
- **Validation**: Input validation on all routes

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Development**: nodemon
