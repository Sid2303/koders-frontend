import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, isAdmin, logout } from "../../utils/auth";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const userIsAuthenticated = isAuthenticated();
  const userIsAdmin = isAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            Koders
          </Link>

          <div className="navbar-desktop-menu">
            <Link to="/" className="navbar-link">
              Home
            </Link>

            {userIsAuthenticated ? (
              <>
                <Link to="/dashboard" className="navbar-link">
                  Dashboard
                </Link>
                <Link to="/profile" className="navbar-link">
                  Profile
                </Link>
                {userIsAdmin && (
                  <Link to="/admin" className="navbar-link">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="navbar-button-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-link">
                  Login
                </Link>
                <Link to="/register" className="navbar-button-register">
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-button"
            aria-label="Toggle menu"
          >
            <div
              className={`mobile-menu-icon ${mobileMenuOpen ? "rotate" : ""}`}
            >
              {mobileMenuOpen ? (
                <CloseIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </div>
          </button>
        </div>
      </div>
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : "closed"}`}>
        <div className="mobile-menu-content">
          <div className="mobile-menu-items">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-menu-link"
            >
              Home
            </Link>

            {userIsAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-menu-link"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-menu-link"
                >
                  Profile
                </Link>
                {userIsAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-menu-link"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="mobile-menu-item-button mobile-menu-button-logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-menu-link"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-menu-item-button mobile-menu-button-register"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
