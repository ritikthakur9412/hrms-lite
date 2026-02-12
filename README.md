# HRMS Lite

## Project Overview

HRMS Lite is a simple web-based Human Resource Management System built as part of a full-stack assessment.

The goal of this project was to create a lightweight system where an admin can:

- Add and manage employees
- Track daily attendance
- View attendance records

The focus was on building a clean, stable, and fully deployed application with proper validations and error handling.

---

## Live Application

Frontend:
https://hrms-lite-hazel.vercel.app

Backend:
(Add your Render backend URL here)

---

## Tech Stack Used

Frontend:
- React (Create React App)
- Axios for API calls
- Basic CSS for styling

Backend:
- FastAPI (Python)
- SQLAlchemy
- Pydantic for validation

Database:
- PostgreSQL

Deployment:
- Frontend deployed on Vercel
- Backend deployed on Render

---

## Features Implemented

### Employee Management
- Add new employee
- View all employees
- Delete employee
- Prevent duplicate Employee IDs
- Email format validation

### Attendance Management
- Mark attendance (Present / Absent)
- Select date
- View attendance history for each employee

---

## Validations & Error Handling

- Required fields validation
- Email format validation
- Duplicate employee check
- Proper HTTP status codes
- Meaningful error messages
- Basic loading and empty states on frontend

---

## How to Run the Project Locally

### Backend

1. Navigate to backend folder
2. Install dependencies:
   pip install -r requirements.txt
3. Run:
   uvicorn main:app --reload

Backend will run on:
http://localhost:8000

---

### Frontend

1. Navigate to frontend folder
2. Install dependencies:
   npm install
3. Run:
   npm start

Frontend will run on:
http://localhost:3000

---

## Assumptions

- Single admin user (no authentication required)
- Leave management and payroll are not included
- Attendance is marked manually per day

---

## Author

Ritik Kushwaha
