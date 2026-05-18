// src/pages/admin/AdminModule.jsx    
    
import { useEffect, useState } from "react";    
import axios from "axios";    
    
const API = "https://bivonys.alwaysdata.net/api";    
    
/* =========================================================    
   ADMIN DASHBOARD    
========================================================= */    
export function AdminDashboard() {    
    
  const [stats, setStats] = useState({    
    users: 0,    
    teachers: 0,    
    students: 0,    
    revenue: 0    
  });    
    
  useEffect(() => {    
    loadDashboard();    
  }, []);    
    
  const loadDashboard = async () => {    
    
    try {    
    
      const subjects = await axios.get(`${API}/subjects`);    
      const products = await axios.get(`${API}/products`);    
    
      setStats({    
        users: 1240,    
        teachers: 64,    
        students: 1090,    
        revenue: products.data.data.length * 1200    
      });    
    
    } catch (err) {    
      console.log(err);    
    }    
  };    
    
  return (    
    <div className="dashboard-page">    
    
      <div className="page-header">    
    
        <div>    
          <h1>Admin Dashboard</h1>    
          <p>Manage the entire bivonys system 👑</p>    
        </div>    
    
        <button className="primary-btn">    
          + Add User    
        </button>    
    
      </div>    
    
      <div className="stats-grid">    
    
        <div className="stat-card blue">    
          <h2>{stats.users}</h2>    
          <p>Total Users</p>    
        </div>    
    
        <div className="stat-card green">    
          <h2>{stats.teachers}</h2>    
          <p>Teachers</p>    
        </div>    
    
        <div className="stat-card orange">    
          <h2>{stats.students}</h2>    
          <p>Students</p>    
        </div>    
    
        <div className="stat-card red">    
          <h2>KES {stats.revenue}</h2>    
          <p>Revenue</p>    
        </div>    
    
      </div>    
    
    </div>    
  );    
}    
    
/* =========================================================    
   USERS ADMIN    
========================================================= */    
export function UsersAdmin() {    
    
  const [users, setUsers] = useState([    
    {    
      id: 1,    
      name: "Ryan",    
      role: "Student",    
      email: "student@gmail.com"    
    },    
    {    
      id: 2,    
      name: "Mercy",    
      role: "Teacher",    
      email: "teacher@gmail.com"    
    }    
  ]);    
    
  return (    
    <div className="module-page">    
    
      <div className="module-header">    
    
        <h2>Manage Users</h2>    
    
        <button className="primary-btn">    
          + Add User    
        </button>    
    
      </div>    
    
      <div className="table-container">    
    
        <table>    
    
          <thead>    
    
            <tr>    
              <th>Name</th>    
              <th>Role</th>    
              <th>Email</th>    
              <th>Actions</th>    
            </tr>    
    
          </thead>    
    
          <tbody>    
    
            {users.map((user) => (    
    
              <tr key={user.id}>    
    
                <td>{user.name}</td>    
    
                <td>{user.role}</td>    
    
                <td>{user.email}</td>    
    
                <td>    
    
                  <button className="view-btn">    
                    Edit    
                  </button>    
    
                  <button className="delete-btn">    
                    Delete    
                  </button>    
    
                </td>    
    
              </tr>    
    
            ))}    
    
          </tbody>    
    
        </table>    
    
      </div>    
    
    </div>    
  );    
}    
    
/* =========================================================    
   SUBJECTS ADMIN    
========================================================= */    
export function SubjectsAdmin() {    
    
  const [subjects, setSubjects] = useState([]);    
    
  useEffect(() => {    
    fetchSubjects();    
  }, []);    
    
  const fetchSubjects = async () => {    
    
    try {    
    
      const res = await axios.get(`${API}/subjects`);    
      setSubjects(res.data.data || []);    
    
    } catch (err) {    
      console.log(err);    
    }    
  };    
    
  return (    
    <div className="module-page">    
    
      <div className="module-header">    
    
        <h2>Manage Subjects</h2>    
    
        <button className="primary-btn">    
          + Add Subject    
        </button>    
    
      </div>    
    
      <div className="card-grid">    
    
        {subjects.map((subject) => (    
    
          <div    
            className="subject-card"    
            key={subject.id}    
          >    
    
            <h3>{subject.subject_name}</h3>    
    
            <p>    
              Class ID: {subject.class_id}    
            </p>    
    
            <div className="card-actions">    
    
              <button className="view-btn">    
                Edit    
              </button>    
    
              <button className="delete-btn">    
                Delete    
              </button>    
    
            </div>    
    
          </div>    
    
        ))}    
    
      </div>    
    
    </div>    
  );    
}    
    
