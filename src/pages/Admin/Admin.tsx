import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { getUser } from "../../utils/auth";
import "./Admin.css";

interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "manager" | "admin";
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: {
    _id: string;
    username: string;
    email: string;
  };
  createdBy: {
    _id: string;
    username: string;
    email: string;
  };
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const currentUser = getUser();

  useEffect(() => {
    if (currentUser?.role !== "admin") {
      setError("Unauthorized: Admin access required");
      setLoading(false);
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch users
      const usersResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Fetch tasks
      const tasksResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (usersResponse.ok && tasksResponse.ok) {
        const usersData = await usersResponse.json();
        const tasksData = await tasksResponse.json();

        setUsers(usersData.users || []);
        setTasks(tasksData.tasks || []);
      } else {
        setError("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${selectedUser._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setUsers(users.filter((u) => u._id !== selectedUser._id));
        setDeleteDialogOpen(false);
        setSelectedUser(null);
      } else {
        setError("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Error deleting user");
    }
  };

  const getUserTasks = (userId: string) => {
    return tasks.filter((task) => task.assignedTo?._id === userId);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "error";
      case "manager":
        return "warning";
      default:
        return "info";
    }
  };

  if (currentUser?.role !== "admin") {
    return (
      <div className="admin-container">
        <Alert severity="error">
          Unauthorized: You do not have permission to access this page.
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-container">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <Typography variant="h4" component="h1">
          Admin Panel
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage users and view assigned tasks
        </Typography>
      </div>

      {error && (
        <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <div className="users-grid">
        {users.map((user) => {
          const userTasks = getUserTasks(user._id);
          return (
            <Card key={user._id} className="user-card">
              <CardContent>
                <div className="user-card-header">
                  <div className="user-info">
                    <PersonIcon className="user-icon" />
                    <div>
                      <Typography variant="h6">{user.username}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </div>
                  </div>
                  <div className="user-actions">
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(user)}
                      disabled={user._id === currentUser?.id}
                      title={
                        user._id === currentUser?.id
                          ? "Cannot delete yourself"
                          : "Delete user"
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>

                <div className="user-tasks">
                  <div className="tasks-header">
                    <AssignmentIcon fontSize="small" />
                    <Typography variant="subtitle2">
                      Assigned Tasks ({userTasks.length})
                    </Typography>
                  </div>
                  {userTasks.length > 0 ? (
                    <div className="tasks-list">
                      {userTasks.map((task) => (
                        <div key={task._id} className="task-item">
                          <Typography variant="body2" className="task-title">
                            {task.title}
                          </Typography>
                          <Chip
                            label={task.status}
                            size="small"
                            variant="outlined"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No tasks assigned
                    </Typography>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user{" "}
            <strong>{selectedUser?.username}</strong>? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Admin;
