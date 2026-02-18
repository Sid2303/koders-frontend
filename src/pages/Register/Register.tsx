import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const checkUppercase = (str: string) => {
    for (let i = 0; i < str.length; i++) {
      if (str[i] >= "A" && str[i] <= "Z") return true;
    }
    return false;
  };

  const checkLowercase = (str: string) => {
    for (let i = 0; i < str.length; i++) {
      if (str[i] >= "a" && str[i] <= "z") return true;
    }
    return false;
  };

  const checkNumber = (str: string) => {
    for (let i = 0; i < str.length; i++) {
      if (str[i] >= "0" && str[i] <= "9") return true;
    }
    return false;
  };

  const checkSpecialChar = (str: string) => {
    const specialChars = "!@#$%^&*()_+-=[]{}';:\"\\|,.<>/?";
    for (let i = 0; i < str.length; i++) {
      if (specialChars.includes(str[i])) return true;
    }
    return false;
  };

  const validateEmail = (email: string) => {
    if (email.length === 0) return false;
    if (email.includes("@") && email.includes(".")) return true;
  };

  const validateUsername = (username: string) => {
    return username.length >= 3;
  };

  const hasMinLength = password.length >= 8;
  const hasUppercase = checkUppercase(password);
  const hasLowercase = checkLowercase(password);
  const hasSpecialChar = checkSpecialChar(password);
  const hasNumber = checkNumber(password);

  const isEmailValid = validateEmail(email);
  const isUsernameValid = validateUsername(username);
  const isPasswordValid =
    hasMinLength && hasUppercase && hasLowercase && hasSpecialChar && hasNumber;

  const isRoleSelected = selectedRole !== "";
  const isFormValid =
    isEmailValid && isUsernameValid && isPasswordValid && isRoleSelected;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setToast({
        open: true,
        message: "Registration successful! Redirecting to home.",
        severity: "success",
      });

      setEmail("");
      setUsername("");
      setPassword("");
      setSelectedRole("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setToast({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  return (
    <div className="register-container">
      <div className="register-form-section">
        <div className="register-form-wrapper">
          <h1 className="register-title">Welcome to Task Manager</h1>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={isEmailValid ? "input-valid" : ""}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={isUsernameValid ? "input-valid" : ""}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={isPasswordValid ? "input-valid" : ""}
                required
              />
              <div className="password-requirements">
                <span
                  className={
                    hasMinLength ? "requirement-met" : "requirement-unmet"
                  }
                >
                  ● Use 8 or more characters
                </span>
                <span
                  className={
                    hasUppercase ? "requirement-met" : "requirement-unmet"
                  }
                >
                  ● One Uppercase character
                </span>
                <span
                  className={
                    hasLowercase ? "requirement-met" : "requirement-unmet"
                  }
                >
                  ● One lowercase character
                </span>
                <span
                  className={
                    hasSpecialChar ? "requirement-met" : "requirement-unmet"
                  }
                >
                  ● One special character
                </span>
                <span
                  className={
                    hasNumber ? "requirement-met" : "requirement-unmet"
                  }
                >
                  ● One number
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="select-role">User Role</label>
              <select
                id="select-role"
                className="input-role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a role
                </option>
                <option value="user">user</option>
                <option value="manager">manager</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <p className="terms-text">
              By creating an account, you agree to the{" "}
              <a href="#" className="register-link">
                Terms of use
              </a>{" "}
              and{" "}
              <a href="#" className="register-link">
                Privacy Policy
              </a>
              .
            </p>

            <button
              type="submit"
              className="register-button"
              disabled={!isFormValid || loading}
            >
              {loading ? "Creating account..." : "Create an ccount"}
            </button>
          </form>

          <p className="register-footer">
            Already have an account?{" "}
            <Link to="/login" className="register-link">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
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

export default Register;
