# AgroVision

AgroVision is a full-stack crop disease detection platform with a React frontend, a Node.js/Express backend, and a Python AI inference service.

## Features

- Google login and registration
- Email/password authentication
- Forgot password and reset password flow
- Account deletion
- Crop disease prediction using an AI service
- Registration, login, and login alert email notifications

## Tech Stack

- Frontend: React, Vite, React Router, React Hook Form, Zod, Tailwind CSS
- Backend: Node.js, Express, MongoDB, JWT, Nodemailer, Google Auth Library
- AI Service: Python, FastAPI/Flask-style inference service, TensorFlow model

## Project Structure

```text
AgroVision/
├── client/        # React frontend
├── server/        # Express API and AI integration
├── .env.example   # Example environment variables
└── README.md
```

## Prerequisites

- Node.js 18+ recommended
- Python 3.10+ for the AI service
- MongoDB connection string
- Google OAuth client credentials
- SMTP credentials for email notifications

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Dhruv-Andhariya/Agro_Vision.git
cd Agro_Vision
```

### 2. Configure environment variables

Use the values from [`.env.example`](.env.example) to create these files:

- `server/.env`
- `client/.env`

Do not commit the real env files.

### 3. Install dependencies

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ..\server
npm install
```

## Environment Variables

### Server `server/.env`

- `PORT` - backend port, usually `5000`
- `MONGO_URI` - MongoDB connection string
- `AI_SERVICE_URL` - URL of the Python prediction service
- `JWT_SECRET` - secret for signing auth tokens
- `GOOGLE_CLIENT_ID` - Google OAuth client ID used by the backend
- `EMAIL_HOST` - SMTP host
- `EMAIL_PORT` - SMTP port
- `EMAIL_SECURE` - `true` for SSL, `false` for STARTTLS
- `EMAIL_USER` - sender email address
- `EMAIL_PASS` - SMTP/app password
- `EMAIL_FROM` - sender name and email
- `CLIENT_URL` - frontend URL used in reset links

### Client `client/.env`

- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID used by the frontend

## Run the App

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

By default the frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

## AI Service

The Python AI service lives in `server/ai-service`. Run it separately if needed for predictions.

## Notes

- Do not commit real `.env` files.
- Use an app password for SMTP if you are using Gmail or a Workspace account.
- If email notifications do not arrive, check SMTP configuration and spam folders.

## License

No license has been added yet.
