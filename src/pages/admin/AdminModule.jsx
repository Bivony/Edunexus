/* =========================================================
   ADMIN DASHBOARD
========================================================= */

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthSystem";

const API = "https://bivonys.alwaysdata.net/api";

export function AdminDashboard() {

  const { user } = useAuth();

  const [stats, setStats] = useState({
    users: 0,
    subjects: 0,
    assignments: 0,
    materials: 0,
    products: 0,
    attendance: 0
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    try {

      const usersRes =
        await axios
          .get(`${API}/users`)
          .catch(() => ({
            data:{ data:[] }
          }));

      const subjectsRes =
        await axios
          .get(`${API}/subjects`)
          .catch(() => ({
            data:{ data:[] }
          }));

      const assignmentsRes =
        await axios
          .get(`${API}/assignments`)
          .catch(() => ({
            data:{ data:[] }
          }));

      const materialsRes =
        await axios
          .get(`${API}/materials`)
          .catch(() => ({
            data:{ data:[] }
          }));

      const productsRes =
        await axios
          .get(`${API}/products`)
          .catch(() => ({
            data:{ data:[] }
          }));

      const attendanceRes =
        await axios
          .get(`${API}/attendance`)
          .catch(() => ({
            data:{ data:[] }
          }));

      setStats({

        users:
          usersRes.data.data.length,

        subjects:
          subjectsRes.data.data.length,

        assignments:
          assignmentsRes.data.data.length,

        materials:
          materialsRes.data.data.length,

        products:
          productsRes.data.data.length,

        attendance:
          attendanceRes.data.data.length

      });

    } catch (err) {

      console.log(err);

    }
  };

  const logout = () => {

    localStorage.removeItem("user");

    window.location.href = "/login";

  };

  return (

    <div className="dashboard-page">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <div className="topbar">

        <div>

          <h1>
            bivonys
          </h1>

          <p>
            ADMIN DASHBOARD
          </p>

        </div>

        <div className="topbar-right">

          <div className="admin-user">

            <h3>
              {user?.name}
            </h3>

            <p>
              admin
            </p>

          </div>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>

      {/* =====================================================
          WELCOME
      ===================================================== */}

      <div className="welcome-card">

        <h2>
          Welcome back {user?.name} 👋
        </h2>

        <p>
          Manage your entire bivonys system here.
        </p>

      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="stats-grid">

        <div className="stat-card blue">

          <h2>
            {stats.users}
          </h2>

          <p>
            Total Users
          </p>

        </div>

        <div className="stat-card green">

          <h2>
            {stats.subjects}
          </h2>

          <p>
            Subjects
          </p>

        </div>

        <div className="stat-card orange">

          <h2>
            {stats.assignments}
          </h2>

          <p>
            Assignments
          </p>

        </div>

        <div className="stat-card purple">

          <h2>
            {stats.materials}
          </h2>

          <p>
            Materials
          </p>

        </div>

        <div className="stat-card red">

          <h2>
            {stats.products}
          </h2>

          <p>
            Marketplace
          </p>

        </div>

        <div className="stat-card dark">

          <h2>
            {stats.attendance}
          </h2>

          <p>
            Attendance Records
          </p>

        </div>

      </div>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <div className="quick-actions">

        <button
          className="primary-btn"
          onClick={() =>
            window.location.href =
            "/dashboard/admin/users"
          }
        >
          Manage Users
        </button>

        <button
          className="primary-btn"
          onClick={() =>
            window.location.href =
            "/dashboard/admin/subjects"
          }
        >
          Manage Subjects
        </button>

        <button
          className="primary-btn"
          onClick={() =>
            window.location.href =
            "/dashboard/admin/assignments"
          }
        >
          Manage Assignments
        </button>

        <button
          className="primary-btn"
          onClick={() =>
            window.location.href =
            "/dashboard/admin/materials"
          }
        >
          Manage Materials
        </button>

      </div>

    </div>
  );
}
/* =========================================================
   USERS ADMIN
========================================================= */
export function UsersAdmin() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  // =====================================================
  // FETCH USERS
  // =====================================================
  const fetchUsers = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `${API}/users`
      );

      setUsers(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

      alert("Failed to load users");

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // DELETE USER
  // =====================================================
  const deleteUser = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this user?"
    );

    if (!confirmDelete) return;

    try {

      const res = await axios.delete(
        `${API}/users/${id}`
      );

      alert(
        res.data.message ||
        "User deleted"
      );

      fetchUsers();

    } catch (err) {

      console.log(err);

      alert(
        err?.response?.data?.message ||
        "Failed to delete user"
      );

    }
  };

  // =====================================================
  // CHANGE ROLE
  // =====================================================
  const changeRole = async (
    id,
    role
  ) => {

    try {

      const res = await axios.put(
        `${API}/users/${id}/role`,
        {
          role: role
        }
      );

      alert(
        res.data.message ||
        "Role updated"
      );

      fetchUsers();

    } catch (err) {

      console.log(err);

      console.log(
        err?.response?.data
      );

      alert(
        err?.response?.data?.message ||
        "Failed to update role"
      );

    }
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {

    return (
      <div className="module-page">
        <p>Loading users...</p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================
  return (

    <div className="module-page">

      <div className="module-header">

        <h2>
          Users Management
        </h2>

      </div>

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>Name</th>

              <th>Email</th>

              <th>Phone</th>

              <th>Role</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {users.length > 0 ? (

              users.map((u) => (

                <tr key={u.id}>

                  <td>
                    {u.name}
                  </td>

                  <td>
                    {u.email}
                  </td>

                  <td>
                    {u.phone || "-"}
                  </td>

                  <td>

                    <span>
                      {u.role}
                    </span>

                  </td>

                  <td>

                    {/* MAKE TEACHER */}
                    <button
                      className="primary-btn"
                      onClick={() =>
                        changeRole(
                          u.id,
                          "teacher"
                        )
                      }
                      disabled={
                        u.role === "teacher"
                      }
                    >
                      Make Teacher
                    </button>

                    {/* MAKE STUDENT */}
                    <button
                      className="view-btn"
                      style={{
                        marginLeft: "10px"
                      }}
                      onClick={() =>
                        changeRole(
                          u.id,
                          "student"
                        )
                      }
                      disabled={
                        u.role === "student"
                      }
                    >
                      Make Student
                    </button>

                    {/* MAKE PARENT */}
                    <button
                      className="view-btn"
                      style={{
                        marginLeft: "10px"
                      }}
                      onClick={() =>
                        changeRole(
                          u.id,
                          "parent"
                        )
                      }
                      disabled={
                        u.role === "parent"
                      }
                    >
                      Make Parent
                    </button>

                    {/* DELETE */}
                    <button
                      className="delete-btn"
                      style={{
                        marginLeft: "10px"
                      }}
                      onClick={() =>
                        deleteUser(
                          u.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "20px"
                  }}
                >
                  No users found
                </td>

              </tr>

            )}

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

  const [subjects, setSubjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  // =====================================================
  // FETCH SUBJECTS
  // =====================================================
  const fetchSubjects = async () => {

    try {

      setLoading(true);

      const res =
        await axios.get(
          `${API}/subjects`
        );

      console.log(
        res.data.data
      );

      setSubjects(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

      alert(
        "Failed to load subjects"
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // DELETE SUBJECT
  // =====================================================
  const deleteSubject = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this subject?"
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${API}/subjects/${id}`
      );

      fetchSubjects();

      alert(
        "Subject deleted"
      );

    } catch (err) {

      console.log(err);

      alert(
        "Failed to delete subject"
      );

    }
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {

    return (
      <div className="module-page">
        <p>Loading subjects...</p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================
  return (

    <div className="module-page">

      <div className="module-header">

        <h2>
          Subjects Management
        </h2>

      </div>

      <div className="card-grid">

        {subjects.length > 0 ? (

          subjects.map((s) => (

            <div
              className="subject-card"
              key={s.id}
            >

              <h3>
                {s.subject_name}
              </h3>

              <p>
                <strong>
                  Class ID:
                </strong>{" "}
                {s.class_id}
              </p>

              <p>
                <strong>
                  Teacher:
                </strong>{" "}
                {
                  s.teacher_name ||
                  "Unknown"
                }
              </p>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteSubject(
                    s.id
                  )
                }
              >
                Delete
              </button>

            </div>

          ))

        ) : (

          <p>
            No subjects found
          </p>

        )}

      </div>

    </div>
  );
}
/* =========================================================
   ASSIGNMENTS ADMIN
========================================================= */
export function AssignmentsAdmin() {

  const [assignments, setAssignments] =
    useState([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {

    try {

      const res =
        await axios.get(
          `${API}/assignments`
        );

      setAssignments(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

      alert(
        "Failed to load assignments"
      );

    }
  };

  const deleteAssignment =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this assignment?"
        );

      if (!confirmDelete) return;

      try {

        await axios.delete(
          `${API}/assignments/${id}`
        );

        fetchAssignments();

        alert(
          "Assignment deleted"
        );

      } catch (err) {

        console.log(err);

        alert(
          "Failed to delete assignment"
        );

      }
    };

  return (

    <div className="module-page">

      <div className="module-header">

        <h2>
          Assignments Management
        </h2>

      </div>

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>
                Subject
              </th>

              <th>
                Title
              </th>

              <th>
                Description
              </th>

              <th>
                Due Date
              </th>

              <th>
                Teacher
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {assignments.length > 0 ? (

              assignments.map((a) => (

                <tr key={a.assignment_id}>

                  <td>
                    {a.subject_name || "-"}
                  </td>

                  <td>
                    {a.title}
                  </td>

                  <td>
                    {a.description}
                  </td>

                  <td>
                    {a.due_date}
                  </td>

                  <td>
                    {a.teacher_name || "Unknown"}
                  </td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteAssignment(
                          a.assignment_id
                        )
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  style={{
                    textAlign: "center"
                  }}
                >
                  No assignments found
                </td>

              </tr>

            )}

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

  const [materials, setMaterials] =
    useState([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {

    try {

      const res =
        await axios.get(
          `${API}/materials`
        );

      setMaterials(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

      alert(
        "Failed to load materials"
      );

    }
  };

  const deleteMaterial =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this material?"
        );

      if (!confirmDelete) return;

      try {

        await axios.delete(
          `${API}/materials/${id}`
        );

        fetchMaterials();

        alert(
          "Material deleted"
        );

      } catch (err) {

        console.log(err);

        alert(
          "Failed to delete material"
        );

      }
    };

  return (

    <div className="module-page">

      <div className="module-header">

        <h2>
          Materials Management
        </h2>

      </div>

      <div className="materials-grid">

        {materials.length > 0 ? (

          materials.map((m) => (

            <div
              className="material-card"
              key={m.material_id}
            >

              <div className="material-icon">
                📘
              </div>

              <h3>
                {m.title}
              </h3>

              <p>
                <strong>
                  Subject:
                </strong>{" "}
                {m.subject_name || "-"}
              </p>

              <p>
                <strong>
                  Uploaded By:
                </strong>{" "}
                {m.teacher_name || "Unknown"}
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  window.open(
                    `https://bivonys.alwaysdata.net/uploads/${m.file_path}`,
                    "_blank"
                  )
                }
              >
                Open
              </button>

              <button
                className="delete-btn"
                style={{
                  marginTop: "10px"
                }}
                onClick={() =>
                  deleteMaterial(
                    m.material_id
                  )
                }
              >
                Delete
              </button>

            </div>

          ))

        ) : (

          <p>
            No materials found
          </p>

        )}

      </div>

    </div>
  );
}

/* =========================================================
   GRADES ADMIN
========================================================= */
export function GradesAdmin() {

  const [grades, setGrades] =
    useState([]);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {

    try {

      const res =
        await axios.get(
          `${API}/grades`
        );

      setGrades(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

      alert(
        "Failed to load grades"
      );

    }
  };

  return (

    <div className="module-page">

      <div className="module-header">

        <h2>
          Grades Management
        </h2>

      </div>

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>
                Student
              </th>

              <th>
                Assignment
              </th>

              <th>
                Marks
              </th>

              <th>
                Feedback
              </th>

              <th>
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {grades.length > 0 ? (

              grades.map((g) => (

                <tr key={g.grade_id}>

                  <td>
                    {g.student_name || g.student_id}
                  </td>

                  <td>
                    {g.assignment_title || "-"}
                  </td>

                  <td>
                    {g.marks}
                  </td>

                  <td>
                    {g.feedback || "-"}
                  </td>

                  <td>

                    {g.marks >= 50
                      ? "Passed"
                      : "Failed"}

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="5"
                  style={{
                    textAlign: "center"
                  }}
                >
                  No grades found
                </td>

              </tr>

            )}

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

  const [attendance, setAttendance] =
    useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/attendance`
          );

        setAttendance(
          res.data.data || []
        );

      } catch (err) {

        console.log(err);

        alert(
          "Failed to load attendance"
        );

      }
    };

  return (

    <div className="module-page">

      <div className="module-header">

        <h2>
          Attendance Management
        </h2>

      </div>

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>
                Student
              </th>

              <th>
                Subject
              </th>

              <th>
                Status
              </th>

              <th>
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {attendance.length > 0 ? (

              attendance.map((a) => (

                <tr key={a.attendance_id}>

                  <td>
                    {a.student_name || a.student_id}
                  </td>

                  <td>
                    {a.subject_name || "-"}
                  </td>

                  <td>
                    {a.status}
                  </td>

                  <td>
                    {a.created_at || "-"}
                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="4"
                  style={{
                    textAlign: "center"
                  }}
                >
                  No attendance records
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

/* =========================================================
   ONLINE CLASSES ADMIN
========================================================= */
export function OnlineClassesAdmin() {

  return (

    <div className="module-page center-page">

      <h2>
        Online Classes
      </h2>

      <button
        className="primary-btn"
        onClick={() =>
          window.open(
            "https://meet.google.com",
            "_blank"
          )
        }
      >
        Open Google Meet
      </button>

    </div>
  );
}

/* =========================================================
   CHAT ADMIN
========================================================= */
export function ChatAdmin() {

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const sendMessage = () => {

    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        text: message
      }
    ]);

    setMessage("");
  };

  return (

    <div className="chat-layout">

      <div className="chat-box">

        <div className="messages">

          {messages.map((m, index) => (

            <div
              key={index}
              className="message right"
            >
              {m.text}
            </div>

          ))}

        </div>

        <div className="chat-input">

          <input
            type="text"
            placeholder="Type message..."
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
          />

          <button
            className="primary-btn"
            onClick={sendMessage}
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   NOTIFICATIONS ADMIN
========================================================= */
export function NotificationAdmin() {

  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/notifications`
          );

        setNotifications(
          res.data.data || []
        );

      } catch (err) {

        console.log(err);

      }
    };

  return (

    <div className="module-page">

      <h2>
        Notifications
      </h2>

      {notifications.length > 0 ? (

        notifications.map((n) => (

          <div
            key={n.notification_id}
            className="notification-card"
          >
            {n.message}
          </div>

        ))

      ) : (

        <p>
          No notifications found
        </p>

      )}

    </div>
  );
}

/* =========================================================
   MARKETPLACE ADMIN
========================================================= */
export function MarketplaceAdmin() {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {

    try {

      setLoading(true);

      const res =
        await axios.get(
          `${API}/products`
        );

      setProducts(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

      alert(
        "Failed to load products"
      );

    } finally {

      setLoading(false);

    }
  };

  const deleteProduct =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this product?"
        );

      if (!confirmDelete)
        return;

      try {

        await axios.delete(
          `${API}/products/${id}`
        );

        alert(
          "Product deleted"
        );

        fetchProducts();

      } catch (err) {

        console.log(err);

        alert(
          "Failed to delete product"
        );
      }
    };

  if (loading) {

    return (

      <div className="module-page">

        <p>
          Loading products...
        </p>

      </div>
    );
  }

  return (

    <div className="module-page">

      <div className="module-header">

        <h2>
          Marketplace
        </h2>

      </div>

      <div className="market-grid">

        {products.length > 0 ? (

          products.map((p) => (

            <div
              className="market-card"
              key={p.id}
            >

              <img
                src={`https://bivonys.alwaysdata.net/uploads/${p.image}`}
                alt={p.name}
                className="market-image"
              />

              <div className="card-body">

                <h3>
                  {p.name}
                </h3>

                <p>
                  {p.description}
                </p>

                <h2>
                  KES {p.price}
                </h2>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteProduct(
                      p.id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))

        ) : (

          <p>
            No products found
          </p>

        )}

      </div>

    </div>
  );
}

/* =========================================================
   PROFILE
========================================================= */
export function Profile() {

  const {
    user,
    setUser
  } = useAuth();

  const [form, setForm] =
    useState({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || ""
    });

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState(
      user?.profile_image
        ? `https://bivonys.alwaysdata.net/uploads/${user.profile_image}`
        : ""
    );

  const [loading, setLoading] =
    useState(false);

  const handleImageChange =
    (e) => {

      const file =
        e.target.files[0];

      if (file) {

        setImage(file);

        setPreview(
          URL.createObjectURL(file)
        );
      }
    };

  const updateProfile =
    async () => {

      try {

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "name",
          form.name
        );

        formData.append(
          "email",
          form.email
        );

        formData.append(
          "phone",
          form.phone
        );

        formData.append(
          "bio",
          form.bio
        );

        if (image) {

          formData.append(
            "image",
            image
          );
        }

        const res =
          await axios.put(
            `${API}/profile/${user?.id}`,
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data"
              }
            }
          );

        setUser(
          res.data.data
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            res.data.data
          )
        );

        alert(
          "Profile updated"
        );

      } catch (err) {

        console.log(err);

        alert(
          "Failed to update profile"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="module-page">

      <div className="page-header">

        <h1>
          Profile
        </h1>

      </div>

      <div className="profile-card">

        <div className="profile-top">

          {preview ? (

            <img
              src={preview}
              alt="Profile"
              className="profile-image"
            />

          ) : (

            <div className="empty-profile">

              Upload Image

            </div>

          )}

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImageChange
            }
          />

        </div>

        <div className="profile-form">

          <input
            type="text"
            value={form.name}
            placeholder="Name"
            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target.value
              })
            }
          />

          <input
            type="email"
            value={form.email}
            placeholder="Email"
            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target.value
              })
            }
          />

          <input
            type="text"
            value={form.phone}
            placeholder="Phone"
            onChange={(e) =>
              setForm({
                ...form,
                phone:
                  e.target.value
              })
            }
          />

          <textarea
            value={form.bio}
            placeholder="Bio"
            onChange={(e) =>
              setForm({
                ...form,
                bio:
                  e.target.value
              })
            }
          />

          <button
            className="primary-btn"
            onClick={
              updateProfile
            }
            disabled={loading}
          >

            {loading
              ? "Saving..."
              : "Save Profile"}

          </button>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   SETTINGS
========================================================= */
export function Settings() {

  const {
    user
  } = useAuth();

  const [theme, setTheme] =
    useState(
      user?.theme || "light"
    );

  useEffect(() => {

    document.body.className =
      theme;

  }, [theme]);

  const saveSettings =
    async () => {

      try {

        await axios.put(
          `${API}/settings/${user?.id}`,
          { theme }
        );

        alert(
          "Settings saved"
        );

      } catch (err) {

        console.log(err);

        alert(
          "Failed to save settings"
        );
      }
    };

  return (

    <div className="module-page">

      <div className="page-header">

        <h1>
          Settings
        </h1>

      </div>

      <div className="settings-card">

        <div className="settings-section">

          <label>
            Select Theme
          </label>

          <select
            value={theme}
            onChange={(e) =>
              setTheme(
                e.target.value
              )
            }
          >

            <option value="light">
              Light Mode
            </option>

            <option value="dark">
              Dark Mode
            </option>

          </select>

        </div>

        <button
          className="primary-btn"
          onClick={saveSettings}
        >

          Save Settings

        </button>

      </div>

    </div>
  );
}