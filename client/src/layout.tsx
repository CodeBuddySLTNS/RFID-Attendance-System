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
    <div className="w-full h-dvh grid grid-rows-[max-content_1fr] relative overflow-x-hidden md:overflow-x-visible">
      <div className="w-full max-w-full overflow-hidden flex justify-between items-center gap-2 p-2 px-3 text-white bg-primary shadow z-20">
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
          <div className="flex justify-center items-center shrink-0">
            <div className="w-8 h-8 md:w-10 aspect-square rounded-full bg-gray-200"></div>
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <h1 className="text-xs sm:text-base md:text-xl font-bold leading-tight truncate block max-w-full md:whitespace-normal" title="Philippine Advent College Inc. - Salug Campus">
              Philippine Advent College Inc. - Salug Campus
            </h1>
            <h3 className="text-[10px] sm:text-xs md:text-sm leading-tight text-muted truncate block max-w-full md:whitespace-normal" title="Poblacion East, Salug, Zamboanga del Norte">
              Poblacion East, Salug, Zamboanga del Norte
            </h3>
          </div>
        </div>

        <div className="flex items-center mr-1 md:mr-2 cursor-pointer shrink-0">
          <Menu size={24} onClick={toggleMenu} className="md:w-6 md:h-6" />
        </div>

        <nav
          className={`w-[250px] h-fit pb-5 absolute top-0 right-2 z-50 bg-primary border border-gray-600 shadow rounded mt-2 p-4 transition-all duration-300 ease-in-out ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={toggleMenu}
        >
          <div className="w-full flex justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-lg font-bold text-white">Menu</div>
              {faculty && (
                <div className="text-xs text-orange-400 font-bold border border-orange-400 rounded px-1">
                  ADMIN
                </div>
              )}
            </div>
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

      <div className="w-full h-full relative overflow-x-hidden md:overflow-x-auto overflow-y-auto bg-cover bg-center bg-no-repeat bg-[url('/images/bg.jpg')]">
        {children}
      </div>
    </div>
  );
};

export default Layout;
