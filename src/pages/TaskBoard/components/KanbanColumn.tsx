import TaskCard from "./TaskCard.tsx";
import "./KanbanColumn.css";
import type { Task } from "../../../types/task";

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
  onTaskDeleted: () => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onDrop: (status: "todo" | "in-progress" | "review" | "completed") => void;
  onDragEnter: (
    status: "todo" | "in-progress" | "review" | "completed",
  ) => void;
  isDragging: boolean;
  isDraggingOver: boolean;
}

const KanbanColumn = ({
  title,
  status,
  tasks,
  count,
  color,
  onUpdateStatus,
  onViewTask,
  onTaskDeleted,
  onDragStart,
  onDragEnd,
  onDrop,
  onDragEnter,
  isDragging,
  isDraggingOver,
}: KanbanColumnProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    onDragEnter(status);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(status);
  };

  return (
    <div
      className={`kanban-column ${
        isDraggingOver ? "drag-target" : isDragging ? "drag-over-enabled" : ""
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
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
              onTaskDeleted={onTaskDeleted}
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
