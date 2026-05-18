// src/pages/student/StudentModule.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthSystem";

const API = "https://bivonys.alwaysdata.net/api";
/* =========================================================
   DASHBOARD
========================================================= */
export function StudentDashboard() {

  const { user } = useAuth();

  const [stats, setStats] = useState({
    subjects: 0,
    assignments: 0,
    grades: 0,
    attendance: "0%"
  });

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================
  const loadDashboard = async () => {

    try {

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

      const gradesRes =
        await axios
          .get(`${API}/grades`)
          .catch(() => ({
            data:{ data:[] }
          }));

      const attendanceRes =
        await axios
          .get(`${API}/attendance`)
          .catch(() => ({
            data:{ data:[] }
          }));

      // =================================================
      // USER ID
      // =================================================
      const studentId =
        user?.id ||
        user?.user_id;

      // =================================================
      // FILTER GRADES
      // =================================================
      const grades =
        (gradesRes.data.data || []).filter(
          (g) =>
            String(g.student_id) ===
            String(studentId)
        );

      // =================================================
      // FILTER ATTENDANCE
      // =================================================
      const attendance =
        (attendanceRes.data.data || []).filter(
          (a) =>
            String(a.student_id) ===
            String(studentId)
        );

      // =================================================
      // CALCULATE ATTENDANCE
      // =================================================
      const present =
        attendance.filter(
          (a) =>
            a.status === "Present"
        ).length;

      const attendanceRate =
        attendance.length > 0
          ? Math.round(
              (present / attendance.length) * 100
            ) + "%"
          : "0%";

      // =================================================
      // UPDATE STATS
      // =================================================
      setStats({

        subjects:
          subjectsRes.data.data.length,

        assignments:
          assignmentsRes.data.data.length,

        grades:
          grades.length,

        attendance:
          attendanceRate

      });

    } catch (err) {

      console.log(
        "Dashboard Error:",
        err
      );

    }
  };

  // =====================================================
  // LOAD WHEN USER READY
  // =====================================================
  useEffect(() => {

    if (
      user?.id ||
      user?.user_id
    ) {

      loadDashboard();

    }

  }, [user]);

  // =====================================================
  // JOIN CLASS
  // =====================================================
  const joinClass = () => {

    window.open(
      "https://meet.google.com",
      "_blank"
    );

  };

  // =====================================================
  // UI
  // =====================================================
  return (

    <div className="dashboard-page">

      <div className="page-header">

        <div>

          <h1>
            STUDENT DASHBOARD
          </h1>

          <p>
            Welcome back {user?.name} 👋
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={joinClass}
        >
          Join Class
        </button>

      </div>

      <div className="stats-grid">

        <div className="stat-card blue">

          <h2>
            {stats.subjects}
          </h2>

          <p>
            Subjects
          </p>

        </div>

        <div className="stat-card green">

          <h2>
            {stats.assignments}
          </h2>

          <p>
            Assignments
          </p>

        </div>

        <div className="stat-card orange">

          <h2>
            {stats.grades}
          </h2>

          <p>
            Grades
          </p>

        </div>

        <div className="stat-card red">

          <h2>
            {stats.attendance}
          </h2>

          <p>
            Attendance
          </p>

        </div>

      </div>

    </div>

  );
}

/* =========================================================
   STUDENT SUBJECTS
========================================================= */
export function Subjects() {

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
  // OPEN SUBJECT
  // =====================================================
  const openSubject = (
    subject
  ) => {

    alert(
      `Opening ${subject.subject_name}`
    );

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
          My Subjects
        </h2>

      </div>

      <div className="card-grid">

        {subjects.length > 0 ? (

          subjects.map((subject) => (

            <div
              className="subject-card"
              key={subject.id}
            >

              <h3>
                {subject.subject_name}
              </h3>

              <p>
                <strong>
                  Class ID:
                </strong>{" "}
                {subject.class_id}
              </p>

              <p>
                <strong>
                  Teacher:
                </strong>{" "}
                {
                  subject.teacher_name ||
                  "Unknown"
                }
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  openSubject(
                    subject
                  )
                }
              >
                Open Subject
              </button>

            </div>

          ))

        ) : (

          <p>
            No subjects available
          </p>

        )}

      </div>

    </div>
  );
}

