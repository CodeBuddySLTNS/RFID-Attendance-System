import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Homepage } from "./pages/homepage";
import Layout from "./layout";
import { ManageStudents } from "./pages/manage-students";
import { AddStudent } from "./pages/add-student";
import EditStudent from "./pages/edit-student";
import { Login } from "./pages/login";
import { Signup } from "./pages/signup";
import { AttendanceReports } from "./pages/attendance-reports";
import { Announcements } from "./pages/announcements";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/attendance-reports"
            element={
              <ProtectedRoute>
                <AttendanceReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-students"
            element={
              <ProtectedRoute>
                <ManageStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-students/new"
            element={
              <ProtectedRoute>
                <AddStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-students/:id/edit"
            element={
              <ProtectedRoute>
                <EditStudent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
