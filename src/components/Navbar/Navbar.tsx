import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { isAuthenticated, logout } from "../../utils/auth";
import NavbarDesktop from "./components/NavbarDesktop";
import NavbarMobile from "./components/NavbarMobile";
import "./Navbar.css";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  useLocation();
  const isLoggedIn = isAuthenticated();

  const modules: { name: string; path: string }[] = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Tasks",
      path: "/tasks",
    },
  ];

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const handleCloseMobile = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            Koders
          </Link>

          <NavbarDesktop
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            modules={modules}
          />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-button"
            aria-label="Toggle menu"
          >
            <div className={`mobile-menu-icon`}>
              {mobileMenuOpen ? (
                <CloseIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </div>
          </button>
        </div>
      </div>
      <NavbarMobile
        isLoggedIn={isLoggedIn}
        isOpen={mobileMenuOpen}
        onLogout={handleLogout}
        onClose={handleCloseMobile}
        modules={modules}
      />
    </nav>
  );
};

export default Navbar;
