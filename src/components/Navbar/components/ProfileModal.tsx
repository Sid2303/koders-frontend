import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import { getUser } from "../../../utils/auth";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const ProfileModal = ({ open, onClose }: ProfileModalProps) => {
  const user = getUser();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleClose = () => {
    setUsername(user?.username || "");
    setEmail(user?.email || "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const handleUpdateProfile = async () => {
    if (!username || !email) {
      setToast({
        open: true,
        message: "Username and email are required",
        severity: "error",
      });
      return;
    }

    if (username.length < 3) {
      setToast({
        open: true,
        message: "Username must be at least 3 characters",
        severity: "error",
      });
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setToast({
        open: true,
        message: "Please enter a valid email address",
        severity: "error",
      });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            username,
            email,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data.user));
        setToast({
          open: true,
          message: "Profile updated successfully",
          severity: "success",
        });
        handleClose();
      } else {
        const data = await response.json();
        setToast({
          open: true,
          message: data.message || "Failed to update profile",
          severity: "error",
        });
      }
    } catch {
      setToast({ open: true, message: "An error occurred", severity: "error" });
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      setToast({
        open: true,
        message: "Please enter your current password",
        severity: "error",
      });
      return;
    }

    if (newPassword.length < 8) {
      setToast({
        open: true,
        message: "New password must be at least 8 characters",
        severity: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({
        open: true,
        message: "Passwords do not match",
        severity: "error",
      });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      if (response.ok) {
        setToast({
          open: true,
          message: "Password changed successfully",
          severity: "success",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await response.json();
        setToast({
          open: true,
          message: data.message || "Failed to change password",
          severity: "error",
        });
      }
    } catch {
      setToast({ open: true, message: "An error occurred", severity: "error" });
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="profile-modal-title"
      >
        <Box className="profile-modal">
          <div className="profile-modal-header">
            <h2 id="profile-modal-title">Profile Settings</h2>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </div>

          <div className="profile-modal-content">
            <div className="profile-modal-section">
              <h3>User Information</h3>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
                helperText="Minimum 3 characters"
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                onClick={handleUpdateProfile}
                sx={{ mt: 2 }}
                fullWidth
              >
                Save Changes
              </Button>
            </div>

            <Divider sx={{ my: 3 }} />

            <div className="profile-modal-section">
              <h3>Change Password</h3>
              <TextField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                margin="normal"
                helperText="Must be at least 8 characters"
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                onClick={handleChangePassword}
                sx={{ mt: 2 }}
                fullWidth
              >
                Change Password
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfileModal;
