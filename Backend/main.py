from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr
from enum import Enum
from datetime import date
import os

# ==============================
# LOAD ENV VARIABLES
# ==============================

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    raise ValueError("MONGO_URL not found in .env file")

# ==============================
# APP INIT
# ==============================

app = FastAPI(title="HRMS Lite API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# DATABASE CONNECTION
# ==============================

client = MongoClient(MONGO_URL)
db = client["hrms_db"]

employees_collection = db["employees"]
attendance_collection = db["attendance"]

# ==============================
# MODELS
# ==============================

class Employee(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str


class StatusEnum(str, Enum):
    Present = "Present"
    Absent = "Absent"


class Attendance(BaseModel):
    employee_id: str
    date: date
    status: StatusEnum


# ==============================
# ROOT
# ==============================

@app.get("/")
def root():
    return {"message": "HRMS Backend Running Successfully"}


# ==============================
# EMPLOYEE APIs
# ==============================

@app.post("/employees")
def add_employee(employee: Employee):

    existing = employees_collection.find_one({"employee_id": employee.employee_id})
    if existing:
        raise HTTPException(status_code=400, detail="Employee ID already exists")

    employees_collection.insert_one(employee.dict())

    return {"message": "Employee added successfully"}


@app.get("/employees")
def get_employees():
    employees = list(employees_collection.find({}, {"_id": 0}))
    return employees


@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: str):

    result = employees_collection.delete_one({"employee_id": employee_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")

    return {"message": "Employee deleted successfully"}


# ==============================
# ATTENDANCE APIs
# ==============================

@app.post("/attendance")
def mark_attendance(attendance: Attendance):

    # Check if employee exists
    employee = employees_collection.find_one({"employee_id": attendance.employee_id})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Prevent duplicate attendance for same date
    existing = attendance_collection.find_one({
        "employee_id": attendance.employee_id,
        "date": str(attendance.date)
    })

    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for this date")

    attendance_collection.insert_one({
        "employee_id": attendance.employee_id,
        "date": str(attendance.date),
        "status": attendance.status
    })

    return {"message": "Attendance marked successfully"}


@app.get("/attendance/{employee_id}")
def get_attendance(employee_id: str):

    records = list(attendance_collection.find(
        {"employee_id": employee_id},
        {"_id": 0}
    ))

    if not records:
        raise HTTPException(status_code=404, detail="No attendance records found")

    return records


# ==============================
# BONUS: DASHBOARD SUMMARY
# ==============================

@app.get("/dashboard")
def dashboard_summary():

    total_employees = employees_collection.count_documents({})
    total_attendance = attendance_collection.count_documents({})

    total_present = attendance_collection.count_documents({"status": "Present"})
    total_absent = attendance_collection.count_documents({"status": "Absent"})

    return {
        "total_employees": total_employees,
        "total_attendance_records": total_attendance,
        "total_present": total_present,
        "total_absent": total_absent
    }
