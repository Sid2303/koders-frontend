import { useEffect, useState, useCallback } from "react";
import "./TaskBoard.css";
import KanbanColumn from "./components/KanbanColumn";
import TaskModal from "./components/TaskModal";
import AddTaskModal from "./components/AddTaskModal";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";

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
  deleted?: boolean;
  createdAt: string;
  updatedAt: string;
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

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
        fetchTasks();
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
        fetchTasks();
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
        fetchTasks();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

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

      <div className="kanban-board">
        <KanbanColumn
          title="To Do"
          status="todo"
          tasks={groupedTasks.todo}
          count={groupedTasks.todo.length}
          color="#ef4444"
          onUpdateStatus={handleUpdateStatus}
          onViewTask={handleViewTask}
          onTaskDeleted={fetchTasks}
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
          onTaskDeleted={fetchTasks}
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
          onTaskDeleted={fetchTasks}
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
          onTaskDeleted={fetchTasks}
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
