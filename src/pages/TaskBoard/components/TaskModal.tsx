import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Typography,
  Divider,
  IconButton,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import "./TaskModal.css";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?:
    | {
        _id: string;
        username: string;
        email: string;
      }
    | string;
  createdBy:
    | {
        _id: string;
        username: string;
        email: string;
      }
    | string;
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface TaskModalProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (taskId: string, updates: Partial<Task>) => void;
}

const TaskModal = ({ open, task, onClose, onSave }: TaskModalProps) => {
  const getInitialState = () => {
    if (task) {
      console.log("Task in modal:", task);
      return {
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        tags: task.tags || [],
      };
    }
    return {};
  };

  const [editedTask, setEditedTask] =
    useState<Partial<Task>>(getInitialState());
  const [tagInput, setTagInput] = useState("");
  const [assignedToUsername, setAssignedToUsername] = useState<string | null>(
    null,
  );
  const [createdByUsername, setCreatedByUsername] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (task) {
      const fetchUsernames = async () => {
        const apiUrl = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem("token");

        if (task.assignedTo && typeof task.assignedTo === "string") {
          try {
            const response = await fetch(
              `${apiUrl}/user-name/${task.assignedTo}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            if (response.ok) {
              const data = await response.json();
              setAssignedToUsername(data.username);
            }
          } catch (error) {
            console.error("Error fetching assignedTo username:", error);
          }
        } else if (
          task.assignedTo &&
          typeof task.assignedTo === "object" &&
          "username" in task.assignedTo
        ) {
          setAssignedToUsername(task.assignedTo.username);
        } else {
          setAssignedToUsername(null);
        }

        if (typeof task.createdBy === "string") {
          try {
            const response = await fetch(
              `${apiUrl}/user-name/${task.createdBy}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            if (response.ok) {
              const data = await response.json();
              setCreatedByUsername(data.username);
            }
          } catch (error) {
            console.error("Error fetching createdBy username:", error);
          }
        } else if (
          typeof task.createdBy === "object" &&
          "username" in task.createdBy
        ) {
          setCreatedByUsername(task.createdBy.username);
        } else {
          setCreatedByUsername(null);
        }
      };

      setEditedTask({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        tags: task.tags || [],
      });

      fetchUsernames();
    }
  }, [task]);

  const handleSave = () => {
    if (!task) return;
    onSave(task._id, editedTask);
    onClose();
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTags = [...(editedTask.tags || []), tagInput.trim()];
      setEditedTask({ ...editedTask, tags: newTags });
      setTagInput("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    const newTags = (editedTask.tags || []).filter(
      (tag) => tag !== tagToDelete,
    );
    setEditedTask({ ...editedTask, tags: newTags });
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

  const getInitials = (name?: string) => {
    if (!name || typeof name !== "string") return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name?: string) => {
    const colors = [
      "#EF4444",
      "#F59E0B",
      "#10B981",
      "#3B82F6",
      "#8B5CF6",
      "#EC4899",
    ];
    if (!name || typeof name !== "string") return "#9ca3af";
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Dialog
      key={task?._id}
      open={open && !!task}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      {task && (
        <>
          <DialogTitle sx={{ pb: 1 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" fontWeight={600}>
                Task Details
              </Typography>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <Divider />

          <DialogContent sx={{ pt: 3 }}>
            <Box className="task-modal-content">
              <TextField
                fullWidth
                label="Title"
                value={editedTask.title || ""}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Description"
                value={editedTask.description || ""}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
                multiline
                rows={4}
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <Box display="flex" gap={2} mb={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editedTask.status || "todo"}
                    onChange={(e) =>
                      setEditedTask({
                        ...editedTask,
                        status: e.target.value as Task["status"],
                      })
                    }
                    label="Status"
                  >
                    <MenuItem value="todo">To Do</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="review">Need Review</MenuItem>
                    <MenuItem value="completed">Done</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={editedTask.priority || "medium"}
                    onChange={(e) =>
                      setEditedTask({
                        ...editedTask,
                        priority: e.target.value as Task["priority"],
                      })
                    }
                    label="Priority"
                  >
                    <MenuItem value="low">
                      <Box display="flex" alignItems="center" gap={1}>
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: getPriorityColor("low"),
                          }}
                        />
                        Low
                      </Box>
                    </MenuItem>
                    <MenuItem value="medium">
                      <Box display="flex" alignItems="center" gap={1}>
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: getPriorityColor("medium"),
                          }}
                        />
                        Medium
                      </Box>
                    </MenuItem>
                    <MenuItem value="high">
                      <Box display="flex" alignItems="center" gap={1}>
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: getPriorityColor("high"),
                          }}
                        />
                        High
                      </Box>
                    </MenuItem>
                    <MenuItem value="urgent">
                      <Box display="flex" alignItems="center" gap={1}>
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: getPriorityColor("urgent"),
                          }}
                        />
                        Urgent
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={editedTask.dueDate || ""}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, dueDate: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              {/* Tags */}
              <Box mb={3}>
                <TextField
                  fullWidth
                  label="Tags (Press Enter to add)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  variant="outlined"
                  placeholder="Type and press Enter"
                />
                <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                  {(editedTask.tags || []).map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box className="task-info-section">
                <Typography variant="subtitle2" color="text.secondary" mb={2}>
                  Task Information
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      width={120}
                    >
                      Assigned To:
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: "13px",
                          backgroundColor: getAvatarColor(
                            assignedToUsername || undefined,
                          ),
                        }}
                      >
                        {getInitials(assignedToUsername || undefined)}
                      </Avatar>
                      <Typography variant="body2">
                        {assignedToUsername || "Unassigned"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      width={120}
                    >
                      Created By:
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: "13px",
                          backgroundColor: getAvatarColor(
                            createdByUsername || undefined,
                          ),
                        }}
                      >
                        {getInitials(createdByUsername || undefined)}
                      </Avatar>
                      <Typography variant="body2">
                        {createdByUsername || "Unknown"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      width={120}
                    >
                      Created:
                    </Typography>
                    <Typography variant="body2">
                      {new Date(task.createdAt).toLocaleString()}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      width={120}
                    >
                      Last Updated:
                    </Typography>
                    <Typography variant="body2">
                      {new Date(task.updatedAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{
                textTransform: "none",
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default TaskModal;
