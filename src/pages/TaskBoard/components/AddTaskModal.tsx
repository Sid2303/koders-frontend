import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getUser } from "../../../utils/auth";
import CustomisedModal from "../../../components/CustomisedModal";
import "./TaskModal.css";

interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "manager" | "admin";
}

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (taskData: {
    title: string;
    description: string;
    status: "todo" | "in-progress" | "review" | "completed";
    priority: "low" | "medium" | "high" | "urgent";
    assignedTo?: string;
    dueDate?: string;
    tags: string[];
  }) => void;
}

const AddTaskModal = ({ open, onClose, onCreate }: AddTaskModalProps) => {
  const currentUser = getUser();
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo" as "todo" | "in-progress" | "review" | "completed",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    assignedTo: "",
    dueDate: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isFormValid =
    formData.title.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.assignedTo !== "" &&
    formData.dueDate !== "";

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          let filteredUsers = data.users || [];

          if (currentUser) {
            if (currentUser.role === "user") {
              filteredUsers = filteredUsers.filter(
                (u: User) => u._id === currentUser.id,
              );
            }
          }

          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (open) {
      void loadUsers();
    }
  }, [open, currentUser]);

  const handleCreate = () => {
    setSubmitted(true);
    if (!isFormValid) return;

    const taskData = {
      ...formData,
      assignedTo: formData.assignedTo || undefined,
      dueDate: formData.dueDate || undefined,
    };

    onCreate(taskData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignedTo: "",
      dueDate: "",
      tags: [],
    });
    setTagInput("");
    setSubmitted(false);
    onClose();
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTags = [...formData.tags, tagInput.trim()];
      setFormData({ ...formData, tags: newTags });
      setTagInput("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    const newTags = formData.tags.filter((tag) => tag !== tagToDelete);
    setFormData({ ...formData, tags: newTags });
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
    if (!name) return "?";
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
    if (!name) return "#9ca3af";
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <CustomisedModal
      open={open}
      onClose={handleClose}
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: 2, maxHeight: "90vh" } }}
      title={
        <Typography variant="h6" fontWeight={600}>
          Create New Task
        </Typography>
      }
      actions={
        <>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#3b82f6",
              "&:hover": { backgroundColor: "#2563eb" },
            }}
          >
            Create Task
          </Button>
        </>
      }
    >
      <Box className="task-modal-content">
        <TextField
          fullWidth
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          variant="outlined"
          required
          error={submitted && formData.title.trim() === ""}
          helperText={
            submitted && formData.title.trim() === "" ? "Title is required" : ""
          }
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          multiline
          rows={4}
          variant="outlined"
          required
          error={submitted && formData.description.trim() === ""}
          helperText={
            submitted && formData.description.trim() === ""
              ? "Description is required"
              : ""
          }
          sx={{ mb: 2 }}
        />

        <Box display="flex" gap={2} mb={2}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as typeof formData.status,
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
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as typeof formData.priority,
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

        <Box display="flex" gap={2} mb={2}>
          <FormControl
            fullWidth
            error={submitted && formData.assignedTo === ""}
          >
            <InputLabel>Assign To *</InputLabel>
            <Select
              value={formData.assignedTo}
              onChange={(e) =>
                setFormData({ ...formData, assignedTo: e.target.value })
              }
              label="Assign To *"
            >
              <MenuItem value="">
                <em>Unassigned</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: "11px",
                        backgroundColor: getAvatarColor(user.username),
                      }}
                    >
                      {getInitials(user.username)}
                    </Avatar>
                    {user.username}
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {submitted && formData.assignedTo === "" && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 1.75 }}
              >
                Please assign this task to someone
              </Typography>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            required
            error={submitted && formData.dueDate === ""}
            helperText={
              submitted && formData.dueDate === "" ? "Due date is required" : ""
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

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
            {formData.tags.map((tag, index) => (
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
      </Box>
    </CustomisedModal>
  );
};

export default AddTaskModal;