/* =========================================================
   ASSIGNMENTS
========================================================= */
export function Assignments() {

  const { user } = useAuth();

  const [assignments, setAssignments] =
    useState([]);

  const [selectedFile, setSelectedFile] =
    useState({});

  useEffect(() => {
    fetchAssignments();
  }, []);

  // =====================================================
  // FETCH ASSIGNMENTS
  // =====================================================
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

  // =====================================================
  // SUBMIT ASSIGNMENT
  // =====================================================
  const submitAssignment = async (
    assignmentId
  ) => {

    const file =
      selectedFile[assignmentId];

    if (!file) {

      alert(
        "Select file first"
      );

      return;

    }

    try {

      const formData =
        new FormData();

      formData.append(
        "assignment_id",
        assignmentId
      );

      formData.append(
        "student_id",
        user?.id ||
        user?.user_id
      );

      formData.append(
        "file",
        file
      );

      const res =
        await axios.post(
          `${API}/submissions`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        );

      alert(
        res.data.message ||
        "Assignment submitted"
      );

    } catch (err) {

      console.log(err);

      alert(
        err?.response?.data?.message ||
        "Failed to submit assignment"
      );

    }
  };

  return (

    <div className="module-page">

      <div className="module-header">

        <h2>
          Assignments
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
                Upload
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {assignments.length > 0 ? (

              assignments.map((a) => (

                <tr key={a.id}>

                  <td>
                    {
                      a.subject_name ||
                      "-"
                    }
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

                    <input
                      type="file"
                      onChange={(e) =>
                        setSelectedFile({
                          ...selectedFile,
                          [a.id]:
                            e.target.files[0]
                        })
                      }
                    />

                  </td>

                  <td>

                    <button
                      className="primary-btn"
                      onClick={() =>
                        submitAssignment(
                          a.id
                        )
                      }
                    >
                      Submit
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
                  No assignments available
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
   MATERIALS
========================================================= */
export function Materials() {

  const [materials, setMaterials] =
    useState([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  // =====================================================
  // FETCH MATERIALS
  // =====================================================
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

  // =====================================================
  // DOWNLOAD MATERIAL
  // =====================================================
  const downloadMaterial = (
    filePath
  ) => {

    window.open(
      `https://bivonys.alwaysdata.net/uploads/${filePath}`,
      "_blank"
    );

  };

  return (

    <div className="module-page">

      <div className="module-header">

        <h2>
          Materials
        </h2>

      </div>

      <div className="card-grid">

        {materials.length > 0 ? (

          materials.map((material) => (

            <div
              className="subject-card"
              key={material.id}
            >

              <h3>
                {material.title}
              </h3>

              <p>

                <strong>
                  Subject:
                </strong>{" "}

                {
                  material.subject_name ||
                  "-"
                }

              </p>

              <p>

                <strong>
                  Uploaded By:
                </strong>{" "}

                {
                  material.teacher_name ||
                  "Unknown"
                }

              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  downloadMaterial(
                    material.file_path
                  )
                }
              >
                Download
              </button>

            </div>

          ))

        ) : (

          <p>
            No materials available
          </p>

        )}

      </div>

    </div>

  );
}

/* =========================================================
   GRADES
========================================================= */
export function Grades() {

  const { user } = useAuth();

  const [grades, setGrades] =
    useState([]);

  useEffect(() => {
    fetchGrades();
  }, []);

  // =====================================================
  // FETCH GRADES
  // =====================================================
  const fetchGrades = async () => {

    try {

      const res =
        await axios.get(
          `${API}/grades`
        );

      const myGrades =
        (res.data.data || []).filter(
          (g) =>
            g.student_id ==
            (
              user?.id ||
              user?.user_id
            )
        );

      setGrades(myGrades);

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
          Grades
        </h2>

      </div>

      <div className="table-container">

        <table>

          <thead>

            <tr>

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

              grades.map((grade) => (

                <tr key={grade.id}>

                  <td>
                    {
                      grade.assignment_title ||
                      "-"
                    }
                  </td>

                  <td>
                    {grade.marks}
                  </td>

                  <td>
                    {
                      grade.feedback ||
                      "-"
                    }
                  </td>

                  <td>

                    {grade.marks >= 50
                      ? "Passed"
                      : "Failed"}

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
                  No grades available
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
   ATTENDANCE
========================================================= */
export function Attendance() {

  const { user } = useAuth();

  const [attendance, setAttendance] =
    useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  // =====================================================
  // FETCH ATTENDANCE
  // =====================================================
  const fetchAttendance = async () => {

    try {

      const res =
        await axios.get(
          `${API}/attendance`
        );

      const myAttendance =
        (res.data.data || []).filter(
          (a) =>
            a.student_id ==
            (
              user?.id ||
              user?.user_id
            )
        );

      setAttendance(
        myAttendance
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
          Attendance
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

                <tr key={a.id}>

                  <td>
                    {
                      a.subject_name ||
                      "-"
                    }
                  </td>

                  <td>
                    {a.status}
                  </td>

                  <td>
                    {
                      a.created_at ||
                      "-"
                    }
                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="3"
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
   ONLINE CLASSES
========================================================= */
export function OnlineClasses() {

  const { user } = useAuth();

  const [className, setClassName] =
    useState("");

  const [message, setMessage] =
    useState("");

  const joinClass = async () => {

    if (!className) {
      setMessage("Enter class name");
      return;
    }

    try {

      const res = await axios.post(
        `${API}/classes/join`,
        {
          class_name: className,
          student_id: user.id
        }
      );

      setMessage(
        res.data.message
      );

      setClassName("");

    } catch (err) {

      console.log(err);

      setMessage(
        "Failed to join class"
      );
    }
  };

  return (
    <div className="module-page center-page">

      <h2>
        Online Classes
      </h2>

      {/* GOOGLE MEET */}
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

      {/* JOIN CLASS */}
      <div
        style={{
          marginTop: "40px",
          width: "100%",
          maxWidth: "400px"
        }}
      >

        <h3>
          Join Class
        </h3>

        <input
          type="text"
          placeholder="Enter class name"
          value={className}
          onChange={(e) =>
            setClassName(
              e.target.value
            )
          }
          className="form-input"
        />

        <button
          className="primary-btn"
          style={{
            marginTop: "15px",
            width: "100%"
          }}
          onClick={joinClass}
        >
          Join
        </button>

        {message && (

          <p
            style={{
              marginTop: "15px"
            }}
          >
            {message}
          </p>

        )}

      </div>

    </div>
  );
}
/* =========================================================
   CHAT
========================================================= */
export function Chat() {

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const sendMessage = () => {

    if (!message.trim()) {
      return;
    }

    setMessages([
      ...messages,
      {
        text: message,
        sender: "student"
      }
    ]);

    setMessage("");

  };

  return (

    <div className="chat-layout">

      <div className="chat-box">

        <div className="messages">

          {messages.length > 0 ? (

            messages.map((msg, index) => (

              <div
                key={index}
                className="message right"
              >
                {msg.text}
              </div>

            ))

          ) : (

            <p>
              No messages yet
            </p>

          )}

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
   NOTIFICATIONS
========================================================= */
export function NotificationsPage() {

  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {

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

      alert(
        "Failed to load notifications"
      );

    }
  };

  return (

    <div className="module-page">

      <div className="module-header">

        <h2>
          Notifications
        </h2>

      </div>

      {notifications.length > 0 ? (

        notifications.map((note) => (

          <div
            className="notification-card"
            key={note.id}
          >
            {note.message}
          </div>

        ))

      ) : (

        <p>
          No notifications available
        </p>

      )}

    </div>

  );
}

/* =========================================================
   MARKETPLACE
========================================================= */
export function Marketplace() {

  const { user } = useAuth();

  const [products, setProducts] =
    useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================
  const fetchProducts = async () => {

    try {

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

    }
  };

  // =====================================================
  // BUY PRODUCT
  // =====================================================
  const buyProduct = async (
    product
  ) => {

    const quantity =
      prompt(
        "Enter quantity"
      );

    if (!quantity) return;

    try {

      const res =
        await axios.post(
          `${API}/orders`,
          {
            product_id:
              product.id,

            buyer_id:
              user?.user_id,

            quantity:
              quantity
          }
        );

      alert(
        `Order placed successfully. Total: KES ${res.data.data.total_price}`
      );

    } catch (err) {

      console.log(err);

      alert(
        err?.response?.data?.message ||
        "Failed to place order"
      );

    }
  };

  // =====================================================
  // UI
  // =====================================================
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
                src={
                  p.image
                    ? `https://bivonys.alwaysdata.net/uploads/${p.image}`
                    : "/placeholder.png"
                }
                alt={p.name}
                className="market-image"
              />

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
                className="primary-btn"
                onClick={() =>
                  buyProduct(p)
                }
              >
                Buy Now
              </button>

            </div>

          ))

        ) : (

          <p>
            No products available
          </p>

        )}

      </div>

    </div>

  );
}
// profile
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

      if(file){

        setImage(file);

        setPreview(
          URL.createObjectURL(file)
        );
      }
    };

  const updateProfile =
    async () => {

      try{

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

        if(image){

          formData.append(
            "image",
            image
          );
        }

        const res =
          await axios.put(
            `${API}/profile/${user.user_id}`,
            formData
          );

        setUser(
          res.data.data
        );

        alert(
          "Profile updated"
        );

      }catch(err){

        console.log(err);

      }finally{

        setLoading(false);
      }
    };

  return(

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
              alt=""
              className="profile-image"
            />

          ) : (

            <div className="empty-profile">

              Upload Image

            </div>

          )}

          <input
            type="file"
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
            onChange={(e)=>
              setForm({
                ...form,
                name:e.target.value
              })
            }
          />

          <input
            type="email"
            value={form.email}
            placeholder="Email"
            onChange={(e)=>
              setForm({
                ...form,
                email:e.target.value
              })
            }
          />

          <input
            type="text"
            value={form.phone}
            placeholder="Phone"
            onChange={(e)=>
              setForm({
                ...form,
                phone:e.target.value
              })
            }
          />

          <textarea
            value={form.bio}
            placeholder="Bio"
            onChange={(e)=>
              setForm({
                ...form,
                bio:e.target.value
              })
            }
          />

          <button
            className="primary-btn"
            onClick={
              updateProfile
            }
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
// settings
export function Settings() {

  const {
    user
  } = useAuth();

  const [theme, setTheme] =
    useState(
      user?.theme || "light"
    );

  useEffect(()=>{

    document.body.className =
      theme;

  }, [theme]);

  const saveSettings =
    async () => {

      try{

        await axios.put(
          `${API}/settings/${user.user_id}`,
          { theme }
        );

        alert(
          "Settings saved"
        );

      }catch(err){

        console.log(err);
      }
    };

  return(

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
            onChange={(e)=>
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
