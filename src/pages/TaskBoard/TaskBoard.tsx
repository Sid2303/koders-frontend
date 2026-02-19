import { useEffect, useState, useCallback } from "react";
import "./TaskBoard.css";
import KanbanColumn from "./components/KanbanColumn";
import TaskModal from "./components/TaskModal";
import AddTaskModal from "./components/AddTaskModal";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { getUser } from "../../utils/auth";
import socket from "../../utils/socket";

import type { Task } from "../../types/task";

interface User {
  _id: string;
  username: string;
  role: string;
}

interface Filters {
  status: string;
  priority: string;
  assignedTo: string;
  deleted: string;
  sortBy: string;
  order: string;
}

interface GroupedTasks {
  todo: Task[];
  "in-progress": Task[];
  review: Task[];
  completed: Task[];
}

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<GroupedTasks>({
    todo: [],
    "in-progress": [],
    review: [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const currentUser = getUser();
  const isAdminOrManager =
    currentUser?.role === "admin" || currentUser?.role === "manager";

  const defaultFilters: Filters = {
    status: "",
    priority: "",
    assignedTo: "",
    deleted: "",
    sortBy: "createdAt",
    order: "desc",
  };
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const buildQuery = useCallback((f: Filters) => {
    const params = new URLSearchParams();
    if (f.status) params.set("status", f.status);
    if (f.priority) params.set("priority", f.priority);
    if (f.assignedTo) params.set("assignedTo", f.assignedTo);
    if (f.deleted !== "") params.set("deleted", f.deleted);
    if (f.sortBy) params.set("sortBy", f.sortBy);
    if (f.order) params.set("order", f.order);
    return params.toString();
  }, []);

  const fetchTasks = useCallback(
    async (f: Filters = filters) => {
      try {
        const query = buildQuery(f);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/tasks${query ? `?${query}` : ""}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          const allTasks = data.tasks || [];
          setTasks(allTasks);
          groupTasksByStatus(allTasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters, buildQuery],
  );

  const fetchUsers = useCallback(async () => {
    if (!isAdminOrManager) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || data || []);
      }
    } catch (e) {
      console.error("Error fetching users:", e);
    }
  }, [isAdminOrManager]);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [fetchTasks, fetchUsers]);

  useEffect(() => {
    socket.connect();

    socket.on("task:created", () => {
      fetchTasks(filters);
    });

    socket.on("task:updated", () => {
      fetchTasks(filters);
    });

    socket.on("task:deleted", () => {
      fetchTasks(filters);
    });

    return () => {
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:deleted");
      socket.disconnect();
    };
  }, []);

  const groupTasksByStatus = (taskList: Task[]) => {
    const grouped: GroupedTasks = {
      todo: [],
      "in-progress": [],
      review: [],
      completed: [],
    };

    taskList.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });

    setGroupedTasks(grouped);
  };

  const handleUpdateStatus = async (
    taskId: string,
    newStatus: "todo" | "in-progress" | "review" | "completed",
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.ok) {
        fetchTasks(filters);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updates),
        },
      );

      if (response.ok) {
        fetchTasks(filters);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    status: "todo" | "in-progress" | "review" | "completed";
    priority: "low" | "medium" | "high" | "urgent";
    assignedTo?: string;
    dueDate?: string;
    tags: string[];
  }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        fetchTasks(filters);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    fetchTasks(updated);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    fetchTasks(defaultFilters);
  };

  const hasActiveFilters =
    filters.status !== "" ||
    filters.priority !== "" ||
    filters.assignedTo !== "" ||
    filters.deleted !== "" ||
    filters.sortBy !== "createdAt" ||
    filters.order !== "desc";

  if (loading) {
    return (
      <div className="taskboard">
        <div className="taskboard-loading">Loading tasks...</div>
      </div>
    );
  }

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = (
    status: "todo" | "in-progress" | "review" | "completed",
  ) => {
    if (draggedTask && draggedTask.status !== status) {
      handleUpdateStatus(draggedTask._id, status);
    }
    setDraggedTask(null);
  };

  return (
    <div className="taskboard">
      <div className="taskboard-header">
        <div className="taskboard-title">
          <h1>Task Board</h1>
          <p className="taskboard-subtitle">
            Manage and track your tasks across different stages
          </p>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddModalOpen(true)}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
          }}
        >
          Add New Task
        </Button>
      </div>

      <div className="taskboard-stats">
        <div className="stat-item">
          <span className="stat-value">{tasks.length}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{groupedTasks.todo.length}</span>
          <span className="stat-label">To Do</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {groupedTasks["in-progress"].length}
          </span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{groupedTasks.review.length}</span>
          <span className="stat-label">Need Review</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{groupedTasks.completed.length}</span>
          <span className="stat-label">Done</span>
        </div>
      </div>

      <div className="taskboard-filters">
        <div className="taskboard-filters-left">
          <FilterListIcon sx={{ color: "#6b7280", fontSize: 20 }} />
          <span className="taskboard-filters-label">Filters &amp; Sort</span>
        </div>
        <div className="taskboard-filters-controls">
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

          {isAdminOrManager && (
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Assigned To</InputLabel>
              <Select
                value={filters.assignedTo}
                label="Assigned To"
                onChange={(e) =>
                  handleFilterChange("assignedTo", e.target.value)
                }
              >
                <MenuItem value="">
                  <em>Anyone</em>
                </MenuItem>
                {users.map((u) => (
                  <MenuItem key={u._id} value={u._id}>
                    {u.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl size="small" sx={{ minWidth: 150 }}>
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

      <div className="kanban-board">
        <KanbanColumn
          title="To Do"
          status="todo"
          tasks={groupedTasks.todo}
          count={groupedTasks.todo.length}
          color="#ef4444"
          onUpdateStatus={handleUpdateStatus}
          onViewTask={handleViewTask}
          onTaskDeleted={() => fetchTasks(filters)}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          isDragging={!!draggedTask}
        />
        <KanbanColumn
          title="In Progress"
          status="in-progress"
          tasks={groupedTasks["in-progress"]}
          count={groupedTasks["in-progress"].length}
          color="#3b82f6"
          onUpdateStatus={handleUpdateStatus}
          onViewTask={handleViewTask}
          onTaskDeleted={() => fetchTasks(filters)}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          isDragging={!!draggedTask}
        />
        <KanbanColumn
          title="Need Review"
          status="review"
          tasks={groupedTasks.review}
          count={groupedTasks.review.length}
          color="#f59e0b"
          onUpdateStatus={handleUpdateStatus}
          onViewTask={handleViewTask}
          onTaskDeleted={() => fetchTasks(filters)}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          isDragging={!!draggedTask}
        />
        <KanbanColumn
          title="Done"
          status="completed"
          tasks={groupedTasks.completed}
          count={groupedTasks.completed.length}
          color="#10b981"
          onUpdateStatus={handleUpdateStatus}
          onViewTask={handleViewTask}
          onTaskDeleted={() => fetchTasks(filters)}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          isDragging={!!draggedTask}
        />
      </div>

      <TaskModal
        open={modalOpen}
        task={selectedTask}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
      />

      <AddTaskModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onCreate={handleCreateTask}
      />
    </div>
  );
};

export default TaskBoard;
