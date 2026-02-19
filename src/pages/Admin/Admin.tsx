import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CustomisedModal from "../../components/CustomisedModal";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
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

interface TaskFilters {
  status: string;
  priority: string;
  deleted: string;
  sortBy: string;
  order: string;
}

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userTasksMap, setUserTasksMap] = useState<Record<string, Task[]>>({});
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const currentUser = getUser();

  const defaultFilters: TaskFilters = {
    status: "",
    priority: "",
    deleted: "",
    sortBy: "createdAt",
    order: "desc",
  };
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);

  const buildQuery = (userId: string, f: TaskFilters) => {
    const params = new URLSearchParams();
    params.set("assignedTo", userId);
    if (f.status) params.set("status", f.status);
    if (f.priority) params.set("priority", f.priority);
    if (f.deleted !== "") params.set("deleted", f.deleted);
    if (f.sortBy) params.set("sortBy", f.sortBy);
    if (f.order) params.set("order", f.order);
    return params.toString();
  };

  const fetchTasksForUsers = useCallback(
    async (userList: User[], f: TaskFilters) => {
      const token = localStorage.getItem("token");
      const entries = await Promise.all(
        userList.map(async (u) => {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_API_URL}/tasks?${buildQuery(u._id, f)}`,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            if (res.ok) {
              const data = await res.json();
              return [u._id, data.tasks || []] as [string, Task[]];
            }
          } catch {
            // ignore per-user error
          }
          return [u._id, []] as [string, Task[]];
        }),
      );
      setUserTasksMap(Object.fromEntries(entries));
    },
    [],
  );

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

      const usersResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/users`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        const fetchedUsers: User[] = usersData.users || [];
        setUsers(fetchedUsers);
        await fetchTasksForUsers(fetchedUsers, filters);
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

  const handleFilterChange = async (key: keyof TaskFilters, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    await fetchTasksForUsers(users, updated);
  };

  const handleResetFilters = async () => {
    setFilters(defaultFilters);
    await fetchTasksForUsers(users, defaultFilters);
  };

  const hasActiveFilters =
    filters.status !== "" ||
    filters.priority !== "" ||
    filters.deleted !== "" ||
    filters.sortBy !== "createdAt" ||
    filters.order !== "desc";

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
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        const remaining = users.filter((u) => u._id !== selectedUser._id);
        setUsers(remaining);
        setUserTasksMap((prev) => {
          const next = { ...prev };
          delete next[selectedUser._id];
          return next;
        });
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "#dc2626";
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "info";
      case "review":
        return "warning";
      default:
        return "default";
    }
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

      <div className="admin-filters">
        <div className="admin-filters-left">
          <FilterListIcon sx={{ color: "#6b7280", fontSize: 20 }} />
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Filter Tasks
          </Typography>
        </div>
        <div className="admin-filters-controls">
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="review">Review</MenuItem>
              <MenuItem value="completed">Done</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filters.priority}
              label="Priority"
              onChange={(e) => handleFilterChange("priority", e.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Show Deleted</InputLabel>
            <Select
              value={filters.deleted}
              label="Show Deleted"
              onChange={(e) => handleFilterChange("deleted", e.target.value)}
            >
              <MenuItem value="">
                <em>Active only</em>
              </MenuItem>
              <MenuItem value="true">Deleted only</MenuItem>
              <MenuItem value="false">Not deleted</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              <MenuItem value="createdAt">Date Created</MenuItem>
              <MenuItem value="dueDate">Due Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="title">Title</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 110 }}>
            <InputLabel>Order</InputLabel>
            <Select
              value={filters.order}
              label="Order"
              onChange={(e) => handleFilterChange("order", e.target.value)}
            >
              <MenuItem value="desc">Newest</MenuItem>
              <MenuItem value="asc">Oldest</MenuItem>
            </Select>
          </FormControl>

          {hasActiveFilters && (
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<RestartAltIcon />}
              onClick={handleResetFilters}
              sx={{
                textTransform: "none",
                color: "#6b7280",
                borderColor: "#d1d5db",
                whiteSpace: "nowrap",
              }}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="users-grid">
        {users.map((user) => {
          const userTasks = userTasksMap[user._id] || [];
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
                          <div className="task-item-left">
                            <span
                              className="task-priority-dot"
                              style={{
                                background: getPriorityColor(task.priority),
                              }}
                              title={task.priority}
                            />
                            <Typography variant="body2" className="task-title">
                              {task.title}
                            </Typography>
                          </div>
                          <div className="task-item-right">
                            <Chip
                              label={task.status.replace("-", " ")}
                              size="small"
                              color={
                                getStatusColor(task.status) as
                                  | "default"
                                  | "success"
                                  | "info"
                                  | "warning"
                              }
                              variant="outlined"
                            />
                            {task.dueDate && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(task.dueDate).toLocaleDateString()}
                              </Typography>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No tasks match the current filters
                    </Typography>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <CustomisedModal
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        showCloseButton={false}
        title="Delete User"
        actions={
          <>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </>
        }
      >
        <Typography>
          Are you sure you want to delete user{" "}
          <strong>{selectedUser?.username}</strong>? This action cannot be
          undone.
        </Typography>
      </CustomisedModal>
    </div>
  );
};

export default Admin;
