import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/homepage";
import Layout from "./layout";
import { ManageStudents } from "./pages/manage-students";
import { AddStudent } from "./pages/add-student";
import EditStudent from "./pages/edit-student";

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/manage-students" element={<ManageStudents />} />
          <Route path="/manage-students/new" element={<AddStudent />} />
          <Route path="/manage-students/:id/edit" element={<EditStudent />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
