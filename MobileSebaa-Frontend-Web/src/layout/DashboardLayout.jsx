import { useState, useRef, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Helper to apply active class to NavLink
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 ${isActive ? "text-primary" : ""}`;

  return (
    <div className="flex h-screen bg-base-100 relative">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`bg-base-200 p-5 w-64 transition-all fixed lg:relative h-full ${
          isOpen ? "block" : "hidden lg:block"
        }`}
      >
        {/* Close button for mobile */}
        <button
          className="lg:hidden absolute top-4 right-4 text-xl"
          onClick={() => setIsOpen(false)}
        >
          ✖️
        </button>

        <Link to="/dashboard" className="text-xl font-bold mb-6 block">
          Dashboard
        </Link>

        <ul className="menu space-y-2">
          <li>
            <NavLink to="/" className={navLinkClass}>
              🏠 Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={navLinkClass}>
              👤 Profile
            </NavLink>
          </li>
          <div className="divider"></div>
          <li>
            <NavLink to="/dashboard/allShop" className={navLinkClass}>
              🏪 All Shop
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/allUser" className={navLinkClass}>
              👪 All User
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/shopRequest" className={navLinkClass}>
              📩 Shop Request
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/rejectShop" className={navLinkClass}>
              ❌🏪 Reject Shops
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-base-100 p-4 shadow-md flex justify-between items-center">
          <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "✖️" : "☰"}
          </button>
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </header>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
