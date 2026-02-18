import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import Box from "@mui/material/Box";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CustomisedModal from "../../../components/CustomisedModal";
import { useState, useEffect } from "react";
import "./TaskCard.css";

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
  deleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (
    taskId: string,
    newStatus: "todo" | "in-progress" | "review" | "completed",
  ) => void;
  onViewTask: (task: Task) => void;
  onTaskDeleted: () => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
}

const TaskCard = ({
  task,
  onUpdateStatus,
  onViewTask,
  onTaskDeleted,
  onDragStart,
  onDragEnd,
}: TaskCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [assignedToUsername, setAssignedToUsername] = useState<string | null>(
    null,
  );
  const [createdByUsername, setCreatedByUsername] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchUsernames = async () => {
      if (task.assignedTo && typeof task.assignedTo === "string") {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/user-name/${task.assignedTo}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );
          if (response.ok) {
            const data = await response.json();
            setAssignedToUsername(data.username);
          }
        } catch (error) {
          console.error("Error fetching assigned user:", error);
        }
      } else if (task.assignedTo && typeof task.assignedTo === "object") {
        setAssignedToUsername(task.assignedTo.username);
      }

      if (task.createdBy && typeof task.createdBy === "string") {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/user-name/${task.createdBy}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );
          if (response.ok) {
            const data = await response.json();
            setCreatedByUsername(data.username);
          }
        } catch (error) {
          console.error("Error fetching created by user:", error);
        }
      } else if (task.createdBy && typeof task.createdBy === "object") {
        setCreatedByUsername(task.createdBy.username);
      }
    };

    fetchUsernames();
  }, [task]);

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(task);
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = "1";
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    onDragEnd();
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = "1";
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (
    newStatus: "todo" | "in-progress" | "review" | "completed",
  ) => {
    onUpdateStatus(task._id, newStatus);
    handleMenuClose();
  };

  const getPriorityColor = () => {
    switch (task.priority) {
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

  const getTagColor = (tag: string) => {
    const colors = [
      "#E0E7FF",
      "#FEE2E2",
      "#FEF3C7",
      "#D1FAE5",
      "#DBEAFE",
      "#FCE7F3",
    ];
    const index = tag.length % colors.length;
    return colors[index];
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

  async function handleDeleteTask(taskId: string) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.ok) {
        onTaskDeleted();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setDeleteConfirmOpen(false);
    }
  }

  return (
    <>
      <div
        className={`task-card${task.deleted ? " task-card--deleted" : ""}`}
        onClick={() => onViewTask(task)}
        draggable={!task.deleted}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="task-card-header">
          {task.tags && task.tags.length > 0 && (
            <Chip
              label={task.tags[0]}
              size="small"
              sx={{
                backgroundColor: getTagColor(task.tags[0]),
                color: "#374151",
                fontWeight: 600,
                fontSize: "11px",
                height: "22px",
              }}
            />
          )}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick(e);
            }}
            sx={{ ml: "auto" }}
          >
            <MoreHorizIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={(e) => e.stopPropagation()}
          >
            {!task.deleted && (
              <MenuItem onClick={() => handleStatusChange("todo")}>
                Move to To Do
              </MenuItem>
            )}
            {!task.deleted && (
              <MenuItem onClick={() => handleStatusChange("in-progress")}>
                Move to In Progress
              </MenuItem>
            )}
            {!task.deleted && (
              <MenuItem onClick={() => handleStatusChange("review")}>
                Move to Review
              </MenuItem>
            )}
            {!task.deleted && (
              <MenuItem onClick={() => handleStatusChange("completed")}>
                Move to Done
              </MenuItem>
            )}
            {!task.deleted && (
              <MenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuClose();
                  setDeleteConfirmOpen(true);
                }}
                sx={{ color: "#dc2626" }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <DeleteOutlineIcon
                    fontSize="small"
                    sx={{ color: "#dc2626" }}
                  />
                </ListItemIcon>
                Delete Task
              </MenuItem>
            )}
            <MenuItem onClick={() => onViewTask(task)}>View Details</MenuItem>
          </Menu>
        </div>

        <h4
          className={`task-card-title${task.deleted ? " task-card-title--deleted" : ""}`}
        >
          {task.title}
        </h4>

        {task.description && (
          <p className="task-card-description">
            {task.description.length > 80
              ? `${task.description.substring(0, 80)}...`
              : task.description}
          </p>
        )}

        <div className="task-card-footer">
          <div className="task-card-assignee">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {assignedToUsername ? (
                  <Tooltip title={`Assigned to: ${assignedToUsername}`} arrow>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: "12px",
                        backgroundColor: getAvatarColor(assignedToUsername),
                      }}
                    >
                      {getInitials(assignedToUsername)}
                    </Avatar>
                  </Tooltip>
                ) : (
                  <Tooltip title="Unassigned" arrow>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: "12px",
                        backgroundColor: "#9ca3af",
                      }}
                    >
                      ?
                    </Avatar>
                  </Tooltip>
                )}
                {createdByUsername &&
                  (typeof task.assignedTo === "string"
                    ? task.createdBy !== task.assignedTo
                    : typeof task.assignedTo === "object" &&
                      (typeof task.createdBy === "string"
                        ? task.createdBy !== task.assignedTo._id
                        : task.createdBy._id !== task.assignedTo._id)) && (
                    <Tooltip title={`Created by: ${createdByUsername}`} arrow>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: "12px",
                          backgroundColor: getAvatarColor(createdByUsername),
                          ml: -1,
                        }}
                      >
                        {getInitials(createdByUsername)}
                      </Avatar>
                    </Tooltip>
                  )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "11px",
                  lineHeight: "1.2",
                }}
              >
                {assignedToUsername && (
                  <span style={{ color: "#6b7280", fontWeight: 500 }}>
                    {assignedToUsername}
                  </span>
                )}
                {createdByUsername &&
                  (typeof task.assignedTo === "string"
                    ? task.createdBy !== task.assignedTo
                    : typeof task.assignedTo === "object" &&
                      (typeof task.createdBy === "string"
                        ? task.createdBy !== task.assignedTo._id
                        : task.createdBy._id !== task.assignedTo._id)) && (
                    <span style={{ color: "#9ca3af", fontSize: "10px" }}>
                      by {createdByUsername}
                    </span>
                  )}
              </div>
            </div>
          </div>

          <div className="task-card-meta">
            <div
              className="priority-indicator"
              style={{ backgroundColor: getPriorityColor() }}
              title={`${task.priority} priority`}
            ></div>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <CustomisedModal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onClick={(e) => e.stopPropagation()}
        maxWidth="xs"
        showCloseButton={false}
        title={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#dc2626",
            }}
          >
            <DeleteOutlineIcon sx={{ color: "#dc2626" }} />
            Delete Task
          </Box>
        }
        actions={
          <>
            <Button
              onClick={() => setDeleteConfirmOpen(false)}
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDeleteTask(task._id);
                handleMenuClose();
              }}
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#dc2626",
                "&:hover": { backgroundColor: "#b91c1c" },
              }}
              startIcon={<DeleteOutlineIcon />}
            >
              Delete
            </Button>
          </>
        }
      >
        Are you sure you want to delete <strong>"{task.title}"</strong>? This
        action cannot be undone.
      </CustomisedModal>
    </>
  );
};

export default TaskCard;
