import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import "../Register/Register.css";
import CustomisedTextInput from "../../components/CustomisedTextInput";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const isEmailValid =
    email.includes("@") && email.includes(".") && email.length > 0;
  const isPasswordValid = newPassword.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      setToast({
        open: true,
        message: "Password updated! Redirecting...",
        severity: "success",
      });

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setToast({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-section">
        <div className="register-form-wrapper">
          <h1 className="register-title">Reset password</h1>
          <p className="register-subtitle">
            Enter your email and choose a new password.
          </p>

          <form className="register-form" onSubmit={handleSubmit}>
            <CustomisedTextInput
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              valid={isEmailValid}
            />

            <CustomisedTextInput
              label="New password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              valid={isPasswordValid}
              showToggle
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <button
              type="submit"
              className="register-button"
              disabled={!isFormValid || loading}
            >
              {loading ? "Updating..." : "Reset password"}
            </button>
          </form>

          <p className="register-footer">
            Remember your password?{" "}
            <Link to="/login" className="register-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ForgotPassword;
