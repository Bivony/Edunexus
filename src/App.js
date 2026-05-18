import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

/* ================= AUTH ================= */
import {
  AuthProvider,
  ProtectedRoute
} from "./auth/AuthSystem";

/* ================= LAYOUT ================= */
import DashboardLayout from "./layouts/DashboardLayout";

/* ================= AUTH PAGES ================= */
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

/* ================= TEACHER ================= */
import {
  TeacherDashboard,
  Subjects as TSubjects,
  Assignments as TAssignments,
  Materials as TMaterials,
  Grades as TGrades,
  Attendance as TAttendance,
  OnlineClasses as TClasses,
  Chat as TChat,
  NotificationsPage as TNotifications,
  Marketplace as TMarketplace,
  Profile as TProfile,
  Settings as TSettings
} from "./pages/teacher/TeacherModule";

/* ================= STUDENT ================= */
import {
  StudentDashboard,
  Subjects as SSubjects,
  Assignments as SAssignments,
  Materials as SMaterials,
  Grades as SGrades,
  Attendance as SAttendance,
  OnlineClasses as SClasses,
  Chat as SChat,
  NotificationsPage as SNotifications,
  Marketplace as SMarketplace,
  Profile as SProfile,
  Settings as SSettings
} from "./pages/student/StudentModule";

/* ================= ADMIN ================= */
import {
  AdminDashboard,
  UsersAdmin,
  SubjectsAdmin,
  AssignmentsAdmin,
  MaterialsAdmin,
  GradesAdmin,
  AttendanceAdmin,
  OnlineClassesAdmin,
  ChatAdmin,
  NotificationAdmin,
  MarketplaceAdmin,
  Profile as AProfile,
  Settings as ASettings
} from "./pages/admin/AdminModule";

/* ================= PARENT ================= */
import {
  ParentDashboard,
  ParentSubjects,
  ParentGrades,
  ParentAttendance,
  Profile as PProfile,
  Settings as PSettings,
  Marketplace as PMarketplace
} from "./pages/parent/ParentModule";


/* ================= APP ================= */
function App() {

  return (

    <AuthProvider>

      <Router>

        <Routes>

          {/* ================= HOME ================= */}
          <Route
            path="/"
            element={
              <Navigate to="/signin" />
            }
          />

          {/* ================= AUTH ================= */}
          <Route
            path="/signin"
            element={<Signin />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          {/* ================= DASHBOARD ================= */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>

                <DashboardLayout />

              </ProtectedRoute>
            }
          >

            {/* ================= DEFAULT ================= */}
            <Route
              index
              element={
                <Navigate to="/dashboard/student" />
              }
            />

            {/* ================= PARENT ================= */}

<Route
  path="parent"
  element={<ParentDashboard />}
/>

<Route
  path="parent/children"
  element={<ParentSubjects />}
/>

<Route
  path="parent/attendance"
  element={<ParentAttendance />}
/>
<Route
  path="parent/marketplace"
  element={<PMarketplace />}
/>

<Route
  path="parent/grades"
  element={<ParentGrades />}
/>

<Route
  path="parent/profile"
  element={<PProfile />}
/>

<Route
  path="parent/settings"
  element={<PSettings />}
/>


            {/* =====================================================
               TEACHER
            ===================================================== */}

            <Route
              path="teacher"
              element={<TeacherDashboard />}
            />

            <Route
              path="teacher/subjects"
              element={<TSubjects />}
            />

            <Route
              path="teacher/assignments"
              element={<TAssignments />}
            />

            <Route
              path="teacher/materials"
              element={<TMaterials />}
            />

            <Route
              path="teacher/grades"
              element={<TGrades />}
            />

            <Route
              path="teacher/attendance"
              element={<TAttendance />}
            />

            <Route
              path="teacher/classes"
              element={<TClasses />}
            />

            <Route
              path="teacher/chat"
              element={<TChat />}
            />

            <Route
              path="teacher/notifications"
              element={<TNotifications />}
            />

            <Route
              path="teacher/marketplace"
              element={<TMarketplace />}
            />

            <Route
              path="teacher/profile"
              element={<TProfile />}
            />

            <Route
              path="teacher/settings"
              element={<TSettings />}
            />

            {/* =====================================================
               STUDENT
            ===================================================== */}

            <Route
              path="student"
              element={<StudentDashboard />}
            />

            <Route
              path="student/subjects"
              element={<SSubjects />}
            />

            <Route
              path="student/assignments"
              element={<SAssignments />}
            />

            <Route
              path="student/materials"
              element={<SMaterials />}
            />

            <Route
              path="student/grades"
              element={<SGrades />}
            />

            <Route
              path="student/attendance"
              element={<SAttendance />}
            />

            <Route
              path="student/classes"
              element={<SClasses />}
            />

            <Route
              path="student/chat"
              element={<SChat />}
            />

            <Route
              path="student/notifications"
              element={<SNotifications />}
            />

            <Route
              path="student/marketplace"
              element={<SMarketplace />}
            />

            <Route
              path="student/profile"
              element={<SProfile />}
            />

            <Route
              path="student/settings"
              element={<SSettings />}
            />

            {/* =====================================================
               ADMIN
            ===================================================== */}

            <Route
              path="admin"
              element={<AdminDashboard />}
            />

            <Route
              path="admin/users"
              element={<UsersAdmin />}
            />

            <Route
              path="admin/subjects"
              element={<SubjectsAdmin />}
            />

            <Route
              path="admin/assignments"
              element={<AssignmentsAdmin />}
            />

            <Route
              path="admin/materials"
              element={<MaterialsAdmin />}
            />

            <Route
              path="admin/grades"
              element={<GradesAdmin />}
            />

            <Route
              path="admin/attendance"
              element={<AttendanceAdmin />}
            />

            <Route
              path="admin/classes"
              element={<OnlineClassesAdmin />}
            />

            <Route
              path="admin/chat"
              element={<ChatAdmin />}
            />

            <Route
              path="admin/notifications"
              element={<NotificationAdmin />}
            />

            <Route
              path="admin/marketplace"
              element={<MarketplaceAdmin />}
            />

            <Route
              path="admin/profile"
              element={<AProfile />}
            />

            <Route
              path="admin/settings"
              element={<ASettings />}
            />

          </Route>

        </Routes>

      </Router>

    </AuthProvider>
  );
}

export default App;