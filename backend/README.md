# Appointment Flow Hub Backend

A Node.js backend server for the Appointment Flow Hub application, using Express and MySQL.

## Features

- Authentication and authorization with JWT
- MySQL database integration using Sequelize ORM
- Rate limiting to prevent API abuse
- Appointment management (create, cancel, complete, etc.)
- Medical records management
- User management (patients and doctors)

## Prerequisites

- Node.js (v14 or later)
- MySQL (v5.7 or later)
- npm or yarn

## Installation

1. Clone the repository or navigate to the backend directory

2. Install dependencies
```
npm install
```

3. Create a MySQL database for the application
```sql
CREATE DATABASE appointment_hub;
```

4. Configure environment variables
   - Copy `.env.example` to `.env`
   - Modify the values in `.env` to match your environment

## Database Setup

The application will automatically create the necessary tables when started for the first time, thanks to Sequelize's `sync` feature.

## Running the Server

### Development Mode

```
npm run dev
```

This will start the server with nodemon, which automatically restarts the server when changes are detected.

### Production Mode

```
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup/patient` - Patient registration
- `POST /api/auth/signup/doctor` - Doctor registration
- `GET /api/auth/profile` - Get user profile (requires authentication)

### Appointments

- `GET /api/appointments` - Get user's appointments
- `POST /api/appointments` - Create a new appointment (patient only)
- `POST /api/appointments/cancel/:appointmentId` - Cancel an appointment
- `POST /api/appointments/complete/:appointmentId` - Mark appointment as completed (doctor only)
- `POST /api/appointments/:appointmentId/prescription` - Add prescription to appointment (doctor only)
- `GET /api/appointments/doctors` - Get all doctors (patient only)

### Medical Records

- `GET /api/medical-records/patient/:patientId` - Get patient's medical records
- `GET /api/medical-records/:recordId` - Get a specific medical record
- `POST /api/medical-records` - Add a new medical record (doctor only)
- `PUT /api/medical-records/:recordId` - Update a medical record (doctor only)

## Integration with Frontend

To connect your frontend application to this backend, update your API service to point to the backend server URL (e.g., http://localhost:5000/api).

## Security

The application implements several security measures:
- JWT for authentication
- CORS protection
- Helmet for HTTP headers security
- Rate limiting to prevent abuse
- Password hashing with bcrypt

## License

ISC 