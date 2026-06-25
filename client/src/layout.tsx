import { Menu, X } from "lucide-react";
import React, { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Separator } from "./components/ui/separator";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const facultyRaw = localStorage.getItem("faculty");
  const faculty = facultyRaw ? JSON.parse(facultyRaw) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("faculty");
    window.location.href = "/login";
  };

  return (
    <div className="w-full h-dvh grid grid-rows-[max-content_1fr] relative">
      <div className="w-full flex justify-between items-center gap-2 p-2 px-3 text-white bg-primary shadow">
        <div className="flex gap-2">
          <div className="flex justify-center items-center">
            <div className="w-10 aspect-square rounded-full bg-gray-200"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-snug">
              Philippine Advent College Inc. - Salug Campus
            </h1>
            <h3 className="leading-tight text-muted">
              Poblacion East, Salug, Zamboanga del Norte
            </h3>
          </div>
        </div>

        <div className="flex items-center mr-2 cursor-pointer">
          <Menu size={26} onClick={toggleMenu} />
        </div>

        <nav
          className={`w-[250px] h-fit pb-5 absolute top-0 right-2 z-10 bg-primary border border-gray-600 shadow rounded mt-2 p-4 transition-all duration-300 ease-in-out ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={toggleMenu}
        >
          <div className="w-full flex justify-between">
            <h2 className="text-lg font-bold text-white mb-2">Menu</h2>
            <X className="cursor-pointer" />
          </div>
          <Separator />
          <ul className="mt-4 flex flex-col gap-2">
            <Link to="/">
              <li className="w-full p-1 rounded text-center hover:bg-gray-500">
                RFID Scanner
              </li>
            </Link>
            {faculty ? (
              <>
                <li className="w-full p-1 rounded text-center text-orange-400 font-semibold truncate">
                  {faculty.name}
                </li>
                <Link to="/manage-students">
                  <li className="w-full p-1 rounded text-center hover:bg-gray-500">
                    Manage Students
                  </li>
                </Link>
                <Link to="/attendance-reports">
                  <li className="w-full p-1 rounded text-center hover:bg-gray-500">
                    Attendance Reports
                  </li>
                </Link>
                <Link to="/announcements">
                  <li className="w-full p-1 rounded text-center hover:bg-gray-500">
                    Announcements
                  </li>
                </Link>
                <li
                  className="w-full p-1 rounded text-center hover:bg-red-600 text-red-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </>
            ) : (
              <Link to="/login">
                <li className="w-full p-1 rounded text-center hover:bg-gray-500">
                  Login
                </li>
              </Link>
            )}
          </ul>
        </nav>
      </div>

      <div className="w-full h-full relative">{children}</div>
    </div>
  );
};

export default Layout;
