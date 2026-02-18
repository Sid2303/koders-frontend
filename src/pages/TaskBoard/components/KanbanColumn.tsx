import TaskCard from "./TaskCard.tsx";
import "./KanbanColumn.css";

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

interface KanbanColumnProps {
  title: string;
  status: "todo" | "in-progress" | "review" | "completed";
  tasks: Task[];
  count: number;
  color: string;
  onUpdateStatus: (
    taskId: string,
    newStatus: "todo" | "in-progress" | "review" | "completed",
  ) => void;
  onViewTask: (task: Task) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onDrop: (status: "todo" | "in-progress" | "review" | "completed") => void;
  isDragging: boolean;
}

const KanbanColumn = ({
  title,
  status,
  tasks,
  count,
  color,
  onUpdateStatus,
  onViewTask,
  onDragStart,
  onDragEnd,
  onDrop,
  isDragging,
}: KanbanColumnProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(status);
  };

  return (
    <div
      className={`kanban-column ${isDragging ? "drag-over-enabled" : ""}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="kanban-column-header">
        <div className="column-title-wrapper">
          <div
            className="column-indicator"
            style={{ backgroundColor: color }}
          ></div>
          <h3 className="column-title">{title}</h3>
          <span className="column-count">{count}</span>
        </div>
      </div>

      <div className="kanban-column-content">
        {tasks.length === 0 ? (
          <div className="empty-column">
            <p>No tasks</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdateStatus={onUpdateStatus}
              onViewTask={onViewTask}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