/* =========================================================    
   ASSIGNMENTS ADMIN    
========================================================= */    
export function AssignmentsAdmin() {    
    
  const [assignments, setAssignments] = useState([]);    
    
  useEffect(() => {    
    fetchAssignments();    
  }, []);    
    
  const fetchAssignments = async () => {    
    
    const res = await axios.get(`${API}/assignments`);    
    setAssignments(res.data.data || []);    
  };    
    
  return (    
    <div className="module-page">    
    
      <h2>Assignments</h2>    
    
      <div className="table-container">    
    
        <table>    
    
          <thead>    
    
            <tr>    
              <th>Title</th>    
              <th>Description</th>    
              <th>Due Date</th>    
            </tr>    
    
          </thead>    
    
          <tbody>    
    
            {assignments.map((assignment) => (    
    
              <tr key={assignment.id}>    
    
                <td>{assignment.title}</td>    
    
                <td>{assignment.description}</td>    
    
                <td>{assignment.due_date}</td>    
    
              </tr>    
    
            ))}    
    
          </tbody>    
    
        </table>    
    
      </div>    
    
    </div>    
  );    
}    
    
/* =========================================================    
   MATERIALS ADMIN    
========================================================= */    
export function MaterialsAdmin() {    
    
  const [materials, setMaterials] = useState([]);    
    
  useEffect(() => {    
    fetchMaterials();    
  }, []);    
    
  const fetchMaterials = async () => {    
    
    try {    
    
      const res = await axios.get(`${API}/materials`);    
      setMaterials(res.data.data || []);    
    
    } catch (err) {    
      console.log(err);    
    }    
  };    
    
  return (    
    <div className="module-page">    
    
      <h2>Materials</h2>    
    
      <div className="materials-grid">    
    
        {materials.map((material) => (    
    
          <div    
            className="material-card"    
            key={material.id}    
          >    
    
            <div className="material-icon">    
              📘    
            </div>    
    
            <h3>{material.title}</h3>    
    
            <button className="delete-btn">    
              Delete    
            </button>    
    
          </div>    
    
        ))}    
    
      </div>    
    
    </div>    
  );    
}    
    
/* =========================================================    
   GRADES ADMIN    
========================================================= */    
export function GradesAdmin() {    
    
  return (    
    <div className="module-page">    
    
      <h2>Grades Management</h2>    
    
      <div className="table-container">    
    
        <table>    
    
          <thead>    
    
            <tr>    
              <th>Student</th>    
              <th>Subject</th>    
              <th>Marks</th>    
            </tr>    
    
          </thead>    
    
          <tbody>    
    
            <tr>    
              <td>Ryan</td>    
              <td>Math</td>    
              <td>89%</td>    
            </tr>    
    
            <tr>    
              <td>Mercy</td>    
              <td>Physics</td>    
              <td>75%</td>    
            </tr>    
    
          </tbody>    
    
        </table>    
    
      </div>    
    
    </div>    
  );    
}    
    
/* =========================================================    
   ATTENDANCE ADMIN    
========================================================= */    
export function AttendanceAdmin() {    
    
  return (    
    <div className="module-page">    
    
      <h2>Attendance Analytics</h2>    
    
      <div className="attendance-summary">    
    
        <div className="attendance-box green">    
          <h2>95%</h2>    
          <p>Average Attendance</p>    
        </div>    
    
        <div className="attendance-box blue">    
          <h2>1340</h2>    
          <p>Total Attendances</p>    
        </div>    
    
      </div>    
    
    </div>    
  );    
}    
    
/* =========================================================    
   ONLINE CLASSES ADMIN    
========================================================= */    
export function OnlineClassesAdmin() {    
    
  return (    
    <div className="module-page">    
    
      <h2>Online Classes</h2>    
    
      <div className="live-class-card">    
    
        <h3>Current Live Session</h3>    
    
        <p>    
          Physics Live Class Running    
        </p>    
    
        <button className="primary-btn">    
          Monitor Class    
        </button>    
    
      </div>    
    
    </div>    
  );    
}    
    
