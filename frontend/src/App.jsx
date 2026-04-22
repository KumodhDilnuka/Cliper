import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from '../components/ProtectedRoute';

// Public pages
import Landing from '../pages/public/LandingPage';
import SignUp from '../pages/public/signup';
import Login from '../pages/public/login';

// Student pages
import StuDash from '../pages/public/Student/StudentDashboard';
import StuPubRooms from '../pages/public/Student/StudentPublicRooms';
import StudentLectureLobby from '../pages/public/Student/StudentLectureLobby';
import QA from '../pages/public/Student/QA';
import AskQuestionPage from '../pages/public/Student/AskQuestionPage';
import StudentResources from '../pages/public/Student/StudentResources';
import StudentAttendance from '../pages/public/Student/StudentAttendance';
import StudentMaterials from '../pages/public/Student/StudentMaterials';
import QuestionDetailPage from '../pages/public/Student/QuestionDetailPage';

// Lecturer pages
import LiveSessionLecturer from '../pages/public/Lecturer/LiveSessionLecturer';
import LecturerCreateRoom from '../pages/public/Lecturer/LecturerCreateRoom';
import LecActiveRooms from '../pages/public/Lecturer/lec_active_rooms';
import Resources from '../pages/public/Lecturer/lec_resources';
import LecDash from '../pages/public/Lecturer/LecturerDashboard';
import CourseManagement from '../pages/public/Lecturer/CourseManagement';
import AttendanceManagement from '../pages/public/Lecturer/AttendanceManagement';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboardPage';
import AdminLogin from '../pages/admin/AdminLoginPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Public routes (no login required) ── */}
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* ── Student-only routes ── */}
        <Route path="/StudentDashboard" element={ <ProtectedRoute allowedRoles={["student"]}> <StuDash /> </ProtectedRoute> }/>
        <Route path="/student/rooms" element={ <ProtectedRoute allowedRoles={["student"]}> <StuPubRooms /> </ProtectedRoute> }/>
        <Route path="/live-sessionStudent" element={ <ProtectedRoute allowedRoles={["student"]}> <StudentLectureLobby /> </ProtectedRoute> }/>
        <Route path="/qa" element={ <ProtectedRoute allowedRoles={["student"]}> <QA /> </ProtectedRoute> }/>
        <Route path="/student/resources" element={ <ProtectedRoute allowedRoles={["student"]}> <StudentResources /> </ProtectedRoute> }/>
        <Route path="/student/attendance" element={ <ProtectedRoute allowedRoles={["student"]}> <StudentAttendance /> </ProtectedRoute> }/>
        <Route path="/ask" element={ <ProtectedRoute allowedRoles={["student"]}> <AskQuestionPage /> </ProtectedRoute> }/>
        <Route path="/student/materials" element={ <ProtectedRoute allowedRoles={["student"]}> <StudentMaterials /> </ProtectedRoute> }/>
        <Route path="/question/:id" element={ <ProtectedRoute allowedRoles={["student", "lecturer", "admin"]}> <QuestionDetailPage /> </ProtectedRoute> }/>

        {/* ── Lecturer / Admin routes ── */}
        <Route path="/lecturer" element={ <ProtectedRoute allowedRoles={["lecturer", "admin"]}> <LecDash /> </ProtectedRoute> }/>
        <Route path="/lecturer/lec_active-rooms" element={ <ProtectedRoute allowedRoles={["lecturer", "admin"]}> <LecActiveRooms /> </ProtectedRoute> }/>
        <Route path="/lecturer/create-room" element={ <ProtectedRoute allowedRoles={["lecturer", "admin"]}> <LecturerCreateRoom /> </ProtectedRoute> }/>
        <Route path="/lecturer/resources" element={ <ProtectedRoute allowedRoles={["lecturer", "admin"]}> <Resources /> </ProtectedRoute> }/>
        <Route path="/lecturer/course-management" element={ <ProtectedRoute allowedRoles={["lecturer", "admin"]}> <CourseManagement /> </ProtectedRoute> }/>
        <Route path="/lecturer/attendance" element={ <ProtectedRoute allowedRoles={["lecturer", "admin"]}> <AttendanceManagement /> </ProtectedRoute> }/>
        <Route path="/live-sessionLecturer" element={ <ProtectedRoute allowedRoles={["lecturer", "admin"]}> <LiveSessionLecturer /> </ProtectedRoute> }/>
        <Route path="/live-sessionLecturer/:roomId" element={ <ProtectedRoute allowedRoles={["lecturer", "admin"]}> <LiveSessionLecturer /> </ProtectedRoute> }/>

        {/* ── Admin Specific routes ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}

export default App;
