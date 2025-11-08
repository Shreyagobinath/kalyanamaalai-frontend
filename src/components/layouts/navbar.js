import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, FileText, UserCog, LogOut } from "lucide-react";

const Navbar = ({ user, userType, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) {
      onLogout();
    } else {
      navigate(userType === "admin" ? "/adminlogin" : "/userlogin");
    }
  };

  // Only show sidebar for dashboard routes
  const showSidebar = location.pathname.includes("dashboard");

  const links = [
    { name: "Dashboard", path: userType === "admin" ? "/admindashboard" : "/userdashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Forms", path: "/admin/forms", icon: <FileText size={20} /> },
    { name: "Settings", path: "/admin/settings", icon: <UserCog size={20} /> },
  ];

  return (
    <>
      {/* Vertical Sidebar */}
      {showSidebar && userType === "admin" && (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-emerald-700 text-white flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-center h-16 border-b border-emerald-600">
              <h1 className="text-xl font-bold tracking-wide">Admin Panel</h1>
            </div>
            <nav className="mt-6 flex flex-col space-y-1">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition hover:bg-emerald-600 ${
                    location.pathname === link.path ? "bg-emerald-800" : ""
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-emerald-600">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-6 py-3 text-sm font-medium hover:bg-emerald-600 transition"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </aside>
      )}

      {/* Top Navbar for non-dashboard pages */}
      {!showSidebar && (
        <nav className="bg-white/80 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">Kalyanamalai</h1>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-medium">{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/userlogin"
              className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          )}
        </nav>
      )}
    </>
  );
};

export default Navbar;