/* =========================================================    
   CHAT ADMIN    
========================================================= */    
export function ChatAdmin() {    
    
  return (    
    <div className="chat-layout">    
    
      <div className="chat-sidebar">    
    
        <div className="chat-user active">    
          Teacher Group    
        </div>    
    
        <div className="chat-user">    
          Student Group    
        </div>    
    
      </div>    
    
      <div className="chat-box">    
    
        <div className="messages">    
    
          <div className="message left">    
            System updated successfully    
          </div>    
    
          <div className="message right">    
            Monitoring chats    
          </div>    
    
        </div>    
    
        <div className="chat-input">    
    
          <input    
            type="text"    
            placeholder="Send announcement..."    
          />    
    
          <button className="primary-btn">    
            Send    
          </button>    
    
        </div>    
    
      </div>    
    
    </div>    
  );    
}    
    
/* =========================================================    
   NOTIFICATION ADMIN    
========================================================= */    
export function NotificationAdmin() {    
    
  return (    
    <div className="module-page">    
    
      <div className="module-header">    
    
        <h2>System Notifications</h2>    
    
        <button className="primary-btn">    
          + Send Notification    
        </button>    
    
      </div>    
    
      <div className="notification-card">    
        New teacher registered    
      </div>    
    
      <div className="notification-card">    
        Marketplace order completed    
      </div>    
    
      <div className="notification-card">    
        Student uploaded assignment    
      </div>    
    
    </div>    
  );    
}    
    
/* =========================================================    
   MARKETPLACE ADMIN    
========================================================= */    
export function MarketplaceAdmin() {    
    
  const [products, setProducts] = useState([]);    
    
  useEffect(() => {    
    fetchProducts();    
  }, []);    
    
  const fetchProducts = async () => {    
    
    try {    
    
      const res = await axios.get(`${API}/products`);    
      setProducts(res.data.data || []);    
    
    } catch (err) {    
      console.log(err);    
    }    
  };    
    
  return (    
    <div className="module-page">    
    
      <div className="module-header">    
    
        <h2>Marketplace Management</h2>    
    
        <button className="primary-btn">    
          + Add Product    
        </button>    
    
      </div>    
    
      <div className="market-grid">    
    
        {products.map((product) => (    
    
          <div    
            className="market-card"    
            key={product.id}    
          >    
    
            <img    
              src={`https://bivonys.alwaysdata.net/uploads/${product.image}`}    
              alt=""    
            />    
    
            <h3>{product.name}</h3>    
    
            <p>    
              {product.description}    
            </p>    
    
            <h2>    
              KES {product.price}    
            </h2>    
    
            <div className="card-actions">    
    
              <button className="view-btn">    
                Edit    
              </button>    
    
              <button className="delete-btn">    
                Delete    
              </button>    
    
            </div>    
    
          </div>    
    
        ))}    
    
      </div>    
    
    </div>    
  );    
}    
    
/* =========================================================    
   PROFILE    
========================================================= */    
export function Profile() {    
    
  return (    
    <div className="profile-card">    
    
      <img    
        src="https://i.pravatar.cc/150?img=60"    
        alt=""    
      />    
    
      <h2>Admin User</h2>    
    
      <p>System Administrator</p>    
    
      <table>    
    
        <tbody>    
    
          <tr>    
            <td>Email</td>    
            <td>admin@gmail.com</td>    
          </tr>    
    
          <tr>    
            <td>Phone</td>    
            <td>0712345678</td>    
          </tr>    
    
        </tbody>    
    
      </table>    
    
    </div>    
  );    
}    
    
/* =========================================================    
   SETTINGS    
========================================================= */    
export function Settings() {    
    
  return (    
    <div className="module-page">    
    
      <h2>System Settings</h2>    
    
      <div className="setting-item">    
    
        <div>    
          <h4>Maintenance Mode</h4>    
          <p>Temporarily disable the system</p>    
        </div>    
    
        <input type="checkbox" />    
    
      </div>    
    
      <div className="setting-item">    
    
        <div>    
          <h4>Enable Notifications</h4>    
          <p>Allow global notifications</p>    
        </div>    
    
        <input type="checkbox" />    
    
      </div>    
    
    </div>    
  );    
}