// src/pages/parent/ParentModule.jsx

import {
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
  useAuth
} from "../../auth/AuthSystem";

const API =
  "https://bivonys.alwaysdata.net/api";

/* =========================================================
   PARENT DASHBOARD
========================================================= */

export function ParentDashboard() {

  const { user } = useAuth();

  const [stats, setStats] =
    useState({
      subjects: 0,
      assignments: 0,
      grades: 0,
      attendance: "0%"
    });

  const [children, setChildren] =
    useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard =
    async () => {

      try {

        const [
          usersRes,
          subjectsRes,
          assignmentsRes,
          gradesRes,
          attendanceRes
        ] = await Promise.all([
          axios.get(`${API}/users`),
          axios.get(`${API}/subjects`),
          axios.get(`${API}/assignments`),
          axios.get(`${API}/grades`),
          axios.get(`${API}/attendance`)
        ]);

        /* =====================================================
           GET CHILDREN USING parent_id
        ===================================================== */

        const allStudents =
          (usersRes.data.data || [])
            .filter(
              (u) =>
                u.role ===
                  "student" &&
                Number(
                  u.parent_id
                ) ===
                  Number(
                    user?.user_id
                  )
            );

        setChildren(allStudents);

        const childIds =
          allStudents.map(
            (s) => s.user_id
          );

        /* =====================================================
           FILTER GRADES
        ===================================================== */

        const grades =
          (
            gradesRes.data
              .data || []
          ).filter(
            (g) =>
              childIds.includes(
                g.student_id
              )
          );

        /* =====================================================
           FILTER ATTENDANCE
        ===================================================== */

        const attendance =
          (
            attendanceRes.data
              .data || []
          ).filter(
            (a) =>
              childIds.includes(
                a.student_id
              )
          );

        const present =
          attendance.filter(
            (a) =>
              a.status ===
              "Present"
          ).length;

        const attendanceRate =
          attendance.length > 0
            ? Math.round(
                (present /
                  attendance.length) *
                  100
              ) + "%"
            : "0%";

        setStats({
          subjects:
            subjectsRes.data
              .data?.length || 0,

          assignments:
            assignmentsRes.data
              .data?.length || 0,

          grades:
            grades.length,

          attendance:
            attendanceRate
        });

      } catch (err) {

        console.log(err);

      }
    };

  return (

    <div className="dashboard-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <h1>
            PARENT DASHBOARD
          </h1>

          <p>
            Welcome back{" "}
            {user?.name} 👨‍👩‍👧
          </p>

        </div>

      </div>

      {/* STATS */}

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

      {/* CHILDREN */}

      <div
        className="table-container"
        style={{
          marginTop: "30px"
        }}
      >

        <h2>
          My Children
        </h2>

        <table>

          <thead>

            <tr>

              <th>
                Name
              </th>

              <th>
                Email
              </th>

              <th>
                Role
              </th>

            </tr>

          </thead>

          <tbody>

            {children.map(
              (child) => (

                <tr
                  key={
                    child.user_id
                  }
                >

                  <td>
                    {child.name}
                  </td>

                  <td>
                    {child.email}
                  </td>

                  <td>
                    {child.role}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

/* =========================================================
   PARENT SUBJECTS
========================================================= */

export function ParentSubjects() {

  const [subjects, setSubjects] =
    useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects =
    async () => {

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

  return (

    <div className="module-page">

      <div className="module-header">

        <h2>
          Student Subjects
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
                Class
              </th>

              <th>
                Teacher
              </th>

            </tr>

          </thead>

          <tbody>

            {subjects.map(
              (subject) => (

                <tr
                  key={
                    subject.subject_id
                  }
                >

                  <td>
                    {
                      subject.subject_name
                    }
                  </td>

                  <td>
                    {
                      subject.class_id
                    }
                  </td>

                  <td>
                    {
                      subject.teacher_id
                    }
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

/* =========================================================
   PARENT GRADES
========================================================= */

export function ParentGrades() {

  const { user } = useAuth();

  const [grades, setGrades] =
    useState([]);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades =
    async () => {

      try {

        const [
          usersRes,
          gradesRes
        ] = await Promise.all([
          axios.get(`${API}/users`),
          axios.get(`${API}/grades`)
        ]);

        const children =
          (
            usersRes.data
              .data || []
          ).filter(
            (u) =>
              u.role ===
                "student" &&
              Number(
                u.parent_id
              ) ===
                Number(
                  user?.user_id
                )
          );

        const childIds =
          children.map(
            (c) => c.user_id
          );

        const filtered =
          (
            gradesRes.data
              .data || []
          ).filter(
            (g) =>
              childIds.includes(
                g.student_id
              )
          );

        setGrades(filtered);

      } catch (err) {

        console.log(err);

      }
    };

  return (

    <div className="module-page">

      <div className="module-header">

        <h2>
          Student Grades
        </h2>

      </div>

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>
                Student ID
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

            </tr>

          </thead>

          <tbody>

            {grades.map(
              (grade) => (

                <tr
                  key={
                    grade.grade_id
                  }
                >

                  <td>
                    {
                      grade.student_id
                    }
                  </td>

                  <td>
                    {
                      grade.assignment_id
                    }
                  </td>

                  <td>
                    {
                      grade.marks
                    }
                  </td>

                  <td>
                    {
                      grade.feedback
                    }
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

/* =========================================================
   PARENT ATTENDANCE
========================================================= */

export function ParentAttendance() {

  const { user } = useAuth();

  const [attendance, setAttendance] =
    useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance =
    async () => {

      try {

        const [
          usersRes,
          attendanceRes
        ] = await Promise.all([
          axios.get(`${API}/users`),
          axios.get(`${API}/attendance`)
        ]);

        const children =
          (
            usersRes.data
              .data || []
          ).filter(
            (u) =>
              u.role ===
                "student" &&
              Number(
                u.parent_id
              ) ===
                Number(
                  user?.user_id
                )
          );

        const childIds =
          children.map(
            (c) => c.user_id
          );

        const filtered =
          (
            attendanceRes.data
              .data || []
          ).filter(
            (a) =>
              childIds.includes(
                a.student_id
              )
          );

        setAttendance(filtered);

      } catch (err) {

        console.log(err);

      }
    };

  return (

    <div className="module-page">

      <div className="module-header">

        <h2>
          Student Attendance
        </h2>

      </div>

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>
                Student ID
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

            {attendance.map(
              (a) => (

                <tr
                  key={a.id}
                >

                  <td>
                    {
                      a.student_id
                    }
                  </td>

                  <td>
                    {
                      a.subject_id
                    }
                  </td>

                  <td>
                    {a.status}
                  </td>

                  <td>
                    {a.date}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

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
/* =========================================================
   PARENT MARKETPLACE
========================================================= */

export function Marketplace() {

  const [products, setProducts] =
    useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts =
    async () => {

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

      }
    };

  return (

    <div className="module-page">

      <div className="page-header">

        <h1>
          Parent Marketplace
        </h1>

        <p>
          Buy books, uniforms and learning materials
        </p>

      </div>

      <div className="market-grid">

        {products.map(
          (product) => (

            <div
              className="market-card"
              key={product.id}
            >

              <img
                src={`https://bivonys.alwaysdata.net/uploads/${product.image}`}
                alt={product.name}
                className="market-image"
              />

              <div className="card-body">

                <h3>
                  {product.name}
                </h3>

                <p>
                  {product.description}
                </p>

                <h2>
                  KES {product.price}
                </h2>

              </div>

            </div>

          )
        )}mp

      </div>

    </div>
  );
}