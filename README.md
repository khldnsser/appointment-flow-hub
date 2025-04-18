# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/2bccc8c7-658a-4e52-96e7-08a6eb685140

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2bccc8c7-658a-4e52-96e7-08a6eb685140) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2bccc8c7-658a-4e52-96e7-08a6eb685140) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## MySQL Backend Integration

This application now includes a MySQL backend server for production use. The backend provides:

- Authentication and authorization with JWT tokens
- MySQL database for data persistence
- Rate limiting to prevent API abuse
- RESTful API endpoints for all application features

### Setting up the Backend

1. Make sure you have MySQL installed and running on your system.

2. Create a database for the application:
```sql
CREATE DATABASE appointment_hub;
```

3. Navigate to the backend directory:
```
cd backend
```

4. Install dependencies:
```
npm install
```

5. Configure environment variables in the `.env` file (already created with default values).

6. Start the backend server:
```
npm run dev
```

7. The server will be running at http://localhost:5000

### API Endpoints

The backend provides the following API endpoints:

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup/patient` - Patient registration
- `POST /api/auth/signup/doctor` - Doctor registration
- `GET /api/auth/profile` - Get user profile

#### Appointments
- `GET /api/appointments` - Get user's appointments
- `POST /api/appointments` - Create a new appointment
- `POST /api/appointments/cancel/:appointmentId` - Cancel an appointment
- `POST /api/appointments/complete/:appointmentId` - Mark appointment as completed
- `POST /api/appointments/:appointmentId/prescription` - Add prescription to appointment
- `GET /api/appointments/doctors` - Get all doctors

#### Medical Records
- `GET /api/medical-records/patient/:patientId` - Get patient's medical records
- `GET /api/medical-records/:recordId` - Get a specific medical record
- `POST /api/medical-records` - Add a new medical record
- `PUT /api/medical-records/:recordId` - Update a medical record
