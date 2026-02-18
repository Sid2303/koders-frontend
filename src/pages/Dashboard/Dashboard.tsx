import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { getUser } from "../../utils/auth";
import TaskComponent from "./components/TaskComponent";
import StatCard from "./components/StatCard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LoopIcon from "@mui/icons-material/Loop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import { PieChart } from "@mui/x-charts/PieChart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  createdBy: string;
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface TaskStats {
  total: number;
  active: number;
  done: number;
  overdue: number;
}

const Dashboard = () => {
  const user = getUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    active: 0,
    done: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
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
        calculateStats(allTasks);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const calculateStats = (taskList: Task[]) => {
    const now = new Date();
    const total = taskList.length;
    const active = taskList.filter(
      (t) => t.status === "in-progress" || t.status === "review",
    ).length;
    const done = taskList.filter((t) => t.status === "completed").length;
    const overdue = taskList.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "completed",
    ).length;

    setStats({ total, active, done, overdue });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "priority-urgent";
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "";
    }
  };

  const getProgress = (task: Task) => {
    switch (task.status) {
      case "completed":
        return 100;
      case "review":
        return 90;
      case "in-progress":
        return 50;
      default:
        return 0;
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "No due date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "Todo";
      case "in-progress":
        return "In Progress";
      case "review":
        return "Review";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTasksForToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    });
  };

  const getTasksForTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === tomorrow.getTime();
    });
  };

  const getTasksForThisWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSunday = 7 - dayOfWeek;
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + daysUntilSunday);
    endOfWeek.setHours(23, 59, 59, 999);

    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate > today && dueDate <= endOfWeek;
    });
  };

  const handleUpdateStatus = async (taskId: string, currentStatus: string) => {
    const statusOptions = ["todo", "in-progress", "review", "completed"];
    const nextStatusIndex =
      (statusOptions.indexOf(currentStatus) + 1) % statusOptions.length;
    const newStatus = statusOptions[nextStatusIndex];

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
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleViewDetails = (task: Task) => {
    alert(
      `Task: ${task.title}\n\nDescription: ${task.description || "No description"}\n\nStatus: ${getStatusLabel(task.status)}\nPriority: ${task.priority}\nDue Date: ${formatDate(task.dueDate)}\n\nTags: ${task.tags?.join(", ") || "None"}`,
    );
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <div className="welcome-header">
          <h1>Welcome back, {user?.username}!</h1>
          <div className="welcome-info">
            <span className="welcome-role">
              <LocalOfferIcon />
              Role: {user?.role || "user"}
            </span>
            <span className="welcome-date">
              <CalendarMonthIcon /> {getCurrentDate()}
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <h2 className="section-title">STATISTICS (ONLY MY TASKS)</h2>
        <div className="stats-grid">
          <StatCard
            icon={<AssignmentIcon sx={{ fontSize: 32, color: "#3b82f6" }} />}
            value={stats.total}
            label="Total Tasks"
          />
          <StatCard
            icon={<LoopIcon sx={{ fontSize: 32, color: "#f59e0b" }} />}
            value={stats.active}
            label="Active"
          />
          <StatCard
            icon={<CheckCircleIcon sx={{ fontSize: 32, color: "#10b981" }} />}
            value={stats.done}
            label="Completed"
          />
          <StatCard
            icon={<WarningIcon sx={{ fontSize: 32, color: "#ef4444" }} />}
            value={stats.overdue}
            label="Overdue"
            isOverdue={true}
          />
        </div>
      </div>

      <div className="dashboard-tasks">
        <div className="section-header">
          <h2 className="section-title">MY ASSIGNED TASKS</h2>
          <Link to="/tasks" className="view-all-link">
            View All →
          </Link>
        </div>
        <div className="tasks-list">
          {tasks.length === 0 ? (
            <div className="no-tasks">No tasks assigned yet! 🎉</div>
          ) : (
            tasks
              .slice(0, 5)
              .map((task) => (
                <TaskComponent
                  key={task._id}
                  task={task}
                  handleViewDetails={handleViewDetails}
                  handleUpdateStatus={handleUpdateStatus}
                  getPriorityColor={getPriorityColor}
                  getStatusLabel={getStatusLabel}
                  formatDate={formatDate}
                  getProgress={getProgress}
                />
              ))
          )}
        </div>
      </div>

      <div className="dashboard-chart">
        <h2 className="section-title">TASK STATUS</h2>
        <div className="chart-container">
          {tasks.length > 0 ? (
            <PieChart
              series={[
                {
                  data: [
                    {
                      id: 0,
                      value: tasks.filter((t) => t.status === "todo").length,
                      label: "Todo",
                      color: "#ef4444",
                    },
                    {
                      id: 1,
                      value: tasks.filter((t) => t.status === "in-progress")
                        .length,
                      label: "In Progress",
                      color: "#3b82f6",
                    },
                    {
                      id: 2,
                      value: tasks.filter((t) => t.status === "review").length,
                      label: "Review",
                      color: "#f59e0b",
                    },
                    {
                      id: 3,
                      value: tasks.filter((t) => t.status === "completed")
                        .length,
                      label: "Completed",
                      color: "#10b981",
                    },
                  ],
                },
              ]}
              width={500}
              height={300}
            />
          ) : (
            <div
              style={{ textAlign: "center", padding: "48px", color: "#6b7280" }}
            >
              No task data available
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-deadlines">
        <h2 className="section-title">THIS WEEK'S DEADLINES</h2>
        <div className="deadlines-list">
          <div className="deadline-day">
            <div className="deadline-date">
              📅 Today (
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
              )
            </div>
            <div className="deadline-items">
              {getTasksForToday().length === 0 ? (
                <div className="deadline-item">• No deadlines today 🎉</div>
              ) : (
                getTasksForToday().map((task) => (
                  <div key={task._id} className="deadline-item">
                    • {task.title} - EOD ({task.priority.toUpperCase()})
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="deadline-day">
            <div className="deadline-date">
              📅 Tomorrow (
              {new Date(Date.now() + 86400000).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
              )
            </div>
            <div className="deadline-items">
              {getTasksForTomorrow().length === 0 ? (
                <div className="deadline-item">• No deadlines tomorrow</div>
              ) : (
                getTasksForTomorrow().map((task) => (
                  <div key={task._id} className="deadline-item">
                    • {task.title} ({task.priority.toUpperCase()})
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="deadline-day">
            <div className="deadline-date">📅 This Week</div>
            <div className="deadline-items">
              {getTasksForThisWeek().length === 0 ? (
                <div className="deadline-item">
                  • No upcoming deadlines this week
                </div>
              ) : (
                getTasksForThisWeek()
                  .slice(0, 3)
                  .map((task) => (
                    <div key={task._id} className="deadline-item">
                      • {task.title} - {formatDate(task.dueDate)} (
                      {task.priority.toUpperCase()})
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
