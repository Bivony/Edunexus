// src/layouts/DashboardLayout.jsx

import {
  Link,
  Outlet,
  useLocation
} from "react-router-dom";

import { useAuth } from "../auth/AuthSystem";

export default function DashboardLayout() {

  return (
    <div className="layout">

      <Sidebar />

      <div className="main">

        <Topbar />

        <div className="content">
          <Outlet />
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar() {

  const { user } = useAuth();

  const location = useLocation();

  const role = user?.role;

  /* ================= TEACHER ================= */

  const teacherLinks = [
    ["Dashboard", "/dashboard/teacher"],
    ["Subjects", "/dashboard/teacher/subjects"],
    ["Assignments", "/dashboard/teacher/assignments"],
    ["Materials", "/dashboard/teacher/materials"],
    ["Grades", "/dashboard/teacher/grades"],
    ["Attendance", "/dashboard/teacher/attendance"],
    ["Online Classes", "/dashboard/teacher/classes"],
    ["Chat", "/dashboard/teacher/chat"],
    ["Notifications", "/dashboard/teacher/notifications"],
    ["Marketplace", "/dashboard/teacher/marketplace"],
    ["Profile", "/dashboard/teacher/profile"],
    ["Settings", "/dashboard/teacher/settings"]
  ];

  /* ================= STUDENT ================= */

  const studentLinks = [
    ["Dashboard", "/dashboard/student"],
    ["Subjects", "/dashboard/student/subjects"],
    ["Assignments", "/dashboard/student/assignments"],
    ["Materials", "/dashboard/student/materials"],
    ["Grades", "/dashboard/student/grades"],
    ["Attendance", "/dashboard/student/attendance"],
    ["Online Classes", "/dashboard/student/classes"],
    ["Chat", "/dashboard/student/chat"],
    ["Notifications", "/dashboard/student/notifications"],
    ["Marketplace", "/dashboard/student/marketplace"],
    ["Profile", "/dashboard/student/profile"],
    ["Settings", "/dashboard/student/settings"]
  ];

  /* ================= PARENT ================= */

  const parentLinks = [
  ["Dashboard", "/dashboard/parent"],
  ["Children", "/dashboard/parent/children"],
  ["Attendance", "/dashboard/parent/attendance"],
  ["Grades", "/dashboard/parent/grades"],
  ["Marketplace", "/dashboard/parent/marketplace"],
  ["Profile", "/dashboard/parent/profile"],
  ["Settings", "/dashboard/parent/settings"]
];

  /* ================= ADMIN ================= */

  const adminLinks = [
    ["Dashboard", "/dashboard/admin"],
    ["Users", "/dashboard/admin/users"],
    ["Subjects", "/dashboard/admin/subjects"],
    ["Assignments", "/dashboard/admin/assignments"],
    ["Materials", "/dashboard/admin/materials"],
    ["Grades", "/dashboard/admin/grades"],
    ["Attendance", "/dashboard/admin/attendance"],
    ["Online Classes", "/dashboard/admin/classes"],
    ["Chat", "/dashboard/admin/chat"],
    ["Notifications", "/dashboard/admin/notifications"],
    ["Marketplace", "/dashboard/admin/marketplace"],
    ["Profile", "/dashboard/admin/profile"],
    ["Settings", "/dashboard/admin/settings"]
  ];

  let links = [];

  if (role === "teacher") {
    links = teacherLinks;
  }

  if (role === "student") {
    links = studentLinks;
  }

  if (role === "parent") {
    links = parentLinks;
  }

  if (role === "admin") {
    links = adminLinks;
  }

  return (
    <div className="sidebar">

      <h2>bivonys</h2>

      {links.map((item, index) => (

        <Link
          key={index}
          to={item[1]}
          style={{
            display: "block",
            padding: "12px 15px",
            marginBottom: "10px",
            borderRadius: "12px",
            textDecoration: "none",
            color: "white",
            fontWeight: "500",
            transition: "0.3s",
            background:
              location.pathname === item[1]
                ? "rgba(255,255,255,0.2)"
                : "transparent"
          }}
        >
          {item[0]}
        </Link>

      ))}

    </div>
  );
}

/* =========================================================
   TOPBAR
========================================================= */

function Topbar() {

  const { user, logout } = useAuth();

  return (
    <div className="topbar">

      <h2>
  {user?.role?.toUpperCase()} DASHBOARD
</h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px"
        }}
      >

        <span>
          {user?.name} ({user?.role})
        </span>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}