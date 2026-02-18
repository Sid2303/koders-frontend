import { Link } from "react-router-dom";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ProfileModal from "./ProfileModal";
import { getUser } from "../../../utils/auth";

interface NavbarMobileProps {
  isLoggedIn: boolean;
  isOpen: boolean;
  onLogout: () => void;
  onClose: () => void;
  modules: { name: string; path: string }[];
}

const NavbarMobile = ({
  isLoggedIn,
  isOpen,
  onLogout,
  onClose,
  modules,
}: NavbarMobileProps) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const user = getUser();

  const handleProfileClick = () => {
    onClose();
    setProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
  };

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";

  return (
    <>
      <div className={`mobile-menu ${isOpen ? "open" : "closed"}`}>
        <div className="mobile-menu-content">
          {isLoggedIn && user && (
            <div className="mobile-menu-profile">
              <Avatar
                sx={{
                  bgcolor: "#2563eb",
                  width: 56,
                  height: 56,
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  margin: "0 auto 16px",
                }}
              >
                {getInitials(user.username)}
              </Avatar>
              <div className="mobile-menu-profile-info">
                <div className="mobile-menu-profile-item">
                  <PersonIcon sx={{ fontSize: "1.125rem", color: "#2563eb" }} />
                  <span className="mobile-menu-profile-text">
                    {user.username}
                  </span>
                </div>
                <div className="mobile-menu-profile-item">
                  <EmailIcon sx={{ fontSize: "1.125rem", color: "#6b7280" }} />
                  <span className="mobile-menu-profile-email">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="mobile-menu-items">
            {isLoggedIn ? (
              <>
                {modules.map((module) => (
                  <Link
                    key={module.path}
                    to={module.path}
                    onClick={onClose}
                    className="mobile-menu-link"
                  >
                    {module.name}
                  </Link>
                ))}

                <button
                  onClick={handleProfileClick}
                  className="mobile-menu-link mobile-menu-button"
                >
                  <PersonIcon sx={{ fontSize: "1.125rem", mr: 1 }} />
                  Profile
                </button>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={onClose}
                    className="mobile-menu-link"
                  >
                    <AdminPanelSettingsIcon
                      sx={{ fontSize: "1.125rem", mr: 1 }}
                    />
                    Admin Board
                  </Link>
                )}

                {(isAdmin || isManager) && (
                  <Link
                    to="/team"
                    onClick={onClose}
                    className="mobile-menu-link"
                  >
                    <PeopleIcon sx={{ fontSize: "1.125rem", mr: 1 }} />
                    Team Management
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/system"
                    onClick={onClose}
                    className="mobile-menu-link"
                  >
                    <DashboardIcon sx={{ fontSize: "1.125rem", mr: 1 }} />
                    System Dashboard
                  </Link>
                )}

                {isManager && (
                  <Link
                    to="/manager-settings"
                    onClick={onClose}
                    className="mobile-menu-link"
                  >
                    <SupervisorAccountIcon
                      sx={{ fontSize: "1.125rem", mr: 1 }}
                    />
                    Manager Settings
                  </Link>
                )}

                <button
                  onClick={onLogout}
                  className="mobile-menu-button-logout"
                >
                  <LogoutIcon className="logout-icon" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" onClick={onClose} className="mobile-menu-link">
                  Home
                </Link>
                <div>
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="mobile-menu-link"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="mobile-menu-item-button mobile-menu-button-register"
                  >
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ProfileModal open={profileModalOpen} onClose={handleCloseProfileModal} />
    </>
  );
};

export default NavbarMobile;
