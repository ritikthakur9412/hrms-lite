// redeploy trigger 1

import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://hrms-backend-s8gc.onrender.com"; //URL

function App() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  const [attendanceForm, setAttendanceForm] = useState({
    employee_id: "",
    date: "",
    status: "Present",
  });

  // =============================
  // LOAD EMPLOYEES
  // =============================
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/employees`);
      setEmployees(res.data);
    } catch {
      setEmployees([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // =============================
  // ADD EMPLOYEE
  // =============================
  const addEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/employees`, form);
      fetchEmployees();
      setForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });
      alert("Employee Added!");
    } catch (err) {
      alert(err.response?.data?.detail || "Error adding employee");
    }
  };

  // =============================
  // DELETE EMPLOYEE
  // =============================
  const deleteEmployee = async (id) => {
    await axios.delete(`${API}/employees/${id}`);
    fetchEmployees();
  };

  // =============================
  // MARK ATTENDANCE
  // =============================
  const markAttendance = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/attendance`, attendanceForm);
      alert("Attendance Marked!");
    } catch (err) {
      alert(err.response?.data?.detail || "Error marking attendance");
    }
  };

  // =============================
  // VIEW ATTENDANCE
  // =============================
  const viewAttendance = async (id) => {
    try {
      const res = await axios.get(`${API}/attendance/${id}`);
      setAttendance(res.data);
      setSelectedEmployee(id);
    } catch {
      alert("No attendance found");
      setAttendance([]);
    }
  };

  return (
    <div className="container">
      <h1>HRMS Lite</h1>

      {/* ================= ADD EMPLOYEE ================= */}
      <div className="card">
        <h2>Add Employee</h2>
        <form onSubmit={addEmployee}>
          <input
            placeholder="Employee ID"
            value={form.employee_id}
            onChange={(e) =>
              setForm({ ...form, employee_id: e.target.value })
            }
            required
          />
          <input
            placeholder="Full Name"
            value={form.full_name}
            onChange={(e) =>
              setForm({ ...form, full_name: e.target.value })
            }
            required
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />
          <input
            placeholder="Department"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
            required
          />
          <button type="submit">Add</button>
        </form>
      </div>

      {/* ================= EMPLOYEE LIST ================= */}
      <div className="card">
        <h2>Employees</h2>
        {employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <ul>
            {employees.map((emp) => (
              <li key={emp.employee_id}>
                <strong>{emp.full_name}</strong> ({emp.department})
                <div>
                  <button onClick={() => deleteEmployee(emp.employee_id)}>
                    Delete
                  </button>
                  <button onClick={() => viewAttendance(emp.employee_id)}>
                    View Attendance
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ================= MARK ATTENDANCE ================= */}
      <div className="card">
        <h2>Mark Attendance</h2>
        <form onSubmit={markAttendance}>
          <input
            placeholder="Employee ID"
            value={attendanceForm.employee_id}
            onChange={(e) =>
              setAttendanceForm({
                ...attendanceForm,
                employee_id: e.target.value,
              })
            }
            required
          />
          <input
            type="date"
            value={attendanceForm.date}
            onChange={(e) =>
              setAttendanceForm({
                ...attendanceForm,
                date: e.target.value,
              })
            }
            required
          />
          <select
            value={attendanceForm.status}
            onChange={(e) =>
              setAttendanceForm({
                ...attendanceForm,
                status: e.target.value,
              })
            }
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
          <button type="submit">Mark</button>
        </form>
      </div>

      {/* ================= ATTENDANCE LIST ================= */}
      {selectedEmployee && (
        <div className="card">
          <h2>Attendance for {selectedEmployee}</h2>
          {attendance.length === 0 ? (
            <p>No records.</p>
          ) : (
            <ul>
              {attendance.map((rec, index) => (
                <li key={index}>
                  {rec.date} - {rec.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
