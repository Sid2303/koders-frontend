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

interface TaskComponentProps {
  task: Task;
  handleViewDetails: (task: Task) => void;
  handleUpdateStatus: (taskId: string, currentStatus: string) => void;
  getPriorityColor: (priority: string) => string;
  getStatusLabel: (status: string) => string;
  formatDate: (dateStr?: string) => string;
  getProgress: (task: Task) => number;
}

const getPriorityDotColor = (priority: string) => {
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

export default function TaskComponent({
  task,
  handleViewDetails,
  handleUpdateStatus,
  getPriorityColor,
  getStatusLabel,
  formatDate,
  getProgress,
}: TaskComponentProps) {
  return (
    <div className="task-item">
      <div className="task-header">
        <span className={`task-priority ${getPriorityColor(task.priority)}`}>
          <span
            className="priority-dot"
            style={{ backgroundColor: getPriorityDotColor(task.priority) }}
          ></span>
          {task.priority.toUpperCase()} Priority
        </span>
      </div>
      <div className="task-title">{task.title}</div>
      <div className="task-meta">
        <span className="task-status">
          Status: {getStatusLabel(task.status)}
        </span>
        <span className="task-due">Due: {formatDate(task.dueDate)}</span>
        <span className="task-assigned">Assigned: You</span>
      </div>
      <div className="task-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${getProgress(task)}%` }}
          ></div>
        </div>
        <span className="progress-text">{getProgress(task)}%</span>
      </div>
      <div className="task-actions">
        <button className="btn-view" onClick={() => handleViewDetails(task)}>
          View Details
        </button>
        <button
          className="btn-update"
          onClick={() => handleUpdateStatus(task._id, task.status)}
        >
          Update Status
        </button>
      </div>
    </div>
  );
}
