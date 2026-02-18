import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { isAuthenticated, logout } from "../../utils/auth";
import NavbarDesktop from "./components/NavbarDesktop";
import NavbarMobile from "./components/NavbarMobile";
import "./Navbar.css";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
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

          <NavbarDesktop isLoggedIn={isLoggedIn} onLogout={handleLogout} />

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
      />
    </nav>
  );
};

export default Navbar;
