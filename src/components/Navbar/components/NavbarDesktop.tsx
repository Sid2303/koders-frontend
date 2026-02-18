import { Link } from "react-router-dom";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ProfileModal from "./ProfileModal";
import { getUser } from "../../../utils/auth";

interface NavbarDesktopProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const NavbarDesktop = ({ isLoggedIn, onLogout }: NavbarDesktopProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const open = Boolean(anchorEl);
  const user = getUser();

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    setProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isAdmin = user?.role === "Admin";
  const isManager = user?.role === "Manager";

  return (
    <div className="navbar-desktop-menu">
      {isLoggedIn ? (
        <>
          <Link to="/" className="navbar-link">
            Dashboard
          </Link>
          <Link to="/tasks" className="navbar-link">
            Tasks
          </Link>
          <Avatar onClick={handleAvatarClick} className="navbar-avatar">
            {user ? getInitials(user.username) : "U"}
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            className="navbar-profile-menu"
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <div className="profile-menu-header">
              <Avatar className="profile-menu-header-avatar">
                {user ? getInitials(user.username) : "U"}
              </Avatar>
              <div className="profile-menu-header-info">
                <div className="profile-menu-header-name">
                  {user?.username || "User"}
                </div>
                <div className="profile-menu-header-status">
                  <span className="status-dot"></span>
                  Active
                </div>
              </div>
            </div>

            <Divider className="profile-menu-divider" />

            <MenuItem
              onClick={handleProfileClick}
              className="profile-menu-item"
            >
              <PersonIcon className="profile-menu-icon" />
              <span>Profile</span>
            </MenuItem>

            {isAdmin && (
              <MenuItem onClick={handleClose} className="profile-menu-item">
                <AdminPanelSettingsIcon className="profile-menu-icon" />
                <span>Admin Board</span>
              </MenuItem>
            )}

            {(isAdmin || isManager) && (
              <MenuItem onClick={handleClose} className="profile-menu-item">
                <PeopleIcon className="profile-menu-icon" />
                <span>Team Management</span>
              </MenuItem>
            )}

            {isAdmin && (
              <MenuItem onClick={handleClose} className="profile-menu-item">
                <DashboardIcon className="profile-menu-icon" />
                <span>System Dashboard</span>
              </MenuItem>
            )}

            {isManager && (
              <MenuItem onClick={handleClose} className="profile-menu-item">
                <SupervisorAccountIcon className="profile-menu-icon" />
                <span>Manager Settings</span>
              </MenuItem>
            )}

            <Divider className="profile-menu-divider" />

            <MenuItem
              onClick={handleLogout}
              className="profile-menu-item profile-menu-signout"
            >
              <LogoutIcon className="profile-menu-icon" />
              <span>Sign out</span>
            </MenuItem>
          </Menu>

          <ProfileModal
            open={profileModalOpen}
            onClose={handleCloseProfileModal}
          />
        </>
      ) : (
        <>
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <div className="login-register">
            <Link to="/login" className="navbar-link navbar-button-login">
              Login
            </Link>
            <Link to="/register" className="navbar-button-register">
              Register
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default NavbarDesktop;
