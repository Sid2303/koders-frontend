export interface Task {
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
