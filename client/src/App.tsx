import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/homepage";
import Layout from "./layout";
import { ManageStudents } from "./pages/manage-students";

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/manage-students" element={<ManageStudents />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
