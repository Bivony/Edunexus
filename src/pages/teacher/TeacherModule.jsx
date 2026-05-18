// src/pages/teacher/TeacherModule.jsx

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthSystem";

const API = "https://bivonys.alwaysdata.net/api";

/* =========================================================
   DASHBOARD
========================================================= */
export function TeacherDashboard() {

  const { user } = useAuth();

  const [stats, setStats] = useState({
    students: 0,
    subjects: 0,
    assignments: 0,
    attendance: "94%"
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    try {

      const [
        usersRes,
        subjectsRes,
        assignmentsRes
      ] = await Promise.all([
        axios.get(`${API}/users`),
        axios.get(`${API}/subjects`),
        axios.get(`${API}/assignments`)
      ]);

      const users =
        usersRes.data.data || [];

      const subjects =
        subjectsRes.data.data || [];

      const assignments =
        assignmentsRes.data.data || [];

      const students =
        users.filter(
          (u) =>
            u.role?.toLowerCase() ===
            "student"
        );

      setStats({
        students: students.length,
        subjects: subjects.length,
        assignments:
          assignments.length,
        attendance: "94%"
      });

    } catch (err) {
      console.log(err);
    }
  };

  const createClass = async () => {

    const className =
      prompt("Enter class name");

    if (!className) return;

    try {

      await axios.post(
        `${API}/classes`,
        {
          class_name: className
        }
      );

      alert("Class created");

    } catch (err) {

      console.log(err);
      alert("Failed to create class");

    }
  };

  return (
    <div className="dashboard-page">

      <div className="page-header">

        <div>

          <h1>
            TEACHER DASHBOARD
          </h1>

          <p>
            Welcome back {user?.name} 👋
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={createClass}
        >
          + Create Class
        </button>

      </div>

      <div className="stats-grid">

        <div className="stat-card blue">
          <h2>{stats.students}</h2>
          <p>Total Students</p>
        </div>

        <div className="stat-card green">
          <h2>{stats.subjects}</h2>
          <p>Subjects</p>
        </div>

        <div className="stat-card orange">
          <h2>{stats.assignments}</h2>
          <p>Assignments</p>
        </div>

        <div className="stat-card red">
          <h2>{stats.attendance}</h2>
          <p>Attendance</p>
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   SUBJECTS
========================================================= */
export function Subjects() {

  const [subjects, setSubjects] =
    useState([]);

  const [subjectName, setSubjectName] =
    useState("");

  const [classId, setClassId] =
    useState("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {

    try {

      const res =
        await axios.get(
          `${API}/subjects`
        );

      setSubjects(
        res.data.data || []
      );

    } catch (err) {
      console.log(err);
    }
  };

  const addSubject = async () => {

    if (!subjectName || !classId) {
      alert("Fill all fields");
      return;
    }

    try {

      await axios.post(
        `${API}/subjects`,
        {
          subject_name:
            subjectName,
          class_id: classId
        }
      );

      setSubjectName("");
      setClassId("");

      fetchSubjects();

      alert("Subject added");

    } catch (err) {

      console.log(err);
      alert("Failed");

    }
  };

  const deleteSubject = async (id) => {

    try {

      await axios.delete(
        `${API}/subjects/${id}`
      );

      fetchSubjects();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="module-page">

      <div className="module-header">

        <h2>Subjects</h2>

      </div>

      <div className="upload-box">

        <input
          type="text"
          placeholder="Subject Name"
          value={subjectName}
          onChange={(e) =>
            setSubjectName(
              e.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="Class ID"
          value={classId}
          onChange={(e) =>
            setClassId(
              e.target.value
            )
          }
        />

        <button
          className="primary-btn"
          onClick={addSubject}
        >
          Add Subject
        </button>

      </div>

      <div className="card-grid">

        {subjects.map((subject) => (

          <div
            className="subject-card"
            key={subject.id}
          >

            <h3>
              {subject.subject_name}
            </h3>

            <p>
              Class ID:
              {subject.class_id}
            </p>

            <button
              className="delete-btn"
              onClick={() =>
                deleteSubject(
                  subject.id
                )
              }
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

/* =========================================================
   ASSIGNMENTS
========================================================= */
export function Assignments() {

  const [assignments, setAssignments] =
    useState([]);

  const [subjects, setSubjects] =
    useState([]);

  const [subjectId, setSubjectId] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  useEffect(() => {

    fetchAssignments();
    fetchSubjects();

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

      console.log(
        res.data.data
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
  // FETCH SUBJECTS
  // =====================================================
  const fetchSubjects = async () => {

    try {

      const res =
        await axios.get(
          `${API}/subjects`
        );

      setSubjects(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

    }
  };

  // =====================================================
  // ADD ASSIGNMENT
  // =====================================================
  const addAssignment = async () => {

    if (
      !subjectId ||
      !title ||
      !description ||
      !dueDate
    ) {

      alert(
        "Fill all fields"
      );

      return;

    }

    try {

      const res =
        await axios.post(
          `${API}/assignments`,
          {
            subject_id:
              subjectId,

            teacher_id:
              user?.id ||
              user?.user_id,

            title,
            description,

            due_date:
              dueDate
          }
        );

      alert(
        res.data.message ||
        "Assignment added"
      );

      setSubjectId("");
      setTitle("");
      setDescription("");
      setDueDate("");

      fetchAssignments();

    } catch (err) {

      console.log(err);

      console.log(
        err?.response?.data
      );

      alert(
        err?.response?.data?.message ||
        "Failed to add assignment"
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
          Assignments
        </h2>

      </div>

      {/* ADD ASSIGNMENT */}

      <div className="upload-box">

        <select
          value={subjectId}
          onChange={(e) =>
            setSubjectId(
              e.target.value
            )
          }
        >

          <option value="">
            Select Subject
          </option>

          {subjects.map((s) => (

            <option
              key={s.id}
              value={s.id}
            >
              {s.subject_name}
            </option>

          ))}

        </select>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(
              e.target.value
            )
          }
        />

        <button
          className="primary-btn"
          onClick={addAssignment}
        >
          Add Assignment
        </button>

      </div>

      {/* ASSIGNMENTS TABLE */}

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
                    {
                      a.teacher_name ||
                      "Unknown"
                    }
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
   MATERIALS
========================================================= */
export function Materials() {

  const [materials, setMaterials] =
    useState([]);

  const [subjects, setSubjects] =
    useState([]);

  const [subjectId, setSubjectId] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [file, setFile] =
    useState(null);

  const fileInputRef = useRef();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  useEffect(() => {

    fetchMaterials();
    fetchSubjects();

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

      console.log(
        res.data.data
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
  // FETCH SUBJECTS
  // =====================================================
  const fetchSubjects = async () => {

    try {

      const res =
        await axios.get(
          `${API}/subjects`
        );

      setSubjects(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

    }
  };

  // =====================================================
  // UPLOAD MATERIAL
  // =====================================================
  const uploadMaterial = async () => {

    if (
      !subjectId ||
      !title ||
      !file
    ) {

      alert(
        "Fill all fields"
      );

      return;
    }

    try {

      const formData =
        new FormData();

      formData.append(
        "subject_id",
        subjectId
      );

      formData.append(
        "title",
        title
      );

      formData.append(
        "uploaded_by",
        user?.id ||
        user?.user_id
      );

      formData.append(
        "file",
        file
      );

      const res =
        await axios.post(
          `${API}/materials`,
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
        "Material uploaded"
      );

      setTitle("");
      setSubjectId("");
      setFile(null);

      fileInputRef.current.value =
        "";

      fetchMaterials();

    } catch (err) {

      console.log(err);

      console.log(
        err?.response?.data
      );

      alert(
        err?.response?.data?.message ||
        "Upload failed"
      );

    }
  };

  // =====================================================
  // DELETE MATERIAL
  // =====================================================
  const deleteMaterial = async (id) => {

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
        "Failed to delete"
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
          Materials
        </h2>

      </div>

      {/* UPLOAD */}

      <div className="upload-box">

        <select
          value={subjectId}
          onChange={(e) =>
            setSubjectId(
              e.target.value
            )
          }
        >

          <option value="">
            Select Subject
          </option>

          {subjects.map((s) => (

            <option
              key={s.id}
              value={s.id}
            >
              {s.subject_name}
            </option>

          ))}

        </select>

        <input
          type="text"
          placeholder="Material title"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) =>
            setFile(
              e.target.files[0]
            )
          }
        />

        <button
          className="primary-btn"
          onClick={uploadMaterial}
        >
          Upload
        </button>

      </div>

      {/* MATERIALS */}

      <div className="card-grid">

        {materials.length > 0 ? (

          materials.map((m) => (

            <div
              className="subject-card"
              key={m.id}
            >

              <h3>
                {m.title}
              </h3>

              <p>
                <strong>
                  Subject:
                </strong>{" "}
                {
                  m.subject_name ||
                  "-"
                }
              </p>

              <p>
                <strong>
                  Uploaded By:
                </strong>{" "}
                {
                  m.teacher_name ||
                  "Unknown"
                }
              </p>

              <a
                href={`${API.replace("/api", "")}/uploads/${m.file_path}`}
                target="_blank"
                rel="noreferrer"
                className="primary-btn"
              >
                Open File
              </a>

              <button
                className="delete-btn"
                style={{
                  marginLeft: "10px"
                }}
                onClick={() =>
                  deleteMaterial(
                    m.id
                  )
                }
              >
                Delete
              </button>

            </div>

          ))

        ) : (

          <p>
            No materials uploaded
          </p>

        )}

      </div>

    </div>
  );
}
/* ================= GRADES ================= */
export function Grades() {

  const [grades, setGrades] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [assignments, setAssignments] =
    useState([]);

  const [studentId, setStudentId] =
    useState("");

  const [assignmentId, setAssignmentId] =
    useState("");

  const [marks, setMarks] =
    useState("");

  const [feedback, setFeedback] =
    useState("");

  useEffect(() => {

    fetchGrades();
    fetchStudents();
    fetchAssignments();

  }, []);

  // =========================================
  // FETCH STUDENTS
  // =========================================
  const fetchStudents = async () => {

    try {

      const res =
        await axios.get(
          `${API}/users`
        );

      const onlyStudents =
        (res.data.data || []).filter(
          (u) =>
            u.role === "student"
        );

      setStudents(
        onlyStudents
      );

    } catch (err) {

      console.log(err);

    }
  };

  // =========================================
  // FETCH ASSIGNMENTS
  // =========================================
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

    }
  };

  // =========================================
  // FETCH GRADES
  // =========================================
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

    }
  };

  // =========================================
  // SAVE GRADE
  // =========================================
  const saveGrade = async () => {

    if (
      !studentId ||
      !assignmentId ||
      !marks
    ) {

      alert(
        "Fill all fields"
      );

      return;
    }

    try {

      const res =
        await axios.post(
          `${API}/grades`,
          {
            student_id:
              studentId,

            assignment_id:
              assignmentId,

            marks,

            feedback
          }
        );

      alert(
        res.data.message ||
        "Grade saved"
      );

      setStudentId("");
      setAssignmentId("");
      setMarks("");
      setFeedback("");

      fetchGrades();

    } catch (err) {

      console.log(err);

      alert(
        err?.response?.data?.message ||
        "Failed to save grade"
      );

    }
  };

  // =========================================
  // GET STUDENT NAME
  // =========================================
  const getStudentName = (id) => {

    const student =
      students.find(
        (s) => s.id == id
      );

    return (
      student?.name || id
    );
  };

  // =========================================
  // GET ASSIGNMENT TITLE
  // =========================================
  const getAssignmentTitle = (id) => {

    const assignment =
      assignments.find(
        (a) => a.id == id
      );

    return (
      assignment?.title || id
    );
  };

  return (

    <div className="module-page">

      <div className="module-header">

        <h2>
          Grades
        </h2>

      </div>

      <div className="upload-box">

        <select
          value={studentId}
          onChange={(e) =>
            setStudentId(
              e.target.value
            )
          }
        >

          <option value="">
            Select Student
          </option>

          {students.map((student) => (

            <option
              key={student.id}
              value={student.id}
            >
              {student.name}
            </option>

          ))}

        </select>

        <select
          value={assignmentId}
          onChange={(e) =>
            setAssignmentId(
              e.target.value
            )
          }
        >

          <option value="">
            Select Assignment
          </option>

          {assignments.map((a) => (

            <option
              key={a.id}
              value={a.id}
            >
              {a.title}
            </option>

          ))}

        </select>

        <input
          type="number"
          placeholder="Marks"
          value={marks}
          onChange={(e) =>
            setMarks(
              e.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="Feedback"
          value={feedback}
          onChange={(e) =>
            setFeedback(
              e.target.value
            )
          }
        />

        <button
          className="primary-btn"
          onClick={saveGrade}
        >
          Save Grade
        </button>

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

              grades.map((grade) => (

                <tr key={grade.id}>

                  <td>
                    {getStudentName(
                      grade.student_id
                    )}
                  </td>

                  <td>
                    {getAssignmentTitle(
                      grade.assignment_id
                    )}
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

/* ================= ATTENDANCE ================= */
export function Attendance() {

  const [students, setStudents] =
    useState([]);

  const [attendance, setAttendance] =
    useState([]);

  const [subjects, setSubjects] =
    useState([]);

  const [subjectId, setSubjectId] =
    useState("");

  useEffect(() => {

    fetchStudents();
    fetchAttendance();
    fetchSubjects();

  }, []);

  // =========================================
  // FETCH STUDENTS
  // =========================================
  const fetchStudents = async () => {

    try {

      const res =
        await axios.get(
          `${API}/users`
        );

      const onlyStudents =
        (res.data.data || []).filter(
          (u) =>
            u.role === "student"
        );

      setStudents(
        onlyStudents
      );

    } catch (err) {

      console.log(err);

    }
  };

  // =========================================
  // FETCH SUBJECTS
  // =========================================
  const fetchSubjects = async () => {

    try {

      const res =
        await axios.get(
          `${API}/subjects`
        );

      setSubjects(
        res.data.data || []
      );

    } catch (err) {

      console.log(err);

    }
  };

  // =========================================
  // FETCH ATTENDANCE
  // =========================================
  const fetchAttendance = async () => {

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

    }
  };

  // =========================================
  // MARK ATTENDANCE
  // =========================================
  const markAttendance = async (
    studentId,
    status
  ) => {

    if (!subjectId) {

      alert(
        "Select subject first"
      );

      return;
    }

    try {

      await axios.post(
        `${API}/attendance`,
        {
          student_id:
            studentId,

          subject_id:
            subjectId,

          status
        }
      );

      fetchAttendance();

      alert(
        `Student marked ${status}`
      );

    } catch (err) {

      console.log(err);

      alert(
        "Failed to save attendance"
      );

    }
  };

  // =========================================
  // GET STATUS
  // =========================================
  const getStudentStatus = (id) => {

    const found =
      attendance.find(
        (a) =>
          a.student_id == id
      );

    return (
      found?.status ||
      "Not Marked"
    );
  };

  return (

    <div className="module-page">

      <div className="module-header">

        <h2>
          Attendance
        </h2>

      </div>

      <div
        className="upload-box"
        style={{
          marginBottom: "20px"
        }}
      >

        <select
          value={subjectId}
          onChange={(e) =>
            setSubjectId(
              e.target.value
            )
          }
        >

          <option value="">
            Select Subject
          </option>

          {subjects.map((s) => (

            <option
              key={s.id}
              value={s.id}
            >
              {s.subject_name}
            </option>

          ))}

        </select>

      </div>

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>
                Student
              </th>

              <th>
                Status
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {students.map((student) => (

              <tr key={student.id}>

                <td>
                  {student.name}
                </td>

                <td>
                  {getStudentStatus(
                    student.id
                  )}
                </td>

                <td>

                  <button
                    className="present-btn"
                    onClick={() =>
                      markAttendance(
                        student.id,
                        "Present"
                      )
                    }
                  >
                    Present
                  </button>

                  <button
                    className="absent-btn"
                    style={{
                      marginLeft: "10px"
                    }}
                    onClick={() =>
                      markAttendance(
                        student.id,
                        "Absent"
                      )
                    }
                  >
                    Absent
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
   ONLINE CLASSES
========================================================= */
export function OnlineClasses() {

  const startMeeting = () => {

    window.open(
      "https://meet.google.com",
      "_blank"
    );

  };

  return (

    <div className="module-page center-page">

      <h2>
        Online Classes
      </h2>

      <p>
        Start live online class meetings
      </p>

      <button
        className="primary-btn"
        onClick={startMeeting}
      >
        Start Meeting
      </button>

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
        sender: "teacher"
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
                className={`message ${
                  msg.sender === "teacher"
                    ? "right"
                    : "left"
                }`}
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

  const [notification, setNotification] =
    useState("");

  const sendNotification = async () => {

    if (!notification.trim()) {

      alert(
        "Enter notification"
      );

      return;

    }

    try {

      const res =
        await axios.post(
          `${API}/notifications`,
          {
            message: notification
          }
        );

      alert(
        res.data.message ||
        "Notification sent"
      );

      setNotification("");

    } catch (err) {

      console.log(err);

      alert(
        "Failed to send notification"
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

      <div className="upload-box">

        <input
          type="text"
          placeholder="Write notification..."
          value={notification}
          onChange={(e) =>
            setNotification(
              e.target.value
            )
          }
        />

        <button
          className="primary-btn"
          onClick={sendNotification}
        >
          Send
        </button>

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
export function Marketplace() {

  return (

    <div className="module-page">

      <div className="page-header">

        <h1>
          Teacher Marketplace
        </h1>

        <p>
          Buy, sell and share learning resources
        </p>

      </div>

    </div>
  );
}